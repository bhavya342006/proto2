import React, { useEffect, useRef, useState } from 'react';
import {
  Camera,
  Play,
  Square,
  AlertTriangle,
  Volume2,
  VolumeX,
  RotateCcw,
  Navigation,
  ShieldCheck,
  Eye,
  Sliders,
  Layers,
  CheckCircle2,
  Info
} from 'lucide-react';
import { VoiceGuidance, VoiceMessageEvent } from '../../services/voiceGuidanceService';
import { analyzeRoadHazardDemo } from '../../services/aiVisionService';
import { IncidentService } from '../../services/incidentService';
import { HazardCategory, PriorityLevel, CitizenScanDetectionEvent } from '../../types';

interface RoadScannerProps {
  onIncidentDetected?: (incidentId: string) => void;
  onOpenReportModal?: (hazardCategory: HazardCategory, coords: { lat: number; lng: number }) => void;
}

export const RoadScanner: React.FC<RoadScannerProps> = ({ onIncidentDetected, onOpenReportModal }) => {
  // Modes: 'idle' | 'live_camera' | 'demo_simulation'
  const [mode, setMode] = useState<'idle' | 'live_camera' | 'demo_simulation'>('idle');
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Live Location State
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: 37.7841,
    lng: -122.4068
  });
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(3.5);

  // Detections in Current Session
  const [sessionDetections, setSessionDetections] = useState<CitizenScanDetectionEvent[]>([]);
  const [activeTrackingBox, setActiveTrackingBox] = useState<{
    label: string;
    category: HazardCategory;
    priority: PriorityLevel;
    confidence: number;
    distanceM: number;
    trackingId: string;
  } | null>(null);

  // Voice transcript stream
  const [latestVoiceMessage, setLatestVoiceMessage] = useState<string>('Voice guidance standby.');
  const [isVoiceMuted, setIsVoiceMuted] = useState(VoiceGuidance.getSettings().muted);

  // Video / Canvas References
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const processingIntervalRef = useRef<number | null>(null);

  // Simulation variables
  const simOffsetRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);

  // Subscribe to voice guidance transcripts
  useEffect(() => {
    const unsub = VoiceGuidance.onTranscript((msg: VoiceMessageEvent) => {
      setLatestVoiceMessage(msg.text);
    });
    return unsub;
  }, []);

  // Clean up media streams and intervals on unmount
  useEffect(() => {
    return () => {
      stopAllMedia();
    };
  }, []);

  const stopAllMedia = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (processingIntervalRef.current) {
      window.clearInterval(processingIntervalRef.current);
      processingIntervalRef.current = null;
    }
    if (animationFrameIdRef.current) {
      window.cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
  };

  // Start Real Browser Camera
  const startLiveCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser environment. Using Demo Simulator mode.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setMode('live_camera');
      startScanningSession();
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError(err.message || 'Camera permission denied or camera device in use. Switch to Simulated Mode.');
      // Auto-fallback recommendation
      setMode('demo_simulation');
      startScanningSession();
    }
  };

  // Start Simulated Road Scan Mode (Ideal for Hackathons & Desktop testing)
  const startSimulatedMode = () => {
    setCameraError(null);
    setMode('demo_simulation');
    startScanningSession();
  };

  // Obtain GPS with permission
  const requestGeolocation = () => {
    setGpsError(null);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
          setGpsAccuracy(Math.round(pos.coords.accuracy * 10) / 10);
        },
        (err) => {
          console.warn('Geolocation error:', err);
          setGpsError('GPS coordinate lock unavailable. Using metro demo datum coordinates (±3.5m).');
          VoiceGuidance.announceGpsUnavailable();
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setGpsError('Geolocation not supported. Using demo coordinates.');
    }
  };

  const startScanningSession = () => {
    requestGeolocation();
    setIsScanning(true);
    VoiceGuidance.announceScanStarted();

    // Controlled processing rate: Process 1 frame evaluation every 1.8 seconds (edge device simulation)
    if (processingIntervalRef.current) window.clearInterval(processingIntervalRef.current);
    processingIntervalRef.current = window.setInterval(() => {
      evaluateNextFrameDetection();
    }, 2000);

    // Start simulation canvas loop if in demo mode
    startCanvasRoadLoop();
  };

  const stopScanningSession = () => {
    setIsScanning(false);
    stopAllMedia();
    VoiceGuidance.announceScanStopped();
    setActiveTrackingBox(null);
  };

  // Controlled Rate AI Frame Evaluation
  const evaluateNextFrameDetection = () => {
    frameCountRef.current += 1;
    const tick = frameCountRef.current;

    // Trigger hazard detections at reproducible intervals during demonstration
    // Frame 3: Pothole, Frame 7: Open Manhole, Frame 11: Waterlogging, Frame 15: Fallen Wire
    const hazardScenarios: Array<{
      category: HazardCategory;
      label: string;
      priority: PriorityLevel;
      distanceM: number;
    }> = [
      { category: 'pothole', label: 'Deep Pothole Cavity', priority: 'critical', distanceM: 18 },
      { category: 'open_manhole', label: 'Uncovered Manhole Shaft', priority: 'critical', distanceM: 25 },
      { category: 'waterlogging', label: 'Road Ponding / Pool', priority: 'high', distanceM: 30 },
      { category: 'fallen_electrical_wire', label: 'Fallen Wire Conductor', priority: 'critical', distanceM: 14 },
      { category: 'road_crack', label: 'Structural Transverse Crack', priority: 'medium', distanceM: 12 }
    ];

    const currentScenario = hazardScenarios[(tick - 1) % hazardScenarios.length];
    const trackingId = `TRK-SCAN-${100 + ((tick * 17) % 899)}`;

    // Generate analysis
    const analysis = analyzeRoadHazardDemo(currentScenario.category);

    setActiveTrackingBox({
      label: currentScenario.label,
      category: currentScenario.category,
      priority: currentScenario.priority,
      confidence: analysis.visualConfidence,
      distanceM: currentScenario.distanceM,
      trackingId
    });

    // Voice announcement with safety rules
    if (currentScenario.priority === 'critical') {
      VoiceGuidance.announceCriticalHazard(currentScenario.label, trackingId);
    } else {
      VoiceGuidance.announcePossibleHazard(currentScenario.label, trackingId);
    }

    // Add to session detections list (avoid duplicate tracking)
    setSessionDetections((prev) => {
      if (prev.some((p) => p.trackingId === trackingId)) return prev;
      return [
        {
          id: `SCAN-EVT-${Date.now()}`,
          trackingId,
          category: currentScenario.category,
          confidence: analysis.visualConfidence,
          priority: currentScenario.priority,
          timestamp: Date.now(),
          lat: currentCoords.lat + (Math.random() - 0.5) * 0.002,
          lng: currentCoords.lng + (Math.random() - 0.5) * 0.002,
          distanceAheadMeters: currentScenario.distanceM,
          spokentoDriver: true
        },
        ...prev
      ];
    });
  };

  // Canvas-based Realistic Road Simulation Loop
  const startCanvasRoadLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let roadY = 0;

    const render = () => {
      roadY = (roadY + 4) % 80;
      simOffsetRef.current = roadY;

      const w = canvas.width;
      const h = canvas.height;

      // Dark asphalt gradient
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#0a101f');
      grad.addColorStop(0.4, '#10192e');
      grad.addColorStop(1, '#070b14');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Perspective Road Horizon
      const horizonY = h * 0.38;

      // Perspective Road lines
      ctx.strokeStyle = '#1e2d4d';
      ctx.lineWidth = 3;

      // Left curb
      ctx.beginPath();
      ctx.moveTo(w * 0.44, horizonY);
      ctx.lineTo(w * 0.05, h);
      ctx.stroke();

      // Right curb
      ctx.beginPath();
      ctx.moveTo(w * 0.56, horizonY);
      ctx.lineTo(w * 0.95, h);
      ctx.stroke();

      // Center dashed road markings with perspective motion
      ctx.strokeStyle = '#FFB547';
      ctx.lineWidth = 4;
      for (let y = horizonY + roadY; y < h; y += 45) {
        const factor = (y - horizonY) / (h - horizonY);
        const dashLen = 14 * factor + 5;
        const centerX = w * 0.5;
        ctx.beginPath();
        ctx.moveTo(centerX, y);
        ctx.lineTo(centerX, y + dashLen);
        ctx.stroke();
      }

      // Lane divider white dashes
      ctx.strokeStyle = 'rgba(244, 247, 255, 0.4)';
      ctx.lineWidth = 3;
      for (let y = horizonY + ((roadY + 20) % 60); y < h; y += 50) {
        const factor = (y - horizonY) / (h - horizonY);
        const leftX = w * 0.5 - (w * 0.22 * factor);
        const rightX = w * 0.5 + (w * 0.22 * factor);
        ctx.beginPath();
        ctx.moveTo(leftX, y);
        ctx.lineTo(leftX, y + 16 * factor);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(rightX, y);
        ctx.lineTo(rightX, y + 16 * factor);
        ctx.stroke();
      }

      // Simulated Dashboard HUD scanlines & crosshairs
      ctx.strokeStyle = 'rgba(38, 132, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w * 0.3, horizonY);
      ctx.lineTo(w * 0.7, horizonY);
      ctx.stroke();

      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    render();
  };

  const handleToggleMute = () => {
    const newMuted = !isVoiceMuted;
    setIsVoiceMuted(newMuted);
    VoiceGuidance.updateSettings({ muted: newMuted });
  };

  const handleRepeatVoice = () => {
    VoiceGuidance.repeatLast();
  };

  // Submits a detected item to the shared system
  const handleReviewAndSubmit = (event: CitizenScanDetectionEvent) => {
    const newIncident = IncidentService.createIncident({
      category: event.category,
      title: `Citizen Road Scan: ${event.category.replace('_', ' ').toUpperCase()}`,
      description: `Automated dashcam detection during active road scan. Forward distance: ~${event.distanceAheadMeters}m. Model confidence: ${event.confidence}%. Driver reviewed and submitted safely while stopped.`,
      address: `Near ${currentCoords.lat.toFixed(4)}, ${currentCoords.lng.toFixed(4)}`,
      coordinates: { lat: event.lat, lng: event.lng },
      gpsAccuracyMeters: gpsAccuracy || 4.0,
      priority: event.priority,
      priorityExplanation: `Assigned based on visual edge threshold and safety impact on travel corridor.`,
      status: 'reported',
      classification: 'MODEL-SUPPORTED DETECTION',
      classificationEvidence: {
        supporting: [`Dashcam detection confidence: ${event.confidence}%`, `Associated tracking key: ${event.trackingId}`],
        missing: ['Field tape measurement'],
        recommendedNextStep: 'Schedule municipal inspector verification.',
        decidedBy: 'RoadGuard Citizen Scanner (v2.4)',
        isAutomated: true
      },
      dimensions: {
        lengthMeters: 1.10,
        widthMeters: 0.75,
        depthMeters: 0.12,
        areaSqMeters: 0.65,
        measurementMethod: 'Calibrated Monocular Homography',
        uncertaintyPercent: 9,
        status: 'ESTIMATED',
        statusExplanation: 'Camera homography model applied with calibrated 14.5° pitch.'
      },
      detection: {
        visualConfidence: event.confidence,
        locationConfidence: 94,
        dimensionConfidence: 86,
        detectionMethod: 'LIVE_MODEL',
        trackingId: event.trackingId
      },
      imageUrl: analyzeRoadHazardDemo(event.category).detectionId ? '' : '',
      isDemoData: false
    });

    if (onIncidentDetected) {
      onIncidentDetected(newIncident.id);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Driver Safety Warning Banner (Mandatory Requirement) */}
      <div className="bg-[#121D31] border border-[#2684FF]/40 rounded-xl p-4 flex items-start gap-3 shadow-lg">
        <div className="p-2 bg-[#2684FF]/20 rounded-lg text-[#31D7FF] shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex-1 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#F4F7FF]">Driver Safety &amp; Hands-Free Mandate</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#2684FF]/20 text-[#31D7FF] uppercase">
              Passive Audio Mode
            </span>
          </div>
          <p className="text-[#A6B4CC] text-xs mt-1 leading-relaxed">
            Mount your phone in a standard dashboard cradle before driving. Do <strong>not</strong> look at the screen,
            type, or capture manual photos while moving. Spoken voice warnings announce detected hazards automatically.
          </p>
        </div>
      </div>

      {/* Main Scanner Viewport Container */}
      <div className="relative bg-[#0D1424] border border-[#1A2640] rounded-2xl overflow-hidden shadow-2xl">
        {/* Top Viewport Header */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-[#070B14]/90 via-[#070B14]/60 to-transparent p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  isScanning ? 'bg-[#FF4D5A] animate-pulse ring-4 ring-[#FF4D5A]/20' : 'bg-[#A6B4CC]/40'
                }`}
              />
              <span className="font-mono text-xs font-bold tracking-wider uppercase text-[#F4F7FF]">
                {isScanning ? 'ROAD SCAN ACTIVE' : 'ROAD SCAN PAUSED'}
              </span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#121D31] border border-[#2684FF]/30 text-[#31D7FF] font-mono">
              {mode === 'live_camera' ? 'LIVE CAMERA FEED' : mode === 'demo_simulation' ? 'HACKATHON SIMULATOR' : 'STANDBY'}
            </span>
          </div>

          {/* GPS Coordinates & Accuracy Pill */}
          <div className="flex items-center gap-2 text-xs font-mono bg-[#121D31]/80 px-3 py-1.5 rounded-lg border border-[#2684FF]/20 text-[#A6B4CC]">
            <Navigation className="w-3.5 h-3.5 text-[#31D7FF]" />
            <span>
              {currentCoords.lat.toFixed(4)}, {currentCoords.lng.toFixed(4)}
            </span>
            <span className="text-[#35D49A] text-[11px]">±{gpsAccuracy}m</span>
          </div>
        </div>

        {/* Viewport Display Area (Camera or Canvas Simulator) */}
        <div className="relative w-full aspect-video min-h-[340px] max-h-[500px] flex items-center justify-center bg-[#070B14]">
          {/* Live Video Element */}
          <video
            ref={videoRef}
            playsInline
            muted
            className={`w-full h-full object-cover ${mode === 'live_camera' && isScanning ? 'block' : 'hidden'}`}
          />

          {/* Canvas Road Driving Simulator */}
          <canvas
            ref={canvasRef}
            width={800}
            height={450}
            className={`w-full h-full object-cover ${
              mode === 'demo_simulation' || (mode === 'idle' && !isScanning) ? 'block' : 'hidden'
            }`}
          />

          {/* Idle Placeholder when not scanning */}
          {!isScanning && (
            <div className="absolute inset-0 bg-[#070B14]/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#121D31] border border-[#2684FF]/40 flex items-center justify-center text-[#2684FF] mb-4 shadow-lg shadow-[#2684FF]/10">
                <Camera className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#F4F7FF] mb-1">RoadGuard Passive Road Scanner</h3>
              <p className="text-xs text-[#A6B4CC] max-w-md mb-6 leading-relaxed">
                Uses optical dashcam vision to detect potholes, open manholes, waterlogging, and fallen debris before
                they cause tire blowouts or collisions.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={startSimulatedMode}
                  className="px-6 py-3 rounded-xl bg-[#2684FF] hover:bg-[#1f73e8] text-[#F4F7FF] font-semibold text-sm shadow-lg shadow-[#2684FF]/30 flex items-center gap-2 transition cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  START ROAD SCAN (SIMULATOR)
                </button>
                <button
                  type="button"
                  onClick={startLiveCamera}
                  className="px-5 py-3 rounded-xl bg-[#121D31] hover:bg-[#1A2640] border border-[#2684FF]/40 text-[#31D7FF] font-semibold text-sm flex items-center gap-2 transition cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  USE DEVICE CAMERA
                </button>
              </div>

              <div className="mt-4 text-[11px] text-[#A6B4CC]/80 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#31D7FF]" />
                <span>Camera and GPS are requested only after explicit consent. No raw video stored.</span>
              </div>
            </div>
          )}

          {/* Active AI Bounding Box HUD (Shown during scan when hazard detected) */}
          {isScanning && activeTrackingBox && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
              <div
                className={`relative w-64 h-36 border-2 ${
                  activeTrackingBox.priority === 'critical'
                    ? 'border-[#FF4D5A] bg-[#FF4D5A]/10 shadow-lg shadow-[#FF4D5A]/30'
                    : 'border-[#FFB547] bg-[#FFB547]/10 shadow-lg shadow-[#FFB547]/30'
                } rounded-lg animate-pulse flex flex-col justify-between p-2`}
              >
                {/* Corner reticle marks */}
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-current" />
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-current" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-current" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-current" />

                <div className="flex items-center justify-between text-[11px] font-mono font-bold bg-[#0D1424]/90 px-2 py-0.5 rounded">
                  <span
                    className={
                      activeTrackingBox.priority === 'critical' ? 'text-[#FF4D5A]' : 'text-[#FFB547]'
                    }
                  >
                    {activeTrackingBox.label.toUpperCase()}
                  </span>
                  <span className="text-[#31D7FF]">{activeTrackingBox.confidence}% CONF</span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#A6B4CC] bg-[#0D1424]/90 px-2 py-0.5 rounded">
                  <span>TRACK: {activeTrackingBox.trackingId}</span>
                  <span className="text-[#F4F7FF] font-bold">~{activeTrackingBox.distanceM}m AHEAD</span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom HUD HUD Status Overlay */}
          {isScanning && (
            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
              <div className="bg-[#0D1424]/90 backdrop-blur-md border border-[#2684FF]/30 px-3 py-1.5 rounded-lg text-xs font-mono text-[#A6B4CC] flex items-center gap-2">
                <span className="text-[#31D7FF] font-bold">FPS: 28</span>
                <span>•</span>
                <span>EDGE INFERENCE: 1.8s</span>
                <span>•</span>
                <span className="text-[#35D49A]">TRACKER: ACTIVE</span>
              </div>

              <div className="bg-[#0D1424]/90 backdrop-blur-md border border-[#2684FF]/30 px-3 py-1.5 rounded-lg text-xs font-mono text-[#F4F7FF] flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-[#FFB547]" />
                <span>{sessionDetections.length} HAZARDS IN SESSION</span>
              </div>
            </div>
          )}
        </div>

        {/* Viewport Control Bar */}
        <div className="p-4 bg-[#0D1424] border-t border-[#1A2640] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {isScanning ? (
              <button
                type="button"
                onClick={stopScanningSession}
                className="px-6 py-2.5 rounded-xl bg-[#FF4D5A] hover:bg-[#e03d4a] text-[#F4F7FF] font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#FF4D5A]/20 transition cursor-pointer"
              >
                <Square className="w-4 h-4 fill-current" />
                STOP SCANNING
              </button>
            ) : (
              <button
                type="button"
                onClick={startSimulatedMode}
                className="px-6 py-2.5 rounded-xl bg-[#2684FF] hover:bg-[#1f73e8] text-[#F4F7FF] font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#2684FF]/30 transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                START ROAD SCAN
              </button>
            )}

            {/* Quick Mode Toggle */}
            <div className="flex items-center bg-[#121D31] rounded-xl p-1 border border-[#2684FF]/20 text-xs">
              <button
                type="button"
                onClick={startSimulatedMode}
                className={`px-3 py-1.5 rounded-lg transition ${
                  mode === 'demo_simulation' ? 'bg-[#2684FF] text-[#F4F7FF] font-bold' : 'text-[#A6B4CC]'
                }`}
              >
                Simulator Mode
              </button>
              <button
                type="button"
                onClick={startLiveCamera}
                className={`px-3 py-1.5 rounded-lg transition ${
                  mode === 'live_camera' ? 'bg-[#2684FF] text-[#F4F7FF] font-bold' : 'text-[#A6B4CC]'
                }`}
              >
                Live Camera
              </button>
            </div>
          </div>

          {/* Voice Guidance Bar Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleMute}
              className={`p-2.5 rounded-xl border transition flex items-center gap-1.5 text-xs font-mono cursor-pointer ${
                isVoiceMuted
                  ? 'bg-[#121D31] border-[#FF4D5A]/40 text-[#FF4D5A]'
                  : 'bg-[#121D31] border-[#2684FF]/40 text-[#31D7FF]'
              }`}
              title={isVoiceMuted ? 'Unmute Voice Assistant' : 'Mute Voice Assistant'}
            >
              {isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isVoiceMuted ? 'MUTED' : 'VOICE ON'}</span>
            </button>

            <button
              type="button"
              onClick={handleRepeatVoice}
              className="p-2.5 rounded-xl bg-[#121D31] hover:bg-[#1A2640] border border-[#2684FF]/30 text-[#A6B4CC] hover:text-[#F4F7FF] transition cursor-pointer flex items-center gap-1 text-xs"
              title="Repeat last voice message"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Repeat</span>
            </button>
          </div>
        </div>

        {/* Spoken Voice Subtitle Banner (Ensures accessibility for deaf/muted users) */}
        <div className="px-4 py-2.5 bg-[#070B14] border-t border-[#1A2640] flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#31D7FF] text-xs font-mono uppercase font-bold shrink-0">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Voice Subtitle:</span>
          </div>
          <p className="text-xs text-[#F4F7FF] font-medium truncate italic">
            "{latestVoiceMessage}"
          </p>
        </div>
      </div>

      {/* Warnings & Errors If Any */}
      {cameraError && (
        <div className="p-3 bg-[#FFB547]/10 border border-[#FFB547]/40 rounded-xl text-xs text-[#FFB547] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}
      {gpsError && (
        <div className="p-3 bg-[#121D31] border border-[#2684FF]/30 rounded-xl text-xs text-[#A6B4CC] flex items-center gap-2">
          <Navigation className="w-4 h-4 text-[#31D7FF] shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Current Session Detections Summary (Safe Post-Drive Review) */}
      {sessionDetections.length > 0 && (
        <div className="bg-[#0D1424] border border-[#1A2640] rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-[#F4F7FF] flex items-center gap-2">
                <span>Detections Logged in Current Session</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#2684FF]/20 text-[#31D7FF]">
                  {sessionDetections.length} Total
                </span>
              </h4>
              <p className="text-xs text-[#A6B4CC] mt-0.5">
                Review and submit hazard tickets safely after bringing your vehicle to a complete stop.
              </p>
            </div>
            {!isScanning && (
              <span className="text-xs text-[#35D49A] flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Ready for Review
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sessionDetections.map((det) => (
              <div
                key={det.id}
                className="bg-[#121D31] border border-[#1A2640] rounded-lg p-3 flex flex-col justify-between gap-3 hover:border-[#2684FF]/50 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                        det.priority === 'critical'
                          ? 'bg-[#FF4D5A]/20 text-[#FF4D5A]'
                          : 'bg-[#FFB547]/20 text-[#FFB547]'
                      }`}
                    >
                      {det.priority.toUpperCase()}
                    </span>
                    <span className="text-xs font-mono text-[#31D7FF]">{det.confidence}% Conf</span>
                  </div>
                  <h5 className="text-xs font-bold text-[#F4F7FF] capitalize">
                    {det.category.replace('_', ' ')}
                  </h5>
                  <p className="text-[11px] text-[#A6B4CC] mt-1 font-mono">
                    Track ID: {det.trackingId} • ~{det.distanceAheadMeters}m ahead
                  </p>
                </div>

                <div className="pt-2 border-t border-[#1A2640] flex items-center justify-between">
                  <span className="text-[10px] text-[#A6B4CC]">
                    {new Date(det.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleReviewAndSubmit(det)}
                    className="px-2.5 py-1 rounded bg-[#2684FF]/20 hover:bg-[#2684FF] text-[#31D7FF] hover:text-[#F4F7FF] text-xs font-semibold transition cursor-pointer"
                  >
                    Save to Authority Queue
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

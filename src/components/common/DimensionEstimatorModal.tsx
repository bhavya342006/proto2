import React, { useState } from 'react';
import {
  Ruler,
  Navigation,
  Eye,
  Cpu,
  Layers,
  AlertTriangle,
  Info,
  CheckCircle2,
  HelpCircle,
  X
} from 'lucide-react';
import { IncidentRecord, DimensionStatus } from '../../types';
import {
  CameraCalibrationProfile,
  DEFAULT_VEHICLE_CALIBRATION,
  computeMetricHomographyDimensions
} from '../../services/aiVisionService';

interface DimensionEstimatorModalProps {
  incident?: IncidentRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DimensionEstimatorModal: React.FC<DimensionEstimatorModalProps> = ({
  incident,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  // Interactive Calibration Playground
  const [calibration, setCalibration] = useState<CameraCalibrationProfile>(DEFAULT_VEHICLE_CALIBRATION);
  const [testBboxWidth, setTestBboxWidth] = useState<number>(180);
  const [testBboxHeight, setTestBboxHeight] = useState<number>(110);
  const [testYCenter, setTestYCenter] = useState<number>(310);

  const calculated = computeMetricHomographyDimensions(
    { widthPx: testBboxWidth, heightPx: testBboxHeight, yCenterPx: testYCenter },
    { width: 800, height: 500 },
    calibration
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070B14]/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0D1424] border border-[#2684FF]/40 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#1A2640] flex items-center justify-between sticky top-0 bg-[#0D1424] z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#2684FF]/20 text-[#31D7FF] border border-[#2684FF]/30">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#F4F7FF]">
                  Physical Dimension Estimation &amp; Calibration Architecture
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2684FF]/20 text-[#31D7FF] font-semibold">
                  SIGNATURE TECHNICAL FEATURE
                </span>
              </div>
              <p className="text-xs text-[#A6B4CC] mt-0.5">
                Technical separation of GPS, Computer Vision, and Metric Extrinsics Homography.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#A6B4CC] hover:text-[#F4F7FF] rounded-lg hover:bg-[#121D31] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Active Incident Metric Summary (if modal opened for a specific incident) */}
          {incident && (
            <div className="p-4 bg-[#121D31] border border-[#2684FF]/30 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-[#31D7FF]">
                  TARGET INCIDENT: {incident.id} • {incident.title}
                </span>
                <span
                  className={`text-[11px] font-mono px-2.5 py-0.5 rounded font-bold ${
                    incident.dimensions.status === 'ESTIMATED'
                      ? 'bg-[#35D49A]/20 text-[#35D49A]'
                      : incident.dimensions.status === 'APPROXIMATE'
                      ? 'bg-[#2684FF]/20 text-[#31D7FF]'
                      : 'bg-[#FFB547]/20 text-[#FFB547]'
                  }`}
                >
                  STATUS: {incident.dimensions.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono mt-3">
                <div className="bg-[#0D1424] p-3 rounded-lg border border-[#1A2640]">
                  <span className="text-[#A6B4CC] text-[10px] block">ESTIMATED LENGTH</span>
                  <span className="text-base font-bold text-[#F4F7FF]">
                    {incident.dimensions.lengthMeters ? `${incident.dimensions.lengthMeters} m` : 'UNAVAILABLE'}
                  </span>
                  {incident.dimensions.uncertaintyPercent && (
                    <span className="text-[10px] text-[#A6B4CC] block">±{incident.dimensions.uncertaintyPercent}%</span>
                  )}
                </div>

                <div className="bg-[#0D1424] p-3 rounded-lg border border-[#1A2640]">
                  <span className="text-[#A6B4CC] text-[10px] block">ESTIMATED WIDTH</span>
                  <span className="text-base font-bold text-[#F4F7FF]">
                    {incident.dimensions.widthMeters ? `${incident.dimensions.widthMeters} m` : 'UNAVAILABLE'}
                  </span>
                  {incident.dimensions.uncertaintyPercent && (
                    <span className="text-[10px] text-[#A6B4CC] block">±{incident.dimensions.uncertaintyPercent}%</span>
                  )}
                </div>

                <div className="bg-[#0D1424] p-3 rounded-lg border border-[#1A2640]">
                  <span className="text-[#A6B4CC] text-[10px] block">ESTIMATED DEPTH</span>
                  <span className="text-base font-bold text-[#F4F7FF]">
                    {incident.dimensions.depthMeters !== undefined
                      ? `${incident.dimensions.depthMeters} m`
                      : 'N/A (Monocular)'}
                  </span>
                  <span className="text-[10px] text-[#A6B4CC] block">Requires laser probe</span>
                </div>

                <div className="bg-[#0D1424] p-3 rounded-lg border border-[#1A2640]">
                  <span className="text-[#A6B4CC] text-[10px] block">SURFACE AREA</span>
                  <span className="text-base font-bold text-[#31D7FF]">
                    {incident.dimensions.areaSqMeters ? `${incident.dimensions.areaSqMeters} m²` : 'N/A'}
                  </span>
                  <span className="text-[10px] text-[#A6B4CC] block">Projected contour</span>
                </div>
              </div>

              <div className="mt-3 text-xs text-[#A6B4CC] bg-[#070B14] p-3 rounded-lg border border-[#1A2640]">
                <strong className="text-[#F4F7FF]">Method &amp; Constraint Explanation:</strong>{' '}
                {incident.dimensions.statusExplanation}
              </div>
            </div>
          )}

          {/* Section 5: The 3 Pillars of Metric Separation */}
          <div>
            <h4 className="text-xs font-mono font-bold text-[#A6B4CC] uppercase tracking-wider mb-3">
              THE 3-PILLAR SEPARATION OF RESPONSIBILITY
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Pillar 1: GPS */}
              <div className="bg-[#121D31] border border-[#1A2640] rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#2684FF] mb-2 font-bold text-sm">
                    <Navigation className="w-4 h-4" />
                    <span>Pillar 1: GPS Geolocation</span>
                  </div>
                  <p className="text-xs text-[#A6B4CC] leading-relaxed">
                    Provides geographic latitude, longitude, and accuracy radius.
                  </p>
                  <div className="mt-3 p-2 bg-[#FF4D5A]/10 border border-[#FF4D5A]/30 rounded text-[11px] text-[#FF4D5A]">
                    <strong>Critical Principle:</strong> GPS alone cannot measure pothole width, length, depth, or
                    area. Never infer physical dimensions from coordinates.
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1A2640] text-[11px] font-mono text-[#A6B4CC]">
                  Confidence: <span className="text-[#35D49A]">Location Confidence (94%)</span>
                </div>
              </div>

              {/* Pillar 2: Computer Vision */}
              <div className="bg-[#121D31] border border-[#1A2640] rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#31D7FF] mb-2 font-bold text-sm">
                    <Eye className="w-4 h-4" />
                    <span>Pillar 2: Computer Vision</span>
                  </div>
                  <p className="text-xs text-[#A6B4CC] leading-relaxed">
                    Detects the visible hazard class, isolates 2D pixel boundaries, and tracks the target across
                    consecutive video frames.
                  </p>
                  <div className="mt-3 p-2 bg-[#2684FF]/10 border border-[#2684FF]/30 rounded text-[11px] text-[#31D7FF]">
                    <strong>CV Boundary:</strong> Outputs 2D pixel bounding boxes $[x, y, w, h]$ and instance segmentation
                    contours without scale.
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1A2640] text-[11px] font-mono text-[#A6B4CC]">
                  Confidence: <span className="text-[#35D49A]">Visual Confidence (92%)</span>
                </div>
              </div>

              {/* Pillar 3: Metric Homography */}
              <div className="bg-[#121D31] border border-[#1A2640] rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#35D49A] mb-2 font-bold text-sm">
                    <Cpu className="w-4 h-4" />
                    <span>Pillar 3: Metric Extrinsics</span>
                  </div>
                  <p className="text-xs text-[#A6B4CC] leading-relaxed">
                    Uses vehicle camera pitch angle, lens height from road surface, and focal length to project pixel rays
                    onto real ground meters.
                  </p>
                  <div className="mt-3 p-2 bg-[#35D49A]/10 border border-[#35D49A]/30 rounded text-[11px] text-[#35D49A]">
                    <strong>Homography Mapping:</strong> Calculates meters per pixel. Flags monocular depth limitations
                    honestly.
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1A2640] text-[11px] font-mono text-[#A6B4CC]">
                  Confidence: <span className="text-[#35D49A]">Dimension Confidence (86%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dimension Status Matrix */}
          <div>
            <h4 className="text-xs font-mono font-bold text-[#A6B4CC] uppercase tracking-wider mb-3">
              FOUR MEASUREMENT AVAILABILITY STATUSES
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-[#121D31] border border-[#35D49A]/30 rounded-xl">
                <span className="font-mono font-bold text-[#35D49A] block mb-1">ESTIMATED</span>
                <p className="text-[#A6B4CC] text-[11px] leading-relaxed">
                  Full camera extrinsics calibration and reliable road ground-plane scale are established.
                </p>
              </div>

              <div className="p-3 bg-[#121D31] border border-[#2684FF]/30 rounded-xl">
                <span className="font-mono font-bold text-[#31D7FF] block mb-1">APPROXIMATE</span>
                <p className="text-[#A6B4CC] text-[11px] leading-relaxed">
                  Validated approximate method available (e.g. standard lane markings or curb line proportions).
                </p>
              </div>

              <div className="p-3 bg-[#121D31] border border-[#FFB547]/30 rounded-xl">
                <span className="font-mono font-bold text-[#FFB547] block mb-1">UNAVAILABLE</span>
                <p className="text-[#A6B4CC] text-[11px] leading-relaxed">
                  Hazard is too far or uncalibrated; reliable physical scale cannot be established.
                </p>
              </div>

              <div className="p-3 bg-[#121D31] border border-[#FF4D5A]/30 rounded-xl">
                <span className="font-mono font-bold text-[#FF4D5A] block mb-1">MANUAL REQUIRED</span>
                <p className="text-[#A6B4CC] text-[11px] leading-relaxed">
                  High-uncertainty hazard requires a municipal field inspector with a physical tape or laser gauge.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Homography Simulator Playground */}
          <div className="bg-[#121D31] border border-[#2684FF]/40 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="text-sm font-bold text-[#F4F7FF] flex items-center gap-2">
                  <span>Interactive Camera Homography Engine</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#2684FF]/20 text-[#31D7FF]">
                    Live Calibration Math
                  </span>
                </h5>
                <p className="text-xs text-[#A6B4CC]">
                  Adjust camera mount parameters to observe how prospective ground plane scaling converts pixels to
                  meters.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sliders */}
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-[#A6B4CC] mb-1">
                    <span>Camera Mount Height:</span>
                    <span className="font-mono font-bold text-[#F4F7FF]">
                      {calibration.mountingHeightMeters.toFixed(2)} m
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="2.5"
                    step="0.05"
                    value={calibration.mountingHeightMeters}
                    onChange={(e) =>
                      setCalibration({ ...calibration, mountingHeightMeters: parseFloat(e.target.value) })
                    }
                    className="w-full accent-[#2684FF] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[#A6B4CC] mb-1">
                    <span>Downward Pitch Angle:</span>
                    <span className="font-mono font-bold text-[#F4F7FF]">
                      {calibration.pitchAngleDegrees.toFixed(1)}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="35"
                    step="0.5"
                    value={calibration.pitchAngleDegrees}
                    onChange={(e) =>
                      setCalibration({ ...calibration, pitchAngleDegrees: parseFloat(e.target.value) })
                    }
                    className="w-full accent-[#2684FF] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[#A6B4CC] mb-1">
                    <span>Bounding Box Pixel Width:</span>
                    <span className="font-mono font-bold text-[#F4F7FF]">{testBboxWidth} px</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="450"
                    step="10"
                    value={testBboxWidth}
                    onChange={(e) => setTestBboxWidth(parseInt(e.target.value))}
                    className="w-full accent-[#2684FF] cursor-pointer"
                  />
                </div>
              </div>

              {/* Real-time Math Output Card */}
              <div className="lg:col-span-2 bg-[#0D1424] border border-[#1A2640] rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-[#31D7FF]">HOMOGRAPHY OUTPUT</span>
                    <span className="text-xs font-mono text-[#35D49A] font-bold">
                      {calculated.status} [±{calculated.uncertaintyPercent}%]
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center my-3">
                    <div className="bg-[#121D31] p-3 rounded-lg border border-[#1A2640]">
                      <span className="text-[#A6B4CC] text-[10px] block">ESTIMATED LENGTH</span>
                      <span className="font-mono text-base font-bold text-[#F4F7FF]">
                        {calculated.lengthM} m
                      </span>
                    </div>

                    <div className="bg-[#121D31] p-3 rounded-lg border border-[#1A2640]">
                      <span className="text-[#A6B4CC] text-[10px] block">ESTIMATED WIDTH</span>
                      <span className="font-mono text-base font-bold text-[#F4F7FF]">
                        {calculated.widthM} m
                      </span>
                    </div>

                    <div className="bg-[#121D31] p-3 rounded-lg border border-[#1A2640]">
                      <span className="text-[#A6B4CC] text-[10px] block">ESTIMATED AREA</span>
                      <span className="font-mono text-base font-bold text-[#31D7FF]">
                        {calculated.areaM2} m²
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-[#A6B4CC] mt-2 font-mono leading-relaxed bg-[#070B14] p-2.5 rounded border border-[#1A2640]">
                  {calculated.explanation}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#070B14] border-t border-[#1A2640] flex items-center justify-between">
          <span className="text-xs text-[#A6B4CC]">
            Physical dimensions unavailable — manual measurement required when camera is uncalibrated.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#2684FF] hover:bg-[#1f73e8] text-[#F4F7FF] text-xs font-bold transition cursor-pointer"
          >
            Close Explainer
          </button>
        </div>
      </div>
    </div>
  );
};

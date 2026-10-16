import React, { useState } from 'react';
import {
  Shield,
  Camera,
  Play,
  Square,
  Volume2,
  VolumeX,
  RotateCcw,
  MapPin,
  AlertTriangle,
  ArrowRight,
  Eye,
  CheckCircle2,
  Clock,
  Compass,
  FilePlus,
  Sliders,
  Sparkles
} from 'lucide-react';
import { IncidentRecord, HazardCategory } from '../../types';
import { RoadScanner } from './RoadScanner';
import { HazardMap } from '../common/HazardMap';
import { VoiceGuidance } from '../../services/voiceGuidanceService';

interface CitizenHomeProps {
  incidents: IncidentRecord[];
  onSelectIncident: (id: string) => void;
  onOpenReportModal: () => void;
  onNavigateTab: (tab: 'scanner' | 'map' | 'home') => void;
}

export const CitizenHome: React.FC<CitizenHomeProps> = ({
  incidents,
  onSelectIncident,
  onOpenReportModal,
  onNavigateTab
}) => {
  const [voiceMuted, setVoiceMuted] = useState(VoiceGuidance.getSettings().muted);
  const [voiceVolume, setVoiceVolume] = useState(VoiceGuidance.getSettings().volume);

  const nearbyHazards = incidents.slice(0, 4);

  const handleToggleMute = () => {
    const next = !voiceMuted;
    setVoiceMuted(next);
    VoiceGuidance.updateSettings({ muted: next });
  };

  const handleVolumeChange = (vol: number) => {
    setVoiceVolume(vol);
    VoiceGuidance.updateSettings({ volume: vol });
  };

  return (
    <div className="space-y-6">
      {/* Hero Welcome Card */}
      <div className="relative bg-[#0D1424] border border-[#1A2640] rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2684FF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-[#2684FF] text-[#F4F7FF] shadow-lg shadow-[#2684FF]/30">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-black text-[#F4F7FF] tracking-tight">
                    RoadGuard Citizen App
                  </h1>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#2684FF]/20 text-[#31D7FF] font-bold">
                    CONNECTED SENSOR
                  </span>
                </div>
                <p className="text-xs text-[#31D7FF] font-medium">
                  See hazards earlier. Respond smarter. Make roads safer.
                </p>
              </div>
            </div>

            <p className="text-xs text-[#A6B4CC] leading-relaxed">
              Transform your phone into a passive driving safety co-pilot. RoadGuard monitors pavement conditions
              through your front dashcam, provides hands-free audio alerts for critical hazards, and allows you to
              safely submit civic repair tickets when your vehicle is parked.
            </p>

            {/* Scanning State Clarification (Section 3.A Requirement) */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-2">
              <div className="flex items-center gap-2 bg-[#121D31] px-3 py-1.5 rounded-lg border border-[#1A2640] text-[#A6B4CC]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A6B4CC]/40" />
                <span>Scanning is active ONLY when explicitly started by you.</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#35D49A]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero Background Tracking</span>
              </div>
            </div>
          </div>

          {/* Quick Action CTA Card */}
          <div className="bg-[#121D31] border border-[#2684FF]/40 rounded-2xl p-5 shadow-xl flex flex-col gap-3 w-full md:w-72 shrink-0">
            <span className="text-xs font-mono font-bold text-[#A6B4CC] uppercase tracking-wider">
              DRIVER SCANNER CONTROL
            </span>

            <button
              type="button"
              onClick={() => onNavigateTab('scanner')}
              className="w-full py-3 px-4 rounded-xl bg-[#2684FF] hover:bg-[#1f73e8] text-[#F4F7FF] font-bold text-sm shadow-xl shadow-[#2684FF]/30 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>START ROAD SCAN</span>
            </button>

            <button
              type="button"
              onClick={onOpenReportModal}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0D1424] hover:bg-[#1A2640] border border-[#2684FF]/30 text-[#31D7FF] font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <FilePlus className="w-4 h-4" />
              <span>Submit Stopped Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Voice Assistant & Accessibility Controls Box (Section 3.A Requirement) */}
      <div className="bg-[#0D1424] border border-[#1A2640] rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#121D31] text-[#31D7FF] border border-[#2684FF]/20">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F4F7FF]">Driver Voice Guidance &amp; Accessibility</h3>
            <p className="text-xs text-[#A6B4CC]">
              Announces upcoming road hazards using concise audio cues with duplicate alert suppression.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          {/* Mute Toggle */}
          <button
            type="button"
            onClick={handleToggleMute}
            className={`px-3 py-1.5 rounded-xl border font-mono font-semibold transition flex items-center gap-1.5 cursor-pointer ${
              voiceMuted
                ? 'bg-[#FF4D5A]/20 border-[#FF4D5A]/40 text-[#FF4D5A]'
                : 'bg-[#121D31] border-[#2684FF]/40 text-[#31D7FF]'
            }`}
          >
            {voiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{voiceMuted ? 'VOICE MUTED' : 'VOICE GUIDANCE ACTIVE'}</span>
          </button>

          {/* Repeat Last Announcement */}
          <button
            type="button"
            onClick={() => VoiceGuidance.repeatLast()}
            className="px-3 py-1.5 rounded-xl bg-[#121D31] hover:bg-[#1A2640] border border-[#1A2640] text-[#A6B4CC] hover:text-[#F4F7FF] transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Repeat Last Alert</span>
          </button>

          {/* Volume Slider */}
          <div className="flex items-center gap-2 bg-[#121D31] px-3 py-1.5 rounded-xl border border-[#1A2640]">
            <span className="text-[#A6B4CC] text-[11px]">Volume:</span>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={voiceVolume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-20 accent-[#2684FF] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Embedded Live Road Scanner Viewport */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-mono font-bold text-[#A6B4CC] uppercase tracking-wider flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#2684FF]" />
            <span>OPTICAL ROAD SCANNER VIEWPORT</span>
          </h2>
          <span className="text-xs text-[#31D7FF] font-mono">Hands-Free Passive Scanning</span>
        </div>
        <RoadScanner onIncidentDetected={onSelectIncident} />
      </div>

      {/* Hazard Map Preview & Nearby Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Map Preview */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-[#A6B4CC] uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#2684FF]" />
              <span>NEARBY CIVIC HAZARDS MAP</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigateTab('map')}
              className="text-xs text-[#31D7FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Interactive Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <HazardMap
            incidents={incidents}
            onSelectIncident={onSelectIncident}
            heightClass="h-[380px]"
          />
        </div>

        {/* Right Column: Recent Incident Reports */}
        <div className="bg-[#0D1424] border border-[#1A2640] rounded-2xl p-5 shadow-xl flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1A2640]">
              <h4 className="text-xs font-mono font-bold text-[#A6B4CC] uppercase tracking-wider">
                RECENT ROAD HAZARDS
              </h4>
              <span className="text-[11px] font-mono text-[#31D7FF]">
                {incidents.length} IN METRO AREA
              </span>
            </div>

            <div className="space-y-3 mt-3">
              {nearbyHazards.map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => onSelectIncident(inc.id)}
                  className="p-3 bg-[#121D31] rounded-xl border border-[#1A2640] hover:border-[#2684FF]/50 transition cursor-pointer flex items-center gap-3"
                >
                  <img
                    src={inc.imageUrl}
                    alt={inc.title}
                    className="w-12 h-12 rounded-lg object-cover border border-[#1A2640] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[10px] font-mono mb-0.5">
                      <span className="text-[#31D7FF]">{inc.id}</span>
                      <span
                        className={
                          inc.priority === 'critical'
                            ? 'text-[#FF4D5A] font-bold'
                            : 'text-[#FF8C38] font-bold'
                        }
                      >
                        {inc.priority.toUpperCase()}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-[#F4F7FF] truncate">{inc.title}</h5>
                    <p className="text-[11px] text-[#A6B4CC] truncate mt-0.5">{inc.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenReportModal}
            className="w-full py-2.5 rounded-xl bg-[#121D31] hover:bg-[#1A2640] border border-[#2684FF]/30 text-[#F4F7FF] text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <FilePlus className="w-4 h-4 text-[#31D7FF]" />
            <span>Submit New Hazard Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

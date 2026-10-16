import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  ShieldAlert,
  Ruler,
  FileCheck,
  X,
  ChevronRight
} from 'lucide-react';
import { IncidentRecord } from '../../types';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenarioKey: string) => void;
  onResetDemo: () => void;
}

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  onSelectScenario,
  onResetDemo
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const scenarios = [
    {
      key: 'critical_emergency',
      title: 'Scenario 1: Critical Emergency Response (Fallen High-Voltage Wire)',
      targetId: 'DEMO-003',
      badge: 'CRITICAL PRIORITY',
      badgeColor: 'text-[#FF4D5A] bg-[#FF4D5A]/20',
      description:
        'Overhead power cable snapped on 4th St. High-risk audio alert fires, automated dispatch routes to High-Voltage emergency team.',
      actionLabel: 'Launch Emergency Scenario'
    },
    {
      key: 'dimension_homography',
      title: 'Scenario 2: Physical Dimension Estimation (Market St Deep Pothole)',
      targetId: 'DEMO-001',
      badge: 'HOMOGRAPHY CALIBRATION',
      badgeColor: 'text-[#31D7FF] bg-[#2684FF]/20',
      description:
        'Inspect calibrated 14.5° camera projection vs uncalibrated GPS. View length (1.25m), width (0.82m), shadow depth, and assign repair crew.',
      actionLabel: 'Inspect Metric Scale Scenario'
    },
    {
      key: 'repair_verification',
      title: 'Scenario 3: Repair Verification & Evidence Sign-Off',
      targetId: 'DEMO-012',
      badge: 'OFFICER SIGN-OFF GATE',
      badgeColor: 'text-[#35D49A] bg-[#35D49A]/20',
      description:
        'Field crew finished hot asphalt compaction on 3rd St. Test the side-by-side split slider and commit officer sign-off approval.',
      actionLabel: 'Open Repair Audit Studio'
    },
    {
      key: 'anti_noise_triage',
      title: 'Scenario 4: Anti-Noise Filtering & Duplicate Association',
      targetId: 'DEMO-010',
      badge: 'HONEST VALIDATION',
      badgeColor: 'text-[#FFB547] bg-[#FFB547]/20',
      description:
        'Examine DEMO-010 (Cabin coffee cup false positive auto-rejected) and DEMO-011 (duplicate of DEMO-001 linked via geo-proximity).',
      actionLabel: 'Test Triage Filter Scenario'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070B14]/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0D1424] border border-[#2684FF]/40 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#1A2640] flex items-center justify-between bg-[#121D31]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#2684FF]/20 text-[#31D7FF] border border-[#2684FF]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#F4F7FF]">Hackathon Quick Demonstration Guide</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2684FF]/20 text-[#31D7FF] font-bold">
                  ONE-CLICK PRESETS
                </span>
              </div>
              <p className="text-xs text-[#A6B4CC]">
                Fast-track evaluation workflows designed for competition judges and mentors.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[#A6B4CC] hover:text-[#F4F7FF] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenarios List */}
        <div className="p-6 space-y-3.5">
          {scenarios.map((sc) => (
            <div
              key={sc.key}
              className="bg-[#121D31] border border-[#1A2640] hover:border-[#2684FF]/60 rounded-xl p-4 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${sc.badgeColor}`}>
                    {sc.badge}
                  </span>
                  <span className="text-xs font-mono text-[#31D7FF] font-bold">Target: {sc.targetId}</span>
                </div>
                <h4 className="text-sm font-bold text-[#F4F7FF]">{sc.title}</h4>
                <p className="text-xs text-[#A6B4CC] leading-relaxed">{sc.description}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSelectScenario(sc.key);
                  onClose();
                }}
                className="px-4 py-2 bg-[#2684FF] hover:bg-[#1f73e8] text-[#F4F7FF] text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0 shadow-md cursor-pointer"
              >
                <span>{sc.actionLabel}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer with Reset Demo Button (Section 14 Requirement) */}
        <div className="p-4 bg-[#070B14] border-t border-[#1A2640] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#A6B4CC]">
            <span>Judges can safely test edits, worker dispatches, and sign-offs without permanent state damage.</span>
          </div>

          <div className="flex items-center gap-2">
            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2 rounded-xl bg-[#121D31] hover:bg-[#FF4D5A]/20 border border-[#FF4D5A]/40 text-[#FF4D5A] text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESET DEMO DATA</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-[#FF4D5A]/15 border border-[#FF4D5A]/50 px-3 py-1.5 rounded-xl text-xs">
                <span className="text-[#FF4D5A] font-bold">Restore 30 pristine records?</span>
                <button
                  type="button"
                  onClick={() => {
                    onResetDemo();
                    setShowResetConfirm(false);
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded bg-[#FF4D5A] text-[#F4F7FF] font-bold text-[11px] cursor-pointer"
                >
                  Yes, Reset
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2.5 py-1 rounded bg-[#121D31] text-[#A6B4CC] text-[11px] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

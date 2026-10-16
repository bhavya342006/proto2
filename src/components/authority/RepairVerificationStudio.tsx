import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Ruler,
  Clock,
  ShieldCheck,
  FileText,
  UserCheck,
  Sliders,
  RotateCcw,
  Camera,
  Layers,
  ChevronRight
} from 'lucide-react';
import { IncidentRecord } from '../../types';
import { IncidentService } from '../../services/incidentService';

interface RepairVerificationStudioProps {
  incident: IncidentRecord;
  isOpen?: boolean;
  onClose: () => void;
  onUpdated: (updated: IncidentRecord) => void;
}

export const RepairVerificationStudio: React.FC<RepairVerificationStudioProps> = ({
  incident,
  onClose,
  onUpdated
}) => {
  // Slider position for interactive before/after split view (0 to 100%)
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [decisionNotes, setDecisionNotes] = useState<string>('');
  const [officerDecision, setOfficerDecision] = useState<
    'approved' | 'rejected' | 'reinspection_requested'
  >('approved');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const repairData = incident.repairData;
  const beforeImg = repairData?.beforeImageUrl || incident.imageUrl;
  const afterImg = repairData?.afterImageUrl || incident.imageUrl;

  const handleExecuteDecision = () => {
    if (!decisionNotes.trim()) {
      alert('Please provide a decision rationale in the officer review notes.');
      return;
    }
    setIsSubmitting(true);
    const updated = IncidentService.verifyRepair(
      incident.id,
      officerDecision,
      decisionNotes,
      'OFF-01',
      'Chief Engineer Miller (Authority Review)'
    );

    setIsSubmitting(false);
    if (updated) {
      onUpdated(updated);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070B14]/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0D1424] border border-[#2684FF]/40 rounded-2xl w-full max-w-5xl max-h-[94vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#1A2640] flex items-center justify-between sticky top-0 bg-[#0D1424] z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#35D49A]/20 text-[#35D49A] border border-[#35D49A]/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#F4F7FF]">
                  Repair Verification &amp; Evidence Audit Studio
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFB547]/20 text-[#FFB547] font-semibold">
                  OFFICER SIGN-OFF GATE
                </span>
              </div>
              <p className="text-xs text-[#A6B4CC] mt-0.5">
                Target: {incident.id} • {incident.title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#A6B4CC] hover:text-[#F4F7FF] rounded-lg hover:bg-[#121D31] transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Prominent Mandatory Statement (Requirement from Section 9.D) */}
        <div className="bg-[#121D31] border-b border-[#2684FF]/30 px-6 py-3.5 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-[#FFB547] shrink-0" />
          <p className="text-xs font-semibold text-[#F4F7FF] leading-relaxed">
            "A photograph supports a repair claim; it does not automatically prove that the hazard is resolved."
            <span className="text-[#A6B4CC] font-normal block sm:inline sm:ml-1">
              Authorised municipal review must verify compaction, sealant continuity, and road grade standards.
            </span>
          </p>
        </div>

        {/* Studio Content */}
        <div className="p-6 space-y-6">
          {/* Interactive Side-by-Side & Split Slider Comparison View */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold text-[#A6B4CC] uppercase tracking-wider flex items-center gap-2">
                <span>BEFORE AND AFTER PHOTOGRAPHIC COMPARISON</span>
                <span className="text-[#31D7FF] font-normal">({sliderPos}% Split)</span>
              </h4>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-[#FF4D5A]">◀ ORIGINAL INCIDENT</span>
                <span className="text-[#A6B4CC]">|</span>
                <span className="text-[#35D49A]">REPAIRED WORK ▶</span>
              </div>
            </div>

            {/* Slider Container */}
            <div className="relative w-full aspect-21/9 min-h-[300px] max-h-[420px] rounded-xl overflow-hidden border border-[#1A2640] select-none bg-[#070B14]">
              {/* After Image (Background) */}
              <img
                src={afterImg}
                alt="Repaired Evidence"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Before Image (Clipped Left Side) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={beforeImg}
                  alt="Original Incident"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: '100%', minWidth: '100%' }}
                />
              </div>

              {/* Vertical Divider Line with Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-[#31D7FF] shadow-2xl pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#0D1424] border-2 border-[#31D7FF] flex items-center justify-center text-[#31D7FF] text-xs font-bold shadow-lg">
                  ⬄
                </div>
              </div>

              {/* Slider Input overlay */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(parseInt(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
              />

              {/* Overlay Tags */}
              <div className="absolute top-3 left-3 bg-[#0D1424]/90 backdrop-blur-md px-3 py-1 rounded-md border border-[#FF4D5A]/40 text-xs font-mono text-[#FF4D5A] font-bold">
                BEFORE: HAZARD ACTIVE
              </div>
              <div className="absolute top-3 right-3 bg-[#0D1424]/90 backdrop-blur-md px-3 py-1 rounded-md border border-[#35D49A]/40 text-xs font-mono text-[#35D49A] font-bold">
                AFTER: WORKER COMPLETED
              </div>
            </div>

            <p className="text-[11px] text-[#A6B4CC] text-center font-mono">
              Drag slider horizontally to inspect joint sealing, compaction edge, and road line continuity.
            </p>
          </div>

          {/* Details & Worker Evidence Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Field Worker Report */}
            <div className="bg-[#121D31] border border-[#1A2640] rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-[#31D7FF] flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4" /> FIELD WORKER SUBMISSION
                  </span>
                  <span className="text-[11px] font-mono text-[#A6B4CC]">
                    ID: {repairData?.workerId || incident.assignedWorkerId || 'WRK-02'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[#A6B4CC] text-[10px] block">WORKER NAME:</span>
                    <span className="text-[#F4F7FF] font-semibold">
                      {repairData?.workerName || incident.assignedWorkerName || 'Darnell Washington (Asphalt Crew B)'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#A6B4CC] text-[10px] block">WORKER NOTES &amp; MATERIALS:</span>
                    <p className="text-[#F4F7FF] bg-[#0D1424] p-2.5 rounded border border-[#1A2640] mt-1 leading-relaxed">
                      {repairData?.workerNotes ||
                        'Excavated damaged asphalt to sound base. Placed hot mix asphalt, compacted to grade with vibratory roller. Seams coated with bitumen.'}
                    </p>
                  </div>

                  {repairData?.inspectionMeasurements && (
                    <div className="pt-2">
                      <span className="text-[#A6B4CC] text-[10px] block mb-1">ON-SITE MANUAL MEASUREMENTS:</span>
                      <div className="grid grid-cols-3 gap-2 text-center font-mono text-[11px]">
                        <div className="bg-[#0D1424] p-1.5 rounded">
                          L: {repairData.inspectionMeasurements.lengthM}m
                        </div>
                        <div className="bg-[#0D1424] p-1.5 rounded">
                          W: {repairData.inspectionMeasurements.widthM}m
                        </div>
                        <div className="bg-[#0D1424] p-1.5 rounded">
                          D: {repairData.inspectionMeasurements.depthM || 0.0}m (Flush)
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quality Checklist */}
              <div className="mt-4 pt-3 border-t border-[#1A2640]">
                <span className="text-[10px] font-mono font-bold text-[#A6B4CC] block mb-2">
                  FIELD QUALITY CHECKLIST:
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 text-[#35D49A]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Bitumen Perimeter Sealed</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#35D49A]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Debris Removed</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#35D49A]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Road Grade Flush</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#35D49A]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Safety Cones Cleared</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Officer Action & Audit Decision Box */}
            <div className="bg-[#121D31] border border-[#2684FF]/40 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#2684FF] block mb-2">
                  AUTHORISED MUNICIPAL OFFICER DECISION
                </span>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-[#A6B4CC] block mb-1">Select Verification Action:</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setOfficerDecision('approved');
                          setDecisionNotes(
                            'Visual compaction and bitumen seam sealing verified against municipal standards. Approved for ticket closure.'
                          );
                        }}
                        className={`p-2 rounded-lg text-xs font-bold border transition flex flex-col items-center gap-1 cursor-pointer ${
                          officerDecision === 'approved'
                            ? 'bg-[#35D49A]/20 border-[#35D49A] text-[#35D49A]'
                            : 'bg-[#0D1424] border-[#1A2640] text-[#A6B4CC]'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>APPROVE</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setOfficerDecision('rejected');
                          setDecisionNotes(
                            'Evidence rejected: Visible edge gaps around asphalt perimeter. Rework required.'
                          );
                        }}
                        className={`p-2 rounded-lg text-xs font-bold border transition flex flex-col items-center gap-1 cursor-pointer ${
                          officerDecision === 'rejected'
                            ? 'bg-[#FF4D5A]/20 border-[#FF4D5A] text-[#FF4D5A]'
                            : 'bg-[#0D1424] border-[#1A2640] text-[#A6B4CC]'
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                        <span>REJECT</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setOfficerDecision('reinspection_requested');
                          setDecisionNotes(
                            'Requesting physical on-site straightedge test before formal sign-off.'
                          );
                        }}
                        className={`p-2 rounded-lg text-xs font-bold border transition flex flex-col items-center gap-1 cursor-pointer ${
                          officerDecision === 'reinspection_requested'
                            ? 'bg-[#FFB547]/20 border-[#FFB547] text-[#FFB547]'
                            : 'bg-[#0D1424] border-[#1A2640] text-[#A6B4CC]'
                        }`}
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>RE-INSPECT</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#A6B4CC] block mb-1">
                      Decision Rationale &amp; Audit Notes (Mandatory):
                    </label>
                    <textarea
                      rows={3}
                      value={decisionNotes}
                      onChange={(e) => setDecisionNotes(e.target.value)}
                      placeholder="Enter formal justification for resolution approval or rejection..."
                      className="w-full bg-[#0D1424] border border-[#1A2640] rounded-lg p-2.5 text-xs text-[#F4F7FF] focus:border-[#2684FF] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#1A2640] flex items-center justify-between">
                <span className="text-[10px] text-[#A6B4CC] font-mono">
                  Reviewer: Chief Engineer Miller (Badge #309)
                </span>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleExecuteDecision}
                  className="px-5 py-2 rounded-xl bg-[#2684FF] hover:bg-[#1f73e8] text-[#F4F7FF] text-xs font-bold transition shadow-lg shadow-[#2684FF]/20 cursor-pointer"
                >
                  Commit Officer Verification
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

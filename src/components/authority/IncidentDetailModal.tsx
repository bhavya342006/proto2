import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  MapPin,
  Clock,
  Ruler,
  UserCheck,
  Copy,
  Layers,
  CheckCircle2,
  FileText,
  CornerDownRight,
  Eye,
  Sliders,
  X,
  ExternalLink,
  Send
} from 'lucide-react';
import { IncidentRecord, PriorityLevel, ReportStatus, ValidationClassification } from '../../types';
import { IncidentService } from '../../services/incidentService';

interface IncidentDetailModalProps {
  incident: IncidentRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (updated: IncidentRecord) => void;
  onOpenDimensionsModal: (inc: IncidentRecord) => void;
  onOpenRepairVerification: (inc: IncidentRecord) => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incident,
  isOpen,
  onClose,
  onUpdated,
  onOpenDimensionsModal,
  onOpenRepairVerification
}) => {
  if (!isOpen || !incident) return null;

  // Edit / Action Form States
  const [operatorNotes, setOperatorNotes] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel>(incident.priority);
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus>(incident.status);
  const [selectedClassification, setSelectedClassification] = useState<ValidationClassification>(
    incident.classification
  );
  const [assignedWorkerName, setAssignedWorkerName] = useState<string>(
    incident.assignedWorkerName || 'Carlos Ramirez (Rapid Response Crew A)'
  );

  const [activeTab, setActiveTab] = useState<'overview' | 'dimensions' | 'evidence' | 'audit_history'>(
    'overview'
  );

  const handleCommitUpdate = () => {
    if (!operatorNotes.trim()) {
      alert('Please record an operator audit rationale for this change.');
      return;
    }

    const updated = IncidentService.updateIncident(
      incident.id,
      {
        priority: selectedPriority,
        status: selectedStatus,
        classification: selectedClassification,
        assignedWorkerName
      },
      'Officer Miller (Control Centre)',
      operatorNotes
    );

    if (updated) {
      onUpdated(updated);
      setOperatorNotes('');
      alert(`Incident ${incident.id} updated and logged to audit trail.`);
    }
  };

  const handleMarkManualInspection = () => {
    const updated = IncidentService.updateIncident(
      incident.id,
      {
        status: 'under_inspection',
        classification: 'MANUAL INSPECTION REQUIRED'
      },
      'Officer Miller',
      'Moved to manual inspection queue: On-site laser/tape measurement and hazard severity confirmation required.'
    );
    if (updated) onUpdated(updated);
  };

  const handleFlagDuplicate = () => {
    const parentId = prompt('Enter Parent Incident ID (e.g. DEMO-001):', 'DEMO-001');
    if (!parentId) return;
    const updated = IncidentService.updateIncident(
      incident.id,
      {
        classification: 'LIKELY DUPLICATE',
        duplicateOfId: parentId,
        duplicateMatchReason: `Flagged as duplicate of ${parentId} by authority reviewer.`
      },
      'Officer Miller',
      `Associated as duplicate of parent ticket ${parentId}.`
    );
    if (updated) onUpdated(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070B14]/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0D1424] border border-[#2684FF]/40 rounded-2xl w-full max-w-5xl max-h-[94vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#1A2640] flex items-center justify-between sticky top-0 bg-[#0D1424] z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#2684FF]/20 text-[#31D7FF] border border-[#2684FF]/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#2684FF]/20 text-[#31D7FF]">
                  {incident.id}
                </span>
                <h3 className="text-base font-bold text-[#F4F7FF]">{incident.title}</h3>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    incident.priority === 'critical'
                      ? 'bg-[#FF4D5A]/20 text-[#FF4D5A]'
                      : 'bg-[#FF8C38]/20 text-[#FF8C38]'
                  }`}
                >
                  {incident.priority.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-[#A6B4CC] flex items-center gap-2 mt-0.5 font-mono">
                <span>{incident.address}</span>
                <span>•</span>
                <span>
                  {incident.coordinates.lat.toFixed(4)}, {incident.coordinates.lng.toFixed(4)} (±{incident.gpsAccuracyMeters}m)
                </span>
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

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-[#1A2640] flex items-center gap-4 bg-[#0A101C] text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3 font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#2684FF] text-[#31D7FF]'
                : 'border-transparent text-[#A6B4CC] hover:text-[#F4F7FF]'
            }`}
          >
            Incident Overview &amp; Visuals
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('dimensions')}
            className={`py-3 font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'dimensions'
                ? 'border-[#2684FF] text-[#31D7FF]'
                : 'border-transparent text-[#A6B4CC] hover:text-[#F4F7FF]'
            }`}
          >
            Physical Dimension Scale
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('evidence')}
            className={`py-3 font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'evidence'
                ? 'border-[#2684FF] text-[#31D7FF]'
                : 'border-transparent text-[#A6B4CC] hover:text-[#F4F7FF]'
            }`}
          >
            Validation Evidence &amp; AI Triage
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('audit_history')}
            className={`py-3 font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'audit_history'
                ? 'border-[#2684FF] text-[#31D7FF]'
                : 'border-transparent text-[#A6B4CC] hover:text-[#F4F7FF]'
            }`}
          >
            Audit Trail ({incident.history.length})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Image with Bounding Box & Captions */}
              <div className="space-y-3">
                <div className="relative aspect-16/10 rounded-xl overflow-hidden border border-[#2684FF]/40 bg-[#070B14]">
                  <img
                    src={incident.imageUrl}
                    alt={incident.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-[#070B14]/85 px-2.5 py-1 rounded text-[10px] text-[#A6B4CC] border border-[#1A2640] font-mono">
                    {incident.imageCaption || 'Dashcam optical evidence frame'}
                  </div>
                </div>

                <div className="bg-[#121D31] p-3.5 rounded-xl border border-[#1A2640] space-y-2 text-xs">
                  <span className="font-bold text-[#F4F7FF] block">Hazard Description:</span>
                  <p className="text-[#A6B4CC] leading-relaxed">{incident.description}</p>
                  <div className="pt-2 border-t border-[#1A2640] text-[11px] text-[#FFB547]">
                    <strong>Priority Rationale:</strong> {incident.priorityExplanation}
                  </div>
                </div>

                {/* Repair Status Quick Action */}
                {incident.repairData && (
                  <div className="p-3.5 bg-[#35D49A]/10 border border-[#35D49A]/30 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#35D49A] block">
                        Repair Evidence Uploaded by Field Crew
                      </span>
                      <span className="text-[11px] text-[#A6B4CC]">
                        Submitted by: {incident.repairData.workerName}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenRepairVerification(incident)}
                      className="px-3 py-1.5 bg-[#35D49A] text-[#070B14] font-bold text-xs rounded-lg cursor-pointer"
                    >
                      Audit Repair Slider
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Municipal Dispatcher Control Action Panel */}
              <div className="bg-[#121D31] border border-[#2684FF]/30 rounded-xl p-5 space-y-4">
                <span className="text-xs font-mono font-bold text-[#31D7FF] uppercase tracking-wider block">
                  OFFICER TRIAGE &amp; DISPATCH CONTROLS
                </span>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[#A6B4CC] block mb-1">Status:</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as ReportStatus)}
                      className="w-full bg-[#0D1424] border border-[#1A2640] rounded-lg p-2 text-xs text-[#F4F7FF] focus:border-[#2684FF] focus:outline-hidden cursor-pointer"
                    >
                      <option value="reported">Reported</option>
                      <option value="triaged">Triaged</option>
                      <option value="inspection_assigned">Inspection Assigned</option>
                      <option value="under_inspection">Under Inspection</option>
                      <option value="repaired_pending_verification">Repaired (Pending Verification)</option>
                      <option value="verified_resolved">Verified Resolved</option>
                      <option value="rejected_false_positive">Rejected / False Positive</option>
                      <option value="reopened">Reopened</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[#A6B4CC] block mb-1">Priority Level:</label>
                    <select
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value as PriorityLevel)}
                      className="w-full bg-[#0D1424] border border-[#1A2640] rounded-lg p-2 text-xs text-[#F4F7FF] focus:border-[#2684FF] focus:outline-hidden cursor-pointer"
                    >
                      <option value="critical">Critical (Immediate Life-Safety Hazard)</option>
                      <option value="high">High (Significant Hazard / Damage Risk)</option>
                      <option value="medium">Medium (Requires Attention)</option>
                      <option value="low">Low (Minor Non-Urgent Maintenance)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[#A6B4CC] block mb-1">Validation Classification:</label>
                    <select
                      value={selectedClassification}
                      onChange={(e) =>
                        setSelectedClassification(e.target.value as ValidationClassification)
                      }
                      className="w-full bg-[#0D1424] border border-[#1A2640] rounded-lg p-2 text-xs text-[#F4F7FF] focus:border-[#2684FF] focus:outline-hidden cursor-pointer"
                    >
                      <option value="MODEL-SUPPORTED DETECTION">MODEL-SUPPORTED DETECTION</option>
                      <option value="HUMAN-VERIFIED HAZARD">HUMAN-VERIFIED HAZARD</option>
                      <option value="MANUAL INSPECTION REQUIRED">MANUAL INSPECTION REQUIRED</option>
                      <option value="LIKELY DUPLICATE">LIKELY DUPLICATE</option>
                      <option value="SUSPECTED FALSE OR IRRELEVANT REPORT">
                        SUSPECTED FALSE OR IRRELEVANT REPORT
                      </option>
                      <option value="HUMAN-VERIFIED RESOLUTION">HUMAN-VERIFIED RESOLUTION</option>
                      <option value="DEMONSTRATION RECORD">DEMONSTRATION RECORD</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[#A6B4CC] block mb-1">Assigned Field Crew:</label>
                    <select
                      value={assignedWorkerName}
                      onChange={(e) => setAssignedWorkerName(e.target.value)}
                      className="w-full bg-[#0D1424] border border-[#1A2640] rounded-lg p-2 text-xs text-[#F4F7FF] focus:border-[#2684FF] focus:outline-hidden cursor-pointer"
                    >
                      <option value="Carlos Ramirez (Rapid Response Crew A)">
                        Carlos Ramirez (Rapid Response Crew A)
                      </option>
                      <option value="Darnell Washington (Asphalt Crew B)">
                        Darnell Washington (Asphalt Crew B)
                      </option>
                      <option value="Marcus Vance (Emergency Utility Response)">
                        Marcus Vance (Emergency Utility Response)
                      </option>
                      <option value="Sarah Lin (High Voltage Safety Team)">
                        Sarah Lin (High Voltage Safety Team)
                      </option>
                      <option value="Elena Rostova (DPW Forestry & Clearance)">
                        Elena Rostova (DPW Forestry &amp; Clearance)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[#A6B4CC] block mb-1 font-semibold">
                      Reason for Decision / Audit Notes (Required):
                    </label>
                    <textarea
                      rows={2}
                      value={operatorNotes}
                      onChange={(e) => setOperatorNotes(e.target.value)}
                      placeholder="Enter operational rationale for changes..."
                      className="w-full bg-[#0D1424] border border-[#1A2640] rounded-lg p-2 text-xs text-[#F4F7FF] focus:border-[#2684FF] focus:outline-hidden"
                    />
                  </div>

                  {/* Quick Triage Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleMarkManualInspection}
                      className="px-3 py-1.5 rounded-lg bg-[#FFB547]/20 hover:bg-[#FFB547] text-[#FFB547] hover:text-[#070B14] font-semibold text-[11px] transition cursor-pointer"
                    >
                      Mark Manual Inspection
                    </button>
                    <button
                      type="button"
                      onClick={handleFlagDuplicate}
                      className="px-3 py-1.5 rounded-lg bg-[#2684FF]/20 hover:bg-[#2684FF] text-[#31D7FF] hover:text-[#F4F7FF] font-semibold text-[11px] transition cursor-pointer"
                    >
                      Flag as Duplicate
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1A2640] flex justify-end">
                  <button
                    type="button"
                    onClick={handleCommitUpdate}
                    className="px-5 py-2 rounded-xl bg-[#2684FF] hover:bg-[#1f73e8] text-[#F4F7FF] font-bold text-xs transition cursor-pointer shadow-lg shadow-[#2684FF]/20"
                  >
                    Commit Officer Action
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dimensions' && (
            <div className="space-y-4">
              <div className="bg-[#121D31] p-4 rounded-xl border border-[#2684FF]/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-[#31D7FF]">
                    STATUS: {incident.dimensions.status}
                  </span>
                  <p className="text-xs text-[#A6B4CC] mt-0.5">
                    {incident.dimensions.statusExplanation}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenDimensionsModal(incident)}
                  className="px-4 py-2 bg-[#2684FF] hover:bg-[#1f73e8] text-[#F4F7FF] text-xs font-bold rounded-lg cursor-pointer"
                >
                  Open Homography Calibration Engine
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="bg-[#0D1424] p-3 rounded-xl border border-[#1A2640]">
                  <span className="text-[#A6B4CC] text-[10px] block">ESTIMATED LENGTH</span>
                  <span className="text-lg font-bold text-[#F4F7FF]">
                    {incident.dimensions.lengthMeters ? `${incident.dimensions.lengthMeters} m` : 'UNAVAILABLE'}
                  </span>
                  {incident.dimensions.uncertaintyPercent && (
                    <span className="text-[10px] text-[#A6B4CC] block">±{incident.dimensions.uncertaintyPercent}%</span>
                  )}
                </div>

                <div className="bg-[#0D1424] p-3 rounded-xl border border-[#1A2640]">
                  <span className="text-[#A6B4CC] text-[10px] block">ESTIMATED WIDTH</span>
                  <span className="text-lg font-bold text-[#F4F7FF]">
                    {incident.dimensions.widthMeters ? `${incident.dimensions.widthMeters} m` : 'UNAVAILABLE'}
                  </span>
                  {incident.dimensions.uncertaintyPercent && (
                    <span className="text-[10px] text-[#A6B4CC] block">±{incident.dimensions.uncertaintyPercent}%</span>
                  )}
                </div>

                <div className="bg-[#0D1424] p-3 rounded-xl border border-[#1A2640]">
                  <span className="text-[#A6B4CC] text-[10px] block">DEPTH ESTIMATE</span>
                  <span className="text-lg font-bold text-[#F4F7FF]">
                    {incident.dimensions.depthMeters !== undefined
                      ? `${incident.dimensions.depthMeters} m`
                      : 'N/A (Monocular)'}
                  </span>
                  <span className="text-[10px] text-[#A6B4CC] block">Requires laser probe</span>
                </div>

                <div className="bg-[#0D1424] p-3 rounded-xl border border-[#1A2640]">
                  <span className="text-[#A6B4CC] text-[10px] block">SURFACE AREA</span>
                  <span className="text-lg font-bold text-[#31D7FF]">
                    {incident.dimensions.areaSqMeters ? `${incident.dimensions.areaSqMeters} m²` : 'N/A'}
                  </span>
                  <span className="text-[10px] text-[#A6B4CC] block">Projected contour</span>
                </div>
              </div>

              <div className="bg-[#0D1424] p-4 rounded-xl border border-[#1A2640] text-xs font-mono space-y-2">
                <span className="text-[#31D7FF] font-bold block">MEASUREMENT METHOD:</span>
                <p className="text-[#F4F7FF]">{incident.dimensions.measurementMethod}</p>
              </div>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="space-y-4 text-xs">
              <div className="bg-[#121D31] p-4 rounded-xl border border-[#1A2640] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[#31D7FF] font-bold">
                    CLASSIFICATION: {incident.classification}
                  </span>
                  <span className="font-mono text-[#A6B4CC]">
                    Decided by: {incident.classificationEvidence.decidedBy}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="bg-[#0D1424] p-3 rounded-lg border border-[#1A2640]">
                    <span className="text-[#35D49A] font-bold block mb-1">Supporting Evidence:</span>
                    <ul className="list-disc list-inside space-y-1 text-[#A6B4CC]">
                      {incident.classificationEvidence.supporting.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#0D1424] p-3 rounded-lg border border-[#1A2640]">
                    <span className="text-[#FFB547] font-bold block mb-1">Missing / Unverified:</span>
                    {incident.classificationEvidence.missing.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-[#A6B4CC]">
                        {incident.classificationEvidence.missing.map((m, idx) => (
                          <li key={idx}>{m}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-[#A6B4CC] italic">All primary evidence criteria verified.</span>
                    )}
                  </div>
                </div>

                <div className="bg-[#0D1424] p-3 rounded-lg border border-[#1A2640]">
                  <span className="text-[#2684FF] font-bold block mb-1">Recommended Next Step:</span>
                  <p className="text-[#F4F7FF]">{incident.classificationEvidence.recommendedNextStep}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit_history' && (
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-[#A6B4CC] uppercase tracking-wider block">
                IMMUTABLE AUDIT LOG &amp; CHAIN OF CUSTODY
              </span>
              <div className="space-y-2">
                {incident.history.map((h) => (
                  <div
                    key={h.id}
                    className="p-3 bg-[#121D31] rounded-xl border border-[#1A2640] flex items-start justify-between text-xs font-mono"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[#F4F7FF]">{h.action}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2684FF]/20 text-[#31D7FF]">
                          {h.actor}
                        </span>
                      </div>
                      <p className="text-[#A6B4CC] text-[11px] font-sans">{h.details}</p>
                    </div>
                    <span className="text-[#A6B4CC] text-[10px] shrink-0 ml-3">{h.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

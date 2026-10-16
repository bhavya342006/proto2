import React, { useState } from 'react';
import {
  Wrench,
  Navigation,
  MapPin,
  Camera,
  CheckCircle2,
  Clock,
  Ruler,
  AlertTriangle,
  Upload,
  Send,
  FileCheck,
  ChevronRight
} from 'lucide-react';
import { IncidentRecord } from '../../types';
import { IncidentService } from '../../services/incidentService';
import { getHazardIllustration } from '../../utils/hazardIllustrations';

interface FieldWorkerPortalProps {
  incidents: IncidentRecord[];
  onSelectIncident: (id: string) => void;
  onRefresh: () => void;
}

export const FieldWorkerPortal: React.FC<FieldWorkerPortalProps> = ({
  incidents,
  onSelectIncident,
  onRefresh
}) => {
  // Demo field worker identity
  const [currentWorkerId] = useState<string>('WRK-04');
  const [currentWorkerName] = useState<string>('Carlos Ramirez (Rapid Response Crew A)');

  // Selected work order to report on
  const [activeTask, setActiveTask] = useState<IncidentRecord | null>(null);

  // Form states for submitting repair
  const [manualLength, setManualLength] = useState<string>('1.15');
  const [manualWidth, setManualWidth] = useState<string>('0.80');
  const [manualDepth, setManualDepth] = useState<string>('0.00');
  const [repairNotes, setRepairNotes] = useState<string>(
    'Excavated damaged area, applied rapid-cure tack emulsion, placed 50mm compacted asphalt, applied liquid perimeter sealant.'
  );
  const [checklist, setChecklist] = useState({
    surfaceSealed: true,
    debrisCleared: true,
    structuralGradeMet: true,
    hazardEliminated: true
  });
  const [afterPhotoUrl, setAfterPhotoUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filter tasks assigned to field workers or needing field action
  const assignedTasks = incidents.filter(
    (inc) =>
      inc.status === 'inspection_assigned' ||
      inc.status === 'under_inspection' ||
      (inc.assignedWorkerId && inc.status !== 'verified_resolved')
  );

  const handleOpenTask = (task: IncidentRecord) => {
    setActiveTask(task);
    setSuccessMsg(null);
    setAfterPhotoUrl(getHazardIllustration(task.category, task.id, 'repaired'));
    if (task.dimensions.lengthMeters) setManualLength(task.dimensions.lengthMeters.toString());
    if (task.dimensions.widthMeters) setManualWidth(task.dimensions.widthMeters.toString());
    if (task.dimensions.depthMeters) setManualDepth(task.dimensions.depthMeters.toString());

    // Automatically set to 'under_inspection' when worker opens task
    if (task.status === 'inspection_assigned') {
      IncidentService.setUnderInspection(task.id, currentWorkerName);
      onRefresh();
    }
  };

  const handleSubmitRepair = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask) return;

    setIsSubmitting(true);
    IncidentService.submitInspectionAndRepair(activeTask.id, {
      afterImageUrl: afterPhotoUrl || getHazardIllustration(activeTask.category, activeTask.id, 'repaired'),
      workerNotes: repairNotes,
      workerId: currentWorkerId,
      workerName: currentWorkerName,
      measurements: {
        lengthM: parseFloat(manualLength) || 1.1,
        widthM: parseFloat(manualWidth) || 0.8,
        depthM: parseFloat(manualDepth) || 0.0
      },
      checklist
    });

    setIsSubmitting(false);
    setSuccessMsg(
      `Work order for ${activeTask.id} submitted successfully to Municipal Officer Review. Awaiting independent verification.`
    );
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Field Worker Header Card */}
      <div className="bg-[#0D1424] border border-[#1A2640] rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#2684FF]/20 rounded-xl text-[#31D7FF] border border-[#2684FF]/30">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#F4F7FF]">Field Worker Inspection &amp; Repair Portal</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#35D49A]/20 text-[#35D49A] font-bold">
                CREW ONLINE
              </span>
            </div>
            <p className="text-xs text-[#A6B4CC] mt-0.5">
              Logged in: <strong className="text-[#F4F7FF]">{currentWorkerName}</strong> ({currentWorkerId})
            </p>
          </div>
        </div>

        {/* Worker Notice */}
        <div className="text-xs font-mono bg-[#121D31] px-3.5 py-2 rounded-xl border border-[#1A2640] text-[#A6B4CC]">
          <span className="text-[#FFB547] font-bold">Separation of Duties:</span> Workers submit repair evidence;
          only Authorized Municipal Officers can grant final verification approval.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Assigned Work Orders Queue */}
        <div className="bg-[#0D1424] border border-[#1A2640] rounded-2xl p-4 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#1A2640]">
            <h3 className="text-xs font-mono font-bold text-[#A6B4CC] uppercase tracking-wider flex items-center gap-2">
              <span>ASSIGNED WORK ORDERS</span>
              <span className="px-2 py-0.5 rounded-full bg-[#2684FF]/20 text-[#31D7FF]">
                {assignedTasks.length}
              </span>
            </h3>
            <span className="text-[11px] text-[#A6B4CC]">Tap to open</span>
          </div>

          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {assignedTasks.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#A6B4CC]">
                No pending work orders assigned right now. Check back shortly.
              </div>
            ) : (
              assignedTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleOpenTask(task)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col gap-2 ${
                    activeTask?.id === task.id
                      ? 'bg-[#121D31] border-[#2684FF] shadow-lg shadow-[#2684FF]/10'
                      : 'bg-[#121D31]/60 border-[#1A2640] hover:border-[#2684FF]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#31D7FF]">{task.id}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        task.priority === 'critical'
                          ? 'bg-[#FF4D5A]/20 text-[#FF4D5A]'
                          : task.priority === 'high'
                          ? 'bg-[#FF8C38]/20 text-[#FF8C38]'
                          : 'bg-[#2684FF]/20 text-[#31D7FF]'
                      }`}
                    >
                      {task.priority.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-[#F4F7FF] line-clamp-1">{task.title}</h4>

                  <div className="flex items-center justify-between text-[11px] text-[#A6B4CC] pt-1 border-t border-[#1A2640]">
                    <span className="flex items-center gap-1 truncate max-w-[170px]">
                      <MapPin className="w-3 h-3 text-[#2684FF] shrink-0" />
                      <span className="truncate">{task.address}</span>
                    </span>
                    <span
                      className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                        task.status === 'under_inspection'
                          ? 'bg-[#FFB547]/20 text-[#FFB547]'
                          : task.status === 'repaired_pending_verification'
                          ? 'bg-[#35D49A]/20 text-[#35D49A]'
                          : 'bg-[#121D31] text-[#A6B4CC]'
                      }`}
                    >
                      {task.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 2 Columns: Active Work Order Details & Evidence Submission Form */}
        <div className="lg:col-span-2 space-y-5">
          {activeTask ? (
            <div className="bg-[#0D1424] border border-[#1A2640] rounded-2xl p-6 shadow-xl space-y-6">
              {/* Active Task Banner */}
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-[#1A2640]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#2684FF]/20 text-[#31D7FF]">
                      {activeTask.id}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#121D31] text-[#A6B4CC]">
                      CATEGORY: {activeTask.category.replace('_', ' ').toUpperCase()}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        activeTask.priority === 'critical'
                          ? 'bg-[#FF4D5A]/20 text-[#FF4D5A]'
                          : 'bg-[#FF8C38]/20 text-[#FF8C38]'
                      }`}
                    >
                      {activeTask.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#F4F7FF]">{activeTask.title}</h3>
                  <p className="text-xs text-[#A6B4CC] mt-1">{activeTask.description}</p>
                </div>

                <div className="bg-[#121D31] p-3 rounded-xl border border-[#1A2640] text-xs font-mono text-right">
                  <span className="text-[#A6B4CC] text-[10px] block">SITE LOCATION</span>
                  <span className="text-[#F4F7FF] font-semibold">{activeTask.address}</span>
                  <span className="text-[#31D7FF] block text-[11px] mt-0.5">
                    {activeTask.coordinates.lat.toFixed(4)}, {activeTask.coordinates.lng.toFixed(4)} (±{activeTask.gpsAccuracyMeters}m)
                  </span>
                </div>
              </div>

              {/* Success Notification */}
              {successMsg && (
                <div className="p-4 bg-[#35D49A]/15 border border-[#35D49A]/40 rounded-xl text-xs text-[#35D49A] flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Evidence Submission Form */}
              <form onSubmit={handleSubmitRepair} className="space-y-5">
                <h4 className="text-xs font-mono font-bold text-[#31D7FF] uppercase tracking-wider flex items-center gap-2">
                  <FileCheck className="w-4 h-4" />
                  <span>RECORD FIELD MEASUREMENTS &amp; REPAIR EVIDENCE</span>
                </h4>

                {/* Physical Measurements Input */}
                <div className="bg-[#121D31] p-4 rounded-xl border border-[#1A2640] space-y-3">
                  <span className="text-xs font-semibold text-[#F4F7FF] block">
                    Actual Manual Field Measurements (Tape / Caliper / Depth Gauge):
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-[#A6B4CC] block mb-1">Measured Length (m):</label>
                      <input
                        type="number"
                        step="0.01"
                        value={manualLength}
                        onChange={(e) => setManualLength(e.target.value)}
                        required
                        className="w-full bg-[#0D1424] border border-[#1A2640] rounded-lg p-2 text-xs text-[#F4F7FF] font-mono focus:border-[#2684FF] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#A6B4CC] block mb-1">Measured Width (m):</label>
                      <input
                        type="number"
                        step="0.01"
                        value={manualWidth}
                        onChange={(e) => setManualWidth(e.target.value)}
                        required
                        className="w-full bg-[#0D1424] border border-[#1A2640] rounded-lg p-2 text-xs text-[#F4F7FF] font-mono focus:border-[#2684FF] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#A6B4CC] block mb-1">Depth Post-Repair (m):</label>
                      <input
                        type="number"
                        step="0.01"
                        value={manualDepth}
                        onChange={(e) => setManualDepth(e.target.value)}
                        required
                        className="w-full bg-[#0D1424] border border-[#1A2640] rounded-lg p-2 text-xs text-[#F4F7FF] font-mono focus:border-[#2684FF] focus:outline-hidden"
                      />
                      <span className="text-[10px] text-[#A6B4CC] block mt-0.5">0.00m = Flush grade</span>
                    </div>
                  </div>
                </div>

                {/* Repair Notes */}
                <div>
                  <label className="text-xs text-[#A6B4CC] block mb-1 font-semibold">
                    Repair Methodology &amp; Materials Used:
                  </label>
                  <textarea
                    rows={3}
                    value={repairNotes}
                    onChange={(e) => setRepairNotes(e.target.value)}
                    required
                    className="w-full bg-[#121D31] border border-[#1A2640] rounded-xl p-3 text-xs text-[#F4F7FF] leading-relaxed focus:border-[#2684FF] focus:outline-hidden"
                  />
                </div>

                {/* Work Checklist */}
                <div className="bg-[#121D31] p-4 rounded-xl border border-[#1A2640] space-y-2">
                  <span className="text-xs font-semibold text-[#F4F7FF] block mb-1">
                    Quality &amp; Safety Compliance Verification:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center gap-2 text-[#A6B4CC] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checklist.surfaceSealed}
                        onChange={(e) => setChecklist({ ...checklist, surfaceSealed: e.target.checked })}
                        className="rounded accent-[#2684FF]"
                      />
                      <span>Perimeter bitumen seam sealed</span>
                    </label>
                    <label className="flex items-center gap-2 text-[#A6B4CC] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checklist.debrisCleared}
                        onChange={(e) => setChecklist({ ...checklist, debrisCleared: e.target.checked })}
                        className="rounded accent-[#2684FF]"
                      />
                      <span>Loose aggregate &amp; debris swept</span>
                    </label>
                    <label className="flex items-center gap-2 text-[#A6B4CC] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checklist.structuralGradeMet}
                        onChange={(e) => setChecklist({ ...checklist, structuralGradeMet: e.target.checked })}
                        className="rounded accent-[#2684FF]"
                      />
                      <span>Compacted flush with surrounding grade</span>
                    </label>
                    <label className="flex items-center gap-2 text-[#A6B4CC] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checklist.hazardEliminated}
                        onChange={(e) => setChecklist({ ...checklist, hazardEliminated: e.target.checked })}
                        className="rounded accent-[#2684FF]"
                      />
                      <span>Work area barricades &amp; cones cleared</span>
                    </label>
                  </div>
                </div>

                {/* Photo Evidence Preview */}
                <div className="space-y-2">
                  <label className="text-xs text-[#A6B4CC] block font-semibold">
                    Post-Repair Photographic Evidence:
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-48 h-28 rounded-xl overflow-hidden border border-[#2684FF]/40 bg-[#070B14] relative">
                      <img
                        src={afterPhotoUrl || getHazardIllustration(activeTask.category, activeTask.id, 'repaired')}
                        alt="After evidence"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#0D1424]/90 text-[#35D49A]">
                        POST-REPAIR
                      </span>
                    </div>

                    <div className="text-xs space-y-1 text-[#A6B4CC]">
                      <span className="text-[#F4F7FF] font-semibold block">Attached Repair Evidence Image</span>
                      <p className="text-[11px] leading-relaxed">
                        Calibrated high-contrast post-compaction image showing sealed patch seams and smooth traffic
                        surface.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-3 border-t border-[#1A2640] flex items-center justify-between">
                  <span className="text-[11px] text-[#A6B4CC] font-mono">
                    Submitting as {currentWorkerName}
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-[#2684FF] hover:bg-[#1f73e8] text-[#F4F7FF] text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-[#2684FF]/20 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Work Order for Officer Review</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-[#0D1424] border border-[#1A2640] rounded-2xl p-12 text-center text-[#A6B4CC] shadow-xl flex flex-col items-center justify-center gap-3">
              <div className="p-4 rounded-2xl bg-[#121D31] text-[#2684FF]">
                <Wrench className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-[#F4F7FF]">No Work Order Selected</h4>
              <p className="text-xs max-w-sm">
                Select an assigned road hazard ticket from the queue on the left to record inspection measurements and
                submit before/after repair evidence.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

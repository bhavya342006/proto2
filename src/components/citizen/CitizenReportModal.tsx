import React, { useState } from 'react';
import {
  AlertTriangle,
  MapPin,
  Camera,
  Upload,
  Send,
  X,
  CheckCircle2,
  ShieldCheck,
  Info
} from 'lucide-react';
import { HazardCategory, PriorityLevel } from '../../types';
import { IncidentService } from '../../services/incidentService';
import { getHazardIllustration } from '../../utils/hazardIllustrations';
import { analyzeRoadHazardDemo } from '../../services/aiVisionService';

interface CitizenReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: (incidentId: string) => void;
  initialCoords?: { lat: number; lng: number };
}

export const CitizenReportModal: React.FC<CitizenReportModalProps> = ({
  isOpen,
  onClose,
  onSubmitted,
  initialCoords = { lat: 37.7841, lng: -122.4068 }
}) => {
  if (!isOpen) return null;

  const [category, setCategory] = useState<HazardCategory>('pothole');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('Market St & 6th St, Metro District');
  const [coords, setCoords] = useState(initialCoords);
  const [gpsAccuracy] = useState(3.5);
  const [includePhoto, setIncludePhoto] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<{ isDuplicate: boolean; parentId?: string; distM?: number } | null>(null);

  // Check for duplicate whenever category or coords change
  const handleCategoryChange = (newCat: HazardCategory) => {
    setCategory(newCat);
    const dupCheck = IncidentService.checkPotentialDuplicate(newCat, coords.lat, coords.lng);
    if (dupCheck.isDuplicate && dupCheck.parent) {
      setDuplicateWarning({
        isDuplicate: true,
        parentId: dupCheck.parent.id,
        distM: dupCheck.distanceMeters
      });
    } else {
      setDuplicateWarning(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const analysis = analyzeRoadHazardDemo(category);

    const newRecord = IncidentService.createIncident({
      category,
      title: title.trim() || `Citizen Report: ${category.replace('_', ' ').toUpperCase()}`,
      description:
        description.trim() ||
        `Citizen reported visible ${category.replace('_', ' ')} hazard while stationary at ${address}.`,
      address,
      coordinates: coords,
      gpsAccuracyMeters: gpsAccuracy,
      priority: analysis.priority,
      priorityExplanation: analysis.priorityExplanation,
      status: 'reported',
      classification: duplicateWarning?.isDuplicate ? 'LIKELY DUPLICATE' : 'MODEL-SUPPORTED DETECTION',
      classificationEvidence: {
        supporting: [
          'Citizen verified submission captured while stopped',
          duplicateWarning?.isDuplicate
            ? `Proximity to existing incident ${duplicateWarning.parentId} (~${duplicateWarning.distM}m)`
            : 'Independent geo-referenced observation'
        ],
        missing: ['Field crew inspection'],
        recommendedNextStep: 'Schedule municipal field triage verification.',
        decidedBy: 'RoadGuard Citizen Gate',
        isAutomated: true
      },
      duplicateOfId: duplicateWarning?.parentId,
      duplicateMatchReason: duplicateWarning?.isDuplicate
        ? `Within ${duplicateWarning.distM}m of ${duplicateWarning.parentId}`
        : undefined,
      dimensions: analysis.dimensions,
      detection: {
        visualConfidence: analysis.visualConfidence,
        locationConfidence: 94,
        dimensionConfidence: analysis.dimensionConfidence,
        detectionMethod: 'LIVE_MODEL'
      },
      imageUrl: includePhoto ? getHazardIllustration(category, 'CITIZEN-NEW') : '',
      isDemoData: false
    });

    setIsSubmitting(false);
    onSubmitted(newRecord.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070B14]/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0D1424] border border-[#2684FF]/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#1A2640] flex items-center justify-between bg-[#121D31]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#2684FF]/20 text-[#31D7FF] border border-[#2684FF]/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F4F7FF]">Submit Citizen Hazard Report</h3>
              <p className="text-xs text-[#A6B4CC]">
                RoadGuard Citizen App • Safe post-drive submission
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

        {/* Driver Safety Reminder */}
        <div className="bg-[#070B14] px-6 py-2.5 border-b border-[#1A2640] flex items-center gap-2 text-xs text-[#35D49A]">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Vehicle stopped safely. Submitting post-trip road report.</span>
        </div>

        {/* Duplicate Warning if Detected */}
        {duplicateWarning?.isDuplicate && (
          <div className="mx-6 mt-4 p-3 bg-[#FFB547]/15 border border-[#FFB547]/40 rounded-xl text-xs text-[#FFB547] flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Possible Duplicate Detected:</span> A similar hazard ({duplicateWarning.parentId}) was already reported ~{duplicateWarning.distM}m away. Your report will be linked to accelerate resolution rather than create clutter!
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="text-[#A6B4CC] block mb-1 font-semibold">Hazard Category:</label>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value as HazardCategory)}
              className="w-full bg-[#121D31] border border-[#1A2640] rounded-xl p-2.5 text-xs text-[#F4F7FF] focus:border-[#2684FF] focus:outline-hidden cursor-pointer"
            >
              <option value="pothole">Pothole / Road Cavity</option>
              <option value="open_manhole">Open / Dislodged Manhole</option>
              <option value="waterlogging">Severe Waterlogging / Flooding</option>
              <option value="damaged_drain">Damaged / Collapsed Storm Drain</option>
              <option value="fallen_electrical_wire">Fallen Electrical Wire</option>
              <option value="fallen_object">Fallen Object / Debris Obstruction</option>
              <option value="road_crack">Severe Road Surface Cracking</option>
              <option value="broken_streetlight">Broken Streetlight</option>
              <option value="other_hazard">Other Visible Road Hazard</option>
            </select>
          </div>

          <div>
            <label className="text-[#A6B4CC] block mb-1 font-semibold">Report Title (Optional):</label>
            <input
              type="text"
              placeholder="e.g. Deep Pothole outside 5th & Market"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#121D31] border border-[#1A2640] rounded-xl p-2.5 text-xs text-[#F4F7FF] focus:border-[#2684FF] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-[#A6B4CC] block mb-1 font-semibold">Street Address / Location:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full bg-[#121D31] border border-[#1A2640] rounded-xl p-2.5 text-xs text-[#F4F7FF] focus:border-[#2684FF] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-[#A6B4CC] block mb-1 font-semibold">Detailed Observations (Optional):</label>
            <textarea
              rows={3}
              placeholder="Describe lane position, estimated severity, risk to cyclists or traffic..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#121D31] border border-[#1A2640] rounded-xl p-2.5 text-xs text-[#F4F7FF] focus:border-[#2684FF] focus:outline-hidden"
            />
          </div>

          {/* Location & GPS accuracy */}
          <div className="bg-[#121D31] p-3 rounded-xl border border-[#1A2640] flex items-center justify-between text-[11px] font-mono text-[#A6B4CC]">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#2684FF]" />
              <span>
                Coordinates: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
              </span>
            </div>
            <span className="text-[#35D49A]">Accuracy: ±{gpsAccuracy}m</span>
          </div>

          {/* Photo inclusion toggle */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-[#F4F7FF] cursor-pointer">
              <input
                type="checkbox"
                checked={includePhoto}
                onChange={(e) => setIncludePhoto(e.target.checked)}
                className="rounded accent-[#2684FF]"
              />
              <span>Attach camera snapshot evidence</span>
            </label>
            <span className="text-[11px] text-[#A6B4CC]">
              {includePhoto ? 'High-contrast illustrative frame attached' : 'Reporting without photograph'}
            </span>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-[#1A2640] flex items-center justify-between">
            <span className="text-[11px] text-[#A6B4CC]">
              Submitted to shared CivicShield incident layer
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#2684FF] hover:bg-[#1f73e8] text-[#F4F7FF] rounded-xl font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-[#2684FF]/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Hazard Ticket</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

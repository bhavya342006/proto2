import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  ClipboardList,
  Wrench,
  Copy,
  FilterX,
  CheckCircle2,
  FileCheck,
  TrendingUp,
  MapPin,
  Clock,
  ArrowRight,
  BarChart3,
  PieChart
} from 'lucide-react';
import { IncidentRecord } from '../../types';
import { HazardMap } from '../common/HazardMap';

interface ControlCentreDashboardProps {
  incidents: IncidentRecord[];
  onSelectIncident: (id: string) => void;
  onNavigateTab: (tab: 'incidents' | 'repair_verification' | 'field_worker' | 'map') => void;
  onOpenDimensionsModal: () => void;
}

export const ControlCentreDashboard: React.FC<ControlCentreDashboardProps> = ({
  incidents,
  onSelectIncident,
  onNavigateTab,
  onOpenDimensionsModal
}) => {
  // Calculated Statistics directly from application dataset (Requirement 9.A)
  const totalIncidents = incidents.length;
  const criticalCount = incidents.filter((i) => i.priority === 'critical').length;
  const highCount = incidents.filter((i) => i.priority === 'high').length;
  const awaitingReviewCount = incidents.filter((i) => i.status === 'reported' || i.status === 'triaged').length;
  const underInspectionCount = incidents.filter((i) => i.status === 'under_inspection' || i.status === 'inspection_assigned').length;
  const possibleDuplicatesCount = incidents.filter((i) => i.classification === 'LIKELY DUPLICATE').length;
  const suspectedFalseCount = incidents.filter((i) => i.classification === 'SUSPECTED FALSE OR IRRELEVANT REPORT').length;
  const verifiedHazardsCount = incidents.filter((i) => i.classification === 'HUMAN-VERIFIED HAZARD').length;
  const awaitingRepairVerificationCount = incidents.filter((i) => i.status === 'repaired_pending_verification').length;
  const verifiedResolvedCount = incidents.filter((i) => i.status === 'verified_resolved').length;

  // Category Breakdown Counts
  const categoryCounts: Record<string, number> = {};
  incidents.forEach((i) => {
    categoryCounts[i.category] = (categoryCounts[i.category] || 0) + 1;
  });

  // Recent Activity audit events
  const allEvents = incidents
    .flatMap((inc) =>
      inc.history.map((h) => ({
        ...h,
        incidentId: inc.id,
        incidentTitle: inc.title,
        priority: inc.priority
      }))
    )
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
    .slice(0, 8);

  // High Risk Recurring Arterials
  const recurringHotspots = [
    { corridor: 'Market Street Arterial (5th - 8th)', incidents: 5, priority: 'critical', mainType: 'Potholes & Cavities' },
    { corridor: 'Folsom St SOMA Transit Corridor', incidents: 4, priority: 'critical', mainType: 'Waterlogging & Wires' },
    { corridor: 'Mission & Fremont Utility Hub', incidents: 3, priority: 'high', mainType: 'Open Manholes & Grates' },
    { corridor: 'Van Ness Avenue West Transit', incidents: 3, priority: 'medium', mainType: 'Road Cracks & Obstructions' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome & KPI Header Banner */}
      <div className="bg-[#0D1424] border border-[#1A2640] rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-[#F4F7FF]">CivicShield Municipal Authority Control Centre</h1>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#2684FF]/20 text-[#31D7FF] font-semibold">
              LIVE COMMAND DASHBOARD
            </span>
          </div>
          <p className="text-xs text-[#A6B4CC]">
            Real-time multi-agent triage, priority dispatch, physical dimension inspection, and verified repair sign-off.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-[#121D31] border border-[#2684FF]/30 text-[#31D7FF]">
            PROTOTYPE DEMO — SIMULATED DATA
          </span>
          <button
            type="button"
            onClick={onOpenDimensionsModal}
            className="px-4 py-2 bg-[#2684FF] hover:bg-[#1f73e8] text-[#F4F7FF] rounded-xl text-xs font-semibold transition cursor-pointer shadow-lg shadow-[#2684FF]/20"
          >
            Dimension Architecture
          </button>
        </div>
      </div>

      {/* Primary KPI Metric Cards Grid (Section 9.A Requirements) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {/* Total Incidents */}
        <div className="bg-[#0D1424] border border-[#1A2640] rounded-xl p-4 shadow-lg hover:border-[#2684FF]/40 transition">
          <div className="flex items-center justify-between text-[#A6B4CC] mb-2 text-xs">
            <span>TOTAL INCIDENTS</span>
            <ClipboardList className="w-4 h-4 text-[#2684FF]" />
          </div>
          <div className="text-2xl font-bold text-[#F4F7FF] font-mono">{totalIncidents}</div>
          <span className="text-[11px] text-[#A6B4CC] mt-1 block">Active dataset records</span>
        </div>

        {/* Critical & High Priority */}
        <div className="bg-[#0D1424] border border-[#FF4D5A]/40 rounded-xl p-4 shadow-lg hover:border-[#FF4D5A] transition">
          <div className="flex items-center justify-between text-[#FF4D5A] mb-2 text-xs font-bold">
            <span>CRITICAL &amp; HIGH</span>
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-[#FF4D5A] font-mono">
            {criticalCount + highCount}
          </div>
          <span className="text-[11px] text-[#A6B4CC] mt-1 block">
            {criticalCount} critical • {highCount} high
          </span>
        </div>

        {/* Awaiting Review */}
        <div className="bg-[#0D1424] border border-[#1A2640] rounded-xl p-4 shadow-lg hover:border-[#2684FF]/40 transition">
          <div className="flex items-center justify-between text-[#A6B4CC] mb-2 text-xs">
            <span>AWAITING REVIEW</span>
            <Clock className="w-4 h-4 text-[#FFB547]" />
          </div>
          <div className="text-2xl font-bold text-[#FFB547] font-mono">{awaitingReviewCount}</div>
          <span className="text-[11px] text-[#A6B4CC] mt-1 block">Pending triage gate</span>
        </div>

        {/* Under Inspection */}
        <div className="bg-[#0D1424] border border-[#1A2640] rounded-xl p-4 shadow-lg hover:border-[#2684FF]/40 transition">
          <div className="flex items-center justify-between text-[#A6B4CC] mb-2 text-xs">
            <span>UNDER INSPECTION</span>
            <Wrench className="w-4 h-4 text-[#31D7FF]" />
          </div>
          <div className="text-2xl font-bold text-[#31D7FF] font-mono">{underInspectionCount}</div>
          <span className="text-[11px] text-[#A6B4CC] mt-1 block">Assigned field crews</span>
        </div>

        {/* Repairs Awaiting Approval */}
        <div
          onClick={() => onNavigateTab('repair_verification')}
          className="bg-[#121D31] border border-[#35D49A]/50 rounded-xl p-4 shadow-lg hover:border-[#35D49A] transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-[#35D49A] mb-2 text-xs font-bold">
            <span>REPAIRS PENDING SIGN-OFF</span>
            <FileCheck className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-[#35D49A] font-mono">
            {awaitingRepairVerificationCount}
          </div>
          <span className="text-[11px] text-[#35D49A]/80 mt-1 block">Click to audit evidence</span>
        </div>
      </div>

      {/* Secondary KPI Bar: Duplicates, Suspected False, Verified */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#0D1424] border border-[#1A2640] rounded-xl p-3 flex items-center justify-between">
          <div className="text-xs">
            <span className="text-[#A6B4CC] block">POSSIBLE DUPLICATES</span>
            <span className="text-sm font-bold font-mono text-[#FFB547]">
              {possibleDuplicatesCount} Flagged
            </span>
          </div>
          <Copy className="w-4 h-4 text-[#FFB547]" />
        </div>

        <div className="bg-[#0D1424] border border-[#1A2640] rounded-xl p-3 flex items-center justify-between">
          <div className="text-xs">
            <span className="text-[#A6B4CC] block">SUSPECTED FALSE/IRRELEVANT</span>
            <span className="text-sm font-bold font-mono text-[#FF4D5A]">
              {suspectedFalseCount} Filtered
            </span>
          </div>
          <FilterX className="w-4 h-4 text-[#FF4D5A]" />
        </div>

        <div className="bg-[#0D1424] border border-[#1A2640] rounded-xl p-3 flex items-center justify-between">
          <div className="text-xs">
            <span className="text-[#A6B4CC] block">HUMAN-VERIFIED HAZARDS</span>
            <span className="text-sm font-bold font-mono text-[#31D7FF]">
              {verifiedHazardsCount} Verified
            </span>
          </div>
          <CheckCircle2 className="w-4 h-4 text-[#31D7FF]" />
        </div>

        <div className="bg-[#0D1424] border border-[#1A2640] rounded-xl p-3 flex items-center justify-between">
          <div className="text-xs">
            <span className="text-[#A6B4CC] block">RESOLVED &amp; CLOSED</span>
            <span className="text-sm font-bold font-mono text-[#35D49A]">
              {verifiedResolvedCount} Approved
            </span>
          </div>
          <CheckCircle2 className="w-4 h-4 text-[#35D49A]" />
        </div>
      </div>

      {/* Main Center Section: Interactive Map + Problem Areas & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Interactive Map Preview */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-[#A6B4CC] uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#2684FF]" />
              <span>LIVE INCIDENT GEOGRAPHIC MAP</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigateTab('map')}
              className="text-xs text-[#31D7FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Full Screen Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <HazardMap
            incidents={incidents}
            onSelectIncident={onSelectIncident}
            heightClass="h-[420px]"
          />
        </div>

        {/* Right Column: Recurring Problem Corridors & Category Distribution */}
        <div className="space-y-5">
          {/* Recurring Problem Areas Card */}
          <div className="bg-[#0D1424] border border-[#1A2640] rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1A2640]">
              <h4 className="text-xs font-mono font-bold text-[#A6B4CC] uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#FF4D5A]" />
                <span>RECURRING PROBLEM ARTERIALS</span>
              </h4>
            </div>

            <div className="space-y-2.5">
              {recurringHotspots.map((spot, idx) => (
                <div
                  key={idx}
                  className="bg-[#121D31] p-3 rounded-xl border border-[#1A2640] flex items-center justify-between"
                >
                  <div>
                    <h5 className="text-xs font-bold text-[#F4F7FF]">{spot.corridor}</h5>
                    <span className="text-[11px] text-[#A6B4CC] block">{spot.mainType}</span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        spot.priority === 'critical'
                          ? 'bg-[#FF4D5A]/20 text-[#FF4D5A]'
                          : 'bg-[#FF8C38]/20 text-[#FF8C38]'
                      }`}
                    >
                      {spot.incidents} Incidents
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incident Category Distribution */}
          <div className="bg-[#0D1424] border border-[#1A2640] rounded-2xl p-5 shadow-xl space-y-3">
            <h4 className="text-xs font-mono font-bold text-[#A6B4CC] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#1A2640]">
              <BarChart3 className="w-4 h-4 text-[#2684FF]" />
              <span>CATEGORY BREAKDOWN</span>
            </h4>

            <div className="space-y-2 text-xs font-mono">
              {Object.entries(categoryCounts).map(([cat, count]) => {
                const pct = Math.round((count / totalIncidents) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-[#A6B4CC] text-[11px]">
                      <span className="capitalize">{cat.replace('_', ' ')}</span>
                      <span className="text-[#F4F7FF] font-bold">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#121D31] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2684FF] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Audit Stream */}
      <div className="bg-[#0D1424] border border-[#1A2640] rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#1A2640]">
          <h4 className="text-xs font-mono font-bold text-[#A6B4CC] uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#31D7FF]" />
            <span>REAL-TIME AUDIT LOG ACTIVITY</span>
          </h4>
          <span className="text-[11px] text-[#A6B4CC]">Immutable audit events</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {allEvents.map((evt) => (
            <div
              key={evt.id}
              onClick={() => onSelectIncident(evt.incidentId)}
              className="bg-[#121D31] p-3 rounded-xl border border-[#1A2640] hover:border-[#2684FF]/40 transition cursor-pointer flex flex-col justify-between gap-2"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-[#A6B4CC] font-mono mb-1">
                  <span>{evt.incidentId}</span>
                  <span>{evt.timestamp}</span>
                </div>
                <h5 className="text-xs font-bold text-[#F4F7FF] line-clamp-1">{evt.action}</h5>
                <p className="text-[11px] text-[#A6B4CC] line-clamp-2 mt-1">{evt.details}</p>
              </div>
              <div className="text-[10px] text-[#31D7FF] font-mono pt-1.5 border-t border-[#1A2640]">
                Actor: {evt.actor}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

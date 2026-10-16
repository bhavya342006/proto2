import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  UserCheck,
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';
import { IncidentRecord, PriorityLevel, ReportStatus, HazardCategory } from '../../types';

interface IncidentManagementTableProps {
  incidents: IncidentRecord[];
  onSelectIncident: (id: string) => void;
  onOpenRepairVerification: (incident: IncidentRecord) => void;
}

export const IncidentManagementTable: React.FC<IncidentManagementTableProps> = ({
  incidents,
  onSelectIncident,
  onOpenRepairVerification
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'id' | 'priority' | 'status'>('id');

  const filteredIncidents = incidents.filter((inc) => {
    if (filterCategory !== 'all' && inc.category !== filterCategory) return false;
    if (filterPriority !== 'all' && inc.priority !== filterPriority) return false;
    if (filterStatus !== 'all' && inc.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        inc.id.toLowerCase().includes(q) ||
        inc.title.toLowerCase().includes(q) ||
        inc.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="bg-[#0D1424] border border-[#1A2640] rounded-2xl overflow-hidden shadow-xl flex flex-col">
      {/* Table Header and Multi-Filter Controls */}
      <div className="p-5 border-b border-[#1A2640] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#F4F7FF] flex items-center gap-2">
            <span>MUNICIPAL INCIDENT TRIAGE &amp; WORKFLOW MANAGEMENT</span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#2684FF]/20 text-[#31D7FF]">
              {filteredIncidents.length} RECORDS
            </span>
          </h2>
          <p className="text-xs text-[#A6B4CC] mt-0.5">
            Filter by priority, inspect computer-vision frames, assign rapid crews, and verify resolutions.
          </p>
        </div>

        {/* Filter Inputs */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#A6B4CC] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ID, street, hazard..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#121D31] border border-[#1A2640] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#F4F7FF] placeholder-[#A6B4CC]/60 focus:border-[#2684FF] focus:outline-hidden"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-[#121D31] text-[#F4F7FF] text-xs px-3 py-1.5 rounded-xl border border-[#1A2640] focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="pothole">Potholes</option>
            <option value="open_manhole">Open Manholes</option>
            <option value="waterlogging">Waterlogging</option>
            <option value="damaged_drain">Damaged Drains</option>
            <option value="fallen_electrical_wire">Electrical Wires</option>
            <option value="fallen_object">Fallen Objects</option>
            <option value="road_crack">Road Cracks</option>
            <option value="broken_streetlight">Broken Streetlights</option>
            <option value="irrelevant">Irrelevant / False</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-[#121D31] text-[#F4F7FF] text-xs px-3 py-1.5 rounded-xl border border-[#1A2640] focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#121D31] text-[#F4F7FF] text-xs px-3 py-1.5 rounded-xl border border-[#1A2640] focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="reported">Reported</option>
            <option value="triaged">Triaged</option>
            <option value="inspection_assigned">Inspection Assigned</option>
            <option value="under_inspection">Under Inspection</option>
            <option value="repaired_pending_verification">Awaiting Verification</option>
            <option value="verified_resolved">Verified Resolved</option>
            <option value="rejected_false_positive">False Positive</option>
          </select>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#A6B4CC]">
          <thead className="bg-[#121D31] text-[#F4F7FF] font-mono text-[11px] uppercase border-b border-[#1A2640]">
            <tr>
              <th className="py-3 px-4">Incident ID</th>
              <th className="py-3 px-4">Hazard &amp; Category</th>
              <th className="py-3 px-4">Address / Coordinates</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Classification</th>
              <th className="py-3 px-4">Dimensions</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A2640]">
            {filteredIncidents.map((inc) => (
              <tr
                key={inc.id}
                className="hover:bg-[#121D31]/80 transition cursor-pointer"
                onClick={() => onSelectIncident(inc.id)}
              >
                {/* ID & Thumbnail */}
                <td className="py-3.5 px-4 font-mono font-bold text-[#31D7FF] whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <img
                      src={inc.imageUrl}
                      alt={inc.id}
                      className="w-8 h-8 rounded-md object-cover border border-[#1A2640]"
                    />
                    <span>{inc.id}</span>
                  </div>
                </td>

                {/* Title & Category */}
                <td className="py-3.5 px-4">
                  <span className="font-bold text-[#F4F7FF] block line-clamp-1">{inc.title}</span>
                  <span className="text-[10px] font-mono text-[#31D7FF] uppercase">
                    {inc.category.replace('_', ' ')}
                  </span>
                </td>

                {/* Address & GPS */}
                <td className="py-3.5 px-4 max-w-[200px] truncate">
                  <span className="text-[#F4F7FF] block truncate">{inc.address}</span>
                  <span className="text-[10px] font-mono text-[#A6B4CC]">
                    {inc.coordinates.lat.toFixed(4)}, {inc.coordinates.lng.toFixed(4)} (±{inc.gpsAccuracyMeters}m)
                  </span>
                </td>

                {/* Priority */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                      inc.priority === 'critical'
                        ? 'bg-[#FF4D5A]/20 text-[#FF4D5A]'
                        : inc.priority === 'high'
                        ? 'bg-[#FF8C38]/20 text-[#FF8C38]'
                        : 'bg-[#2684FF]/20 text-[#31D7FF]'
                    }`}
                  >
                    {inc.priority.toUpperCase()}
                  </span>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                      inc.status === 'verified_resolved'
                        ? 'bg-[#35D49A]/20 text-[#35D49A]'
                        : inc.status === 'repaired_pending_verification'
                        ? 'bg-[#FFB547]/20 text-[#FFB547]'
                        : inc.status === 'under_inspection'
                        ? 'bg-[#31D7FF]/20 text-[#31D7FF]'
                        : 'bg-[#121D31] text-[#A6B4CC]'
                    }`}
                  >
                    {inc.status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </td>

                {/* Classification */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="text-[11px] font-medium text-[#F4F7FF] truncate max-w-[150px] block">
                    {inc.classification}
                  </span>
                </td>

                {/* Dimensions */}
                <td className="py-3.5 px-4 font-mono text-[11px] whitespace-nowrap">
                  {inc.dimensions.lengthMeters ? (
                    <span className="text-[#35D49A]">
                      {inc.dimensions.lengthMeters}m × {inc.dimensions.widthMeters}m
                    </span>
                  ) : (
                    <span className="text-[#A6B4CC]">{inc.dimensions.status}</span>
                  )}
                </td>

                {/* Actions */}
                <td
                  className="py-3.5 px-4 text-right whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-end gap-2">
                    {inc.status === 'repaired_pending_verification' && (
                      <button
                        type="button"
                        onClick={() => onOpenRepairVerification(inc)}
                        className="px-2.5 py-1 rounded bg-[#35D49A]/20 hover:bg-[#35D49A] text-[#35D49A] hover:text-[#070B14] text-[11px] font-bold transition cursor-pointer"
                      >
                        Verify Repair
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onSelectIncident(inc.id)}
                      className="px-2.5 py-1 rounded bg-[#121D31] hover:bg-[#2684FF] text-[#F4F7FF] text-[11px] font-semibold transition cursor-pointer"
                    >
                      Inspect
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Filter,
  Layers,
  MapPin,
  ExternalLink,
  ShieldAlert,
  Info,
  Calendar,
  Compass,
  CheckCircle2,
  Clock,
  Ruler
} from 'lucide-react';
import { IncidentRecord, HazardCategory, PriorityLevel, ReportStatus } from '../../types';

interface HazardMapProps {
  incidents: IncidentRecord[];
  selectedIncidentId?: string | null;
  onSelectIncident: (id: string) => void;
  heightClass?: string;
}

// Marker icon generator using SVG Data URIs matching color requirements
function createCustomPin(color: string, label: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 46" width="36" height="46">
    <defs>
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.6"/>
      </filter>
    </defs>
    <path d="M 18,2 C 9.16,2 2,9.16 2,18 C 2,28.5 18,44 18,44 C 18,44 34,28.5 34,18 C 34,9.16 26.84,2 18,2 Z" fill="#0D1424" stroke="${color}" stroke-width="2.5" filter="url(#shadow)"/>
    <circle cx="18" cy="17" r="7.5" fill="${color}"/>
    <circle cx="18" cy="17" r="3.5" fill="#FFFFFF"/>
  </svg>`;

  return L.divIcon({
    className: 'custom-hazard-pin',
    html: svg,
    iconSize: [36, 46],
    iconAnchor: [18, 44],
    popupAnchor: [0, -42]
  });
}

function getMarkerColor(incident: IncidentRecord): string {
  // Section 3.E color rules:
  // Red: critical
  // Orange: high
  // Blue: medium or low
  // Amber: awaiting manual inspection
  // Green: verified as resolved
  if (incident.status === 'verified_resolved') {
    return '#35D49A'; // Green
  }
  if (
    incident.classification === 'MANUAL INSPECTION REQUIRED' ||
    incident.status === 'repaired_pending_verification'
  ) {
    return '#FFB547'; // Amber
  }
  if (incident.priority === 'critical') {
    return '#FF4D5A'; // Red
  }
  if (incident.priority === 'high') {
    return '#FF8C38'; // Orange
  }
  return '#2684FF'; // Electric Blue
}

export const HazardMap: React.FC<HazardMapProps> = ({
  incidents,
  selectedIncidentId,
  onSelectIncident,
  heightClass = 'h-[540px]'
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Active popup preview incident
  const [previewIncident, setPreviewIncident] = useState<IncidentRecord | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Center on Civic Metro Area
    const map = L.map(mapContainerRef.current, {
      center: [37.784, -122.408],
      zoom: 14,
      zoomControl: false
    });

    // Dark Matter tile layer for cohesive dark & electric blue theme
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    markersGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers when incidents or filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = markersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // Filter incidents
    const filtered = incidents.filter((inc) => {
      if (selectedCategory !== 'all' && inc.category !== selectedCategory) return false;
      if (selectedPriority !== 'all' && inc.priority !== selectedPriority) return false;
      if (selectedStatus !== 'all' && inc.status !== selectedStatus) return false;
      return true;
    });

    filtered.forEach((inc) => {
      if (!inc.coordinates || isNaN(inc.coordinates.lat) || isNaN(inc.coordinates.lng)) return;

      const color = getMarkerColor(inc);
      const icon = createCustomPin(color, inc.id);

      const marker = L.marker([inc.coordinates.lat, inc.coordinates.lng], { icon });

      marker.on('click', () => {
        setPreviewIncident(inc);
        onSelectIncident(inc.id);
      });

      marker.addTo(group);
    });
  }, [incidents, selectedCategory, selectedPriority, selectedStatus, onSelectIncident]);

  // Center on selected incident if requested externally
  useEffect(() => {
    if (!selectedIncidentId || !mapInstanceRef.current) return;
    const inc = incidents.find((i) => i.id === selectedIncidentId);
    if (inc && inc.coordinates) {
      mapInstanceRef.current.setView([inc.coordinates.lat, inc.coordinates.lng], 16, {
        animate: true
      });
      setPreviewIncident(inc);
    }
  }, [selectedIncidentId, incidents]);

  return (
    <div className="relative bg-[#0D1424] border border-[#1A2640] rounded-2xl overflow-hidden shadow-xl flex flex-col">
      {/* Top Filter and Status Bar */}
      <div className="p-3.5 bg-[#0D1424] border-b border-[#1A2640] flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#2684FF]" />
          <span className="text-xs font-bold text-[#F4F7FF] uppercase tracking-wider font-mono">
            CIVIC INFRASTRUCTURE INCIDENT MAP
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#2684FF]/20 text-[#31D7FF] font-medium">
            PROTOTYPE DEMO — SIMULATED DATA
          </span>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-[#121D31] px-2.5 py-1 rounded-lg border border-[#1A2640]">
            <Filter className="w-3 h-3 text-[#A6B4CC]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-[#F4F7FF] text-xs focus:outline-hidden cursor-pointer"
            >
              <option value="all" className="bg-[#0D1424]">All Categories</option>
              <option value="pothole" className="bg-[#0D1424]">Potholes</option>
              <option value="open_manhole" className="bg-[#0D1424]">Open Manholes</option>
              <option value="waterlogging" className="bg-[#0D1424]">Waterlogging</option>
              <option value="damaged_drain" className="bg-[#0D1424]">Damaged Drains</option>
              <option value="fallen_electrical_wire" className="bg-[#0D1424]">Electrical Wires</option>
              <option value="fallen_object" className="bg-[#0D1424]">Fallen Objects</option>
              <option value="road_crack" className="bg-[#0D1424]">Road Cracks</option>
              <option value="broken_streetlight" className="bg-[#0D1424]">Broken Streetlights</option>
              <option value="irrelevant" className="bg-[#0D1424]">Irrelevant/False</option>
            </select>
          </div>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-[#121D31] text-[#F4F7FF] text-xs px-2.5 py-1 rounded-lg border border-[#1A2640] focus:outline-hidden cursor-pointer"
          >
            <option value="all" className="bg-[#0D1424]">All Priorities</option>
            <option value="critical" className="bg-[#0D1424]">Critical (Red)</option>
            <option value="high" className="bg-[#0D1424]">High (Orange)</option>
            <option value="medium" className="bg-[#0D1424]">Medium (Blue)</option>
            <option value="low" className="bg-[#0D1424]">Low (Blue)</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#121D31] text-[#F4F7FF] text-xs px-2.5 py-1 rounded-lg border border-[#1A2640] focus:outline-hidden cursor-pointer"
          >
            <option value="all" className="bg-[#0D1424]">All Statuses</option>
            <option value="reported" className="bg-[#0D1424]">Reported</option>
            <option value="inspection_assigned" className="bg-[#0D1424]">Inspection Assigned</option>
            <option value="under_inspection" className="bg-[#0D1424]">Under Inspection</option>
            <option value="repaired_pending_verification" className="bg-[#0D1424]">Awaiting Verification</option>
            <option value="verified_resolved" className="bg-[#0D1424]">Verified Resolved</option>
            <option value="rejected_false_positive" className="bg-[#0D1424]">False Positive</option>
          </select>
        </div>
      </div>

      {/* Map Body */}
      <div className={`relative w-full ${heightClass}`}>
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Map Legend (Strictly conforming to Section 3.E) */}
        <div className="absolute top-4 left-4 z-10 bg-[#0D1424]/90 backdrop-blur-md border border-[#1A2640] p-3 rounded-xl shadow-xl text-xs flex flex-col gap-1.5 pointer-events-none">
          <div className="font-mono text-[11px] font-bold text-[#A6B4CC] uppercase tracking-wider mb-0.5">
            HAZARD PIN LEGEND
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF4D5A]" />
            <span className="text-[#F4F7FF]">Critical Immediate Hazard</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF8C38]" />
            <span className="text-[#F4F7FF]">High Priority Hazard</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#2684FF]" />
            <span className="text-[#F4F7FF]">Medium / Low Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FFB547]" />
            <span className="text-[#F4F7FF]">Awaiting Manual Review / Verification</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#35D49A]" />
            <span className="text-[#F4F7FF]">Verified Resolved</span>
          </div>
        </div>

        {/* Selected Pin Preview Drawer Card */}
        {previewIncident && (
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-10 bg-[#0D1424]/95 backdrop-blur-md border border-[#2684FF]/40 p-4 rounded-xl shadow-2xl flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#2684FF]/20 text-[#31D7FF]">
                    {previewIncident.id}
                  </span>
                  <span
                    className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                      previewIncident.priority === 'critical'
                        ? 'bg-[#FF4D5A]/20 text-[#FF4D5A]'
                        : previewIncident.priority === 'high'
                        ? 'bg-[#FF8C38]/20 text-[#FF8C38]'
                        : 'bg-[#2684FF]/20 text-[#31D7FF]'
                    }`}
                  >
                    {previewIncident.priority.toUpperCase()}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#F4F7FF] line-clamp-1">{previewIncident.title}</h4>
                <p className="text-xs text-[#A6B4CC] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#2684FF]" />
                  <span>{previewIncident.address}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPreviewIncident(null)}
                className="text-[#A6B4CC] hover:text-[#F4F7FF] p-1 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-[#121D31] p-2.5 rounded-lg border border-[#1A2640]">
              <div>
                <span className="text-[#A6B4CC] text-[10px] block">COORDINATES &amp; ACCURACY</span>
                <span className="font-mono text-[#F4F7FF] text-[11px]">
                  {previewIncident.coordinates.lat.toFixed(4)}, {previewIncident.coordinates.lng.toFixed(4)}
                </span>
                <span className="text-[#35D49A] text-[10px] ml-1">±{previewIncident.gpsAccuracyMeters}m</span>
              </div>
              <div>
                <span className="text-[#A6B4CC] text-[10px] block">VALIDATION STATUS</span>
                <span className="font-medium text-[#31D7FF] text-[11px] truncate block">
                  {previewIncident.classification}
                </span>
              </div>
              <div>
                <span className="text-[#A6B4CC] text-[10px] block">ESTIMATED DIMENSIONS</span>
                <span className="font-mono text-[#F4F7FF] text-[11px]">
                  {previewIncident.dimensions.lengthMeters
                    ? `${previewIncident.dimensions.lengthMeters}m × ${previewIncident.dimensions.widthMeters}m`
                    : 'Manual required'}
                </span>
              </div>
              <div>
                <span className="text-[#A6B4CC] text-[10px] block">MODEL CONFIDENCE</span>
                <span className="font-mono text-[#35D49A] text-[11px]">
                  {previewIncident.detection.visualConfidence}%
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectIncident(previewIncident.id)}
              className="w-full py-2 bg-[#2684FF] hover:bg-[#1f73e8] text-[#F4F7FF] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
            >
              <span>Open Detailed Incident File</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

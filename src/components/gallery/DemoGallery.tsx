import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Search,
  Filter,
  Ruler,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  Eye,
  Info
} from 'lucide-react';
import { IncidentRecord, HazardCategory, ValidationClassification } from '../../types';
import { analyzeRoadHazardDemo, VisionAnalysisResult } from '../../services/aiVisionService';

interface DemoGalleryProps {
  incidents: IncidentRecord[];
  onSelectIncident: (id: string) => void;
  onOpenDimensionsModal: (incident: IncidentRecord) => void;
}

export const DemoGallery: React.FC<DemoGalleryProps> = ({
  incidents,
  onSelectIncident,
  onOpenDimensionsModal
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterClassification, setFilterClassification] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected item for AI Model Analysis Test Bench
  const [activeAnalysisTarget, setActiveAnalysisTarget] = useState<IncidentRecord | null>(null);
  const [analysisResult, setAnalysisResult] = useState<VisionAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const filteredIncidents = incidents.filter((inc) => {
    if (filterCategory !== 'all' && inc.category !== filterCategory) return false;
    if (filterClassification !== 'all' && inc.classification !== filterClassification) return false;
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

  const handleRunModelAnalysis = (inc: IncidentRecord) => {
    setActiveAnalysisTarget(inc);
    setIsAnalyzing(true);
    // Simulate real-time neural network inference time (450ms)
    setTimeout(() => {
      const res = analyzeRoadHazardDemo(inc.category);
      setAnalysisResult(res);
      setIsAnalyzing(false);
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* Gallery Header Card */}
      <div className="bg-[#0D1424] border border-[#1A2640] rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#2684FF]/20 rounded-xl text-[#31D7FF] border border-[#2684FF]/30">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#F4F7FF]">Demonstration Visual Evidence Library</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2684FF]/20 text-[#31D7FF] font-semibold">
                30 VERIFIED SEED SAMPLES
              </span>
            </div>
            <p className="text-xs text-[#A6B4CC] mt-0.5">
              Comprehensive visual library spanning all hazard categories, metric estimations, and validation states.
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
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
            <option value="all">All Categories ({incidents.length})</option>
            <option value="pothole">Potholes</option>
            <option value="open_manhole">Open Manholes</option>
            <option value="waterlogging">Waterlogging</option>
            <option value="damaged_drain">Damaged Drains</option>
            <option value="fallen_electrical_wire">Electrical Wires</option>
            <option value="fallen_object">Fallen Obstructions</option>
            <option value="road_crack">Road Cracks</option>
            <option value="broken_streetlight">Broken Streetlights</option>
            <option value="irrelevant">Irrelevant / False</option>
          </select>

          <select
            value={filterClassification}
            onChange={(e) => setFilterClassification(e.target.value)}
            className="bg-[#121D31] text-[#F4F7FF] text-xs px-3 py-1.5 rounded-xl border border-[#1A2640] focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Classifications</option>
            <option value="MODEL-SUPPORTED DETECTION">Model-Supported Detection</option>
            <option value="LIKELY DUPLICATE">Likely Duplicate</option>
            <option value="SUSPECTED FALSE OR IRRELEVANT REPORT">Suspected False/Irrelevant</option>
            <option value="MANUAL INSPECTION REQUIRED">Manual Inspection Required</option>
            <option value="HUMAN-VERIFIED HAZARD">Human-Verified Hazard</option>
            <option value="HUMAN-VERIFIED RESOLUTION">Human-Verified Resolution</option>
            <option value="DEMONSTRATION RECORD">Demonstration Record</option>
          </select>
        </div>
      </div>

      {/* Grid of 30 Incidents Evidence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredIncidents.map((inc) => (
          <div
            key={inc.id}
            className="bg-[#0D1424] border border-[#1A2640] rounded-2xl overflow-hidden hover:border-[#2684FF]/50 transition shadow-xl flex flex-col justify-between"
          >
            {/* Image Preview & Badges */}
            <div className="relative aspect-16/10 bg-[#070B14] overflow-hidden group">
              <img
                src={inc.imageUrl}
                alt={inc.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />

              {/* Mandatory Notice Tag from Section 11 */}
              <div className="absolute bottom-2 left-2 right-2 bg-[#070B14]/85 backdrop-blur-xs px-2 py-1 rounded text-[9px] font-mono text-[#A6B4CC] border border-[#1A2640]">
                ILLUSTRATIVE DEMO IMAGE — NOT REAL-WORLD EVIDENCE
              </div>

              {/* Top Badges */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#0D1424]/90 border border-[#2684FF]/40 text-[#31D7FF]">
                  {inc.id}
                </span>
                <span
                  className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                    inc.priority === 'critical'
                      ? 'bg-[#FF4D5A]/90 text-white'
                      : inc.priority === 'high'
                      ? 'bg-[#FF8C38]/90 text-white'
                      : 'bg-[#2684FF]/90 text-white'
                  }`}
                >
                  {inc.priority.toUpperCase()}
                </span>
              </div>

              <div className="absolute top-2 right-2">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#0D1424]/90 border border-[#35D49A]/40 text-[#35D49A]">
                  {inc.detection.visualConfidence}% CONF
                </span>
              </div>
            </div>

            {/* Information Body */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono text-[#31D7FF] uppercase font-bold tracking-wider">
                  {inc.category.replace('_', ' ')}
                </span>
                <h3 className="text-sm font-bold text-[#F4F7FF] line-clamp-1 mt-0.5">{inc.title}</h3>
                <p className="text-xs text-[#A6B4CC] line-clamp-2 mt-1 leading-relaxed">
                  {inc.description}
                </p>
              </div>

              {/* Dimensions & Validation Status Chips */}
              <div className="bg-[#121D31] p-2.5 rounded-xl border border-[#1A2640] space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#A6B4CC]">SCALE STATUS:</span>
                  <span
                    className={`font-bold ${
                      inc.dimensions.status === 'ESTIMATED'
                        ? 'text-[#35D49A]'
                        : inc.dimensions.status === 'APPROXIMATE'
                        ? 'text-[#31D7FF]'
                        : 'text-[#FFB547]'
                    }`}
                  >
                    {inc.dimensions.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#A6B4CC]">DIMENSIONS:</span>
                  <span className="text-[#F4F7FF]">
                    {inc.dimensions.lengthMeters
                      ? `${inc.dimensions.lengthMeters}m × ${inc.dimensions.widthMeters}m`
                      : 'Manual req.'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#1A2640]/80">
                  <span className="text-[#A6B4CC]">CLASSIFICATION:</span>
                  <span className="text-[#31D7FF] truncate max-w-[170px]">
                    {inc.classification}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#1A2640]">
                <button
                  type="button"
                  onClick={() => handleRunModelAnalysis(inc)}
                  className="px-3 py-1.5 rounded-lg bg-[#2684FF]/20 hover:bg-[#2684FF] text-[#31D7FF] hover:text-[#F4F7FF] text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Test Detector</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectIncident(inc.id)}
                  className="px-3 py-1.5 rounded-lg bg-[#121D31] hover:bg-[#1A2640] text-[#F4F7FF] text-xs font-medium transition cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Model Analysis Test Bench Modal */}
      {activeAnalysisTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070B14]/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0D1424] border border-[#2684FF]/40 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 border-b border-[#1A2640] flex items-center justify-between bg-[#121D31]">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#31D7FF]" />
                <h3 className="text-sm font-bold text-[#F4F7FF]">
                  AI Vision Model Evaluation: {activeAnalysisTarget.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveAnalysisTarget(null);
                  setAnalysisResult(null);
                }}
                className="text-[#A6B4CC] hover:text-[#F4F7FF] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {isAnalyzing ? (
                <div className="p-12 text-center text-xs text-[#31D7FF] font-mono flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-[#31D7FF] border-t-transparent rounded-full animate-spin" />
                  <span>RUNNING CONVOLUTIONAL FEATURE EXTRACTION &amp; HOMOGRAPHY SCALE...</span>
                </div>
              ) : analysisResult ? (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Visual with Bounding Box */}
                    <div className="relative aspect-16/10 rounded-xl overflow-hidden border border-[#2684FF]/40 bg-black">
                      <img
                        src={activeAnalysisTarget.imageUrl}
                        alt="Test target"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 border-2 border-[#2684FF] rounded-lg pointer-events-none flex items-start justify-end p-2 bg-[#2684FF]/10">
                        <span className="bg-[#0D1424] text-[#31D7FF] font-mono text-[10px] px-2 py-0.5 rounded font-bold border border-[#2684FF]/40">
                          {analysisResult.categoryLabel} ({analysisResult.visualConfidence}%)
                        </span>
                      </div>
                    </div>

                    {/* Inference Breakdown */}
                    <div className="bg-[#121D31] p-4 rounded-xl border border-[#1A2640] space-y-2.5 font-mono">
                      <div className="flex justify-between">
                        <span className="text-[#A6B4CC]">DETECTION METHOD:</span>
                        <span className="text-[#31D7FF] font-bold">{analysisResult.detectionMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#A6B4CC]">TRACKING ID:</span>
                        <span className="text-[#F4F7FF]">{analysisResult.trackingId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#A6B4CC]">VISUAL CONFIDENCE:</span>
                        <span className="text-[#35D49A] font-bold">{analysisResult.visualConfidence}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#A6B4CC]">RECOMMENDED PRIORITY:</span>
                        <span className="text-[#FF4D5A] font-bold">{analysisResult.priority.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#A6B4CC]">SCALE STATUS:</span>
                        <span className="text-[#35D49A] font-bold">{analysisResult.dimensions.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Technical Limitation Note */}
                  <div className="bg-[#070B14] p-3 rounded-xl border border-[#1A2640] text-[#A6B4CC] text-[11px] font-mono leading-relaxed">
                    <strong className="text-[#F4F7FF]">Honest Technical Limitation:</strong>{' '}
                    {analysisResult.technicalLimitationNote}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="p-4 bg-[#121D31] border-t border-[#1A2640] flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setActiveAnalysisTarget(null);
                  setAnalysisResult(null);
                }}
                className="px-4 py-2 bg-[#2684FF] text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Close Bench
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

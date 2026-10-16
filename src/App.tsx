import React, { useEffect, useState } from 'react';
import {
  Shield,
  LayoutDashboard,
  Camera,
  MapPin,
  ClipboardList,
  Wrench,
  FileCheck,
  Image as ImageIcon,
  Ruler,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  FilePlus,
  Layers,
  Menu,
  X,
  Radio,
  Building2,
  Car
} from 'lucide-react';
import { IncidentRecord } from './types';
import { IncidentService } from './services/incidentService';
import { VoiceGuidance } from './services/voiceGuidanceService';
import { CitizenHome } from './components/citizen/CitizenHome';
import { RoadScanner } from './components/citizen/RoadScanner';
import { CitizenReportModal } from './components/citizen/CitizenReportModal';
import { ControlCentreDashboard } from './components/authority/ControlCentreDashboard';
import { IncidentManagementTable } from './components/authority/IncidentManagementTable';
import { IncidentDetailModal } from './components/authority/IncidentDetailModal';
import { FieldWorkerPortal } from './components/authority/FieldWorkerPortal';
import { RepairVerificationStudio } from './components/authority/RepairVerificationStudio';
import { HazardMap } from './components/common/HazardMap';
import { DemoGallery } from './components/gallery/DemoGallery';
import { DimensionEstimatorModal } from './components/common/DimensionEstimatorModal';
import { DemoTourModal } from './components/common/DemoTourModal';

export default function App() {
  // App Domain Switcher: 'citizen' | 'authority'
  const [activeApp, setActiveApp] = useState<'citizen' | 'authority'>('authority');

  // Active View Tab within Citizen App: 'home' | 'scanner' | 'map'
  const [citizenTab, setCitizenTab] = useState<'home' | 'scanner' | 'map'>('home');

  // Active View Tab within Authority App: 'dashboard' | 'incidents' | 'field_worker' | 'repair_verification' | 'map' | 'gallery'
  const [authorityTab, setAuthorityTab] = useState<
    'dashboard' | 'incidents' | 'field_worker' | 'repair_verification' | 'map' | 'gallery'
  >('dashboard');

  // Incidents shared dataset
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);

  // Modals & Drawers state
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDimensionModalOpen, setIsDimensionModalOpen] = useState(false);
  const [dimensionTargetIncident, setDimensionTargetIncident] = useState<IncidentRecord | null>(null);
  const [isRepairStudioOpen, setIsRepairStudioOpen] = useState(false);
  const [repairStudioIncident, setRepairStudioIncident] = useState<IncidentRecord | null>(null);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);

  // Mobile navigation drawer toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Voice Guidance state
  const [isMuted, setIsMuted] = useState(VoiceGuidance.getSettings().muted);

  // Subscribe to reactive incident store
  useEffect(() => {
    setIncidents(IncidentService.getIncidents());
    const unsubscribe = IncidentService.subscribe((updatedList) => {
      setIncidents([...updatedList]);
    });
    return unsubscribe;
  }, []);

  const handleSelectIncident = (id: string) => {
    setSelectedIncidentId(id);
    setIsDetailModalOpen(true);
  };

  const handleOpenDimensionsModal = (incident?: IncidentRecord) => {
    setDimensionTargetIncident(incident || null);
    setIsDimensionModalOpen(true);
  };

  const handleOpenRepairVerification = (incident: IncidentRecord) => {
    setRepairStudioIncident(incident);
    setIsRepairStudioOpen(true);
  };

  const handleResetDemoData = () => {
    IncidentService.resetToDemo();
    alert('CivicShield AI dataset restored to initial 30 reproducible demonstration records.');
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    VoiceGuidance.updateSettings({ muted: next });
  };

  // Launch preset scenarios from tour
  const handleLaunchScenario = (key: string) => {
    if (key === 'critical_emergency') {
      setActiveApp('authority');
      setAuthorityTab('incidents');
      setSelectedIncidentId('DEMO-003');
      setIsDetailModalOpen(true);
    } else if (key === 'dimension_homography') {
      const inc = incidents.find((i) => i.id === 'DEMO-001') || incidents[0];
      handleOpenDimensionsModal(inc);
    } else if (key === 'repair_verification') {
      const inc = incidents.find((i) => i.id === 'DEMO-012') || incidents[0];
      handleOpenRepairVerification(inc);
    } else if (key === 'anti_noise_triage') {
      setActiveApp('authority');
      setAuthorityTab('incidents');
      setSelectedIncidentId('DEMO-010');
      setIsDetailModalOpen(true);
    }
  };

  const selectedIncident = incidents.find((i) => i.id === selectedIncidentId) || null;

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F4F7FF] flex flex-col font-sans selection:bg-[#2684FF] selection:text-white">
      {/* Top Universal App Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0D1424]/95 backdrop-blur-md border-b border-[#1A2640] px-4 lg:px-6 py-3 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 lg:hidden text-[#A6B4CC] hover:text-[#F4F7FF] rounded-lg hover:bg-[#121D31] cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* CivicShield Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2684FF] flex items-center justify-center text-[#F4F7FF] shadow-lg shadow-[#2684FF]/30 font-black">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-tight text-[#F4F7FF]">
                  CivicShield <span className="text-[#31D7FF]">AI</span>
                </span>
                {/* Mandatory Prototype Label */}
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#2684FF]/20 text-[#31D7FF] font-semibold border border-[#2684FF]/30">
                  PROTOTYPE DEMO — SIMULATED DATA
                </span>
              </div>
              <span className="text-[10px] text-[#A6B4CC] hidden md:block">
                See hazards earlier. Respond smarter. Make roads safer.
              </span>
            </div>
          </div>
        </div>

        {/* Dual Application Switcher Pill (Connected Apps Layer) */}
        <div className="flex items-center bg-[#121D31] p-1 rounded-xl border border-[#2684FF]/30 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveApp('citizen')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeApp === 'citizen'
                ? 'bg-[#2684FF] text-[#F4F7FF] shadow-md shadow-[#2684FF]/20'
                : 'text-[#A6B4CC] hover:text-[#F4F7FF]'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>RoadGuard Citizen</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveApp('authority')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeApp === 'authority'
                ? 'bg-[#2684FF] text-[#F4F7FF] shadow-md shadow-[#2684FF]/20'
                : 'text-[#A6B4CC] hover:text-[#F4F7FF]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Authority Control Centre</span>
          </button>
        </div>

        {/* Right Header Action Tools */}
        <div className="flex items-center gap-2.5">
          {/* Hackathon Quick Demo Tour */}
          <button
            type="button"
            onClick={() => setIsTourModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#2684FF] to-[#31D7FF] text-[#070B14] font-bold text-xs flex items-center gap-1.5 transition hover:brightness-110 shadow-lg shadow-[#2684FF]/20 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Demo Tour</span>
          </button>

          {/* Voice Mute Toggle */}
          <button
            type="button"
            onClick={handleToggleMute}
            className={`p-2 rounded-xl border transition cursor-pointer text-xs ${
              isMuted
                ? 'bg-[#121D31] border-[#FF4D5A]/40 text-[#FF4D5A]'
                : 'bg-[#121D31] border-[#2684FF]/30 text-[#31D7FF]'
            }`}
            title={isMuted ? 'Unmute Voice Assistant' : 'Mute Voice Assistant'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Reset Demo Button */}
          <button
            type="button"
            onClick={handleResetDemoData}
            className="p-2 rounded-xl bg-[#121D31] hover:bg-[#FF4D5A]/20 border border-[#1A2640] hover:border-[#FF4D5A]/40 text-[#A6B4CC] hover:text-[#FF4D5A] transition cursor-pointer"
            title="Reset to 30 pristine demo incidents"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Body with Left Navigation Sidebar + View Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigation (Desktop) */}
        <aside
          className={`w-64 bg-[#0D1424] border-r border-[#1A2640] p-4 flex flex-col justify-between shrink-0 transition-all z-30 ${
            isMobileMenuOpen ? 'fixed inset-y-0 left-0 top-[61px] block' : 'hidden lg:flex'
          }`}
        >
          <div className="space-y-6">
            {/* Domain App Identity Banner */}
            <div className="p-3 bg-[#121D31] rounded-xl border border-[#1A2640]">
              <span className="text-[10px] font-mono text-[#A6B4CC] uppercase tracking-wider block">
                CURRENT WORKSPACE
              </span>
              <span className="text-xs font-bold text-[#31D7FF] flex items-center gap-1.5 mt-0.5">
                {activeApp === 'citizen' ? <Car className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                {activeApp === 'citizen' ? 'RoadGuard Citizen Mode' : 'Authority Control Centre'}
              </span>
            </div>

            {/* Navigation Links for Citizen App */}
            {activeApp === 'citizen' && (
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#A6B4CC] uppercase px-3 mb-2 block tracking-wider">
                  CITIZEN MODULES
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setCitizenTab('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
                    citizenTab === 'home'
                      ? 'bg-[#2684FF] text-[#F4F7FF] shadow-lg shadow-[#2684FF]/20'
                      : 'text-[#A6B4CC] hover:text-[#F4F7FF] hover:bg-[#121D31]'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Citizen Home</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCitizenTab('scanner');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
                    citizenTab === 'scanner'
                      ? 'bg-[#2684FF] text-[#F4F7FF] shadow-lg shadow-[#2684FF]/20'
                      : 'text-[#A6B4CC] hover:text-[#F4F7FF] hover:bg-[#121D31]'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>Road Scanner (Dashcam)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCitizenTab('map');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
                    citizenTab === 'map'
                      ? 'bg-[#2684FF] text-[#F4F7FF] shadow-lg shadow-[#2684FF]/20'
                      : 'text-[#A6B4CC] hover:text-[#F4F7FF] hover:bg-[#121D31]'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Hazard Map</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsReportModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-[#31D7FF] bg-[#121D31] hover:bg-[#1A2640] border border-[#2684FF]/30 flex items-center gap-2.5 transition mt-3 cursor-pointer"
                >
                  <FilePlus className="w-4 h-4" />
                  <span>Submit Stopped Report</span>
                </button>
              </div>
            )}

            {/* Navigation Links for Authority App */}
            {activeApp === 'authority' && (
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#A6B4CC] uppercase px-3 mb-2 block tracking-wider">
                  MUNICIPAL WORKFLOWS
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setAuthorityTab('dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
                    authorityTab === 'dashboard'
                      ? 'bg-[#2684FF] text-[#F4F7FF] shadow-lg shadow-[#2684FF]/20'
                      : 'text-[#A6B4CC] hover:text-[#F4F7FF] hover:bg-[#121D31]'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Overview Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthorityTab('incidents');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
                    authorityTab === 'incidents'
                      ? 'bg-[#2684FF] text-[#F4F7FF] shadow-lg shadow-[#2684FF]/20'
                      : 'text-[#A6B4CC] hover:text-[#F4F7FF] hover:bg-[#121D31]'
                  }`}
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>Incident Management</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthorityTab('repair_verification');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
                    authorityTab === 'repair_verification'
                      ? 'bg-[#2684FF] text-[#F4F7FF] shadow-lg shadow-[#2684FF]/20'
                      : 'text-[#A6B4CC] hover:text-[#F4F7FF] hover:bg-[#121D31]'
                  }`}
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Repair Verification Studio</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthorityTab('field_worker');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
                    authorityTab === 'field_worker'
                      ? 'bg-[#2684FF] text-[#F4F7FF] shadow-lg shadow-[#2684FF]/20'
                      : 'text-[#A6B4CC] hover:text-[#F4F7FF] hover:bg-[#121D31]'
                  }`}
                >
                  <Wrench className="w-4 h-4" />
                  <span>Field Worker Portal</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthorityTab('map');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
                    authorityTab === 'map'
                      ? 'bg-[#2684FF] text-[#F4F7FF] shadow-lg shadow-[#2684FF]/20'
                      : 'text-[#A6B4CC] hover:text-[#F4F7FF] hover:bg-[#121D31]'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Geographic Incident Map</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthorityTab('gallery');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
                    authorityTab === 'gallery'
                      ? 'bg-[#2684FF] text-[#F4F7FF] shadow-lg shadow-[#2684FF]/20'
                      : 'text-[#A6B4CC] hover:text-[#F4F7FF] hover:bg-[#121D31]'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Visual Evidence Library</span>
                </button>
              </div>
            )}
          </div>

          {/* Bottom Technical Explainer Link */}
          <div className="pt-4 border-t border-[#1A2640] space-y-2">
            <button
              type="button"
              onClick={() => handleOpenDimensionsModal()}
              className="w-full px-3 py-2.5 rounded-xl bg-[#121D31] hover:bg-[#1A2640] border border-[#2684FF]/30 text-xs text-[#31D7FF] font-semibold flex items-center gap-2 transition cursor-pointer"
            >
              <Ruler className="w-4 h-4 text-[#31D7FF]" />
              <span>Dimension Estimation Math</span>
            </button>

            <div className="p-3 bg-[#070B14] rounded-lg border border-[#1A2640] text-[10px] text-[#A6B4CC] leading-normal font-mono">
              <span className="text-[#35D49A] font-bold block mb-0.5">METRO CIVIC LAYER</span>
              30 Fixed Benchmarks (DEMO-001 to DEMO-030)
            </div>
          </div>
        </aside>

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          {/* CITIZEN APPLICATION VIEWS */}
          {activeApp === 'citizen' && citizenTab === 'home' && (
            <CitizenHome
              incidents={incidents}
              onSelectIncident={handleSelectIncident}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              onNavigateTab={(tab) => setCitizenTab(tab)}
            />
          )}

          {activeApp === 'citizen' && citizenTab === 'scanner' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#F4F7FF]">Active Road Scanner</h2>
                  <p className="text-xs text-[#A6B4CC]">
                    Continuous optical dashcam monitoring with automated voice alert dispatch.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCitizenTab('home')}
                  className="px-3 py-1.5 rounded-lg bg-[#121D31] text-[#A6B4CC] hover:text-[#F4F7FF] text-xs font-semibold cursor-pointer"
                >
                  Back to Citizen Home
                </button>
              </div>
              <RoadScanner
                onIncidentDetected={handleSelectIncident}
                onOpenReportModal={() => setIsReportModalOpen(true)}
              />
            </div>
          )}

          {activeApp === 'citizen' && citizenTab === 'map' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#F4F7FF]">Interactive Citizen Hazard Map</h2>
                  <p className="text-xs text-[#A6B4CC]">
                    Real-time community-reported road infrastructure issues.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#2684FF] text-white text-xs font-bold cursor-pointer shadow-md"
                >
                  Report Hazard Here
                </button>
              </div>
              <HazardMap
                incidents={incidents}
                onSelectIncident={handleSelectIncident}
                heightClass="h-[620px]"
              />
            </div>
          )}

          {/* AUTHORITY CONTROL CENTRE VIEWS */}
          {activeApp === 'authority' && authorityTab === 'dashboard' && (
            <ControlCentreDashboard
              incidents={incidents}
              onSelectIncident={handleSelectIncident}
              onNavigateTab={(tab) => setAuthorityTab(tab)}
              onOpenDimensionsModal={() => handleOpenDimensionsModal()}
            />
          )}

          {activeApp === 'authority' && authorityTab === 'incidents' && (
            <IncidentManagementTable
              incidents={incidents}
              onSelectIncident={handleSelectIncident}
              onOpenRepairVerification={handleOpenRepairVerification}
            />
          )}

          {activeApp === 'authority' && authorityTab === 'field_worker' && (
            <FieldWorkerPortal
              incidents={incidents}
              onSelectIncident={handleSelectIncident}
              onRefresh={() => setIncidents(IncidentService.getIncidents())}
            />
          )}

          {activeApp === 'authority' && authorityTab === 'repair_verification' && (
            <div className="space-y-5">
              <div className="bg-[#0D1424] border border-[#1A2640] rounded-2xl p-6 shadow-xl flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#F4F7FF]">Repair Verification Audit Center</h2>
                  <p className="text-xs text-[#A6B4CC] mt-0.5">
                    Side-by-side photographic review for work orders submitted by municipal field crews.
                  </p>
                </div>
              </div>

              {/* Show list of repair-ready tickets */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {incidents
                  .filter(
                    (i) =>
                      i.status === 'repaired_pending_verification' ||
                      i.status === 'verified_resolved' ||
                      i.repairData
                  )
                  .map((inc) => (
                    <div
                      key={inc.id}
                      className="bg-[#0D1424] border border-[#1A2640] rounded-xl p-4 flex flex-col justify-between gap-3 shadow-lg hover:border-[#2684FF]/40 transition"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs font-bold text-[#31D7FF]">{inc.id}</span>
                          <span
                            className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                              inc.status === 'verified_resolved'
                                ? 'bg-[#35D49A]/20 text-[#35D49A]'
                                : 'bg-[#FFB547]/20 text-[#FFB547]'
                            }`}
                          >
                            {inc.status === 'verified_resolved' ? 'VERIFIED RESOLVED' : 'AWAITING SIGN-OFF'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-[#F4F7FF] line-clamp-1">{inc.title}</h4>
                        <p className="text-[11px] text-[#A6B4CC] mt-1">{inc.address}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenRepairVerification(inc)}
                        className="w-full py-2 bg-[#2684FF]/20 hover:bg-[#2684FF] text-[#31D7FF] hover:text-[#F4F7FF] text-xs font-bold rounded-lg transition cursor-pointer"
                      >
                        Launch Side-by-Side Slider
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeApp === 'authority' && authorityTab === 'map' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#F4F7FF]">Authority Incident Spatial Map</h2>
                  <p className="text-xs text-[#A6B4CC]">
                    Geographic distribution of all 30 municipal road asset incidents.
                  </p>
                </div>
              </div>
              <HazardMap
                incidents={incidents}
                onSelectIncident={handleSelectIncident}
                heightClass="h-[620px]"
              />
            </div>
          )}

          {activeApp === 'authority' && authorityTab === 'gallery' && (
            <DemoGallery
              incidents={incidents}
              onSelectIncident={handleSelectIncident}
              onOpenDimensionsModal={handleOpenDimensionsModal}
            />
          )}
        </main>
      </div>

      {/* MODALS */}
      {/* 1. Incident Detail Inspector Drawer */}
      <IncidentDetailModal
        incident={selectedIncident}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onUpdated={(updated) => {
          setIncidents(IncidentService.getIncidents());
        }}
        onOpenDimensionsModal={(inc) => handleOpenDimensionsModal(inc)}
        onOpenRepairVerification={(inc) => handleOpenRepairVerification(inc)}
      />

      {/* 2. Citizen Manual Report Modal */}
      <CitizenReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitted={(newId) => {
          setIncidents(IncidentService.getIncidents());
          handleSelectIncident(newId);
        }}
      />

      {/* 3. Physical Dimension Estimator Architecture Modal */}
      <DimensionEstimatorModal
        incident={dimensionTargetIncident}
        isOpen={isDimensionModalOpen}
        onClose={() => setIsDimensionModalOpen(false)}
      />

      {/* 4. Side-by-Side Repair Verification Studio */}
      {repairStudioIncident && isRepairStudioOpen && (
        <RepairVerificationStudio
          incident={repairStudioIncident}
          isOpen={isRepairStudioOpen}
          onClose={() => setIsRepairStudioOpen(false)}
          onUpdated={(updated) => {
            setIncidents(IncidentService.getIncidents());
          }}
        />
      )}

      {/* 5. Hackathon Guided Tour Preset Modal */}
      <DemoTourModal
        isOpen={isTourModalOpen}
        onClose={() => setIsTourModalOpen(false)}
        onSelectScenario={handleLaunchScenario}
        onResetDemo={handleResetDemoData}
      />
    </div>
  );
}

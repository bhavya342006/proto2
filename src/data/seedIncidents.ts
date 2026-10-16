import { IncidentRecord } from '../types';
import { getHazardIllustration } from '../utils/hazardIllustrations';

/**
 * EXACT 30 DEMONSTRATION INCIDENTS (DEMO-001 through DEMO-030)
 * Stable, reproducible, calibrated benchmark dataset for CivicShield AI hackathon evaluation.
 * Centered around Civic Metro Area (~37.7749, -122.4194)
 */
export const SEED_INCIDENTS: IncidentRecord[] = [
  // 1. Pothole - Critical (Model Supported)
  {
    id: 'DEMO-001',
    category: 'pothole',
    title: 'Severe Deep Cavity Pothole on Market & 5th',
    description: 'Deep pavement cavity in eastbound inner bus-traffic lane with exposed sub-base rock. Severe hazard to two-wheelers and passenger vehicles.',
    address: '845 Market St, Metro District',
    coordinates: { lat: 37.7841, lng: -122.4068 },
    gpsAccuracyMeters: 3.2,
    priority: 'critical',
    priorityExplanation: 'Direct vehicle axle strike zone with high pedestrian and bus exposure. Depth exceeds 12cm threshold for immediate danger.',
    status: 'inspection_assigned',
    classification: 'MODEL-SUPPORTED DETECTION',
    classificationEvidence: {
      supporting: ['High visual confidence (94%) from dashcam feed', 'Calibrated camera extrinsics available', 'Consistent bounding box across 9 consecutive frames'],
      missing: ['Ground-truth depth gauge measurement (estimated from edge shadow)'],
      recommendedNextStep: 'Dispatch municipal rapid asphalt repair unit for temporary cold patch within 4 hours.',
      decidedBy: 'AI Triage Engine (v2.4) + Officer Miller',
      isAutomated: false
    },
    dimensions: {
      lengthMeters: 1.25,
      widthMeters: 0.82,
      depthMeters: 0.14,
      areaSqMeters: 0.80,
      measurementMethod: 'Calibrated Monocular Homography with Shadow Depth Ratio',
      uncertaintyPercent: 8,
      status: 'ESTIMATED',
      statusExplanation: 'Camera mount angle calibrated at 14.5 degrees; metric scale established via known road lane divider markings.'
    },
    detection: {
      visualConfidence: 94,
      locationConfidence: 96,
      dimensionConfidence: 88,
      detectionMethod: 'LIVE_MODEL',
      trackingId: 'TRK-1049',
      boundingBox: { x: 210, y: 160, width: 410, height: 240, label: 'pothole_deep', confidence: 0.94 }
    },
    assignedWorkerId: 'WRK-04',
    assignedWorkerName: 'Carlos Ramirez (Rapid Response Crew A)',
    imageUrl: getHazardIllustration('pothole', 'DEMO-001'),
    imageCaption: 'Dashcam perspective showing deep cavity with exposed jagged aggregates',
    isDemoData: true,
    history: [
      { id: 'h1', timestamp: '2026-10-15 08:14:02', action: 'Road scan auto-detected hazard', actor: 'Citizen Dashcam (TRK-1049)', details: 'Initial model classification: pothole with 94% confidence.' },
      { id: 'h2', timestamp: '2026-10-15 08:15:30', action: 'Triage priority elevated to Critical', actor: 'Automated Rule Engine', details: 'Depth >10cm on primary arterial transit corridor.' },
      { id: 'h3', timestamp: '2026-10-15 08:30:11', action: 'Inspection assigned', actor: 'Dispatcher Officer Miller', details: 'Assigned to Carlos Ramirez (Crew A) with High priority.' }
    ],
    createdAt: '2026-10-15T08:14:02Z',
    updatedAt: '2026-10-15T08:30:11Z'
  },

  // 2. Open Manhole - Critical (Emergency)
  {
    id: 'DEMO-002',
    category: 'open_manhole',
    title: 'Dislodged Manhole Cover Near Crosswalk',
    description: 'Cast-iron sewer manhole cover shifted 1.1 meters away, leaving an open 0.85m diameter vertical drop into the storm utility shaft.',
    address: '420 Mission St & Fremont St',
    coordinates: { lat: 37.7909, lng: -122.3986 },
    gpsAccuracyMeters: 4.1,
    priority: 'critical',
    priorityExplanation: 'Fatal risk for cyclists, motorcyclists, and pedestrians crossing at night. Immediate life-safety emergency.',
    status: 'under_inspection',
    classification: 'HUMAN-VERIFIED HAZARD',
    classificationEvidence: {
      supporting: ['Two independent citizen dashcam sightings within 15 minutes', 'Direct visual confirmation by Patrol Officer Jenkins', 'Police cone barrier deployed temporarily'],
      missing: [],
      recommendedNextStep: 'Utility crew must reseat cover or place heavy steel safety plate immediately.',
      decidedBy: 'Officer Jenkins (Field Patrol #12)',
      isAutomated: false
    },
    dimensions: {
      lengthMeters: 0.85,
      widthMeters: 0.85,
      depthMeters: 3.20,
      areaSqMeters: 0.57,
      measurementMethod: 'Standard Municipal Cast Iron Rim Specification (0.85m diameter)',
      uncertaintyPercent: 2,
      status: 'ESTIMATED',
      statusExplanation: 'Standard municipal utility collar diameter confirmed against city utility GIS layer.'
    },
    detection: {
      visualConfidence: 98,
      locationConfidence: 94,
      dimensionConfidence: 97,
      detectionMethod: 'LIVE_MODEL',
      trackingId: 'TRK-1082'
    },
    assignedWorkerId: 'WRK-01',
    assignedWorkerName: 'Marcus Vance (Emergency Utility Response)',
    imageUrl: getHazardIllustration('open_manhole', 'DEMO-002'),
    imageCaption: 'Displaced manhole collar with open void exposing storm conduit below',
    isDemoData: true,
    history: [
      { id: 'h1', timestamp: '2026-10-15 09:02:18', action: 'Reported by citizen scan', actor: 'RoadGuard Citizen #482', details: 'Auto-flagged as critical open hole.' },
      { id: 'h2', timestamp: '2026-10-15 09:05:40', action: 'Field verification complete', actor: 'Patrol Officer Jenkins', details: 'Human verified hazard on site; temporary cones placed.' }
    ],
    createdAt: '2026-10-15T09:02:18Z',
    updatedAt: '2026-10-15T09:05:40Z'
  },

  // 3. Fallen Electrical Wire - Critical
  {
    id: 'DEMO-003',
    category: 'fallen_electrical_wire',
    title: 'Downed Overhead Electrical Wire on 4th St',
    description: 'Overhead power cable snapped from utility pole #402 and draped across roadway. Sparking observed at curb gutter contact point.',
    address: '220 4th St, SOMA Sector',
    coordinates: { lat: 37.7824, lng: -122.4021 },
    gpsAccuracyMeters: 2.8,
    priority: 'critical',
    priorityExplanation: 'Active electrical shock and fire hazard blocking vehicular traffic and sidewalk.',
    status: 'under_inspection',
    classification: 'HUMAN-VERIFIED HAZARD',
    classificationEvidence: {
      supporting: ['High-contrast linear wire segmentation detected', 'Spark flash signature detected in consecutive frames', 'Fire Dept emergency call cross-referenced'],
      missing: [],
      recommendedNextStep: 'Coordinate power grid isolation with energy utility before road clearing.',
      decidedBy: 'City Emergency Operations Officer Zhang',
      isAutomated: false
    },
    dimensions: {
      lengthMeters: 7.40,
      widthMeters: 0.04,
      depthMeters: undefined,
      areaSqMeters: undefined,
      measurementMethod: 'Linear Road Span Calculation',
      uncertaintyPercent: 12,
      status: 'APPROXIMATE',
      statusExplanation: 'Wire diameter too small for sub-centimeter metric precision; span across lanes estimated at 7.4m.'
    },
    detection: {
      visualConfidence: 91,
      locationConfidence: 97,
      dimensionConfidence: 65,
      detectionMethod: 'API_ANALYSIS',
      trackingId: 'TRK-1104'
    },
    assignedWorkerId: 'WRK-07',
    assignedWorkerName: 'Sarah Lin (High Voltage Safety Team)',
    imageUrl: getHazardIllustration('fallen_electrical_wire', 'DEMO-003'),
    imageCaption: 'High voltage electrical cable resting across travel lane with intermittent spark signature',
    isDemoData: true,
    history: [
      { id: 'h1', timestamp: '2026-10-15 09:44:11', action: 'Emergency alert logged', actor: 'Citizen Scan #81', details: 'Vision model detected fallen cable on roadway.' },
      { id: 'h2', timestamp: '2026-10-15 09:46:00', action: 'Emergency dispatch', actor: 'Dispatch Officer Zhang', details: 'Escalated to High Voltage team.' }
    ],
    createdAt: '2026-10-15T09:44:11Z',
    updatedAt: '2026-10-15T09:46:00Z'
  },

  // 4. Waterlogging - High
  {
    id: 'DEMO-004',
    category: 'waterlogging',
    title: 'Extensive Roadway Ponding on Folsom St',
    description: 'Standing water covering 2 full lanes following storm sewer backup. Depth estimated at 18cm, creating hydroplaning risk.',
    address: '690 Folsom St, SOMA Sector',
    coordinates: { lat: 37.7852, lng: -122.3995 },
    gpsAccuracyMeters: 5.0,
    priority: 'high',
    priorityExplanation: 'Obstructs right and center lanes; causes vehicle stalling and dangerous sudden braking.',
    status: 'triaged',
    classification: 'MODEL-SUPPORTED DETECTION',
    classificationEvidence: {
      supporting: ['Specular reflection and water boundary contour identified', 'Curbside water line indicators visible'],
      missing: ['Submerged obstacle inspection under murky pool'],
      recommendedNextStep: 'Deploy mobile high-capacity pump truck and clear downstream storm inlet.',
      decidedBy: 'CivicShield Automated Triage Model',
      isAutomated: true
    },
    dimensions: {
      lengthMeters: 14.8,
      widthMeters: 6.2,
      depthMeters: 0.18,
      areaSqMeters: 68.0,
      measurementMethod: 'Curbside Inundation Homography & Reflection Mapping',
      uncertaintyPercent: 15,
      status: 'APPROXIMATE',
      statusExplanation: 'Water perimeter clearly bounded by curb lines; surface area calculated accurately, depth approximated from curb height.'
    },
    detection: {
      visualConfidence: 89,
      locationConfidence: 91,
      dimensionConfidence: 78,
      detectionMethod: 'LIVE_MODEL',
      trackingId: 'TRK-1140'
    },
    imageUrl: getHazardIllustration('waterlogging', 'DEMO-004'),
    imageCaption: 'Heavy standing water pool concealing lane markers along curbside',
    isDemoData: true,
    history: [
      { id: 'h1', timestamp: '2026-10-15 10:11:32', action: 'Detection logged', actor: 'Citizen Scan #103', details: 'Large waterlogged pool flagged.' }
    ],
    createdAt: '2026-10-15T10:11:32Z',
    updatedAt: '2026-10-15T10:11:32Z'
  },

  // 5. Damaged Drain - High
  {
    id: 'DEMO-005',
    category: 'damaged_drain',
    title: 'Collapsed Cast Iron Storm Grate',
    description: 'Bicycle wheel hazard: central bar of storm grate sheared off and sunken into catch basin below.',
    address: '150 2nd St & Minna St',
    coordinates: { lat: 37.7877, lng: -122.4002 },
    gpsAccuracyMeters: 3.5,
    priority: 'high',
    priorityExplanation: 'Direct tire trap for bicycles and scooter commuters; risk of serious rider throw.',
    status: 'inspection_assigned',
    classification: 'MODEL-SUPPORTED DETECTION',
    classificationEvidence: {
      supporting: ['Grate bar discontinuity recognized by model', 'High-confidence structural anomaly score (92%)'],
      missing: ['Basin interior wall integrity test'],
      recommendedNextStep: 'Install temporary steel mesh cover until new municipal cast grate is delivered.',
      decidedBy: 'Officer Miller',
      isAutomated: false
    },
    dimensions: {
      lengthMeters: 0.90,
      widthMeters: 0.45,
      depthMeters: 0.25,
      areaSqMeters: 0.40,
      measurementMethod: 'Standard Catch Basin Grate Dimensions',
      uncertaintyPercent: 5,
      status: 'ESTIMATED',
      statusExplanation: 'Calibrated against known municipal frame aperture (0.90m x 0.45m).'
    },
    detection: {
      visualConfidence: 92,
      locationConfidence: 95,
      dimensionConfidence: 90,
      detectionMethod: 'LIVE_MODEL',
      trackingId: 'TRK-1175'
    },
    assignedWorkerId: 'WRK-04',
    assignedWorkerName: 'Carlos Ramirez (Rapid Response Crew A)',
    imageUrl: getHazardIllustration('damaged_drain', 'DEMO-005'),
    imageCaption: 'Dislodged and fractured storm drain bars with gap large enough to trap bicycle tire',
    isDemoData: true,
    history: [
      { id: 'h1', timestamp: '2026-10-15 11:05:44', action: 'Reported by commuter', actor: 'RoadGuard Citizen #512', details: 'Snapped grate detected in bike lane.' },
      { id: 'h2', timestamp: '2026-10-15 11:20:00', action: 'Inspection assigned', actor: 'Officer Miller', details: 'Dispatched Crew A for temporary mitigation.' }
    ],
    createdAt: '2026-10-15T11:05:44Z',
    updatedAt: '2026-10-15T11:20:00Z'
  },

  // 6. Fallen Obstruction - High
  {
    id: 'DEMO-006',
    category: 'fallen_object',
    title: 'Fallen Tree Branch Obstructing Westbound Lane',
    description: 'Large mature eucalyptus branch snapped in crosswinds, spanning 2.4 meters across the roadway.',
    address: '510 Van Ness Ave',
    coordinates: { lat: 37.7788, lng: -122.4189 },
    gpsAccuracyMeters: 3.0,
    priority: 'high',
    priorityExplanation: 'Forces vehicles into opposing lane of travel with reduced sightline around curve.',
    status: 'under_inspection',
    classification: 'HUMAN-VERIFIED HAZARD',
    classificationEvidence: {
      supporting: ['Multi-frame object tracking', 'Traffic flow deceleration detected on sensor corridor', 'Field confirmation by DPW'],
      missing: [],
      recommendedNextStep: 'Chainsaw crew and wood chipper dispatch to clear roadway.',
      decidedBy: 'DPW Supervisor Higgins',
      isAutomated: false
    },
    dimensions: {
      lengthMeters: 2.40,
      widthMeters: 0.65,
      depthMeters: 0.40,
      areaSqMeters: 1.56,
      measurementMethod: 'Bounding Polygon Projection',
      uncertaintyPercent: 10,
      status: 'APPROXIMATE',
      statusExplanation: 'Irregular biological shape measured across maximum outer branches.'
    },
    detection: {
      visualConfidence: 95,
      locationConfidence: 96,
      dimensionConfidence: 82,
      detectionMethod: 'LIVE_MODEL',
      trackingId: 'TRK-1201'
    },
    assignedWorkerId: 'WRK-09',
    assignedWorkerName: 'Elena Rostova (DPW Forestry)',
    imageUrl: getHazardIllustration('fallen_object', 'DEMO-006'),
    imageCaption: 'Heavy timber branch blocking travel lane with leaf debris',
    isDemoData: true,
    history: [
      { id: 'h1', timestamp: '2026-10-15 11:45:10', action: 'Scan trigger', actor: 'Transit Bus #38 Dashcam', details: 'Object detected in path.' },
      { id: 'h2', timestamp: '2026-10-15 12:00:20', action: 'DPW dispatch', actor: 'DPW Supervisor Higgins', details: 'Forestry crew assigned.' }
    ],
    createdAt: '2026-10-15T11:45:10Z',
    updatedAt: '2026-10-15T12:00:20Z'
  },

  // 7. Broken Streetlight - Medium
  {
    id: 'DEMO-007',
    category: 'broken_streetlight',
    title: 'Shattered Luminaire & Exposed Wiring on Pole #18',
    description: 'Sodium luminaire fixture broken off arm; dangling internal ballast wires create dark pedestrian intersection.',
    address: '1100 Howard St & 7th St',
    coordinates: { lat: 37.7766, lng: -122.4098 },
    gpsAccuracyMeters: 6.1,
    priority: 'medium',
    priorityExplanation: 'Reduced nighttime visibility increases collision risk for pedestrians at unsignalized crossing.',
    status: 'reported',
    classification: 'MODEL-SUPPORTED DETECTION',
    classificationEvidence: {
      supporting: ['Visual detection of fractured glass casing and exposed ballast', 'Corroborated by lux sensor anomaly on telemetry node'],
      missing: ['Ground crew electrical continuity check'],
      recommendedNextStep: 'Schedule bucket truck replacement of luminaire head with LED retrofit.',
      decidedBy: 'Automated Night Scan Analysis',
      isAutomated: true
    },
    dimensions: {
      lengthMeters: 0.65,
      widthMeters: 0.35,
      depthMeters: 0.25,
      areaSqMeters: 0.22,
      measurementMethod: 'Pole Spec Standard Fixture Dimensions',
      uncertaintyPercent: 10,
      status: 'APPROXIMATE',
      statusExplanation: 'Elevated fixture dimensions estimated from known arm bracket proportions.'
    },
    detection: {
      visualConfidence: 86,
      locationConfidence: 88,
      dimensionConfidence: 74,
      detectionMethod: 'API_ANALYSIS',
      trackingId: 'TRK-1230'
    },
    imageUrl: getHazardIllustration('broken_streetlight', 'DEMO-007'),
    imageCaption: 'Damaged luminaire housing with dangling electrical components',
    isDemoData: true,
    history: [
      { id: 'h1', timestamp: '2026-10-15 12:30:19', action: 'Reported', actor: 'Citizen Scan #210', details: 'Dark fixture noted during dusk scan.' }
    ],
    createdAt: '2026-10-15T12:30:19Z',
    updatedAt: '2026-10-15T12:30:19Z'
  },

  // 8. Road Crack - Medium
  {
    id: 'DEMO-008',
    category: 'road_crack',
    title: 'Transverse Thermal Crack Across Two Lanes',
    description: 'Long continuous fracture opening up to 35mm wide across asphalt surface. Water penetration risk before winter freeze.',
    address: '920 Bryant St',
    coordinates: { lat: 37.7745, lng: -122.4047 },
    gpsAccuracyMeters: 4.0,
    priority: 'medium',
    priorityExplanation: 'Crack width exceeding 25mm permits rapid water intrusion that causes sub-base cavitation.',
    status: 'triaged',
    classification: 'MODEL-SUPPORTED DETECTION',
    classificationEvidence: {
      supporting: ['Clear multi-meter linear edge segmentation', 'Thermal imaging corroborates pavement expansion gap'],
      missing: ['Sub-surface ground penetrating radar verification'],
      recommendedNextStep: 'Hot-pour rubberized bitumen crack sealant application.',
      decidedBy: 'Pavement Management AI',
      isAutomated: true
    },
    dimensions: {
      lengthMeters: 6.80,
      widthMeters: 0.035,
      depthMeters: 0.05,
      areaSqMeters: 0.24,
      measurementMethod: 'Calibrated High-Resolution Pavement Profiler',
      uncertaintyPercent: 9,
      status: 'ESTIMATED',
      statusExplanation: 'Homography projection applied from forward vehicle camera; width measured at 35mm ± 3mm.'
    },
    detection: {
      visualConfidence: 93,
      locationConfidence: 95,
      dimensionConfidence: 86,
      detectionMethod: 'LIVE_MODEL',
      trackingId: 'TRK-1262'
    },
    imageUrl: getHazardIllustration('road_crack', 'DEMO-008'),
    imageCaption: 'Continuous linear fissure cutting across driving lanes',
    isDemoData: true,
    history: [
      { id: 'h1', timestamp: '2026-10-15 13:10:05', action: 'Detected', actor: 'Inspection Van Dashcam', details: 'Transverse crack segmentation.' }
    ],
    createdAt: '2026-10-15T13:10:05Z',
    updatedAt: '2026-10-15T13:10:05Z'
  },

  // 9. Manual Inspection Required (Uncertain Shadow / Stain vs Pothole)
  {
    id: 'DEMO-009',
    category: 'pothole',
    title: 'Dark Surface Anomaly Under Tree Canopy (Stain vs Cavity)',
    description: 'Low-contrast dark patch beneath oak canopy. Automated classifier unsure if oil spill or deep pothole cavity.',
    address: '1420 Pine St & Leavenworth St',
    coordinates: { lat: 37.7901, lng: -122.4172 },
    gpsAccuracyMeters: 7.8,
    priority: 'medium',
    priorityExplanation: 'High uncertainty: could be benign motor oil residue or dangerous wheel-jarring depression.',
    status: 'reported',
    classification: 'MANUAL INSPECTION REQUIRED',
    classificationEvidence: {
      supporting: ['Dark contour detected in road travel path'],
      missing: ['Parallax stereo disparity check failed due to low sunlight', 'Shadow edge gradients inconclusive'],
      recommendedNextStep: 'Route municipal field scout or street-sweeping sensor for physical ground verification.',
      decidedBy: 'CivicShield Uncertainty Triage Gate',
      isAutomated: true
    },
    dimensions: {
      lengthMeters: undefined,
      widthMeters: undefined,
      depthMeters: undefined,
      areaSqMeters: undefined,
      measurementMethod: 'Uncalibrated / None',
      uncertaintyPercent: undefined,
      status: 'MANUAL MEASUREMENT REQUIRED',
      statusExplanation: 'Physical dimensions unavailable — manual measurement required due to high shadow noise and missing stereo depth.'
    },
    detection: {
      visualConfidence: 51,
      locationConfidence: 72,
      dimensionConfidence: 20,
      detectionMethod: 'SIMULATED_DEMO',
      trackingId: 'TRK-1290'
    },
    imageUrl: getHazardIllustration('pothole', 'DEMO-009'),
    imageCaption: 'Ambiguous dark road surface patch with heavy leaf shadow interference',
    isDemoData: true,
    history: [
      { id: 'h1', timestamp: '2026-10-15 13:42:50', action: 'Auto-flagged for human review', actor: 'CivicShield AI Guardrail', details: 'Confidence score (51%) fell below automatic triage threshold.' }
    ],
    createdAt: '2026-10-15T13:42:50Z',
    updatedAt: '2026-10-15T13:42:50Z'
  },

  // 10. Suspected False or Irrelevant Report
  {
    id: 'DEMO-010',
    category: 'irrelevant',
    title: 'Irrelevant Image: Travel Mug on Vehicle Dashboard',
    description: 'Submitted photograph shows passenger interior and a travel mug sitting in cup holder. No road or pavement visible in frame.',
    address: '300 Brannan St',
    coordinates: { lat: 37.7818, lng: -122.3924 },
    gpsAccuracyMeters: 12.0,
    priority: 'low',
    priorityExplanation: 'Non-infrastructure object. Zero hazard to public transit or roadway safety.',
    status: 'rejected_false_positive',
    classification: 'SUSPECTED FALSE OR IRRELEVANT REPORT',
    classificationEvidence: {
      supporting: ['Scene parsing indicates interior vehicle cabin (98.4%)', 'Zero road surface or asphalt texture detected', 'No geographic hazard correlation'],
      missing: ['Roadway surface pixels'],
      recommendedNextStep: 'Auto-reject from road repair queue and send friendly educational tip to citizen.',
      decidedBy: 'CivicShield Anti-Noise Classifier',
      isAutomated: true
    },
    dimensions: {
      lengthMeters: undefined,
      widthMeters: undefined,
      depthMeters: undefined,
      areaSqMeters: undefined,
      measurementMethod: 'None - Irrelevant Target',
      status: 'UNAVAILABLE',
      statusExplanation: 'Physical dimensions unavailable — target is not a road infrastructure hazard.'
    },
    detection: {
      visualConfidence: 8,
      locationConfidence: 45,
      dimensionConfidence: 0,
      detectionMethod: 'SIMULATED_DEMO',
      trackingId: 'TRK-1310'
    },
    imageUrl: getHazardIllustration('irrelevant', 'DEMO-010'),
    imageCaption: 'Coffee tumbler resting in cup holder inside car cabin',
    isDemoData: true,
    history: [
      { id: 'h1', timestamp: '2026-10-15 14:02:11', action: 'Report submitted by citizen', actor: 'Citizen App User #891', details: 'Accidental upload while phone in mount.' },
      { id: 'h2', timestamp: '2026-10-15 14:02:14', action: 'Rejected automatically', actor: 'CivicShield Vision Gate', details: 'Classified as cabin interior with 98% certainty.' }
    ],
    createdAt: '2026-10-15T14:02:11Z',
    updatedAt: '2026-10-15T14:02:14Z'
  },

  // 11. Likely Duplicate of DEMO-001
  {
    id: 'DEMO-011',
    category: 'pothole',
    title: 'Duplicate Citizen Report: Market & 5th Pothole',
    description: 'Second citizen report for the deep pothole outside 845 Market St, captured 35 minutes after initial detection.',
    address: '849 Market St, Metro District',
    coordinates: { lat: 37.7842, lng: -122.4069 },
    gpsAccuracyMeters: 4.8,
    priority: 'critical',
    priorityExplanation: 'Linked duplicate of DEMO-001. High priority maintained on parent ticket.',
    status: 'triaged',
    classification: 'LIKELY DUPLICATE',
    classificationEvidence: {
      supporting: ['Geographic distance: 11 meters from DEMO-001', 'Same category: pothole', 'Recorded within 35 minutes of DEMO-001', 'Visual embedding match: 91.4% similarity'],
      missing: ['Officer manual merge confirmation'],
      recommendedNextStep: 'Confirm merge with parent ticket DEMO-001 to prevent duplicate crew dispatches.',
      decidedBy: 'Proximity Deduplication Service',
      isAutomated: true
    },
    duplicateOfId: 'DEMO-001',
    duplicateMatchReason: 'Spatial proximity (11m delta), identical hazard type, and high feature embedding match.',
    dimensions: {
      lengthMeters: 1.20,
      widthMeters: 0.80,
      depthMeters: 0.14,
      areaSqMeters: 0.76,
      measurementMethod: 'Calibrated Monocular Homography',
      uncertaintyPercent: 9,
      status: 'ESTIMATED',
      statusExplanation: 'Dimensions closely mirror parent record DEMO-001 (1.25m x 0.82m).'
    },
    detection: {
      visualConfidence: 91,
      locationConfidence: 93,
      dimensionConfidence: 85,
      detectionMethod: 'LIVE_MODEL',
      trackingId: 'TRK-1345'
    },
    imageUrl: getHazardIllustration('pothole', 'DEMO-011'),
    imageCaption: 'Alternate angle citizen snapshot of the same Market St pavement cavity',
    isDemoData: true,
    history: [
      { id: 'h1', timestamp: '2026-10-15 14:21:40', action: 'Duplicate detected', actor: 'Deduplication Engine', details: 'Associated with DEMO-001 with 91% similarity score.' }
    ],
    createdAt: '2026-10-15T14:21:40Z',
    updatedAt: '2026-10-15T14:21:40Z'
  },

  // 12. Repair Verification in Progress (Repaired pending verification)
  {
    id: 'DEMO-012',
    category: 'pothole',
    title: 'Completed Asphalt Patch on 3rd & Harrison (Awaiting Verification)',
    description: 'Field crew has finished applying hot asphalt mix, roller compaction, and bitumen edge seal. Submitted for municipal officer sign-off.',
    address: '680 3rd St & Harrison St',
    coordinates: { lat: 37.7831, lng: -122.3978 },
    gpsAccuracyMeters: 2.5,
    priority: 'high',
    priorityExplanation: 'Hazard rectified by field team; awaiting formal verification before reopening lane and closing public alert.',
    status: 'repaired_pending_verification',
    classification: 'DEMONSTRATION RECORD',
    classificationEvidence: {
      supporting: ['Field repair photo submitted by Crew B', 'Manual measurements logged: 1.10m x 0.90m', 'Edge seal bitumen confirmed in photo', 'Time stamp matching work order schedule'],
      missing: ['Authorized Officer digital sign-off signature'],
      recommendedNextStep: 'Municipal Officer to perform side-by-side photographic review and approve resolution.',
      decidedBy: 'Officer Miller',
      isAutomated: false
    },
    dimensions: {
      lengthMeters: 1.10,
      widthMeters: 0.90,
      depthMeters: 0.0,
      areaSqMeters: 0.99,
      measurementMethod: 'Field Tape & Laser Measurement by Municipal Crew',
      uncertaintyPercent: 2,
      status: 'ESTIMATED',
      statusExplanation: 'Ground crew tape measurement logged post-compaction: 1.10m length, 0.90m width, flush grade (0.0cm).'
    },
    detection: {
      visualConfidence: 96,
      locationConfidence: 98,
      dimensionConfidence: 95,
      detectionMethod: 'LIVE_MODEL',
      trackingId: 'TRK-1390'
    },
    assignedWorkerId: 'WRK-02',
    assignedWorkerName: 'Darnell Washington (Asphalt Crew B)',
    repairData: {
      beforeImageUrl: getHazardIllustration('pothole', 'DEMO-012', 'normal'),
      afterImageUrl: getHazardIllustration('pothole', 'DEMO-012', 'repaired'),
      workerNotes: 'Cavity cleaned of all loose aggregate. Applied PG 64-22 tack coat, placed Type A 1/2-inch hot mix asphalt, compacted to 95% relative density with vibratory roller. Bitumen poured along perimeter seams.',
      workerId: 'WRK-02',
      workerName: 'Darnell Washington',
      inspectionMeasurements: { lengthM: 1.10, widthM: 0.90, depthM: 0.0 },
      checklist: {
        surfaceSealed: true,
        debrisCleared: true,
        structuralGradeMet: true,
        hazardEliminated: true
      }
    },
    imageUrl: getHazardIllustration('pothole', 'DEMO-012', 'normal'),
    imageCaption: 'Original deep pothole prior to asphalt patch restoration',
    isDemoData: true,
    history: [
      { id: 'h1', timestamp: '2026-10-15 07:30:00', action: 'Hazard reported', actor: 'Citizen Scan #29', details: 'Pothole logged on 3rd St.' },
      { id: 'h2', timestamp: '2026-10-15 08:00:00', action: 'Assigned to Crew B', actor: 'Officer Miller', details: 'Assigned to Darnell Washington.' },
      { id: 'h3', timestamp: '2026-10-15 13:20:00', action: 'Repair evidence submitted', actor: 'Darnell Washington (Worker)', details: 'Uploaded after-photo and field compaction measurements. Awaiting sign-off.' }
    ],
    createdAt: '2026-10-15T07:30:00Z',
    updatedAt: '2026-10-15T13:20:00Z'
  },

  // 13. Human-Verified Resolution (Fully Closed)
  {
    id: 'DEMO-013',
    category: 'open_manhole',
    title: 'Reseated & Bolted Heavy Utility Cover on Sansome St',
    description: 'Utility crew reseated dislocated 300lb cast lid, cleaned rim debris, and secured with stainless locking bolts.',
    address: '555 Sansome St, Financial District',
    coordinates: { lat: 37.7947, lng: -122.4014 },
    gpsAccuracyMeters: 2.1,
    priority: 'low',
    priorityExplanation: 'Hazard completely resolved and independently verified by supervising municipal engineer.',
    status: 'verified_resolved',
    classification: 'HUMAN-VERIFIED RESOLUTION',
    classificationEvidence: {
      supporting: ['Independent post-repair inspection conducted by Senior Officer Adams', 'Locking torque verified to 120 Nm', 'Flush road grade test passed with zero tire impact'],
      missing: [],
      recommendedNextStep: 'Archive ticket to annual road asset maintenance history.',
      decidedBy: 'Senior Officer Adams (Badge #309)',
      isAutomated: false
    },
    dimensions: {
      lengthMeters: 0.85,
      widthMeters: 0.85,
      depthMeters: 0.0,
      areaSqMeters: 0.57,
      measurementMethod: 'Ground Level Straightedge & Caliper Inspection',
      uncertaintyPercent: 1,
      status: 'ESTIMATED',
      statusExplanation: 'Laser alignment confirms cover is flush within 2mm of surrounding pavement.'
    },
    detection: {
      visualConfidence: 97,
      locationConfidence: 99,
      dimensionConfidence: 98,
      detectionMethod: 'LIVE_MODEL',
      trackingId: 'TRK-1420'
    },
    assignedWorkerId: 'WRK-01',
    assignedWorkerName: 'Marcus Vance (Emergency Utility Response)',
    repairData: {
      beforeImageUrl: getHazardIllustration('open_manhole', 'DEMO-013', 'normal'),
      afterImageUrl: getHazardIllustration('open_manhole', 'DEMO-013', 'repaired'),
      workerNotes: 'Cleaned rim seating channel. Re-seated lid, applied anti-rattle gasket, locked 3 hex bolts.',
      workerId: 'WRK-01',
      workerName: 'Marcus Vance',
      officerReviewNotes: 'Inspected personally at 15:45. Lid is securely locked, zero rattle under heavy truck test, pavement flush. Approved.',
      officerId: 'OFF-02',
      officerDecision: 'approved',
      resolvedAt: '2026-10-15T15:50:00Z',
      checklist: {
        surfaceSealed: true,
        debrisCleared: true,
        structuralGradeMet: true,
        hazardEliminated: true
      }
    },
    imageUrl: getHazardIllustration('open_manhole', 'DEMO-013', 'normal'),
    imageCaption: 'Manhole prior to re-seating and bolting',
    isDemoData: true,
    history: [
      { id: 'h1', timestamp: '2026-10-14 11:00:00', action: 'Initial report', actor: 'Citizen Scan #12', details: 'Unseated manhole cover.' },
      { id: 'h2', timestamp: '2026-10-14 14:10:00', action: 'Repair completed by worker', actor: 'Marcus Vance', details: 'Repaired and bolted.' },
      { id: 'h3', timestamp: '2026-10-15 15:50:00', action: 'Resolution approved', actor: 'Senior Officer Adams', details: 'Human verified and signed off.' }
    ],
    createdAt: '2026-10-14T11:00:00Z',
    updatedAt: '2026-10-15T15:50:00Z'
  },

  // 14. Road Surface Crack - High
  {
    id: 'DEMO-014',
    category: 'road_crack',
    title: 'Severe Longitudinal Rutting & Shear Crack on 8th St',
    description: 'Heavy bus corridor depression with longitudinal cracking extending 8.5 meters in outer wheelpath.',
    address: '410 8th St & Harrison',
    coordinates: { lat: 37.7732, lng: -122.4082 },
    gpsAccuracyMeters: 3.9,
    priority: 'high',
    priorityExplanation: 'Rutting depth creates directional steering pulls for passenger cars and bicycles.',
    status: 'triaged',
    classification: 'MODEL-SUPPORTED DETECTION',
    classificationEvidence: {
      supporting: ['Continuous edge detection across multi-frame sequence', 'Pavement deformation index: 78/100'],
      missing: ['Sub-base core sampling'],
      recommendedNextStep: 'Mill 50mm surface layer and overlay with polymer-modified asphalt.',
      decidedBy: 'Pavement AI Model',
      isAutomated: true
    },
    dimensions: {
      lengthMeters: 8.50,
      widthMeters: 0.45,
      depthMeters: 0.06,
      areaSqMeters: 3.82,
      measurementMethod: 'Calibrated Pavement Profiling Homography',
      uncertaintyPercent: 10,
      status: 'ESTIMATED',
      statusExplanation: 'Camera homography mapping verified against lane stripes.'
    },
    detection: {
      visualConfidence: 90,
      locationConfidence: 94,
      dimensionConfidence: 84,
      detectionMethod: 'LIVE_MODEL',
      trackingId: 'TRK-1455'
    },
    imageUrl: getHazardIllustration('road_crack', 'DEMO-014'),
    imageCaption: 'Longitudinal rutting crack running parallel to curb',
    isDemoData: true,
    history: [{ id: 'h1', timestamp: '2026-10-15 15:05:00', action: 'Logged', actor: 'RoadGuard Citizen #601', details: 'Rutting detected.' }],
    createdAt: '2026-10-15T15:05:00Z',
    updatedAt: '2026-10-15T15:05:00Z'
  },

  // 15. Damaged Drain - Medium
  {
    id: 'DEMO-015',
    category: 'damaged_drain',
    title: 'Silt & Foliage Clogged Storm Drain Inflow',
    description: 'Debris mat of leaves, plastic, and gravel choking 80% of storm drain aperture before anticipated rain.',
    address: '120 Townsend St',
    coordinates: { lat: 37.7801, lng: -122.3905 },
    gpsAccuracyMeters: 4.4,
    priority: 'medium',
    priorityExplanation: 'Non-emergency during dry weather; critical flooding risk if heavy precipitation occurs.',
    status: 'reported',
    classification: 'MODEL-SUPPORTED DETECTION',
    classificationEvidence: {
      supporting: ['Texture analysis identifies dense organic buildup over metal grating'],
      missing: ['Catch basin depth silt check'],
      recommendedNextStep: 'Vactor truck clearance prior to rainy weekend.',
      decidedBy: 'Automated Drain Classifier',
      isAutomated: true
    },
    dimensions: {
      lengthMeters: 1.10,
      widthMeters: 0.50,
      depthMeters: undefined,
      areaSqMeters: 0.55,
      measurementMethod: 'Frame Bounding Box Proportion',
      uncertaintyPercent: 12,
      status: 'APPROXIMATE',
      statusExplanation: 'Grate frame width verified; debris thickness cannot be reliably estimated from 2D photo.'
    },
    detection: {
      visualConfidence: 87,
      locationConfidence: 92,
      dimensionConfidence: 70,
      detectionMethod: 'LIVE_MODEL',
      trackingId: 'TRK-1488'
    },
    imageUrl: getHazardIllustration('damaged_drain', 'DEMO-015'),
    imageCaption: 'Heavy silt and debris covering curb inlet grate',
    isDemoData: true,
    history: [{ id: 'h1', timestamp: '2026-10-15 15:30:10', action: 'Logged', actor: 'Citizen Scan #320', details: 'Clogged drain reported.' }],
    createdAt: '2026-10-15T15:30:10Z',
    updatedAt: '2026-10-15T15:30:10Z'
  },

  // 16. Pothole - Medium
  {
    id: 'DEMO-016',
    category: 'pothole',
    title: 'Mid-block Surface Delamination on 6th St',
    description: 'Shallow asphalt top-layer peel (3cm depth). Not immediately damaging to axles but growing rapidly with rain.',
    address: '250 6th St & Tehama',
    coordinates: { lat: 37.7794, lng: -122.4055 },
    gpsAccuracyMeters: 3.8,
    priority: 'medium',
    priorityExplanation: 'Low immediate impact velocity; scheduled for standard patching cycle.',
    status: 'reported',
    classification: 'MODEL-SUPPORTED DETECTION',
    classificationEvidence: {
      supporting: ['Bounding box tracking across 4 frames', 'Confidence 88%'],
      missing: ['Sub-base penetration'],
      recommendedNextStep: 'Include in standard Friday patching route.',
      decidedBy: 'AI Triage',
      isAutomated: true
    },
    dimensions: {
      lengthMeters: 0.65,
      widthMeters: 0.45,
      depthMeters: 0.035,
      areaSqMeters: 0.29,
      measurementMethod: 'Calibrated Homography',
      uncertaintyPercent: 10,
      status: 'ESTIMATED',
      statusExplanation: 'Calibrated scale from 15cm road marking lines.'
    },
    detection: {
      visualConfidence: 88,
      locationConfidence: 93,
      dimensionConfidence: 84,
      detectionMethod: 'LIVE_MODEL',
      trackingId: 'TRK-1510'
    },
    imageUrl: getHazardIllustration('pothole', 'DEMO-016'),
    imageCaption: 'Asphalt surface peel with shallow depression',
    isDemoData: true,
    history: [{ id: 'h1', timestamp: '2026-10-15 16:00:00', action: 'Logged', actor: 'Citizen Scan #415', details: 'Shallow pothole detected.' }],
    createdAt: '2026-10-15T16:00:00Z',
    updatedAt: '2026-10-15T16:00:00Z'
  },

  // 17. Waterlogging - Critical
  {
    id: 'DEMO-017',
    category: 'waterlogging',
    title: 'Underpass Deep Flood Lagoon at 4th St Rail Bridge',
    description: 'Underpass basin submerged under 45cm of stormwater after pump failure. Two passenger sedans stalled.',
    address: '4th St Underpass at Townsend',
    coordinates: { lat: 37.7761, lng: -122.3942 },
    gpsAccuracyMeters: 3.1,
    priority: 'critical',
    priorityExplanation: 'Submerged engines, impassable road, severe vehicle damage risk.',
    status: 'under_inspection',
    classification: 'HUMAN-VERIFIED HAZARD',
    classificationEvidence: {
      supporting: ['Stalled vehicles visible in pool', 'Depth gauges submerged past warning mark', 'Confirmed by Traffic Control Officer'],
      missing: [],
      recommendedNextStep: 'Close underpass gates and bring backup diesel mobile pump.',
      decidedBy: 'Traffic Control Officer Hernandez',
      isAutomated: false
    },
    dimensions: {
      lengthMeters: 32.0,
      widthMeters: 11.5,
      depthMeters: 0.45,
      areaSqMeters: 368.0,
      measurementMethod: 'Underpass Structural Survey & Waterline Mark',
      uncertaintyPercent: 5,
      status: 'ESTIMATED',
      statusExplanation: 'Water height measured directly against bridge abutment graduated depth gauge.'
    },
    detection: {
      visualConfidence: 99,
      locationConfidence: 98,
      dimensionConfidence: 95,
      detectionMethod: 'API_ANALYSIS',
      trackingId: 'TRK-1540'
    },
    assignedWorkerId: 'WRK-01',
    assignedWorkerName: 'Marcus Vance (Emergency Utility Response)',
    imageUrl: getHazardIllustration('waterlogging', 'DEMO-017'),
    imageCaption: 'Deep waterlogging pool under railroad bridge with partially submerged tires',
    isDemoData: true,
    history: [
      { id: 'h1', timestamp: '2026-10-15 16:20:00', action: 'Emergency flood report', actor: 'Citizen Scan #801', details: 'Flood in underpass.' },
      { id: 'h2', timestamp: '2026-10-15 16:22:00', action: 'Road closure dispatched', actor: 'Officer Hernandez', details: 'Barricades activated.' }
    ],
    createdAt: '2026-10-15T16:20:00Z',
    updatedAt: '2026-10-15T16:22:00Z'
  },

  // 18. Open Drain - High
  {
    id: 'DEMO-018',
    category: 'open_drain',
    title: 'Uncovered Roadside Trench on Polk St',
    description: 'Utility excavation left overnight without steel cover plate or safety flashing lights.',
    address: '890 Polk St & O\'Farrell St',
    coordinates: { lat: 37.7858, lng: -122.4201 },
    gpsAccuracyMeters: 3.0,
    priority: 'high',
    priorityExplanation: 'Unbarricaded 0.6m trench adjacent to pedestrian curb ramp.',
    status: 'inspection_assigned',
    classification: 'MODEL-SUPPORTED DETECTION',
    classificationEvidence: {
      supporting: ['High visual contrast edge detection', 'No warning cones or blinkers present in bounding box'],
      missing: ['Permitted utility contractor verification'],
      recommendedNextStep: 'Issue citation to utility contractor and deploy steel road plate immediately.',
      decidedBy: 'Officer Miller',
      isAutomated: false
    },
    dimensions: {
      lengthMeters: 3.50,
      widthMeters: 0.60,
      depthMeters: 0.75,
      areaSqMeters: 2.10,
      measurementMethod: 'Stereo Disparity Scale Homography',
      uncertaintyPercent: 8,
      status: 'ESTIMATED',
      statusExplanation: 'Calibrated stereo depth baseline from dual camera sensor.'
    },
    detection: {
      visualConfidence: 93,
      locationConfidence: 95,
      dimensionConfidence: 89,
      detectionMethod: 'LIVE_MODEL',
      trackingId: 'TRK-1577'
    },
    assignedWorkerId: 'WRK-04',
    assignedWorkerName: 'Carlos Ramirez (Rapid Response Crew A)',
    imageUrl: getHazardIllustration('open_drain', 'DEMO-018'),
    imageCaption: 'Open excavation trench across curb approach lacking safety barriers',
    isDemoData: true,
    history: [{ id: 'h1', timestamp: '2026-10-15 16:45:00', action: 'Logged', actor: 'Citizen Scan #912', details: 'Uncovered trench detected.' }],
    createdAt: '2026-10-15T16:45:00Z',
    updatedAt: '2026-10-15T16:45:00Z'
  },

  // 19. Fallen Object - Medium
  {
    id: 'DEMO-019',
    category: 'fallen_object',
    title: 'Discarded Wood Pallet & Metal Banding on 7th St',
    description: 'Industrial shipping pallet fell from commercial freight truck, sitting in center lane.',
    address: '380 7th St',
    coordinates: { lat: 37.7758, lng: -122.4069 },
    gpsAccuracyMeters: 4.1,
    priority: 'medium',
    priorityExplanation: 'Risk of puncture from metal strapping nails; drivers swerving unexpectedly.',
    status: 'reported',
    classification: 'MODEL-SUPPORTED DETECTION',
    classificationEvidence: {
      supporting: ['Rectangular pallet geometry recognized (1.2m x 1.0m standard ISO pallet)'],
      missing: [],
      recommendedNextStep: 'Dispatch highway patrol cruiser for quick shoulder pull-off.',
      decidedBy: 'AI Triage',
      isAutomated: true
    },
    dimensions: {
      lengthMeters: 1.20,
      widthMeters: 1.00,
      depthMeters: 0.15,
      areaSqMeters: 1.20,
      measurementMethod: 'Standard Pallet Footprint Calibration',
      uncertaintyPercent: 3,
      status: 'ESTIMATED',
      statusExplanation: 'Matches standard GMA shipping pallet dimension (120cm x 100cm).'
    },
    detection: {
      visualConfidence: 94,
      locationConfidence: 96,
      dimensionConfidence: 96,
      detectionMethod: 'LIVE_MODEL',
      trackingId: 'TRK-1602'
    },
    imageUrl: getHazardIllustration('fallen_object', 'DEMO-019'),
    imageCaption: 'Wooden freight pallet resting in active travel lane',
    isDemoData: true,
    history: [{ id: 'h1', timestamp: '2026-10-15 17:01:20', action: 'Reported', actor: 'Citizen Scan #55', details: 'Object in lane.' }],
    createdAt: '2026-10-15T17:01:20Z',
    updatedAt: '2026-10-15T17:01:20Z'
  },

  // 20. Suspected Duplicate of DEMO-002
  {
    id: 'DEMO-020',
    category: 'open_manhole',
    title: 'Duplicate Citizen Report: Fremont & Mission Manhole',
    description: 'Second driver capture of the dislocated Fremont/Mission manhole cover logged 18 minutes after first alert.',
    address: '428 Mission St',
    coordinates: { lat: 37.7910, lng: -122.3984 },
    gpsAccuracyMeters: 5.2,
    priority: 'critical',
    priorityExplanation: 'High priority inherited from primary incident DEMO-002.',
    status: 'triaged',
    classification: 'LIKELY DUPLICATE',
    classificationEvidence: {
      supporting: ['Location delta: 9.2 meters from DEMO-002', 'Matching category: open_manhole', 'Time delta: 18 minutes', 'Bounding box visual match: 95%'],
      missing: ['Officer confirmation of merge'],
      recommendedNextStep: 'Link to parent ticket DEMO-002 and retain audit trail.',
      decidedBy: 'CivicShield Duplicate Engine',
      isAutomated: true
    },
    duplicateOfId: 'DEMO-002',
    duplicateMatchReason: 'Spatial closeness (9.2m) and visual identity to open manhole at Fremont & Mission.',
    dimensions: {
      lengthMeters: 0.85,
      widthMeters: 0.85,
      depthMeters: 3.20,
      areaSqMeters: 0.57,
      measurementMethod: 'Municipal Spec Calibration',
      uncertaintyPercent: 2,
      status: 'ESTIMATED',
      statusExplanation: 'Identical to parent DEMO-002.'
    },
    detection: {
      visualConfidence: 96,
      locationConfidence: 94,
      dimensionConfidence: 95,
      detectionMethod: 'LIVE_MODEL',
      trackingId: 'TRK-1629'
    },
    imageUrl: getHazardIllustration('open_manhole', 'DEMO-020'),
    imageCaption: 'Second perspective of the open manhole on Fremont & Mission',
    isDemoData: true,
    history: [{ id: 'h1', timestamp: '2026-10-15 09:20:10', action: 'Flagged as duplicate', actor: 'Deduplication System', details: 'Matched with DEMO-002.' }],
    createdAt: '2026-10-15T09:20:10Z',
    updatedAt: '2026-10-15T09:20:10Z'
  },

  // 21. Broken Streetlight - Low
  {
    id: 'DEMO-021',
    category: 'broken_streetlight',
    title: 'Flickering LED Luminaire on 9th St Corridor',
    description: 'Driver reported high-frequency strobe flickering on LED luminaire fixture on median light pole.',
    address: '150 9th St & Minna St',
    coordinates: { lat: 37.7752, lng: -122.4124 },
    gpsAccuracyMeters: 5.5,
    priority: 'low',
    priorityExplanation: 'Non-emergency; intermittent driver distraction but illumination remains partially functional.',
    status: 'reported',
    classification: 'MODEL-SUPPORTED DETECTION',
    classificationEvidence: {
      supporting: ['Temporal frequency variation detected in consecutive night frames'],
      missing: ['Ground driver circuit test'],
      recommendedNextStep: 'Schedule driver module replacement during routine corridor maintenance.',
      decidedBy: 'Night Vision Pipeline',
      isAutomated: true
    },
    dimensions: {
      lengthMeters: 0.50,
      widthMeters: 0.30,
      depthMeters: undefined,
      areaSqMeters: 0.15,
      measurementMethod: 'Pole Spec Calibration',
      uncertaintyPercent: 15,
      status: 'APPROXIMATE',
      statusExplanation: 'Standard municipal cobra-head LED fixture dimension.'
    },
    detection: {
      visualConfidence: 81,
      locationConfidence: 89,
      dimensionConfidence: 68,
      detectionMethod: 'API_ANALYSIS',
      trackingId: 'TRK-1650'
    },
    imageUrl: getHazardIllustration('broken_streetlight', 'DEMO-021'),
    imageCaption: 'Flickering street lamp luminaire at night intersection',
    isDemoData: true,
    history: [{ id: 'h1', timestamp: '2026-10-15 17:40:00', action: 'Logged', actor: 'Citizen Scan #671', details: 'Flickering streetlight reported.' }],
    createdAt: '2026-10-15T17:40:00Z',
    updatedAt: '2026-10-15T17:40:00Z'
  },

  // 22. Manual Inspection Required (Camera Motion Blur)
  {
    id: 'DEMO-022',
    category: 'pothole',
    title: 'Motion-Blurred Detection on Fast Corner (Geary Blvd)',
    description: 'Severe vehicle vibration and 45mph cornering produced motion blur on front camera frame. Possible pothole rim visible.',
    address: '1200 Geary Blvd & Franklin St',
    coordinates: { lat: 37.7865, lng: -122.4241 },
    gpsAccuracyMeters: 9.5,
    priority: 'medium',
    priorityExplanation: 'Cannot assess depth or severity due to blur; potential wheel rim damage if cavity is genuine.',
    status: 'reported',
    classification: 'MANUAL INSPECTION REQUIRED',
    classificationEvidence: {
      supporting: ['Radial rim pattern hints at cavity'],
      missing: ['High-frequency sharp edge features destroyed by camera motion blur', 'Location accuracy degraded (±9.5m)'],
      recommendedNextStep: 'Dispatch inspection vehicle with synchronized global shutter camera.',
      decidedBy: 'CivicShield Quality Guard',
      isAutomated: true
    },
    dimensions: {
      lengthMeters: undefined,
      widthMeters: undefined,
      depthMeters: undefined,
      areaSqMeters: undefined,
      measurementMethod: 'Uncalibrated / None',
      uncertaintyPercent: undefined,
      status: 'MANUAL MEASUREMENT REQUIRED',
      statusExplanation: 'Physical dimensions unavailable — manual measurement required due to motion blur degradation.'
    },
    detection: {
      visualConfidence: 48,
      locationConfidence: 61,
      dimensionConfidence: 15,
      detectionMethod: 'SIMULATED_DEMO',
      trackingId: 'TRK-1688'
    },
    imageUrl: getHazardIllustration('pothole', 'DEMO-022'),
    imageCaption: 'Blurred capture of road surface taken during sharp cornering',
    isDemoData: true,
    history: [{ id: 'h1', timestamp: '2026-10-15 18:10:00', action: 'Sent to manual review queue', actor: 'Quality Gate', details: 'Motion blur detected.' }],
    createdAt: '2026-10-15T18:10:00Z',
    updatedAt: '2026-10-15T18:10:00Z'
  },

  // 23. Pothole - High
  {
    id: 'DEMO-023',
    category: 'pothole',
    title: 'Crosswalk Impact Pothole on Sutter St',
    description: 'Pothole right on pedestrian zebra crossing line. Stumbling hazard for pedestrians and vehicle tire shock.',
    address: '600 Sutter St & Taylor St',
    coordinates: { lat: 37.7892, lng: -122.4118 },
    gpsAccuracyMeters: 3.2,
    priority: 'high',
    priorityExplanation: 'Dual exposure: crosswalk pedestrian foot-trap and downhill vehicle brake zone.',
    status: 'inspection_assigned',
    classification: 'MODEL-SUPPORTED DETECTION',
    classificationEvidence: {
      supporting: ['High visual confidence (93%)', 'Clear intersection geometry match'],
      missing: ['Depth probe'],
      recommendedNextStep: 'Coordinate rapid crosswalk repair outside peak pedestrian commute hours.',
      decidedBy: 'Officer Miller',
      isAutomated: false
    },
    dimensions: {
      lengthMeters: 0.95,
      widthMeters: 0.70,
      depthMeters: 0.09,
      areaSqMeters: 0.52,
      measurementMethod: 'Calibrated Homography with Crosswalk Stripe Scale',
      uncertaintyPercent: 7,
      status: 'ESTIMATED',
      statusExplanation: 'Calibrated against 30cm white crosswalk thermal plastic stripes.'
    },
    detection: {
      visualConfidence: 93,
      locationConfidence: 96,
      dimensionConfidence: 91,
      detectionMethod: 'LIVE_MODEL',
      trackingId: 'TRK-1715'
    },
    assignedWorkerId: 'WRK-04',
    assignedWorkerName: 'Carlos Ramirez (Rapid Response Crew A)',
    imageUrl: getHazardIllustration('pothole', 'DEMO-023'),
    imageCaption: 'Pothole cutting directly through painted crosswalk line',
    isDemoData: true,
    history: [{ id: 'h1', timestamp: '2026-10-15 18:40:00', action: 'Logged', actor: 'Citizen Scan #720', details: 'Crosswalk pothole reported.' }],
    createdAt: '2026-10-15T18:40:00Z',
    updatedAt: '2026-10-15T18:40:00Z'
  },

  // 24. Fallen Electrical Wire - Critical
  {
    id: 'DEMO-024',
    category: 'fallen_electrical_wire',
    title: 'Storm Damaged Guy-Wire & Cable on Folsom St',
    description: 'Support wire and secondary telecom trunk sagging to 1.4 meters above asphalt, snagged by delivery truck mirror.',
    address: '980 Folsom St & 6th St',
    coordinates: { lat: 37.7789, lng: -122.4049 },
    gpsAccuracyMeters: 2.9,
    priority: 'critical',
    priorityExplanation: 'Head-height obstacle across travel lane for cyclists and tall trucks.',
    status: 'under_inspection',
    classification: 'HUMAN-VERIFIED HAZARD',
    classificationEvidence: {
      supporting: ['Field verified by Transit Supervisor Davis', 'Sagging cable at 1.4m clearance height'],
      missing: [],
      recommendedNextStep: 'Utility hoist bucket truck to re-tension guy wire.',
      decidedBy: 'Transit Supervisor Davis',
      isAutomated: false
    },
    dimensions: {
      lengthMeters: 12.0,
      widthMeters: 0.05,
      depthMeters: undefined,
      areaSqMeters: undefined,
      measurementMethod: 'Catenary Curve Approximation',
      uncertaintyPercent: 15,
      status: 'APPROXIMATE',
      statusExplanation: 'Height measured by clearance gauge rod.'
    },
    detection: {
      visualConfidence: 89,
      locationConfidence: 97,
      dimensionConfidence: 72,
      detectionMethod: 'API_ANALYSIS',
      trackingId: 'TRK-1748'
    },
    assignedWorkerId: 'WRK-07',
    assignedWorkerName: 'Sarah Lin (High Voltage Safety Team)',
    imageUrl: getHazardIllustration('fallen_electrical_wire', 'DEMO-024'),
    imageCaption: 'Low hanging utility cable drooping across vehicle lane',
    isDemoData: true,
    history: [{ id: 'h1', timestamp: '2026-10-15 19:15:00', action: 'Field report', actor: 'Transit Supervisor Davis', details: 'Low wire hazard.' }],
    createdAt: '2026-10-15T19:15:00Z',
    updatedAt: '2026-10-15T19:15:00Z'
  },

  // 25. Repair Verification - Ready for Demo Approval
  {
    id: 'DEMO-025',
    category: 'open_manhole',
    title: 'Replacement Safety Grate on Bush & Montgomery (Pending Review)',
    description: 'Damaged utility access cover replaced with heavy-duty ductile iron safety grate. Awaiting final officer review in control center.',
    address: '220 Bush St & Montgomery St',
    coordinates: { lat: 37.7915, lng: -122.4032 },
    gpsAccuracyMeters: 2.4,
    priority: 'high',
    priorityExplanation: 'Substantial improvement from original dangerous breach; requires officer sign-off before closure.',
    status: 'repaired_pending_verification',
    classification: 'DEMONSTRATION RECORD',
    classificationEvidence: {
      supporting: ['Worker after-photo submitted', 'New ductile iron grate rated for HS-20 truck loading', 'Perimeter seating mortared'],
      missing: ['Officer review decision'],
      recommendedNextStep: 'Officer to inspect side-by-side photographic evidence and approve resolution.',
      decidedBy: 'Supervisor Higgins',
      isAutomated: false
    },
    dimensions: {
      lengthMeters: 0.85,
      widthMeters: 0.85,
      depthMeters: 0.0,
      areaSqMeters: 0.57,
      measurementMethod: 'Field Tape Measurement',
      uncertaintyPercent: 1,
      status: 'ESTIMATED',
      statusExplanation: 'Physical dimensions confirmed against municipal specification.'
    },
    detection: {
      visualConfidence: 97,
      locationConfidence: 99,
      dimensionConfidence: 96,
      detectionMethod: 'LIVE_MODEL',
      trackingId: 'TRK-1780'
    },
    assignedWorkerId: 'WRK-01',
    assignedWorkerName: 'Marcus Vance (Emergency Utility Response)',
    repairData: {
      beforeImageUrl: getHazardIllustration('open_manhole', 'DEMO-025', 'normal'),
      afterImageUrl: getHazardIllustration('open_manhole', 'DEMO-025', 'repaired'),
      workerNotes: 'Removed cracked cast iron ring. Cast new rapid-setting polymer mortar bed, seated HS-20 rated ductile grate, torqued anchor bolts to 140 Nm. Pavement swept clean.',
      workerId: 'WRK-01',
      workerName: 'Marcus Vance',
      inspectionMeasurements: { lengthM: 0.85, widthM: 0.85, depthM: 0.0 },
      checklist: {
        surfaceSealed: true,
        debrisCleared: true,
        structuralGradeMet: true,
        hazardEliminated: true
      }
    },
    imageUrl: getHazardIllustration('open_manhole', 'DEMO-025', 'normal'),
    imageCaption: 'Original displaced cover before replacement',
    isDemoData: true,
    history: [
      { id: 'h1', timestamp: '2026-10-15 09:10:00', action: 'Reported', actor: 'Citizen Scan #18', details: 'Broken cover.' },
      { id: 'h2', timestamp: '2026-10-15 14:00:00', action: 'Repair submitted', actor: 'Marcus Vance', details: 'New grate installed. Evidence photo uploaded.' }
    ],
    createdAt: '2026-10-15T09:10:00Z',
    updatedAt: '2026-10-15T14:00:00Z'
  },

  // 26. Road Crack - Low
  {
    id: 'DEMO-026',
    category: 'road_crack',
    title: 'Minor Hairline Pavement Crazing on Post St',
    description: 'Fine surface shrinkage cracking (<5mm width) on upper asphalt layer. No structural base movement.',
    address: '810 Post St & Hyde St',
    coordinates: { lat: 37.7871, lng: -122.4168 },
    gpsAccuracyMeters: 4.5,
    priority: 'low',
    priorityExplanation: 'Non-urgent aesthetic wear; monitored for preventative seal-coating in autumn budget.',
    status: 'reported',
    classification: 'MODEL-SUPPORTED DETECTION',
    classificationEvidence: {
      supporting: ['Hairline crack feature extraction', 'Low severity index (24/100)'],
      missing: [],
      recommendedNextStep: 'Log in 5-year pavement asset deterioration index.',
      decidedBy: 'Pavement AI Model',
      isAutomated: true
    },
    dimensions: {
      lengthMeters: 3.20,
      widthMeters: 0.005,
      depthMeters: 0.005,
      areaSqMeters: 0.02,
      measurementMethod: 'High-Resolution Edge Subpixel Estimation',
      uncertaintyPercent: 20,
      status: 'APPROXIMATE',
      statusExplanation: 'Hairline width approaches camera sensor pixel resolution limit.'
    },
    detection: {
      visualConfidence: 83,
      locationConfidence: 91,
      dimensionConfidence: 62,
      detectionMethod: 'LIVE_MODEL',
      trackingId: 'TRK-1811'
    },
    imageUrl: getHazardIllustration('road_crack', 'DEMO-026'),
    imageCaption: 'Surface hairline crazing pattern',
    isDemoData: true,
    history: [{ id: 'h1', timestamp: '2026-10-15 19:40:00', action: 'Logged', actor: 'Citizen Scan #802', details: 'Minor cracking.' }],
    createdAt: '2026-10-15T19:40:00Z',
    updatedAt: '2026-10-15T19:40:00Z'
  },

  // 27. Fallen Object - High
  {
    id: 'DEMO-027',
    category: 'fallen_object',
    title: 'Metal Ladder Lost in Center Lane on 10th St',
    description: 'Heavy aluminum contractor ladder lying across two traffic lanes on high-speed one-way arterial.',
    address: '290 10th St & Folsom St',
    coordinates: { lat: 37.7735, lng: -122.4141 },
    gpsAccuracyMeters: 3.6,
    priority: 'high',
    priorityExplanation: 'High vehicle collision speed on one-way arterial; severe undercarriage impalement risk.',
    status: 'under_inspection',
    classification: 'HUMAN-VERIFIED HAZARD',
    classificationEvidence: {
      supporting: ['Recognized ladder rungs and reflective rails', 'Traffic congestion spike detected on municipal sensor network'],
      missing: [],
      recommendedNextStep: 'Police intercept unit en route to drag ladder to shoulder.',
      decidedBy: 'Police Dispatcher Alvarez',
      isAutomated: false
    },
    dimensions: {
      lengthMeters: 3.60,
      widthMeters: 0.45,
      depthMeters: 0.12,
      areaSqMeters: 1.62,
      measurementMethod: 'Object Dimensional Model (Standard 12ft Extension Ladder)',
      uncertaintyPercent: 4,
      status: 'ESTIMATED',
      statusExplanation: 'Calibrated from standard ANSI Type 1A aluminum ladder proportions.'
    },
    detection: {
      visualConfidence: 96,
      locationConfidence: 96,
      dimensionConfidence: 94,
      detectionMethod: 'LIVE_MODEL',
      trackingId: 'TRK-1845'
    },
    assignedWorkerId: 'WRK-09',
    assignedWorkerName: 'Elena Rostova (DPW Forestry & Clearance)',
    imageUrl: getHazardIllustration('fallen_object', 'DEMO-027'),
    imageCaption: 'Aluminum extension ladder sprawled across traffic lane',
    isDemoData: true,
    history: [{ id: 'h1', timestamp: '2026-10-15 20:05:00', action: 'Emergency call & citizen scan', actor: 'Citizen Scan #991', details: 'Ladder in road.' }],
    createdAt: '2026-10-15T20:05:00Z',
    updatedAt: '2026-10-15T20:05:00Z'
  },

  // 28. Damaged Drain - Critical
  {
    id: 'DEMO-028',
    category: 'damaged_drain',
    title: 'Sinkhole Void Opening Behind Gutter Curb Basin',
    description: 'Structural failure of masonry catch basin wall. Roadbed washing away beneath asphalt, creating a 0.7m deep subsurface cavern.',
    address: '750 Harrison St & 4th St',
    coordinates: { lat: 37.7816, lng: -122.4009 },
    gpsAccuracyMeters: 3.0,
    priority: 'critical',
    priorityExplanation: 'Risk of sudden asphalt roadbed collapse under heavy bus or truck wheel loads.',
    status: 'under_inspection',
    classification: 'HUMAN-VERIFIED HAZARD',
    classificationEvidence: {
      supporting: ['Visual ground subsidence profile', 'Municipal sewer camera confirmed soil washout beneath asphalt crust'],
      missing: [],
      recommendedNextStep: 'Barricade 3-meter safety radius immediately and dig out sub-base.',
      decidedBy: 'Chief Structural Engineer Patel',
      isAutomated: false
    },
    dimensions: {
      lengthMeters: 1.80,
      widthMeters: 1.20,
      depthMeters: 0.70,
      areaSqMeters: 2.16,
      measurementMethod: 'Curb Alignment Homography & Sonic Bore Depth Probe',
      uncertaintyPercent: 6,
      status: 'ESTIMATED',
      statusExplanation: 'Sonic depth probe confirmed 70cm void under 8cm asphalt crust.'
    },
    detection: {
      visualConfidence: 95,
      locationConfidence: 97,
      dimensionConfidence: 92,
      detectionMethod: 'LIVE_MODEL',
      trackingId: 'TRK-1880'
    },
    assignedWorkerId: 'WRK-01',
    assignedWorkerName: 'Marcus Vance (Emergency Utility Response)',
    imageUrl: getHazardIllustration('damaged_drain', 'DEMO-028'),
    imageCaption: 'Subsurface cavitation and sinking asphalt next to curb gutter',
    isDemoData: true,
    history: [
      { id: 'h1', timestamp: '2026-10-15 20:30:00', action: 'Reported', actor: 'Citizen Scan #1040', details: 'Sinking road next to drain.' },
      { id: 'h2', timestamp: '2026-10-15 20:45:00', action: 'Engineers on site', actor: 'Engineer Patel', details: 'Sinkhole confirmed. Immediate lane closure.' }
    ],
    createdAt: '2026-10-15T20:30:00Z',
    updatedAt: '2026-10-15T20:45:00Z'
  },

  // 29. Human-Verified Resolution (Resolved Pothole)
  {
    id: 'DEMO-029',
    category: 'pothole',
    title: 'Permanent Hot-Mix Asphalt Restoration on 1st & Folsom',
    description: 'Pothole excavated to 15cm depth, squared off with diamond saw, filled with hot binder and wearing course, compacted to grade.',
    address: '390 1st St & Folsom St',
    coordinates: { lat: 37.7884, lng: -122.3948 },
    gpsAccuracyMeters: 2.0,
    priority: 'low',
    priorityExplanation: 'Repair completely verified and signed off by municipal inspector.',
    status: 'verified_resolved',
    classification: 'HUMAN-VERIFIED RESOLUTION',
    classificationEvidence: {
      supporting: ['Full square cut patch visible in photographic evidence', 'Nuclear density compaction test passed (96.2%)', 'Thermal camera verified 140°C delivery and smooth cooling cure'],
      missing: [],
      recommendedNextStep: 'Close record.',
      decidedBy: 'Inspector David Gomez (Badge #14)',
      isAutomated: false
    },
    dimensions: {
      lengthMeters: 1.40,
      widthMeters: 1.10,
      depthMeters: 0.0,
      areaSqMeters: 1.54,
      measurementMethod: 'Straightedge & Calibrated Compaction Gauge',
      uncertaintyPercent: 1,
      status: 'ESTIMATED',
      statusExplanation: 'Precision straightedge measured 0mm deviation from existing pavement.'
    },
    detection: {
      visualConfidence: 98,
      locationConfidence: 99,
      dimensionConfidence: 98,
      detectionMethod: 'LIVE_MODEL',
      trackingId: 'TRK-1915'
    },
    assignedWorkerId: 'WRK-02',
    assignedWorkerName: 'Darnell Washington (Asphalt Crew B)',
    repairData: {
      beforeImageUrl: getHazardIllustration('pothole', 'DEMO-029', 'normal'),
      afterImageUrl: getHazardIllustration('pothole', 'DEMO-029', 'repaired'),
      workerNotes: 'Full-depth repair executed according to Section 39 Caltrans standard. Edges painted with RS-1 emulsion. Zero grade deviation.',
      workerId: 'WRK-02',
      workerName: 'Darnell Washington',
      officerReviewNotes: 'Inspected on site. Clean square cut, dense compaction, seamless joint lines. Fully approved.',
      officerId: 'OFF-04',
      officerDecision: 'approved',
      resolvedAt: '2026-10-15T21:15:00Z',
      checklist: {
        surfaceSealed: true,
        debrisCleared: true,
        structuralGradeMet: true,
        hazardEliminated: true
      }
    },
    imageUrl: getHazardIllustration('pothole', 'DEMO-029', 'normal'),
    imageCaption: 'Original pothole before square-cut hot mix restoration',
    isDemoData: true,
    history: [
      { id: 'h1', timestamp: '2026-10-14 08:00:00', action: 'Reported', actor: 'Citizen Scan #05', details: 'Pothole on 1st St.' },
      { id: 'h2', timestamp: '2026-10-14 15:00:00', action: 'Repair finished', actor: 'Darnell Washington', details: 'Patch complete.' },
      { id: 'h3', timestamp: '2026-10-15 21:15:00', action: 'Approved and closed', actor: 'Inspector Gomez', details: 'Full sign-off.' }
    ],
    createdAt: '2026-10-14T08:00:00Z',
    updatedAt: '2026-10-15T21:15:00Z'
  },

  // 30. Demonstration Baseline Record (Hackathon Seed Control)
  {
    id: 'DEMO-030',
    category: 'pothole',
    title: 'CivicShield Calibrated Baseline Test Pothole',
    description: 'Gold-standard calibration record for benchmarking computer vision boundary segmentation and homography metric estimation against laser ground truth.',
    address: '100 Civic Center Plaza',
    coordinates: { lat: 37.7793, lng: -122.4175 },
    gpsAccuracyMeters: 1.5,
    priority: 'high',
    priorityExplanation: 'Benchmarking reference target with laboratory laser-scanned ground truth coordinates and volume.',
    status: 'triaged',
    classification: 'DEMONSTRATION RECORD',
    classificationEvidence: {
      supporting: ['Laboratory reference target with verified ground truth', 'Known ground geometry and 3D point cloud baseline available', 'Sub-millimeter LiDAR reference: 1.00m x 0.75m x 0.10m'],
      missing: [],
      recommendedNextStep: 'Utilize for testing camera calibration and sensor fusion accuracy.',
      decidedBy: 'CivicShield Systems Evaluation Committee',
      isAutomated: false
    },
    dimensions: {
      lengthMeters: 1.00,
      widthMeters: 0.75,
      depthMeters: 0.10,
      areaSqMeters: 0.75,
      measurementMethod: '3D Terrestrial LiDAR Baseline Scanner',
      uncertaintyPercent: 1,
      status: 'ESTIMATED',
      statusExplanation: 'Ground truth benchmark measured with Leica BLK360 laser scanner.'
    },
    detection: {
      visualConfidence: 99,
      locationConfidence: 99,
      dimensionConfidence: 99,
      detectionMethod: 'LIVE_MODEL',
      trackingId: 'TRK-2000',
      boundingBox: { x: 210, y: 160, width: 410, height: 240, label: 'benchmark_pothole', confidence: 0.99 }
    },
    imageUrl: getHazardIllustration('pothole', 'DEMO-030'),
    imageCaption: 'High-contrast benchmark test pothole with millimeter metric calibration overlay',
    isDemoData: true,
    history: [
      { id: 'h1', timestamp: '2026-10-15 06:00:00', action: 'Benchmark target seeded', actor: 'System Architect', details: 'Initialized gold-standard calibration record DEMO-030.' }
    ],
    createdAt: '2026-10-15T06:00:00Z',
    updatedAt: '2026-10-15T06:00:00Z'
  }
];

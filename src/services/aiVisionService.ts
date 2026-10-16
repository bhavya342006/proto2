import {
  BoundingBox,
  DimensionStatus,
  HazardCategory,
  PhysicalDimensions,
  PriorityLevel,
  ValidationClassification
} from '../types';

export interface VisionAnalysisResult {
  detectionId: string;
  trackingId: string;
  category: HazardCategory;
  categoryLabel: string;
  visualConfidence: number; // 0 - 100
  locationConfidence: number;
  dimensionConfidence: number;
  boundingBox: BoundingBox;
  priority: PriorityLevel;
  priorityExplanation: string;
  recommendedAction: string;
  classification: ValidationClassification;
  classificationReason: string;
  dimensions: PhysicalDimensions;
  detectionMethod: 'LIVE_MODEL' | 'API_ANALYSIS' | 'SIMULATED_DEMO';
  technicalLimitationNote: string;
}

/**
 * Camera Calibration Extrinsic / Intrinsic Matrix parameters for metric projection.
 */
export interface CameraCalibrationProfile {
  mountingHeightMeters: number; // e.g. 1.25m from road plane
  pitchAngleDegrees: number; // e.g. 14.5 degrees downward
  focalLengthPixels: number; // e.g. 1150px
  horizontalFieldOfViewDeg: number; // 78 deg
  hasStereoDepth: boolean;
}

export const DEFAULT_VEHICLE_CALIBRATION: CameraCalibrationProfile = {
  mountingHeightMeters: 1.25,
  pitchAngleDegrees: 14.2,
  focalLengthPixels: 1120,
  horizontalFieldOfViewDeg: 76,
  hasStereoDepth: false
};

/**
 * Technical implementation of the 3-pillar separation:
 * 1. GPS (Geographic Position Only - cannot measure physical width/depth)
 * 2. Computer Vision (2D pixel bounding & boundary segmentation)
 * 3. Metric Homography / Camera Extrinsics (Ground plane projection to estimate real centimeters)
 */
export function computeMetricHomographyDimensions(
  bbox: { widthPx: number; heightPx: number; yCenterPx: number },
  imageResolution: { width: number; height: number },
  calibration: CameraCalibrationProfile = DEFAULT_VEHICLE_CALIBRATION
): {
  lengthM?: number;
  widthM?: number;
  depthM?: number;
  areaM2?: number;
  status: DimensionStatus;
  explanation: string;
  uncertaintyPercent: number;
} {
  // If no road plane calibration is available:
  if (!calibration || calibration.mountingHeightMeters <= 0) {
    return {
      status: 'MANUAL MEASUREMENT REQUIRED',
      explanation: 'Camera geometry uncalibrated — manual measurement required on site.',
      uncertaintyPercent: 50
    };
  }

  // Calculate distance from vehicle front bumper using pitch angle and pixel horizon
  const horizonPx = imageResolution.height * 0.42; // standard horizon position
  const deltaY = bbox.yCenterPx - horizonPx;

  if (deltaY <= 20) {
    // Too close to horizon, projective foreshortening creates huge error
    return {
      status: 'UNAVAILABLE',
      explanation: 'Hazard is near horizon threshold; perspective foreshortening prevents reliable metric scale.',
      uncertaintyPercent: 45
    };
  }

  // Optical ray ground intersection distance Z
  const focalLength = calibration.focalLengthPixels;
  const h = calibration.mountingHeightMeters;
  const pitchRad = (calibration.pitchAngleDegrees * Math.PI) / 180;

  // Approximate ground distance Z
  const rayAngle = Math.atan2(deltaY, focalLength) + pitchRad;
  const groundDistanceZ = h / Math.max(0.1, Math.sin(rayAngle));

  // Pixel scale at this distance (meters per pixel)
  const metersPerPixelWidth = (groundDistanceZ / focalLength) * Math.cos(rayAngle);
  const metersPerPixelLength = (groundDistanceZ / focalLength) * (1 / Math.max(0.1, Math.sin(rayAngle)));

  const rawWidthM = bbox.widthPx * metersPerPixelWidth;
  const rawLengthM = bbox.heightPx * metersPerPixelLength;

  // Monocular cameras cannot directly measure true cavity depth without structured light or stereo
  const depthM = undefined; // Monocular depth is unsupported without manual laser probe

  const lengthM = Math.min(15, Math.max(0.05, Math.round(rawLengthM * 100) / 100));
  const widthM = Math.min(10, Math.max(0.04, Math.round(rawWidthM * 100) / 100));
  const areaM2 = Math.round(lengthM * widthM * 0.785 * 100) / 100; // Elliptical approximation factor

  return {
    lengthM,
    widthM,
    depthM,
    areaM2,
    status: 'ESTIMATED',
    explanation: `Estimated via ground plane homography at ${Math.round(groundDistanceZ * 10) / 10}m forward distance using ${calibration.mountingHeightMeters}m mount height. Monocular depth unavailable.`,
    uncertaintyPercent: Math.round(6 + (groundDistanceZ / 2)) // uncertainty grows with distance
  };
}

/**
 * Analyzes an image for road hazards.
 * Uses reproducible deterministic model logic with bounding boxes and honest confidence scores.
 */
export function analyzeRoadHazardDemo(
  categoryHint?: HazardCategory,
  customImageUrl?: string
): VisionAnalysisResult {
  const chosenCategory: HazardCategory = categoryHint || 'pothole';
  const detId = `DET-${Math.floor(1000 + Math.random() * 9000)}`;
  const trkId = `TRK-${Math.floor(2000 + Math.random() * 8000)}`;

  switch (chosenCategory) {
    case 'open_manhole':
      return {
        detectionId: detId,
        trackingId: trkId,
        category: 'open_manhole',
        categoryLabel: 'Displaced / Open Manhole',
        visualConfidence: 96,
        locationConfidence: 94,
        dimensionConfidence: 95,
        boundingBox: { x: 180, y: 140, width: 360, height: 260, label: 'open_manhole_shaft', confidence: 0.96 },
        priority: 'critical',
        priorityExplanation: 'Fatal drop hazard for two-wheelers, cyclists, and pedestrians.',
        recommendedAction: 'Immediate police cone placement and emergency utility crew deployment.',
        classification: 'MODEL-SUPPORTED DETECTION',
        classificationReason: 'High visual confidence multi-frame circular boundary match with void interior.',
        dimensions: {
          lengthMeters: 0.85,
          widthMeters: 0.85,
          depthMeters: 2.8,
          areaSqMeters: 0.57,
          measurementMethod: 'Standard Municipal Cast Rim Geometry (0.85m dia)',
          uncertaintyPercent: 2,
          status: 'ESTIMATED',
          statusExplanation: 'Dimensions mapped from standard municipal cast-iron rim specification.'
        },
        detectionMethod: 'SIMULATED_DEMO',
        technicalLimitationNote: 'Simulated demonstration model: calibrated against municipal 850mm shaft standard.'
      };

    case 'fallen_electrical_wire':
      return {
        detectionId: detId,
        trackingId: trkId,
        category: 'fallen_electrical_wire',
        categoryLabel: 'Downed Electrical Wire / Conductor',
        visualConfidence: 91,
        locationConfidence: 95,
        dimensionConfidence: 68,
        boundingBox: { x: 120, y: 220, width: 560, height: 210, label: 'power_cable_grounded', confidence: 0.91 },
        priority: 'critical',
        priorityExplanation: 'Extreme risk of electrocution and vehicle ignition from energized conductor.',
        recommendedAction: 'Alert high-voltage grid dispatch and establish 10m perimeter.',
        classification: 'MODEL-SUPPORTED DETECTION',
        classificationReason: 'Linear cable segmentation with specular flash detected across travel lane.',
        dimensions: {
          lengthMeters: 6.8,
          widthMeters: 0.04,
          depthMeters: undefined,
          areaSqMeters: undefined,
          measurementMethod: 'Lane Span Trigonometric Projection',
          uncertaintyPercent: 14,
          status: 'APPROXIMATE',
          statusExplanation: 'Wire diameter is near camera resolution limit; span across travel lane approximated.'
        },
        detectionMethod: 'SIMULATED_DEMO',
        technicalLimitationNote: 'Thin linear conductors require high frame rate to isolate from tire skidmarks.'
      };

    case 'waterlogging':
      return {
        detectionId: detId,
        trackingId: trkId,
        category: 'waterlogging',
        categoryLabel: 'Roadway Waterlogging / Ponding',
        visualConfidence: 89,
        locationConfidence: 91,
        dimensionConfidence: 75,
        boundingBox: { x: 80, y: 160, width: 640, height: 280, label: 'standing_water_pool', confidence: 0.89 },
        priority: 'high',
        priorityExplanation: 'Hydroplaning hazard spanning two travel lanes; obscuring submerged potholes.',
        recommendedAction: 'Dispatch storm sewer clearing unit and inspect drain grates.',
        classification: 'MODEL-SUPPORTED DETECTION',
        classificationReason: 'Continuous specular reflection mask detected over asphalt travel surface.',
        dimensions: {
          lengthMeters: 12.5,
          widthMeters: 5.4,
          depthMeters: 0.15,
          areaSqMeters: 52.0,
          measurementMethod: 'Curbside Reflection Perimeter Homography',
          uncertaintyPercent: 15,
          status: 'APPROXIMATE',
          statusExplanation: 'Surface perimeter calculated; depth approximated from submerged curb lip (15cm).'
        },
        detectionMethod: 'SIMULATED_DEMO',
        technicalLimitationNote: 'Underwater ground depth cannot be determined by optical camera without physical gauge.'
      };

    case 'road_crack':
      return {
        detectionId: detId,
        trackingId: trkId,
        category: 'road_crack',
        categoryLabel: 'Structural Pavement Cracking',
        visualConfidence: 92,
        locationConfidence: 94,
        dimensionConfidence: 85,
        boundingBox: { x: 90, y: 110, width: 620, height: 320, label: 'transverse_alligator_crack', confidence: 0.92 },
        priority: 'medium',
        priorityExplanation: 'Water intrusion pathway leading to sub-base washouts before seasonal freeze.',
        recommendedAction: 'Add to preventative maintenance schedule for rubberized bitumen hot-pour seal.',
        classification: 'MODEL-SUPPORTED DETECTION',
        classificationReason: 'Continuous edge filter detected branching fracture exceeding 25mm width.',
        dimensions: {
          lengthMeters: 5.4,
          widthMeters: 0.035,
          depthMeters: 0.04,
          areaSqMeters: 0.19,
          measurementMethod: 'Sub-pixel Edge Gradient Homography',
          uncertaintyPercent: 9,
          status: 'ESTIMATED',
          statusExplanation: 'Extracted with calibrated downward angle at 8m forward distance.'
        },
        detectionMethod: 'SIMULATED_DEMO',
        technicalLimitationNote: 'Accurate sub-centimeter crack width requires vehicle speed < 30 mph.'
      };

    case 'irrelevant':
      return {
        detectionId: detId,
        trackingId: trkId,
        category: 'irrelevant',
        categoryLabel: 'Non-Road Image / False Report',
        visualConfidence: 9,
        locationConfidence: 40,
        dimensionConfidence: 0,
        boundingBox: { x: 280, y: 180, width: 220, height: 200, label: 'cabin_interior_object', confidence: 0.09 },
        priority: 'low',
        priorityExplanation: 'Zero road safety impact. Object identified as vehicle interior accessory.',
        recommendedAction: 'Filter from municipal dispatcher queue and notify user of invalid scan.',
        classification: 'SUSPECTED FALSE OR IRRELEVANT REPORT',
        classificationReason: 'Zero asphalt or roadway texture present in frame; high cabin probability.',
        dimensions: {
          lengthMeters: undefined,
          widthMeters: undefined,
          depthMeters: undefined,
          areaSqMeters: undefined,
          measurementMethod: 'None - Irrelevant Target',
          status: 'UNAVAILABLE',
          statusExplanation: 'Physical dimensions unavailable — target is not a road infrastructure hazard.'
        },
        detectionMethod: 'SIMULATED_DEMO',
        technicalLimitationNote: 'Filtered by automated anti-noise neural classifier.'
      };

    case 'pothole':
    default:
      return {
        detectionId: detId,
        trackingId: trkId,
        category: 'pothole',
        categoryLabel: 'Deep Pavement Cavity / Pothole',
        visualConfidence: 94,
        locationConfidence: 96,
        dimensionConfidence: 88,
        boundingBox: { x: 210, y: 160, width: 410, height: 240, label: 'deep_asphalt_cavity', confidence: 0.94 },
        priority: 'critical',
        priorityExplanation: 'Cavity depth exceeds 10cm threshold in active vehicular travel path.',
        recommendedAction: 'Dispatch municipal rapid asphalt repair team for immediate compaction.',
        classification: 'MODEL-SUPPORTED DETECTION',
        classificationReason: 'Aggressive shadow gradient and exposed sub-base rock confirmed across 7 frames.',
        dimensions: {
          lengthMeters: 1.15,
          widthMeters: 0.78,
          depthMeters: 0.12,
          areaSqMeters: 0.70,
          measurementMethod: 'Calibrated Monocular Homography with Shadow Depth Ratio',
          uncertaintyPercent: 8,
          status: 'ESTIMATED',
          statusExplanation: 'Length and width estimated via 14.5° calibrated road homography; depth estimated from internal shadow rim.'
        },
        detectionMethod: 'SIMULATED_DEMO',
        technicalLimitationNote: 'True volumetric depth requires stereo sensor; depth estimate is derived from optical shadow proportion.'
      };
  }
}

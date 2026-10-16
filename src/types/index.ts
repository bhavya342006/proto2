export type HazardCategory =
  | 'pothole'
  | 'road_crack'
  | 'open_manhole'
  | 'open_drain'
  | 'damaged_drain'
  | 'waterlogging'
  | 'fallen_object'
  | 'fallen_electrical_wire'
  | 'broken_streetlight'
  | 'other_hazard'
  | 'irrelevant';

export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export type ReportStatus =
  | 'reported'
  | 'triaged'
  | 'inspection_assigned'
  | 'under_inspection'
  | 'repaired_pending_verification'
  | 'verified_resolved'
  | 'rejected_false_positive'
  | 'reopened';

export type ValidationClassification =
  | 'DEMONSTRATION RECORD'
  | 'MODEL-SUPPORTED DETECTION'
  | 'LIKELY DUPLICATE'
  | 'SUSPECTED FALSE OR IRRELEVANT REPORT'
  | 'MANUAL INSPECTION REQUIRED'
  | 'HUMAN-VERIFIED HAZARD'
  | 'HUMAN-VERIFIED RESOLUTION';

export type DimensionStatus =
  | 'ESTIMATED'
  | 'APPROXIMATE'
  | 'UNAVAILABLE'
  | 'MANUAL MEASUREMENT REQUIRED';

export interface PhysicalDimensions {
  lengthMeters?: number;
  widthMeters?: number;
  depthMeters?: number;
  areaSqMeters?: number;
  measurementMethod: string;
  uncertaintyPercent?: number;
  status: DimensionStatus;
  statusExplanation: string;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  confidence: number;
}

export interface DetectionMetadata {
  visualConfidence: number; // 0 - 100
  locationConfidence: number; // 0 - 100
  dimensionConfidence: number; // 0 - 100
  detectionMethod: 'LIVE_MODEL' | 'API_ANALYSIS' | 'SIMULATED_DEMO';
  trackingId?: string;
  boundingBox?: BoundingBox;
  processedAt?: string;
  frameIndex?: number;
}

export interface ClassificationEvidence {
  supporting: string[];
  missing: string[];
  recommendedNextStep: string;
  decidedBy: string;
  isAutomated: boolean;
}

export interface RepairVerification {
  beforeImageUrl: string;
  afterImageUrl?: string;
  workerNotes?: string;
  workerId?: string;
  workerName?: string;
  inspectionMeasurements?: {
    lengthM: number;
    widthM: number;
    depthM?: number;
  };
  officerReviewNotes?: string;
  officerId?: string;
  officerDecision?: 'approved' | 'rejected' | 'reinspection_requested' | 'more_evidence_needed';
  resolvedAt?: string;
  checklist?: {
    surfaceSealed: boolean;
    debrisCleared: boolean;
    structuralGradeMet: boolean;
    hazardEliminated: boolean;
  };
}

export interface IncidentAuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
}

export interface IncidentRecord {
  id: string; // e.g. DEMO-001 ... DEMO-030
  category: HazardCategory;
  title: string;
  description: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  gpsAccuracyMeters: number;
  priority: PriorityLevel;
  priorityExplanation: string;
  status: ReportStatus;
  classification: ValidationClassification;
  classificationEvidence: ClassificationEvidence;
  dimensions: PhysicalDimensions;
  detection: DetectionMetadata;
  repairData?: RepairVerification;
  imageUrl: string;
  imageCaption?: string;
  isDemoData: boolean;
  duplicateOfId?: string;
  duplicateMatchReason?: string;
  history: IncidentAuditEntry[];
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CitizenScanDetectionEvent {
  id: string;
  trackingId: string;
  category: HazardCategory;
  confidence: number;
  priority: PriorityLevel;
  timestamp: number;
  lat: number;
  lng: number;
  distanceAheadMeters: number;
  spokentoDriver: boolean;
}

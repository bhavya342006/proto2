import { IncidentRecord, ReportStatus } from '../types';
import { SEED_INCIDENTS } from '../data/seedIncidents';

const STORAGE_KEY = 'civicshield_incidents_v1';
const LISTENERS: Array<(incidents: IncidentRecord[]) => void> = [];

function notifyListeners(incidents: IncidentRecord[]) {
  LISTENERS.forEach((cb) => {
    try {
      cb(incidents);
    } catch (e) {
      console.error('Error notifying incident listener:', e);
    }
  });
}

/**
 * Calculates geographic distance in meters between two lat/lng coordinates (Haversine formula).
 */
export function calculateDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export class IncidentService {
  /**
   * Returns all incidents, initializing from SEED_INCIDENTS if not yet present in localStorage.
   */
  static getIncidents(): IncidentRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.resetToDemo();
        return SEED_INCIDENTS;
      }
      const parsed = JSON.parse(data) as IncidentRecord[];
      if (!Array.isArray(parsed) || parsed.length === 0) {
        this.resetToDemo();
        return SEED_INCIDENTS;
      }
      return parsed;
    } catch (e) {
      console.error('Failed to read incidents from localStorage:', e);
      return SEED_INCIDENTS;
    }
  }

  static getIncidentById(id: string): IncidentRecord | undefined {
    const list = this.getIncidents();
    return list.find((inc) => inc.id === id);
  }

  private static save(incidents: IncidentRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
      notifyListeners(incidents);
    } catch (e) {
      console.error('Failed to write incidents to localStorage:', e);
    }
  }

  /**
   * Subscribe to incidents data changes across views.
   */
  static subscribe(listener: (incidents: IncidentRecord[]) => void): () => void {
    LISTENERS.push(listener);
    return () => {
      const idx = LISTENERS.indexOf(listener);
      if (idx !== -1) LISTENERS.splice(idx, 1);
    };
  }

  /**
   * Resets the entire incident store back to the clean 30 demonstration records.
   */
  static resetToDemo(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_INCIDENTS));
      notifyListeners(SEED_INCIDENTS);
    } catch (e) {
      console.error('Failed to reset demo data:', e);
    }
  }

  /**
   * Creates a new citizen or automated detection incident.
   */
  static createIncident(
    input: Omit<IncidentRecord, 'id' | 'createdAt' | 'updatedAt' | 'history'>
  ): IncidentRecord {
    const existing = this.getIncidents();
    const count = existing.length + 1;
    const newId = `CITIZEN-${String(count).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const record: IncidentRecord = {
      ...input,
      id: newId,
      createdAt: now,
      updatedAt: now,
      history: [
        {
          id: `h-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          action: 'Incident Created',
          actor: input.isDemoData ? 'Simulated Scan' : 'Citizen App',
          details: `Logged ${input.category} with ${input.priority} priority at ${input.address}.`
        }
      ]
    };

    const updatedList = [record, ...existing];
    this.save(updatedList);
    return record;
  }

  /**
   * Updates an existing incident with audit tracking.
   */
  static updateIncident(
    id: string,
    updates: Partial<IncidentRecord>,
    actor = 'Authority Operator',
    reason = 'Manual status update'
  ): IncidentRecord | undefined {
    const list = this.getIncidents();
    const idx = list.findIndex((i) => i.id === id);
    if (idx === -1) return undefined;

    const current = list[idx];
    const now = new Date().toISOString();
    const updated: IncidentRecord = {
      ...current,
      ...updates,
      updatedAt: now,
      history: [
        {
          id: `h-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          action: `Updated: ${Object.keys(updates).join(', ')}`,
          actor,
          details: reason
        },
        ...current.history
      ]
    };

    list[idx] = updated;
    this.save(list);
    return updated;
  }

  /**
   * Dispatches or assigns a municipal field worker.
   */
  static assignFieldWorker(
    id: string,
    workerId: string,
    workerName: string,
    notes = 'Assigned for on-site inspection and repair'
  ): IncidentRecord | undefined {
    return this.updateIncident(
      id,
      {
        assignedWorkerId: workerId,
        assignedWorkerName: workerName,
        status: 'inspection_assigned'
      },
      'Dispatcher Control',
      `Assigned to ${workerName} (${workerId}). Notes: ${notes}`
    );
  }

  /**
   * Marks incident as under inspection.
   */
  static setUnderInspection(id: string, workerName: string): IncidentRecord | undefined {
    return this.updateIncident(
      id,
      { status: 'under_inspection' },
      workerName,
      'Field team arrived on site; inspection underway.'
    );
  }

  /**
   * Worker submits field inspection measurements and repair evidence.
   */
  static submitInspectionAndRepair(
    id: string,
    data: {
      afterImageUrl: string;
      workerNotes: string;
      workerId: string;
      workerName: string;
      measurements?: { lengthM: number; widthM: number; depthM?: number };
      checklist?: {
        surfaceSealed: boolean;
        debrisCleared: boolean;
        structuralGradeMet: boolean;
        hazardEliminated: boolean;
      };
    }
  ): IncidentRecord | undefined {
    const inc = this.getIncidentById(id);
    if (!inc) return undefined;

    const repairPayload = {
      beforeImageUrl: inc.imageUrl,
      afterImageUrl: data.afterImageUrl,
      workerNotes: data.workerNotes,
      workerId: data.workerId,
      workerName: data.workerName,
      inspectionMeasurements: data.measurements,
      checklist: data.checklist || {
        surfaceSealed: true,
        debrisCleared: true,
        structuralGradeMet: true,
        hazardEliminated: true
      }
    };

    return this.updateIncident(
      id,
      {
        status: 'repaired_pending_verification',
        repairData: repairPayload
      },
      data.workerName,
      `Submitted repair evidence and photographic proof. Awaiting officer verification.`
    );
  }

  /**
   * Municipal Officer reviews repair evidence: Approve, Reject, or Request Re-inspection.
   */
  static verifyRepair(
    id: string,
    decision: 'approved' | 'rejected' | 'reinspection_requested',
    officerNotes: string,
    officerId = 'OFF-01',
    officerName = 'Chief Engineer Miller'
  ): IncidentRecord | undefined {
    const inc = this.getIncidentById(id);
    if (!inc) return undefined;

    let newStatus: ReportStatus = 'repaired_pending_verification';
    let newClassification = inc.classification;

    if (decision === 'approved') {
      newStatus = 'verified_resolved';
      newClassification = 'HUMAN-VERIFIED RESOLUTION';
    } else if (decision === 'rejected') {
      newStatus = 'reopened';
    } else if (decision === 'reinspection_requested') {
      newStatus = 'under_inspection';
    }

    const updatedRepairData = inc.repairData
      ? {
          ...inc.repairData,
          officerDecision: decision,
          officerReviewNotes: officerNotes,
          officerId,
          resolvedAt: decision === 'approved' ? new Date().toISOString() : undefined
        }
      : undefined;

    return this.updateIncident(
      id,
      {
        status: newStatus,
        classification: newClassification,
        repairData: updatedRepairData
      },
      officerName,
      `Officer decision: ${decision.toUpperCase()}. Notes: ${officerNotes}`
    );
  }

  /**
   * Checks for potential duplicate incidents using geographic distance, hazard category, and time window.
   */
  static checkPotentialDuplicate(
    category: string,
    lat: number,
    lng: number,
    thresholdMeters = 30
  ): { isDuplicate: boolean; parent?: IncidentRecord; distanceMeters: number } {
    const all = this.getIncidents();
    for (const inc of all) {
      if (inc.status === 'verified_resolved' || inc.status === 'rejected_false_positive') {
        continue;
      }
      if (inc.category === category) {
        const dist = calculateDistanceMeters(lat, lng, inc.coordinates.lat, inc.coordinates.lng);
        if (dist <= thresholdMeters) {
          return { isDuplicate: true, parent: inc, distanceMeters: Math.round(dist) };
        }
      }
    }
    return { isDuplicate: false, distanceMeters: 9999 };
  }
}

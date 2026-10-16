/**
 * Voice Guidance Service for Driver Safety
 * Implements browser SpeechSynthesis with alert cooldown, duplicate suppression,
 * volume/rate controls, and guaranteed text transcript fallback.
 */

export interface VoiceSettings {
  enabled: boolean;
  muted: boolean;
  volume: number; // 0.0 - 1.0
  rate: number; // 0.8 - 1.4
}

export interface VoiceMessageEvent {
  id: string;
  text: string;
  category: 'info' | 'hazard_warning' | 'critical_alert' | 'system';
  timestamp: number;
}

type TranscriptListener = (msg: VoiceMessageEvent) => void;

class VoiceGuidanceServiceImpl {
  private settings: VoiceSettings = {
    enabled: true,
    muted: false,
    volume: 0.9,
    rate: 1.05
  };

  private lastSpokenText = '';
  private lastSpokenTime = 0;
  private trackingCooldowns = new Map<string, number>();
  private listeners: TranscriptListener[] = [];
  private isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  constructor() {
    // Load persisted preferences if any
    try {
      const saved = localStorage.getItem('civicshield_voice_prefs');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch {
      // fallback to defaults
    }
  }

  public getSettings(): VoiceSettings {
    return { ...this.settings };
  }

  public updateSettings(partial: Partial<VoiceSettings>): void {
    this.settings = { ...this.settings, ...partial };
    try {
      localStorage.setItem('civicshield_voice_prefs', JSON.stringify(this.settings));
    } catch {
      // ignore
    }
  }

  public isSpeechSupported(): boolean {
    return this.isSupported;
  }

  public getLastMessage(): string {
    return this.lastSpokenText || 'No recent safety announcements.';
  }

  public onTranscript(cb: TranscriptListener): () => void {
    this.listeners.push(cb);
    return () => {
      const idx = this.listeners.indexOf(cb);
      if (idx !== -1) this.listeners.splice(idx, 1);
    };
  }

  private emitTranscript(text: string, category: VoiceMessageEvent['category']) {
    const event: VoiceMessageEvent = {
      id: `voice-${Date.now()}`,
      text,
      category,
      timestamp: Date.now()
    };
    this.listeners.forEach((l) => l(event));
  }

  /**
   * Primary speech dispatch. Applies cooldowns, prevents repetitive spam,
   * respects mute/enabled status, and logs visual transcript.
   */
  public speak(
    text: string,
    category: VoiceMessageEvent['category'] = 'hazard_warning',
    trackingKey?: string,
    cooldownMs = 12000
  ): boolean {
    const now = Date.now();

    // Check tracking key cooldown
    if (trackingKey) {
      const lastKeyTime = this.trackingCooldowns.get(trackingKey) || 0;
      if (now - lastKeyTime < cooldownMs) {
        return false; // Suppressed repetitive hazard alert
      }
      this.trackingCooldowns.set(trackingKey, now);
    }

    // Check general duplicate suppression (same message within 8s)
    if (text === this.lastSpokenText && now - this.lastSpokenTime < 8000) {
      return false;
    }

    this.lastSpokenText = text;
    this.lastSpokenTime = now;

    // Always emit visible transcript for deaf/hard-of-hearing or muted users
    this.emitTranscript(text, category);

    // If disabled or muted, do not produce audio
    if (!this.settings.enabled || this.settings.muted || !this.isSupported) {
      return true;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending queue to keep warnings immediate
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = this.settings.volume;
      utterance.rate = this.settings.rate;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
      return false;
    }
  }

  public repeatLast(): void {
    if (this.lastSpokenText) {
      // Force repeat regardless of duplicate cooldown
      this.emitTranscript(this.lastSpokenText, 'system');
      if (this.settings.enabled && !this.settings.muted && this.isSupported) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(this.lastSpokenText);
        utterance.volume = this.settings.volume;
        utterance.rate = this.settings.rate;
        window.speechSynthesis.speak(utterance);
      }
    } else {
      this.speak('No previous announcement to repeat.', 'system');
    }
  }

  // Pre-configured driver safety announcements
  public announceScanStarted(): void {
    this.speak('Road scan started. Keep your attention on the road.', 'info', 'scan_start', 3000);
  }

  public announceScanStopped(): void {
    this.speak('Road scan stopped. Your session summary is ready.', 'info', 'scan_stop', 3000);
  }

  public announcePossibleHazard(hazardName: string, trackingId?: string): void {
    this.speak(
      `Possible road hazard ahead: ${hazardName}. Avoid interacting with your phone while driving.`,
      'hazard_warning',
      trackingId || hazardName,
      14000
    );
  }

  public announceCriticalHazard(hazardName: string, trackingId?: string): void {
    this.speak(
      `High-risk road hazard ahead: ${hazardName}. Stay alert and follow local road safety rules.`,
      'critical_alert',
      trackingId || hazardName,
      12000
    );
  }

  public announceUncertainHazard(hazardName: string, trackingId?: string): void {
    this.speak(
      `Possible ${hazardName} detected. This report requires further inspection.`,
      'hazard_warning',
      trackingId || hazardName,
      16000
    );
  }

  public announceGpsUnavailable(): void {
    this.speak(
      'Location is unavailable. The detected hazard cannot be accurately mapped yet.',
      'system',
      'gps_warning',
      20000
    );
  }
}

export const VoiceGuidance = new VoiceGuidanceServiceImpl();

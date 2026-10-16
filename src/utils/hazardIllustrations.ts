import { HazardCategory } from '../types';

/**
 * High-fidelity SVG-based data URIs for road hazard visual evidence.
 * These provide crisp, dark-mode-optimized, reproducible visuals for all 30 demo records
 * and before/after repair evidence comparisons.
 */
export function getHazardIllustration(
  category: HazardCategory,
  incidentId: string,
  variant: 'normal' | 'repaired' | 'wireframe' = 'normal'
): string {
  // If requesting repaired variant
  if (variant === 'repaired') {
    return generateRepairedIllustration(category, incidentId);
  }

  switch (category) {
    case 'pothole':
      return generatePotholeSvg(incidentId);
    case 'road_crack':
      return generateCrackSvg(incidentId);
    case 'open_manhole':
      return generateOpenManholeSvg(incidentId);
    case 'open_drain':
    case 'damaged_drain':
      return generateDrainSvg(incidentId);
    case 'waterlogging':
      return generateWaterloggingSvg(incidentId);
    case 'fallen_electrical_wire':
      return generateFallenWireSvg(incidentId);
    case 'fallen_object':
      return generateFallenObjectSvg(incidentId);
    case 'broken_streetlight':
      return generateBrokenStreetlightSvg(incidentId);
    case 'irrelevant':
      return generateIrrelevantSvg(incidentId);
    default:
      return generateGenericRoadHazardSvg(incidentId);
  }
}

function generatePotholeSvg(id: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
    <defs>
      <radialGradient id="road" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="#1E293B"/>
        <stop offset="100%" stop-color="#0F172A"/>
      </radialGradient>
      <radialGradient id="hole" cx="45%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#05070B"/>
        <stop offset="60%" stop-color="#0B0F19"/>
        <stop offset="100%" stop-color="#1A2234"/>
      </radialGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#2684FF" flood-opacity="0.3"/>
      </filter>
    </defs>
    <!-- Asphalt Background -->
    <rect width="800" height="500" fill="url(#road)"/>
    <!-- Lane Divider Marks -->
    <line x1="0" y1="250" x2="160" y2="250" stroke="#F4F7FF" stroke-width="8" stroke-dasharray="24 16" opacity="0.4"/>
    <line x1="640" y1="250" x2="800" y2="250" stroke="#F4F7FF" stroke-width="8" stroke-dasharray="24 16" opacity="0.4"/>
    <line x1="400" y1="20" x2="400" y2="100" stroke="#FFB547" stroke-width="6" stroke-dasharray="16 12" opacity="0.5"/>
    
    <!-- Pothole Rim Cracks -->
    <path d="M 240,220 Q 280,180 340,190 T 480,170 T 560,210 T 600,290 T 540,360 T 420,380 T 290,360 T 220,290 Z" fill="#0C1220" stroke="#334155" stroke-width="6"/>
    <!-- Deep Cavity Interior -->
    <path d="M 260,230 Q 300,200 370,210 T 460,190 T 540,230 T 570,280 T 520,340 T 410,355 T 310,340 T 240,285 Z" fill="url(#hole)"/>
    <!-- Broken Aggregate & Depth Shadows -->
    <ellipse cx="400" cy="280" rx="90" ry="45" fill="#020408" opacity="0.85"/>
    <circle cx="340" cy="270" r="14" fill="#1E293B"/>
    <circle cx="450" cy="290" r="18" fill="#1E293B"/>
    <circle cx="380" cy="240" r="10" fill="#334155"/>
    <path d="M 310,310 L 360,335 L 430,320 L 490,330" stroke="#0F172A" stroke-width="5" fill="none"/>
    
    <!-- CV Bounding Box / Calibrated Metric Grid HUD -->
    <rect x="210" y="160" width="410" height="240" fill="none" stroke="#2684FF" stroke-width="2" stroke-dasharray="6 4" filter="url(#glow)"/>
    <rect x="210" y="160" width="12" height="12" fill="#2684FF"/>
    <rect x="608" y="160" width="12" height="12" fill="#2684FF"/>
    <rect x="210" y="388" width="12" height="12" fill="#2684FF"/>
    <rect x="608" y="388" width="12" height="12" fill="#2684FF"/>
    
    <!-- Calibration Scale Bar -->
    <g transform="translate(230, 420)">
      <line x1="0" y1="0" x2="370" y2="0" stroke="#31D7FF" stroke-width="3"/>
      <line x1="0" y1="-6" x2="0" y2="6" stroke="#31D7FF" stroke-width="3"/>
      <line x1="370" y1="-6" x2="370" y2="6" stroke="#31D7FF" stroke-width="3"/>
      <text x="185" y="-10" font-family="monospace" font-size="14" fill="#31D7FF" text-anchor="middle" font-weight="bold">L: ~1.25m [±0.08m]</text>
    </g>

    <!-- Tag Overlay -->
    <rect x="24" y="24" width="220" height="40" rx="6" fill="#0D1424" fill-opacity="0.9" stroke="#2684FF" stroke-width="1.5"/>
    <circle cx="44" cy="44" r="6" fill="#FF4D5A"/>
    <text x="60" y="49" font-family="system-ui, sans-serif" font-size="14" fill="#F4F7FF" font-weight="bold">${id} • POTHOLE</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function generateCrackSvg(id: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
    <rect width="800" height="500" fill="#131B2E"/>
    <!-- Asphalt grain lines -->
    <line x1="0" y1="120" x2="800" y2="120" stroke="#1E293B" stroke-width="1"/>
    <line x1="0" y1="380" x2="800" y2="380" stroke="#1E293B" stroke-width="1"/>
    <!-- Deep Alligator / Transverse Cracks -->
    <path d="M 80,450 L 170,360 L 220,380 L 290,290 L 360,310 L 420,220 L 510,240 L 610,140 L 710,120" fill="none" stroke="#05070A" stroke-width="9"/>
    <path d="M 80,450 L 170,360 L 220,380 L 290,290 L 360,310 L 420,220 L 510,240 L 610,140 L 710,120" fill="none" stroke="#FFB547" stroke-width="2" stroke-dasharray="8 6" opacity="0.8"/>
    <!-- Branch cracks -->
    <path d="M 290,290 L 250,210 L 290,170" fill="none" stroke="#090E17" stroke-width="6"/>
    <path d="M 420,220 L 460,160 L 430,90" fill="none" stroke="#090E17" stroke-width="5"/>
    <path d="M 510,240 L 580,310 L 670,300" fill="none" stroke="#090E17" stroke-width="5"/>
    
    <!-- CV Detection Overlay -->
    <rect x="60" y="80" width="670" height="390" fill="none" stroke="#FFB547" stroke-width="2" stroke-dasharray="8 4"/>
    <text x="75" y="110" font-family="monospace" font-size="14" fill="#FFB547" font-weight="bold">SEVERITY: EXTENSIVE ALLIGATOR CRACKING</text>
    
    <rect x="24" y="24" width="230" height="40" rx="6" fill="#0D1424" fill-opacity="0.9" stroke="#FFB547" stroke-width="1.5"/>
    <circle cx="44" cy="44" r="6" fill="#FFB547"/>
    <text x="60" y="49" font-family="system-ui, sans-serif" font-size="14" fill="#F4F7FF" font-weight="bold">${id} • SURFACE CRACK</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function generateOpenManholeSvg(id: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
    <rect width="800" height="500" fill="#0F172A"/>
    <!-- Yellow warning stripe on road -->
    <line x1="50" y1="50" x2="750" y2="450" stroke="#FFB547" stroke-width="4" stroke-dasharray="16 16" opacity="0.2"/>
    <!-- Dislodged cover nearby -->
    <ellipse cx="610" cy="220" rx="100" ry="60" fill="#283548" stroke="#475569" stroke-width="6"/>
    <ellipse cx="610" cy="220" rx="75" ry="45" fill="#1E293B"/>
    <path d="M 550,220 L 670,220 M 610,180 L 610,260" stroke="#475569" stroke-width="4"/>
    
    <!-- Deep Open Shaft -->
    <ellipse cx="330" cy="270" rx="150" ry="105" fill="#020408" stroke="#FF4D5A" stroke-width="4"/>
    <ellipse cx="330" cy="275" rx="130" ry="90" fill="#000000"/>
    <!-- Shaft ladders inside dark void -->
    <line x1="280" y1="260" x2="280" y2="330" stroke="#334155" stroke-width="4"/>
    <line x1="380" y1="260" x2="380" y2="330" stroke="#334155" stroke-width="4"/>
    <line x1="280" y1="280" x2="380" y2="280" stroke="#334155" stroke-width="4"/>
    <line x1="280" y1="310" x2="380" y2="310" stroke="#334155" stroke-width="4"/>
    
    <!-- High hazard warning bounds -->
    <rect x="150" y="140" width="360" height="260" fill="none" stroke="#FF4D5A" stroke-width="3" stroke-dasharray="10 6"/>
    <text x="165" y="170" font-family="monospace" font-size="14" fill="#FF4D5A" font-weight="bold">CRITICAL HAZARD: OPEN SHAFT [0.85m DIA]</text>
    
    <rect x="24" y="24" width="250" height="40" rx="6" fill="#0D1424" fill-opacity="0.95" stroke="#FF4D5A" stroke-width="1.5"/>
    <circle cx="44" cy="44" r="6" fill="#FF4D5A"/>
    <text x="60" y="49" font-family="system-ui, sans-serif" font-size="14" fill="#F4F7FF" font-weight="bold">${id} • OPEN MANHOLE</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function generateDrainSvg(id: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
    <rect width="800" height="500" fill="#111827"/>
    <!-- Curb line -->
    <rect x="0" y="320" width="800" height="180" fill="#1F2937"/>
    <line x1="0" y1="320" x2="800" y2="320" stroke="#64748B" stroke-width="6"/>
    <!-- Broken storm grate -->
    <rect x="240" y="210" width="340" height="180" rx="6" fill="#090D16" stroke="#475569" stroke-width="5"/>
    <!-- Bent bars -->
    <line x1="280" y1="210" x2="280" y2="390" stroke="#64748B" stroke-width="8"/>
    <line x1="330" y1="210" x2="325" y2="320" stroke="#64748B" stroke-width="8"/>
    <line x1="380" y1="210" x2="410" y2="300" stroke="#FF4D5A" stroke-width="8"/> <!-- Broken displaced bar -->
    <line x1="430" y1="210" x2="430" y2="390" stroke="#64748B" stroke-width="8"/>
    <line x1="480" y1="210" x2="475" y2="390" stroke="#64748B" stroke-width="8"/>
    <line x1="530" y1="210" x2="530" y2="390" stroke="#64748B" stroke-width="8"/>
    <!-- Void behind broken bar -->
    <ellipse cx="380" cy="330" rx="40" ry="25" fill="#000000"/>
    
    <rect x="220" y="190" width="380" height="220" fill="none" stroke="#FFB547" stroke-width="2" stroke-dasharray="6 4"/>
    <text x="235" y="180" font-family="monospace" font-size="14" fill="#FFB547" font-weight="bold">COLLAPSED GRATE - DISPLACED IRON BAR</text>
    
    <rect x="24" y="24" width="250" height="40" rx="6" fill="#0D1424" fill-opacity="0.9" stroke="#FFB547" stroke-width="1.5"/>
    <circle cx="44" cy="44" r="6" fill="#FFB547"/>
    <text x="60" y="49" font-family="system-ui, sans-serif" font-size="14" fill="#F4F7FF" font-weight="bold">${id} • DAMAGED DRAIN</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function generateWaterloggingSvg(id: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
    <rect width="800" height="500" fill="#0A111E"/>
    <!-- Water Pool with reflection -->
    <ellipse cx="400" cy="270" rx="310" ry="140" fill="#142642" stroke="#2684FF" stroke-width="3"/>
    <ellipse cx="390" cy="265" rx="270" ry="110" fill="#1E3A66" opacity="0.7"/>
    <!-- Ripple waves -->
    <path d="M 220,260 Q 300,240 400,260 T 580,260" fill="none" stroke="#31D7FF" stroke-width="2" opacity="0.6"/>
    <path d="M 260,290 Q 350,270 440,290 T 540,290" fill="none" stroke="#31D7FF" stroke-width="1.5" opacity="0.4"/>
    <path d="M 180,310 Q 280,290 380,310 T 590,310" fill="none" stroke="#31D7FF" stroke-width="1.5" opacity="0.5"/>
    <!-- Submerged road marking -->
    <line x1="120" y1="270" x2="280" y2="270" stroke="#F4F7FF" stroke-width="6" opacity="0.3"/>
    
    <rect x="70" y="110" width="660" height="310" fill="none" stroke="#2684FF" stroke-width="2" stroke-dasharray="8 6"/>
    <text x="85" y="140" font-family="monospace" font-size="14" fill="#31D7FF" font-weight="bold">FLOOD DEPTH: ~18cm | AREA: ~42.0 m²</text>
    
    <rect x="24" y="24" width="240" height="40" rx="6" fill="#0D1424" fill-opacity="0.9" stroke="#2684FF" stroke-width="1.5"/>
    <circle cx="44" cy="44" r="6" fill="#2684FF"/>
    <text x="60" y="49" font-family="system-ui, sans-serif" font-size="14" fill="#F4F7FF" font-weight="bold">${id} • WATERLOGGING</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function generateFallenWireSvg(id: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
    <rect width="800" height="500" fill="#070B14"/>
    <!-- Dark night asphalt with electric sparks -->
    <line x1="0" y1="400" x2="800" y2="400" stroke="#1A2436" stroke-width="2"/>
    <!-- Wire draping from upper pole down onto asphalt -->
    <path d="M 0,30 Q 220,180 340,320 T 480,390 T 700,410 L 800,430" fill="none" stroke="#1E293B" stroke-width="10"/>
    <path d="M 0,30 Q 220,180 340,320 T 480,390 T 700,410 L 800,430" fill="none" stroke="#31D7FF" stroke-width="3"/>
    <path d="M 0,30 Q 220,180 340,320 T 480,390 T 700,410 L 800,430" fill="none" stroke="#FF4D5A" stroke-width="1.5" stroke-dasharray="14 10"/>
    
    <!-- Spark Burst on Road -->
    <circle cx="480" cy="390" r="14" fill="#31D7FF" opacity="0.7"/>
    <circle cx="480" cy="390" r="6" fill="#FFFFFF"/>
    <line x1="480" y1="390" x2="455" y2="365" stroke="#31D7FF" stroke-width="2"/>
    <line x1="480" y1="390" x2="510" y2="370" stroke="#31D7FF" stroke-width="2"/>
    <line x1="480" y1="390" x2="470" y2="420" stroke="#31D7FF" stroke-width="2"/>
    
    <rect x="250" y="270" width="340" height="170" fill="none" stroke="#FF4D5A" stroke-width="3" stroke-dasharray="8 4"/>
    <text x="265" y="300" font-family="monospace" font-size="14" fill="#FF4D5A" font-weight="bold">HIGH VOLTAGE CONDUCTOR DETECTED</text>
    
    <rect x="24" y="24" width="270" height="40" rx="6" fill="#0D1424" fill-opacity="0.95" stroke="#FF4D5A" stroke-width="1.5"/>
    <circle cx="44" cy="44" r="6" fill="#FF4D5A"/>
    <text x="60" y="49" font-family="system-ui, sans-serif" font-size="14" fill="#F4F7FF" font-weight="bold">${id} • FALLEN ELECTRICAL WIRE</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function generateFallenObjectSvg(id: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
    <rect width="800" height="500" fill="#101726"/>
    <!-- Fallen branch/timber blocking lane -->
    <line x1="0" y1="250" x2="800" y2="250" stroke="#F4F7FF" stroke-width="6" stroke-dasharray="24 16" opacity="0.3"/>
    
    <!-- Heavy branch trunk -->
    <path d="M 220,310 Q 360,260 540,290 T 660,240" fill="none" stroke="#3B2F2F" stroke-width="26" stroke-linecap="round"/>
    <path d="M 330,280 L 380,210 M 460,280 L 510,340 M 520,280 L 580,220" stroke="#4A3B32" stroke-width="14" stroke-linecap="round"/>
    <circle cx="380" cy="210" r="15" fill="#2D4A22" opacity="0.8"/>
    <circle cx="580" cy="220" r="20" fill="#2D4A22" opacity="0.8"/>
    
    <rect x="180" y="180" width="510" height="190" fill="none" stroke="#FF4D5A" stroke-width="2" stroke-dasharray="6 4"/>
    <text x="200" y="205" font-family="monospace" font-size="14" fill="#FF4D5A" font-weight="bold">LANE OBSTRUCTION [SPAN: ~2.4m]</text>
    
    <rect x="24" y="24" width="250" height="40" rx="6" fill="#0D1424" fill-opacity="0.9" stroke="#FF4D5A" stroke-width="1.5"/>
    <circle cx="44" cy="44" r="6" fill="#FF4D5A"/>
    <text x="60" y="49" font-family="system-ui, sans-serif" font-size="14" fill="#F4F7FF" font-weight="bold">${id} • FALLEN OBSTRUCTION</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function generateBrokenStreetlightSvg(id: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
    <rect width="800" height="500" fill="#080C16"/>
    <!-- Street light pole with shattered luminaire -->
    <line x1="280" y1="500" x2="280" y2="120" stroke="#475569" stroke-width="14"/>
    <path d="M 280,120 Q 300,70 380,70 L 440,70" fill="none" stroke="#475569" stroke-width="12"/>
    <!-- Shattered Head -->
    <rect x="420" y="60" width="90" height="35" rx="4" fill="#1E293B" stroke="#64748B" stroke-width="3"/>
    <!-- Hanging broken wire from luminaire -->
    <path d="M 470,95 Q 460,140 480,170" fill="none" stroke="#FFB547" stroke-width="3"/>
    <!-- Shattered glass bits on ground below -->
    <ellipse cx="480" cy="450" rx="60" ry="18" fill="#1E293B"/>
    <circle cx="460" cy="450" r="3" fill="#31D7FF"/>
    <circle cx="490" cy="452" r="3" fill="#31D7FF"/>
    <circle cx="510" cy="448" r="2" fill="#31D7FF"/>
    
    <rect x="390" y="40" width="160" height="150" fill="none" stroke="#FFB547" stroke-width="2" stroke-dasharray="6 4"/>
    <text x="400" y="215" font-family="monospace" font-size="13" fill="#FFB547" font-weight="bold">DAMAGED LUMINAIRE</text>
    
    <rect x="24" y="24" width="260" height="40" rx="6" fill="#0D1424" fill-opacity="0.9" stroke="#FFB547" stroke-width="1.5"/>
    <circle cx="44" cy="44" r="6" fill="#FFB547"/>
    <text x="60" y="49" font-family="system-ui, sans-serif" font-size="14" fill="#F4F7FF" font-weight="bold">${id} • BROKEN STREETLIGHT</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function generateIrrelevantSvg(id: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
    <rect width="800" height="500" fill="#181E2B"/>
    <!-- Interior of car: coffee cup on dashboard holder, not a road hazard! -->
    <rect x="0" y="300" width="800" height="200" fill="#252F42"/>
    <ellipse cx="400" cy="360" rx="80" ry="40" fill="#161C28"/>
    <!-- Coffee Cup -->
    <path d="M 360,260 L 370,360 L 430,360 L 440,260 Z" fill="#E2E8F0" stroke="#94A3B8" stroke-width="3"/>
    <ellipse cx="400" cy="260" rx="40" ry="12" fill="#78350F"/>
    
    <!-- AI Triage Rejection Box -->
    <rect x="330" y="230" width="140" height="150" fill="none" stroke="#FF4D5A" stroke-width="2" stroke-dasharray="4 4"/>
    <text x="400" y="210" font-family="monospace" font-size="13" fill="#FF4D5A" text-anchor="middle" font-weight="bold">NO ROAD SURFACE DETECTED (CONF: 8%)</text>
    <text x="400" y="430" font-family="sans-serif" font-size="14" fill="#A6B4CC" text-anchor="middle">SUSPECTED FALSE REPORT: Vehicle Interior Object</text>
    
    <rect x="24" y="24" width="280" height="40" rx="6" fill="#0D1424" fill-opacity="0.95" stroke="#FF4D5A" stroke-width="1.5"/>
    <circle cx="44" cy="44" r="6" fill="#FF4D5A"/>
    <text x="60" y="49" font-family="system-ui, sans-serif" font-size="14" fill="#F4F7FF" font-weight="bold">${id} • IRRELEVANT REPORT</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function generateRepairedIllustration(category: HazardCategory, id: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
    <rect width="800" height="500" fill="#1E293B"/>
    <!-- Fresh Asphalt Patch with sealed edges -->
    <rect x="220" y="160" width="380" height="220" rx="12" fill="#0B101B" stroke="#35D49A" stroke-width="3"/>
    <path d="M 230,170 Q 300,165 400,168 T 590,170" fill="none" stroke="#10B981" stroke-width="2" stroke-dasharray="4 3"/>
    <!-- Bitumen Sealant Tar Line around patch -->
    <rect x="216" y="156" width="388" height="228" rx="14" fill="none" stroke="#05080E" stroke-width="6"/>
    <!-- Clean road lane markings painted over -->
    <line x1="0" y1="270" x2="800" y2="270" stroke="#F4F7FF" stroke-width="8" stroke-dasharray="24 16" opacity="0.7"/>
    
    <!-- Verification Stamp Badge -->
    <g transform="translate(490, 80)">
      <rect x="0" y="0" width="250" height="60" rx="8" fill="#0D1424" stroke="#35D49A" stroke-width="2"/>
      <circle cx="28" cy="30" r="14" fill="#35D49A" fill-opacity="0.2"/>
      <path d="M 22,30 L 26,34 L 34,26" fill="none" stroke="#35D49A" stroke-width="3" stroke-linecap="round"/>
      <text x="50" y="26" font-family="system-ui, sans-serif" font-size="13" fill="#35D49A" font-weight="bold">POST-REPAIR EVIDENCE</text>
      <text x="50" y="44" font-family="system-ui, sans-serif" font-size="11" fill="#A6B4CC">Fresh Patch &amp; Edge Seal</text>
    </g>

    <rect x="24" y="24" width="260" height="40" rx="6" fill="#0D1424" fill-opacity="0.9" stroke="#35D49A" stroke-width="1.5"/>
    <circle cx="44" cy="44" r="6" fill="#35D49A"/>
    <text x="60" y="49" font-family="system-ui, sans-serif" font-size="14" fill="#35D49A" font-weight="bold">${id} • REPAIR COMPLETED</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function generateGenericRoadHazardSvg(id: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
    <rect width="800" height="500" fill="#111827"/>
    <circle cx="400" cy="250" r="80" fill="#1F2937" stroke="#2684FF" stroke-width="3"/>
    <text x="400" y="255" font-family="monospace" font-size="20" fill="#31D7FF" text-anchor="middle" font-weight="bold">CIVIC HAZARD</text>
    <rect x="24" y="24" width="240" height="40" rx="6" fill="#0D1424" stroke="#2684FF" stroke-width="1.5"/>
    <circle cx="44" cy="44" r="6" fill="#2684FF"/>
    <text x="60" y="49" font-family="system-ui, sans-serif" font-size="14" fill="#F4F7FF" font-weight="bold">${id} • HAZARD</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

import * as THREE from 'three'

/* ============================================================
   COLORS
   ============================================================ */
const COLORS = {
  stickyYellow: '#E5D878',
  stickyBlue:   '#9FB9D0',
  stickyGreen:  '#A8C39A',
  stickyRose:   '#D6AAA4',
  stickyCream:  '#E8DCC5',

  paper:      '#F1EBDD',
  paperDark:  '#D8CDBB',
  paperWhite: '#F7F3EA',

  tape: '#BBAF99',

  ink:      '#5E625E',
  inkDark:  '#454A47',
  inkLight: '#777B76',

  pin:       '#B86E4B',
  pinBlue:   '#657B91',
  pinGreen:  '#78956B',
}

/* ============================================================
   BOARD METRICS
   ------------------------------------------------------------
   Inner panel : 6.72 x 3.72
   Panel center: (0, 1.2) di koordinat local BoardMotifs
   Safe bounds (dengan margin ~0.2 di setiap sisi):
     X : -3.10  s/d  +3.10
     Y : -0.40  s/d  +2.85
   Semua posisi di file ini mengacu pada bounds ini.
   ============================================================ */
const BOARD = {
  safeMinX: -3.10,
  safeMaxX:  3.10,
  safeMinY: -0.40,
  safeMaxY:  2.85,
  centerY:   1.20,
}

/* ============================================================
   BASE COMPONENTS
   ============================================================ */

function Paper({
  position,
  rotation = 0,
  size = [0.45, 0.32],
  color = COLORS.paper,
}) {
  return (
    <mesh
      position={position}
      rotation={[0, 0, rotation]}
      castShadow
    >
      <boxGeometry args={[size[0], size[1], 0.025]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  )
}

function StickyNote({
  position,
  rotation = 0,
  color = COLORS.stickyYellow,
  size = [0.52, 0.42],
}) {
  return (
    <group position={position} rotation={[0, 0, rotation]}>
      <mesh castShadow>
        <boxGeometry args={[size[0], size[1], 0.035]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>

      {/* Handwriting lines */}
      <mesh position={[0, 0.07, 0.022]}>
        <boxGeometry args={[0.30, 0.025, 0.008]} />
        <meshStandardMaterial color={COLORS.ink} roughness={1} />
      </mesh>
      <mesh position={[-0.03, -0.01, 0.022]}>
        <boxGeometry args={[0.36, 0.02, 0.008]} />
        <meshStandardMaterial color={COLORS.ink} roughness={1} />
      </mesh>
      <mesh position={[-0.07, -0.08, 0.022]}>
        <boxGeometry args={[0.25, 0.02, 0.008]} />
        <meshStandardMaterial color={COLORS.ink} roughness={1} />
      </mesh>
    </group>
  )
}

function Tape({
  position,
  rotation = 0,
  size = [0.58, 0.16],
}) {
  return (
    <mesh position={position} rotation={[0, 0, rotation]}>
      <boxGeometry args={[size[0], size[1], 0.018]} />
      <meshStandardMaterial
        color={COLORS.tape}
        transparent
        opacity={0.72}
        roughness={1}
      />
    </mesh>
  )
}

function Pin({ position, color = COLORS.pin }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <sphereGeometry args={[0.065, 8, 6]} />
        <meshStandardMaterial
          color={color}
          roughness={0.45}
          metalness={0.25}
        />
      </mesh>
      <mesh position={[0, 0, -0.045]}>
        <cylinderGeometry args={[0.018, 0.018, 0.10, 6]} />
        <meshStandardMaterial color={COLORS.inkDark} roughness={0.7} />
      </mesh>
    </group>
  )
}

function Line({
  position,
  rotation = 0,
  width = 0.55,
  thickness = 0.025,
}) {
  return (
    <mesh position={position} rotation={[0, 0, rotation]}>
      <boxGeometry args={[width, thickness, 0.012]} />
      <meshStandardMaterial color={COLORS.ink} roughness={1} />
    </mesh>
  )
}

/* Arrowhead — two short diagonal strokes at (x, y) */
function ArrowHead({ position, rotation = 0 }) {
  return (
    <group position={position} rotation={[0, 0, rotation]}>
      <mesh position={[0, 0.06, 0]} rotation={[0, 0, -0.6]}>
        <boxGeometry args={[0.16, 0.025, 0.012]} />
        <meshStandardMaterial color={COLORS.ink} roughness={1} />
      </mesh>
      <mesh position={[0, -0.06, 0]} rotation={[0, 0, 0.6]}>
        <boxGeometry args={[0.16, 0.025, 0.012]} />
        <meshStandardMaterial color={COLORS.ink} roughness={1} />
      </mesh>
    </group>
  )
}

/* Horizontal arrow: line + arrowhead on right side */
function Arrow({ position, rotation = 0, width = 0.55 }) {
  return (
    <group position={position} rotation={[0, 0, rotation]}>
      <Line position={[0, 0, 0]} width={width} />
      <ArrowHead position={[width / 2, 0, 0]} />
    </group>
  )
}

function DiagramNode({ position, radius = 0.08 }) {
  return (
    <mesh position={position}>
      <circleGeometry args={[radius, 16]} />
      <meshStandardMaterial color={COLORS.ink} roughness={1} />
    </mesh>
  )
}

function Label({
  position,
  rotation = 0,
  width = 0.62,
  color = COLORS.paperDark,
}) {
  return (
    <group position={position} rotation={[0, 0, rotation]}>
      <mesh castShadow>
        <boxGeometry args={[width, 0.20, 0.025]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.025, 0.02]}>
        <boxGeometry args={[width * 0.65, 0.025, 0.008]} />
        <meshStandardMaterial color={COLORS.inkDark} roughness={1} />
      </mesh>
    </group>
  )
}

/* ============================================================
   DEVELOPMENT MOTIFS — v2
   ------------------------------------------------------------
   Tema: engineering workflow, pipeline nodes, spec sheet.
   Semua ornamen dalam bounds X ±3.10 dan Y -0.40 .. +2.85.
   ============================================================ */
function DevelopmentMotifs() {
  return (
    <group position={[0, 0, 0.24]}>

      {/* ─── TOP LEFT: yellow sticky ─── */}
      <StickyNote
        position={[-2.55, 2.35, 0]}
        rotation={-0.06}
        color={COLORS.stickyYellow}
      />
      <Pin position={[-2.55, 2.58, 0]} />

      {/* ─── TOP RIGHT: blue sticky ─── */}
      <StickyNote
        position={[2.55, 2.40, 0]}
        rotation={0.09}
        color={COLORS.stickyBlue}
      />
      <Pin position={[2.55, 2.63, 0]} color={COLORS.pinBlue} />

      {/* ─── CENTER: pipeline workflow ─── */}
      <DiagramNode position={[-1.85, 1.40, 0]} radius={0.095} />
      <DiagramNode position={[-0.55, 1.40, 0]} radius={0.095} />
      <DiagramNode position={[ 0.75, 1.40, 0]} radius={0.095} />
      <DiagramNode position={[ 2.05, 1.40, 0]} radius={0.095} />

      <Arrow position={[-1.20, 1.40, 0]} width={0.42} />
      <Arrow position={[ 0.10, 1.40, 0]} width={0.42} />
      <Arrow position={[ 1.40, 1.40, 0]} width={0.42} />

      {/* Labels under each node */}
      <Line position={[-1.85, 1.15, 0]} width={0.42} thickness={0.022} />
      <Line position={[-0.55, 1.15, 0]} width={0.42} thickness={0.022} />
      <Line position={[ 0.75, 1.15, 0]} width={0.42} thickness={0.022} />
      <Line position={[ 2.05, 1.15, 0]} width={0.42} thickness={0.022} />

      {/* ─── BOTTOM LEFT: spec paper ─── */}
      <Paper
        position={[-2.55, 0.20, 0]}
        rotation={0.14}
        size={[0.58, 0.44]}
      />
      <Line position={[-2.55, 0.30, 0.02]} width={0.40} />
      <Line position={[-2.55, 0.20, 0.02]} width={0.46} />
      <Line position={[-2.55, 0.10, 0.02]} width={0.32} />
      <Pin position={[-2.55, 0.48, 0]} />

      {/* ─── BOTTOM RIGHT: green sticky ─── */}
      <StickyNote
        position={[2.55, 0.20, 0]}
        rotation={-0.05}
        color={COLORS.stickyGreen}
      />
      <Pin position={[2.55, 0.43, 0]} color={COLORS.pinGreen} />

      {/* ─── BOTTOM CENTER: mini branch diagram ─── */}
      <DiagramNode position={[-0.60, 0.35, 0]} radius={0.07} />
      <DiagramNode position={[ 0.10, 0.35, 0]} radius={0.07} />
      <DiagramNode position={[ 0.80, 0.35, 0]} radius={0.07} />
      <Line position={[-0.25, 0.35, 0]} width={0.42} thickness={0.020} />
      <Line position={[ 0.45, 0.35, 0]} width={0.42} thickness={0.020} />

      {/* ─── LABELS ─── */}
      <Label
        position={[0.05, 2.10, 0]}
        rotation={-0.03}
        width={0.68}
      />
      <Label
        position={[1.90, 0.55, 0]}
        rotation={0.05}
        width={0.55}
      />

      {/* ─── TAPE ─── */}
      <Tape position={[-2.05, 2.75, 0]} rotation={-0.18} />
      <Tape position={[ 2.10, 2.78, 0]} rotation={0.16} />
      <Tape
        position={[-2.05, 0.52, 0]}
        rotation={0.12}
        size={[0.50, 0.14]}
      />

      {/* ─── EXTRA TEXTURE LINES ─── */}
      <Line position={[-1.35, 2.15, 0]} rotation={0.04} width={0.42} />
      <Line position={[ 1.30, 2.05, 0]} rotation={-0.06} width={0.36} />
      <Line position={[-0.10, 0.00, 0]} rotation={0.05} width={0.34} />
    </group>
  )
}

/* ============================================================
   JOURNAL MOTIFS — v2
   ------------------------------------------------------------
   Tema: editorial, academic, research notes.
   Fokus pada layout paper & citation lines yang rapi.
   ============================================================ */
function JournalMotifs() {
  return (
    <group position={[0, 0, 0.24]}>

      {/* ─── TOP LEFT: large white paper (abstract) ─── */}
      <Paper
        position={[-2.55, 2.20, 0]}
        rotation={-0.05}
        size={[0.68, 0.50]}
        color={COLORS.paperWhite}
      />
      <Line position={[-2.55, 2.30, 0.02]} width={0.42} />
      <Line position={[-2.55, 2.20, 0.02]} width={0.50} />
      <Line position={[-2.55, 2.10, 0.02]} width={0.34} />
      <Line position={[-2.55, 2.00, 0.02]} width={0.44} />
      <Pin position={[-2.55, 2.46, 0]} />

      {/* ─── TOP RIGHT: rose sticky ─── */}
      <StickyNote
        position={[2.55, 2.30, 0]}
        rotation={0.08}
        color={COLORS.stickyRose}
      />
      <Pin position={[2.55, 2.53, 0]} />

      {/* ─── CENTER: editorial lines (article body) ─── */}
      <Line position={[-0.30, 1.90, 0]} rotation={0.02} width={1.30} />
      <Line position={[-0.35, 1.75, 0]} rotation={0.02} width={1.15} />
      <Line position={[-0.40, 1.60, 0]} rotation={0.02} width={1.25} />
      <Line position={[-0.35, 1.45, 0]} rotation={0.02} width={0.95} />

      {/* ─── CENTER-BOTTOM: citation graph ─── */}
      <DiagramNode position={[-0.55, 0.90, 0]} radius={0.075} />
      <DiagramNode position={[ 0.30, 0.90, 0]} radius={0.075} />
      <DiagramNode position={[ 0.90, 0.55, 0]} radius={0.075} />
      <Line position={[-0.12, 0.90, 0]} width={0.55} thickness={0.018} />
      <Line
        position={[0.60, 0.72, 0]}
        rotation={-0.6}
        width={0.45}
        thickness={0.018}
      />

      {/* ─── BOTTOM LEFT: cream sticky ─── */}
      <StickyNote
        position={[-2.55, 0.15, 0]}
        rotation={0.06}
        color={COLORS.stickyCream}
      />
      <Pin position={[-2.55, 0.38, 0]} color={COLORS.pinGreen} />

      {/* ─── BOTTOM RIGHT: reference paper ─── */}
      <Paper
        position={[2.55, 0.20, 0]}
        rotation={-0.12}
        size={[0.60, 0.46]}
        color={COLORS.paperWhite}
      />
      <Line position={[2.55, 0.30, 0.02]} width={0.42} />
      <Line position={[2.55, 0.20, 0.02]} width={0.50} />
      <Line position={[2.55, 0.10, 0.02]} width={0.38} />
      <Pin position={[2.55, 0.46, 0]} color={COLORS.pinBlue} />

      {/* ─── TAPE ─── */}
      <Tape position={[-2.10, 2.65, 0]} rotation={-0.16} />
      <Tape position={[ 2.00, 1.20, 0]} rotation={0.15} />
      <Tape
        position={[-2.05, 0.48, 0]}
        rotation={0.10}
        size={[0.44, 0.14]}
      />
      <Tape
        position={[ 2.05, 0.55, 0]}
        rotation={-0.14}
        size={[0.44, 0.14]}
      />

      {/* ─── LABELS ─── */}
      <Label
        position={[0.30, 2.45, 0]}
        rotation={-0.02}
        width={0.72}
      />
      <Label
        position={[1.65, 0.15, 0]}
        rotation={0.05}
        width={0.58}
      />

      {/* ─── EXTRA TEXTURE LINES ─── */}
      <Line position={[-1.45, 1.20, 0]} rotation={0.03} width={0.55} />
      <Line position={[ 1.35, 1.55, 0]} rotation={-0.04} width={0.42} />
    </group>
  )
}

/* ============================================================
   CREATIVE MOTIFS — v2
   ------------------------------------------------------------
   Tema: brainstorming, ide-ide yang tersebar.
   Fokus pada cluster sticky note dengan panah menghubungkan.
   ============================================================ */
function CreativeMotifs() {
  return (
    <group position={[0, 0, 0.24]}>

      {/* ─── CORNER STICKIES ─── */}
      <StickyNote
        position={[-2.60, 2.35, 0]}
        rotation={-0.10}
        color={COLORS.stickyRose}
      />
      <Pin position={[-2.60, 2.58, 0]} />

      <StickyNote
        position={[ 2.60, 2.30, 0]}
        rotation={0.08}
        color={COLORS.stickyBlue}
      />
      <Pin position={[ 2.60, 2.53, 0]} color={COLORS.pinBlue} />

      <StickyNote
        position={[-2.60, 0.15, 0]}
        rotation={0.07}
        color={COLORS.stickyGreen}
      />
      <Pin position={[-2.60, 0.38, 0]} color={COLORS.pinGreen} />

      <StickyNote
        position={[ 2.60, 0.20, 0]}
        rotation={-0.06}
        color={COLORS.stickyCream}
      />
      <Pin position={[ 2.60, 0.43, 0]} color={COLORS.pin} />

      {/* ─── CENTER: focal yellow sticky ─── */}
      <StickyNote
        position={[0, 1.40, 0]}
        rotation={0.03}
        color={COLORS.stickyYellow}
        size={[0.68, 0.55]}
      />
      <Pin position={[0, 1.70, 0]} />

      {/* ─── ARROWS radiating from center ─── */}
      <Arrow
        position={[-1.45, 1.85, 0]}
        rotation={0.35}
        width={0.62}
      />
      <Arrow
        position={[ 1.45, 1.85, 0]}
        rotation={-0.35}
        width={0.62}
      />
      <Arrow
        position={[-1.40, 0.80, 0]}
        rotation={-0.30}
        width={0.62}
      />
      <Arrow
        position={[ 1.40, 0.80, 0]}
        rotation={0.30}
        width={0.62}
      />

      {/* ─── SMALL PAPER NOTES between corners ─── */}
      <Paper
        position={[-1.40, 0.15, 0]}
        rotation={0.12}
        size={[0.50, 0.36]}
      />
      <Line position={[-1.40, 0.24, 0.02]} width={0.34} />
      <Line position={[-1.40, 0.14, 0.02]} width={0.40} />

      <Paper
        position={[1.40, 2.05, 0]}
        rotation={-0.14}
        size={[0.52, 0.38]}
      />
      <Line position={[1.40, 2.14, 0.02]} width={0.36} />
      <Line position={[1.40, 2.04, 0.02]} width={0.42} />

      {/* ─── LABELS ─── */}
      <Label
        position={[-0.20, 2.65, 0]}
        rotation={0.04}
        width={0.68}
      />
      <Label
        position={[ 0.30, 0.35, 0]}
        rotation={-0.05}
        width={0.62}
      />

      {/* ─── TAPE ─── */}
      <Tape position={[-2.15, 2.75, 0]} rotation={-0.20} />
      <Tape position={[ 2.15, 2.70, 0]} rotation={0.18} />
      <Tape
        position={[-2.20, 0.55, 0]}
        rotation={0.15}
        size={[0.48, 0.14]}
      />
      <Tape
        position={[ 2.20, 0.60, 0]}
        rotation={-0.12}
        size={[0.48, 0.14]}
      />

      {/* ─── SCATTERED SMALL LINES (idea fragments) ─── */}
      <Line position={[-0.90, 2.20, 0]} rotation={0.06} width={0.34} />
      <Line position={[ 0.85, 2.20, 0]} rotation={-0.06} width={0.30} />
      <Line position={[-0.75, 0.45, 0]} rotation={0.04} width={0.36} />
      <Line position={[ 0.85, 0.45, 0]} rotation={-0.04} width={0.32} />
    </group>
  )
}

/* ============================================================
   VARIANT DISPATCHER
   ------------------------------------------------------------
   variant:
     'development'  → technical / workflow  (default)
     'journal'      → editorial / academic
     'creative'     → brainstorming
   ============================================================ */
function BoardMotifs({ variant = 'development' }) {
  if (variant === 'journal') {
    return <JournalMotifs />
  }

  if (variant === 'creative') {
    return <CreativeMotifs />
  }

  return <DevelopmentMotifs />
}

export default BoardMotifs
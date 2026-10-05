import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { getTerrainPosition } from '../world/terrainHelper'

/* ============================================================
   PALETTES
   ============================================================ */
const SKINS = {
  light:  { base: '#f4d3b0', shade: '#e0b890' },
  fair:   { base: '#e8bb96', shade: '#d19e78' },
  medium: { base: '#d19c73', shade: '#b88055' },
  tan:    { base: '#b87d52', shade: '#9a6340' },
  dark:   { base: '#7a4a2f', shade: '#5f3822' },
}

const HAIRS = {
  black:     { base: '#1a1a1a', light: '#2f2f2f' },
  darkBrown: { base: '#3b2617', light: '#5a3d29' },
  brown:     { base: '#5c3d21', light: '#7d5734' },
  blueBlack: { base: '#10192b', light: '#1e2c4a' },
  blonde:    { base: '#d9b878', light: '#ead09a' },
}

const PANTS = {
  navy:  { base: '#1b2a4e', dark: '#152238' },
  black: { base: '#1a1a1a', dark: '#0f0f0f' },
  blue:  { base: '#2c4a7c', dark: '#1e3557' },
  gray:  { base: '#4b5563', dark: '#374151' },
}

const SHOES = {
  white: { base: '#f1f5f9', sole: '#cbd5e1' },
  black: { base: '#1f2937', sole: '#111827' },
  blue:  { base: '#3b82f6', sole: '#1e40af' },
}

const OUTFITS = {
  hoodie:  { base: '#1e8a4b', dark: '#11e481', light: '#a2ecca', accent: '#3b82f6', accentSoft: '#60a5fa', sleeve: 'long'  },
  jacket:  { base: '#2f3744', dark: '#1a1f27', light: '#414b5c', accent: '#94a3b8', accentSoft: '#cbd5e1', sleeve: 'long'  },
  sweater: { base: '#6b7a9c', dark: '#4a5775', light: '#8494b5', accent: '#e5e7eb', accentSoft: '#f1f5f9', sleeve: 'long'  },
  tshirt:  { base: '#e5e7eb', dark: '#cbd5e1', light: '#f8fafc', accent: '#3b82f6', accentSoft: '#60a5fa', sleeve: 'short' },
}

const EYE = { white: '#f8fafc', iris: '#2f6fed' }
const MOUTH_COLOR = '#8a3b3b'

/* ============================================================
   UTIL
   ============================================================ */
function damp(current, target, speed, delta) {
  const k = 1 - Math.exp(-speed * delta)
  return current + (target - current) * k
}

/* ============================================================
   TIMELINES & CONSTANTS
   ============================================================ */
const IDLE_TIMELINE = [
  { name: 'normal', duration: 3.5 },
  { name: 'blink',  duration: 0.16 },
  { name: 'normal', duration: 2.8 },
  { name: 'smile',  duration: 2.0 },
  { name: 'normal', duration: 3.2 },
  { name: 'blink',  duration: 0.16 },
  { name: 'normal', duration: 3.6 },
]

const CONVERSATION_TIMELINE = [
  { name: 'rest',       duration: 1.8 },
  { name: 'raiseLeft',  duration: 1.0 },
  { name: 'rest',       duration: 1.2 },
  { name: 'raiseRight', duration: 0.9 },
  { name: 'rest',       duration: 1.4 },
  { name: 'bothHands',  duration: 1.1 },
  { name: 'rest',       duration: 1.6 },
  { name: 'explain',    duration: 1.4 },
  { name: 'rest',       duration: 2.0 },
]

const MOUTH_NORMAL_X = 0.9
const MOUTH_NORMAL_Y = 0.2
const MOUTH_SMILE_X_MAX = 1.1
const MOUTH_SMILE_Y_MAX = 0.35

/* ============================================================
   HAIR COMPONENTS
   ============================================================ */
function HairShort({ base, light }) {
  return (
    <>
      <mesh position={[0, 0.56, 0.02]}>
        <boxGeometry args={[1.16, 0.18, 1.08]} />
        <meshStandardMaterial color={base} roughness={0.85} />
      </mesh>
      <mesh position={[-0.2, 0.68, -0.02]} rotation={[0, 0, -0.12]}>
        <boxGeometry args={[0.72, 0.24, 0.86]} />
        <meshStandardMaterial color={light} roughness={0.82} />
      </mesh>
      <mesh position={[0.22, 0.70, 0.02]} rotation={[0, 0, 0.10]}>
        <boxGeometry args={[0.72, 0.22, 0.82]} />
        <meshStandardMaterial color={base} roughness={0.82} />
      </mesh>
      <mesh position={[-0.54, 0.27, 0.03]} rotation={[0, 0, -0.08]}>
        <boxGeometry args={[0.1, 0.46, 0.78]} />
        <meshStandardMaterial color={base} roughness={0.88} />
      </mesh>
      <mesh position={[0.54, 0.27, 0.03]} rotation={[0, 0, 0.08]}>
        <boxGeometry args={[0.1, 0.46, 0.78]} />
        <meshStandardMaterial color={base} roughness={0.88} />
      </mesh>
      <mesh position={[0, 0.3, 0.51]}>
        <boxGeometry args={[1.02, 0.42, 0.12]} />
        <meshStandardMaterial color={base} roughness={0.85} />
      </mesh>
      <mesh position={[-0.28, 0.55, -0.53]} rotation={[0.08, 0, -0.18]}>
        <boxGeometry args={[0.4, 0.16, 0.12]} />
        <meshStandardMaterial color={base} roughness={0.82} />
      </mesh>
      <mesh position={[0.0, 0.6, -0.54]} rotation={[0.05, 0, -0.06]}>
        <boxGeometry args={[0.44, 0.16, 0.12]} />
        <meshStandardMaterial color={light} roughness={0.8} />
      </mesh>
      <mesh position={[0.26, 0.66, -0.51]} rotation={[0.02, 0, 0.14]}>
        <boxGeometry args={[0.4, 0.16, 0.12]} />
        <meshStandardMaterial color={base} roughness={0.8} />
      </mesh>
    </>
  )
}

function HairSwept({ base, light }) {
  return (
    <>
      <mesh position={[0, 0.56, 0.02]}>
        <boxGeometry args={[1.16, 0.2, 1.08]} />
        <meshStandardMaterial color={base} roughness={0.85} />
      </mesh>
      <mesh position={[-0.15, 0.7, -0.05]} rotation={[0.05, 0, -0.28]}>
        <boxGeometry args={[0.8, 0.24, 0.9]} />
        <meshStandardMaterial color={light} roughness={0.82} />
      </mesh>
      <mesh position={[0.32, 0.72, -0.02]} rotation={[0.05, 0, 0.32]}>
        <boxGeometry args={[0.6, 0.22, 0.86]} />
        <meshStandardMaterial color={base} roughness={0.82} />
      </mesh>
      <mesh position={[0.5, 0.62, -0.28]} rotation={[0.1, 0, 0.45]}>
        <boxGeometry args={[0.5, 0.2, 0.4]} />
        <meshStandardMaterial color={base} roughness={0.8} />
      </mesh>
      <mesh position={[-0.54, 0.22, 0.03]} rotation={[0, 0, -0.12]}>
        <boxGeometry args={[0.1, 0.36, 0.78]} />
        <meshStandardMaterial color={base} roughness={0.88} />
      </mesh>
      <mesh position={[0.54, 0.22, 0.03]} rotation={[0, 0, 0.12]}>
        <boxGeometry args={[0.1, 0.36, 0.78]} />
        <meshStandardMaterial color={base} roughness={0.88} />
      </mesh>
      <mesh position={[0, 0.28, 0.51]}>
        <boxGeometry args={[1.02, 0.4, 0.12]} />
        <meshStandardMaterial color={base} roughness={0.85} />
      </mesh>
      <mesh position={[-0.32, 0.56, -0.53]} rotation={[0.08, 0, -0.28]}>
        <boxGeometry args={[0.42, 0.18, 0.12]} />
        <meshStandardMaterial color={base} roughness={0.82} />
      </mesh>
      <mesh position={[0.02, 0.62, -0.54]} rotation={[0.05, 0, 0.12]}>
        <boxGeometry args={[0.5, 0.18, 0.12]} />
        <meshStandardMaterial color={light} roughness={0.8} />
      </mesh>
      <mesh position={[0.32, 0.66, -0.5]} rotation={[0.02, 0, 0.32]}>
        <boxGeometry args={[0.42, 0.18, 0.12]} />
        <meshStandardMaterial color={base} roughness={0.8} />
      </mesh>
    </>
  )
}

function HairBob({ base, light }) {
  return (
    <>
      <mesh position={[0, 0.56, 0.02]}>
        <boxGeometry args={[1.2, 0.22, 1.1]} />
        <meshStandardMaterial color={base} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.72, -0.02]}>
        <boxGeometry args={[1.1, 0.2, 0.95]} />
        <meshStandardMaterial color={light} roughness={0.82} />
      </mesh>
      <mesh position={[-0.58, -0.1, 0.03]}>
        <boxGeometry args={[0.12, 1.1, 0.85]} />
        <meshStandardMaterial color={base} roughness={0.88} />
      </mesh>
      <mesh position={[0.58, -0.1, 0.03]}>
        <boxGeometry args={[0.12, 1.1, 0.85]} />
        <meshStandardMaterial color={base} roughness={0.88} />
      </mesh>
      <mesh position={[0, -0.05, 0.53]}>
        <boxGeometry args={[1.15, 1.15, 0.14]} />
        <meshStandardMaterial color={base} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.6, -0.53]}>
        <boxGeometry args={[1.0, 0.2, 0.12]} />
        <meshStandardMaterial color={light} roughness={0.82} />
      </mesh>
      <mesh position={[-0.3, 0.46, -0.53]} rotation={[0.05, 0, -0.05]}>
        <boxGeometry args={[0.4, 0.22, 0.12]} />
        <meshStandardMaterial color={base} roughness={0.82} />
      </mesh>
      <mesh position={[0.3, 0.46, -0.53]} rotation={[0.05, 0, 0.05]}>
        <boxGeometry args={[0.4, 0.22, 0.12]} />
        <meshStandardMaterial color={base} roughness={0.82} />
      </mesh>
    </>
  )
}

function HairLong({ base, light }) {
  return (
    <>
      <mesh position={[0, 0.56, 0.02]}>
        <boxGeometry args={[1.18, 0.2, 1.08]} />
        <meshStandardMaterial color={base} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.72, -0.02]}>
        <boxGeometry args={[1.1, 0.22, 0.95]} />
        <meshStandardMaterial color={light} roughness={0.82} />
      </mesh>
      <mesh position={[-0.6, -0.55, 0.03]}>
        <boxGeometry args={[0.14, 2.0, 0.85]} />
        <meshStandardMaterial color={base} roughness={0.88} />
      </mesh>
      <mesh position={[0.6, -0.55, 0.03]}>
        <boxGeometry args={[0.14, 2.0, 0.85]} />
        <meshStandardMaterial color={base} roughness={0.88} />
      </mesh>
      <mesh position={[0, -0.5, 0.53]}>
        <boxGeometry args={[1.2, 2.1, 0.14]} />
        <meshStandardMaterial color={base} roughness={0.85} />
      </mesh>
      <mesh position={[0, -1.4, 0.5]}>
        <boxGeometry args={[1.15, 0.24, 0.2]} />
        <meshStandardMaterial color={light} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.6, -0.53]}>
        <boxGeometry args={[1.02, 0.2, 0.12]} />
        <meshStandardMaterial color={light} roughness={0.82} />
      </mesh>
      <mesh position={[-0.28, 0.44, -0.53]} rotation={[0.05, 0, -0.08]}>
        <boxGeometry args={[0.4, 0.24, 0.12]} />
        <meshStandardMaterial color={base} roughness={0.82} />
      </mesh>
      <mesh position={[0.28, 0.44, -0.53]} rotation={[0.05, 0, 0.08]}>
        <boxGeometry args={[0.4, 0.24, 0.12]} />
        <meshStandardMaterial color={base} roughness={0.82} />
      </mesh>
    </>
  )
}

function HairPonytail({ base, light }) {
  return (
    <>
      <mesh position={[0, 0.56, 0.02]}>
        <boxGeometry args={[1.16, 0.2, 1.08]} />
        <meshStandardMaterial color={base} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.72, 0.02]} rotation={[0.05, 0, 0]}>
        <boxGeometry args={[1.08, 0.2, 0.95]} />
        <meshStandardMaterial color={light} roughness={0.82} />
      </mesh>
      <mesh position={[-0.54, 0.24, 0.03]} rotation={[0, 0, -0.06]}>
        <boxGeometry args={[0.1, 0.4, 0.78]} />
        <meshStandardMaterial color={base} roughness={0.88} />
      </mesh>
      <mesh position={[0.54, 0.24, 0.03]} rotation={[0, 0, 0.06]}>
        <boxGeometry args={[0.1, 0.4, 0.78]} />
        <meshStandardMaterial color={base} roughness={0.88} />
      </mesh>
      <mesh position={[0, 0.3, 0.51]}>
        <boxGeometry args={[1.02, 0.42, 0.12]} />
        <meshStandardMaterial color={base} roughness={0.85} />
      </mesh>
      <mesh position={[0, -0.5, 0.62]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[0.32, 1.2, 0.24]} />
        <meshStandardMaterial color={base} roughness={0.85} />
      </mesh>
      <mesh position={[0, -1.15, 0.55]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[0.28, 0.3, 0.24]} />
        <meshStandardMaterial color={light} roughness={0.85} />
      </mesh>
      <mesh position={[-0.25, 0.58, -0.53]} rotation={[0.08, 0, -0.15]}>
        <boxGeometry args={[0.42, 0.16, 0.12]} />
        <meshStandardMaterial color={base} roughness={0.82} />
      </mesh>
      <mesh position={[0.15, 0.62, -0.53]} rotation={[0.05, 0, 0.1]}>
        <boxGeometry args={[0.42, 0.16, 0.12]} />
        <meshStandardMaterial color={light} roughness={0.82} />
      </mesh>
    </>
  )
}

const HAIR_COMPONENTS = {
  short: HairShort,
  swept: HairSwept,
  bob: HairBob,
  long: HairLong,
  ponytail: HairPonytail,
}

/* ============================================================
   OUTFIT DETAIL COMPONENTS
   ============================================================ */
function HoodieDetails({ o }) {
  return (
    <>
      <mesh position={[0, 1.98, 0.36]}>
        <boxGeometry args={[0.92, 0.52, 0.34]} />
        <meshStandardMaterial color={o.dark} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.98, 0.3]}>
        <boxGeometry args={[0.72, 0.36, 0.2]} />
        <meshStandardMaterial color={o.dark} roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.14, -0.41]}>
        <boxGeometry args={[0.88, 0.38, 0.09]} />
        <meshStandardMaterial color={o.dark} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.31, -0.42]}>
        <boxGeometry args={[0.88, 0.05, 0.08]} />
        <meshStandardMaterial color={o.light} roughness={0.7} />
      </mesh>
      <mesh position={[-0.15, 1.72, -0.4]}>
        <boxGeometry args={[0.05, 0.34, 0.05]} />
        <meshStandardMaterial color={o.accentSoft} roughness={0.6} />
      </mesh>
      <mesh position={[0.15, 1.72, -0.4]}>
        <boxGeometry args={[0.05, 0.34, 0.05]} />
        <meshStandardMaterial color={o.accentSoft} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[1.52, 0.16, 0.86]} />
        <meshStandardMaterial color={o.dark} roughness={0.8} />
      </mesh>
    </>
  )
}

function JacketDetails({ o }) {
  return (
    <>
      <mesh position={[0, 2.0, 0.04]}>
        <boxGeometry args={[0.72, 0.22, 0.68]} />
        <meshStandardMaterial color={o.dark} roughness={0.75} />
      </mesh>
      <mesh position={[-0.32, 1.72, -0.41]} rotation={[0, 0, -0.22]}>
        <boxGeometry args={[0.18, 0.7, 0.06]} />
        <meshStandardMaterial color={o.light} roughness={0.7} />
      </mesh>
      <mesh position={[0.32, 1.72, -0.41]} rotation={[0, 0, 0.22]}>
        <boxGeometry args={[0.18, 0.7, 0.06]} />
        <meshStandardMaterial color={o.light} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.5, -0.42]}>
        <boxGeometry args={[0.04, 0.9, 0.05]} />
        <meshStandardMaterial color={o.dark} roughness={0.8} />
      </mesh>
      <mesh position={[0.08, 1.72, -0.44]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.03, 6]} />
        <meshStandardMaterial color={o.accent} roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0.08, 1.45, -0.44]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.03, 6]} />
        <meshStandardMaterial color={o.accent} roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0.08, 1.18, -0.44]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.03, 6]} />
        <meshStandardMaterial color={o.accent} roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.98, 0]}>
        <boxGeometry args={[1.56, 0.18, 0.86]} />
        <meshStandardMaterial color={o.dark} roughness={0.8} />
      </mesh>
      <mesh position={[-0.55, 1.15, -0.42]}>
        <boxGeometry args={[0.28, 0.04, 0.06]} />
        <meshStandardMaterial color={o.dark} roughness={0.8} />
      </mesh>
      <mesh position={[0.55, 1.15, -0.42]}>
        <boxGeometry args={[0.28, 0.04, 0.06]} />
        <meshStandardMaterial color={o.dark} roughness={0.8} />
      </mesh>
    </>
  )
}

function SweaterDetails({ o }) {
  return (
    <>
      <mesh position={[0, 1.98, 0.04]}>
        <boxGeometry args={[0.6, 0.16, 0.6]} />
        <meshStandardMaterial color={o.dark} roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[1.52, 0.18, 0.86]} />
        <meshStandardMaterial color={o.dark} roughness={0.85} />
      </mesh>
      <mesh position={[-0.4, 1.0, -0.44]}>
        <boxGeometry args={[0.04, 0.16, 0.04]} />
        <meshStandardMaterial color={o.light} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.0, -0.44]}>
        <boxGeometry args={[0.04, 0.16, 0.04]} />
        <meshStandardMaterial color={o.light} roughness={0.8} />
      </mesh>
      <mesh position={[0.4, 1.0, -0.44]}>
        <boxGeometry args={[0.04, 0.16, 0.04]} />
        <meshStandardMaterial color={o.light} roughness={0.8} />
      </mesh>
    </>
  )
}

function TshirtDetails({ o }) {
  return (
    <>
      <mesh position={[0, 1.98, 0.04]}>
        <boxGeometry args={[0.56, 0.14, 0.56]} />
        <meshStandardMaterial color={o.dark} roughness={0.8} />
      </mesh>
      <mesh position={[-0.38, 1.72, -0.42]}>
        <boxGeometry args={[0.18, 0.14, 0.04]} />
        <meshStandardMaterial color={o.accent} roughness={0.4} metalness={0.15} />
      </mesh>
    </>
  )
}

const OUTFIT_COMPONENTS = {
  hoodie: HoodieDetails,
  jacket: JacketDetails,
  sweater: SweaterDetails,
  tshirt: TshirtDetails,
}

/* ============================================================
   MAIN NPC COMPONENT
   ============================================================ */
function NPC({
  position = [0, 0, 0],
  rotation = [0, 0, 0],

  gender = 'male',
  skinTone = 'medium',
  hair = 'short',
  hairColor = 'black',
  outfit = 'hoodie',
  pants = 'navy',
  shoes = 'white',

  appearance = 'default',
  walkStyle = 'normal',
  talkPose = 'conversation',

  isMovingRef,
  walkTimeRef,
  isTalkingRef,
  characterRef,
}) {
  const headRef = useRef()
  const torsoRef = useRef()
  const leftArmRef = useRef()
  const rightArmRef = useRef()
  const leftLegRef = useRef()
  const rightLegRef = useRef()
  const leftEyeRef = useRef()
  const rightEyeRef = useRef()
  const leftBrowRef = useRef()
  const rightBrowRef = useRef()
  const mouthRef = useRef()

  const internalIsMoving = useRef(false)
  const internalWalkTime = useRef(0)
  const isMoving = isMovingRef || internalIsMoving
  const walkTime = walkTimeRef || internalWalkTime

  const idleStateRef = useRef({ phaseIndex: 0, phaseTime: 0 })
  const conversationStateRef = useRef({ phaseIndex: 0, phaseTime: 0 })
  const talkStartRef = useRef(null)

  const skin = SKINS[skinTone] || SKINS.medium
  const hairColors = HAIRS[hairColor] || HAIRS.black
  const pantsColors = PANTS[pants] || PANTS.navy
  const shoeColors = SHOES[shoes] || SHOES.white

  const outfitKey = outfit
  const outfitColors = OUTFITS[outfitKey] || OUTFITS.hoodie

  const HairComponent = HAIR_COMPONENTS[hair] || HairShort
  const OutfitComponent = OUTFIT_COMPONENTS[outfitKey] || HoodieDetails

  const isFemale = gender === 'female'
  const shoulderWidth = isFemale ? 1.5 : 1.62
  const torsoWidth = isFemale ? 1.34 : 1.42
  const pelvisWidth = isFemale ? 1.24 : 1.28
  const isShortSleeve = outfitColors.sleeve === 'short'

  useFrame((state, delta) => {
    if (!leftArmRef.current || !rightArmRef.current) return
    if (!leftLegRef.current || !rightLegRef.current) return

    const t = state.clock.elapsedTime
    const moving = !!(isMoving && isMoving.current)
    const talking = !!(isTalkingRef && isTalkingRef.current)
    const walkT = walkTime ? walkTime.current : 0

    if (talking) {
      if (talkStartRef.current === null) talkStartRef.current = t
    } else {
      talkStartRef.current = null
    }

    let tLeftArmX = 0, tRightArmX = 0
    let tLeftArmZ = 0, tRightArmZ = 0
    let tLeftLegX = 0, tRightLegX = 0
    let tTorsoY = 0, tTorsoRotX = 0
    let tHeadRotX = 0, tHeadRotY = 0, tHeadRotZ = 0
    let tEyeScaleY = 1
    let tMouthScaleX = MOUTH_NORMAL_X
    let tMouthScaleY = MOUTH_NORMAL_Y
    let tLeftBrowY = 0.25
    let tRightBrowY = 0.25
    let bodySpeed = 18

    /* ---------------- WALK ---------------- */
    if (moving) {
      if (walkStyle === 'serious') {
        // Hands behind back.
        // FRONT karakter = -Z.
        // rotation.x negatif mengayun ujung lengan ke +Z (BELAKANG).
        // rotation.z sesuai sisi untuk gerakan menyilang ke dalam
        // (kiri: +, kanan: -) → kesan "tangan clasped behind back".
        tLeftArmX = -0.80
        tRightArmX = -0.80
        tLeftArmZ = 0.35
        tRightArmZ = -0.35

        const legSwing = Math.sin(walkT) * 0.45
        tLeftLegX = legSwing
        tRightLegX = -legSwing
      } else {
        const swing = Math.sin(walkT) * 0.6
        tLeftArmX = -swing
        tRightArmX = swing
        tLeftLegX = swing
        tRightLegX = -swing
      }
      bodySpeed = 30

      idleStateRef.current.phaseIndex = 0
      idleStateRef.current.phaseTime = 0
      conversationStateRef.current.phaseIndex = 0
      conversationStateRef.current.phaseTime = 0
    }
    /* ---------------- IDLE / TALK ---------------- */
    else {
      const breath = Math.sin(t * 1.35)
      const breathOffset = breath * 0.03
      tTorsoY = breathOffset

      const idle = idleStateRef.current
      idle.phaseTime += delta
      let current = IDLE_TIMELINE[idle.phaseIndex]
      if (idle.phaseTime >= current.duration) {
        idle.phaseTime -= current.duration
        idle.phaseIndex = (idle.phaseIndex + 1) % IDLE_TIMELINE.length
        current = IDLE_TIMELINE[idle.phaseIndex]
      }
      const progress = Math.min(idle.phaseTime / current.duration, 1)
      const phase = current.name

      if (phase === 'blink') {
        const k = Math.sin(progress * Math.PI)
        tEyeScaleY = 1 - k * 0.92
      } else if (phase === 'smile') {
        const k = Math.sin(progress * Math.PI)
        tMouthScaleX = MOUTH_NORMAL_X + (MOUTH_SMILE_X_MAX - MOUTH_NORMAL_X) * k
        tMouthScaleY = MOUTH_NORMAL_Y + (MOUTH_SMILE_Y_MAX - MOUTH_NORMAL_Y) * k
      }

      if (talking) {
        if (talkPose === 'greet') {
          const elapsed =
            talkStartRef.current !== null
              ? t - talkStartRef.current
              : 0

          const rise = Math.min(elapsed / 0.7, 1)
          const env = rise * rise * (3 - 2 * rise)

          // Doctor greeting pose
          // FRONT karakter = -Z
          //
          // rotation.z besar → lengan terangkat ke atas
          // kiri  = negatif
          // kanan = positif
          //
          // rotation.x positif → sedikit condong ke depan

          tLeftArmX = 0.15 * env
          tRightArmX = 0.15 * env

          tLeftArmZ = -2.25 * env
          tRightArmZ = 2.25 * env

          // Sedikit gerakan tangan saat menyapa
          const sway =
            Math.sin(elapsed * 2.2) * 0.08 * env

          tLeftArmZ += sway
          tRightArmZ -= sway

          // Kepala tetap natural
          tHeadRotX = Math.sin(t * 1.2) * 0.02
          tHeadRotY = Math.sin(t * 1.6) * 0.05
          tHeadRotZ = Math.sin(t * 0.9) * 0.03

          tTorsoRotX = -0.05 * env
          tTorsoY = breathOffset * env

          bodySpeed = 12
        } else {
          const conv = conversationStateRef.current
          conv.phaseTime += delta
          let convCur = CONVERSATION_TIMELINE[conv.phaseIndex]
          if (conv.phaseTime >= convCur.duration) {
            conv.phaseTime -= convCur.duration
            conv.phaseIndex = (conv.phaseIndex + 1) % CONVERSATION_TIMELINE.length
            convCur = CONVERSATION_TIMELINE[conv.phaseIndex]
          }
          const cProg = Math.min(conv.phaseTime / convCur.duration, 1)
          const cPhase = convCur.name
          const env = Math.sin(cProg * Math.PI)

          tHeadRotX = Math.sin(t * 0.8) * 0.03
          tHeadRotY = Math.sin(t * 0.55) * 0.06
          tHeadRotZ = Math.sin(t * 0.65) * 0.015
          tTorsoRotX = Math.sin(t * 0.6) * 0.012

          if (cPhase === 'raiseLeft') {
            tLeftArmX = 0.70 * env + Math.sin(t * 4.0) * 0.06 * env
            tLeftArmZ = -0.20 * env
            tTorsoRotX += 0.02 * env
          } else if (cPhase === 'raiseRight') {
            tRightArmX = 0.65 * env + Math.sin(t * 4.3 + 0.5) * 0.06 * env
            tRightArmZ = 0.22 * env
            tTorsoRotX += 0.018 * env
          } else if (cPhase === 'bothHands') {
            tLeftArmX = 0.50 * env
            tLeftArmZ = -0.25 * env
            tRightArmX = 0.50 * env
            tRightArmZ = 0.25 * env
            tTorsoY += Math.sin(t * 3.5) * 0.008 * env
          } else if (cPhase === 'explain') {
            const slow = Math.sin(cProg * Math.PI * 2) * 0.15
            tLeftArmX = 0.85 * env + slow * env
            tLeftArmZ = -0.15 * env
            tHeadRotX += Math.sin(t * 4.5) * 0.025 * env
            tTorsoRotX += 0.025 * env
          }
          bodySpeed = 14
        }
      } else {
        tLeftArmX = breathOffset * 1.8
        tRightArmX = breathOffset * 1.8
        tLeftArmZ = Math.sin(t * 0.85) * 0.015
        tRightArmZ = -Math.sin(t * 0.85) * 0.015

        tHeadRotX = Math.sin(t * 0.72) * 0.022
        tHeadRotY = Math.sin(t * 0.53) * 0.05
        tHeadRotZ = Math.sin(t * 0.61) * 0.012

        conversationStateRef.current.phaseIndex = 0
        conversationStateRef.current.phaseTime = 0
        bodySpeed = 18
      }
    }

    const faceSpeed = 22

    leftArmRef.current.rotation.x  = damp(leftArmRef.current.rotation.x,  tLeftArmX,  bodySpeed, delta)
    rightArmRef.current.rotation.x = damp(rightArmRef.current.rotation.x, tRightArmX, bodySpeed, delta)
    leftArmRef.current.rotation.z  = damp(leftArmRef.current.rotation.z,  tLeftArmZ,  bodySpeed, delta)
    rightArmRef.current.rotation.z = damp(rightArmRef.current.rotation.z, tRightArmZ, bodySpeed, delta)

    leftLegRef.current.rotation.x  = damp(leftLegRef.current.rotation.x,  tLeftLegX,  bodySpeed, delta)
    rightLegRef.current.rotation.x = damp(rightLegRef.current.rotation.x, tRightLegX, bodySpeed, delta)

    if (torsoRef.current) {
      torsoRef.current.position.y = damp(torsoRef.current.position.y, tTorsoY, bodySpeed, delta)
      torsoRef.current.rotation.x = damp(torsoRef.current.rotation.x, tTorsoRotX, bodySpeed, delta)
    }
    if (headRef.current) {
      headRef.current.rotation.x = damp(headRef.current.rotation.x, tHeadRotX, bodySpeed, delta)
      headRef.current.rotation.y = damp(headRef.current.rotation.y, tHeadRotY, bodySpeed, delta)
      headRef.current.rotation.z = damp(headRef.current.rotation.z, tHeadRotZ, bodySpeed, delta)
    }
    if (leftEyeRef.current) leftEyeRef.current.scale.y = damp(leftEyeRef.current.scale.y, tEyeScaleY, faceSpeed, delta)
    if (rightEyeRef.current) rightEyeRef.current.scale.y = damp(rightEyeRef.current.scale.y, tEyeScaleY, faceSpeed, delta)
    if (mouthRef.current) {
      mouthRef.current.scale.x = damp(mouthRef.current.scale.x, tMouthScaleX, faceSpeed, delta)
      mouthRef.current.scale.y = damp(mouthRef.current.scale.y, tMouthScaleY, faceSpeed, delta)
    }
    if (leftBrowRef.current) leftBrowRef.current.position.y = damp(leftBrowRef.current.position.y, tLeftBrowY, faceSpeed, delta)
    if (rightBrowRef.current) rightBrowRef.current.position.y = damp(rightBrowRef.current.position.y, tRightBrowY, faceSpeed, delta)
  })

  return (
    <group ref={characterRef} position={getTerrainPosition(position, 0.47)} rotation={rotation}>

      {/* HEAD */}
      <group ref={headRef} position={[0, 2.62, 0]}>
        <mesh position={[0, -0.72, 0]}>
          <boxGeometry args={[0.4, 0.34, 0.4]} />
          <meshStandardMaterial color={skin.shade} roughness={0.85} />
        </mesh>

        <mesh position={[0, 0, 0]}>
          <boxGeometry args={isFemale ? [1.04, 1.12, 1.0] : [1.1, 1.15, 1.05]} />
          <meshStandardMaterial color={skin.base} roughness={0.85} />
        </mesh>

        <mesh position={[-0.555, -0.02, 0.03]}>
          <boxGeometry args={[0.1, 0.24, 0.18]} />
          <meshStandardMaterial color={skin.base} roughness={0.85} />
        </mesh>
        <mesh position={[0.555, -0.02, 0.03]}>
          <boxGeometry args={[0.1, 0.24, 0.18]} />
          <meshStandardMaterial color={skin.base} roughness={0.85} />
        </mesh>

        <group ref={leftEyeRef} position={[-0.23, 0.1, 0]}>
          <mesh position={[0, 0, -0.53]}>
            <boxGeometry args={[0.2, 0.15, 0.04]} />
            <meshStandardMaterial color={EYE.white} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, -0.548]}>
            <boxGeometry args={[0.1, 0.13, 0.03]} />
            <meshStandardMaterial color={EYE.iris} roughness={0.35} />
          </mesh>
        </group>
        <group ref={rightEyeRef} position={[0.23, 0.1, 0]}>
          <mesh position={[0, 0, -0.53]}>
            <boxGeometry args={[0.2, 0.15, 0.04]} />
            <meshStandardMaterial color={EYE.white} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, -0.548]}>
            <boxGeometry args={[0.1, 0.13, 0.03]} />
            <meshStandardMaterial color={EYE.iris} roughness={0.35} />
          </mesh>
        </group>

        <mesh ref={leftBrowRef} position={[-0.23, 0.25, -0.53]}>
          <boxGeometry args={[0.22, 0.055, 0.04]} />
          <meshStandardMaterial color={hairColors.base} roughness={0.9} />
        </mesh>
        <mesh ref={rightBrowRef} position={[0.23, 0.25, -0.53]}>
          <boxGeometry args={[0.22, 0.055, 0.04]} />
          <meshStandardMaterial color={hairColors.base} roughness={0.9} />
        </mesh>

        <mesh position={[0, 0.0, -0.56]}>
          <boxGeometry args={[0.13, 0.15, 0.1]} />
          <meshStandardMaterial color={skin.shade} roughness={0.85} />
        </mesh>

        <group
          ref={mouthRef}
          position={[0, -0.2, -0.53]}
          scale={[MOUTH_NORMAL_X, MOUTH_NORMAL_Y, 1]}
        >
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
            <meshStandardMaterial color={MOUTH_COLOR} roughness={0.7} />
          </mesh>
        </group>

        <HairComponent base={hairColors.base} light={hairColors.light} />

       
      </group>

      {/* PELVIS */}
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[pelvisWidth, 0.52, 0.72]} />
        <meshStandardMaterial color={pantsColors.base} roughness={0.8} />
      </mesh>

      {/* TORSO */}
      <group ref={torsoRef}>
        <mesh position={[0, 1.47, 0]}>
          <boxGeometry args={[torsoWidth, 1.06, 0.78]} />
          <meshStandardMaterial color={outfitColors.base} roughness={0.75} />
        </mesh>

        <mesh position={[0, 1.9, 0]}>
          <boxGeometry args={[shoulderWidth, 0.24, 0.84]} />
          <meshStandardMaterial color={outfitColors.base} roughness={0.75} />
        </mesh>

        <mesh position={[-(torsoWidth / 2 + 0.01), 1.5, 0]}>
          <boxGeometry args={[0.04, 0.7, 0.5]} />
          <meshStandardMaterial color={outfitColors.light} roughness={0.7} />
        </mesh>
        <mesh position={[(torsoWidth / 2 + 0.01), 1.5, 0]}>
          <boxGeometry args={[0.04, 0.7, 0.5]} />
          <meshStandardMaterial color={outfitColors.light} roughness={0.7} />
        </mesh>

        <OutfitComponent o={outfitColors} />
      </group>

      {/* LEFT ARM */}
      <group ref={leftArmRef} position={[-0.98, 1.95, 0]}>
        <mesh position={[0, -0.14, 0]}>
          <boxGeometry args={[0.44, 0.44, 0.54]} />
          <meshStandardMaterial color={outfitColors.base} roughness={0.75} />
        </mesh>
        <mesh position={[0, -0.48, 0]}>
          <boxGeometry args={[0.36, 0.54, 0.42]} />
          <meshStandardMaterial color={outfitColors.base} roughness={0.75} />
        </mesh>

        <group position={[0, -0.78, 0]} rotation={[0.2, 0, 0]}>
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[0.33, 0.12, 0.4]} />
            <meshStandardMaterial color={outfitColors.dark} roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.24, 0]}>
            <boxGeometry args={[0.32, 0.46, 0.38]} />
            <meshStandardMaterial
              color={isShortSleeve ? skin.base : outfitColors.base}
              roughness={0.78}
            />
          </mesh>
          <mesh position={[0, -0.48, 0]}>
            <boxGeometry args={[0.34, 0.12, 0.4]} />
            <meshStandardMaterial
              color={isShortSleeve ? skin.shade : outfitColors.dark}
              roughness={0.8}
            />
          </mesh>
          <mesh position={[0, -0.62, 0]}>
            <boxGeometry args={[0.3, 0.26, 0.34]} />
            <meshStandardMaterial color={skin.base} roughness={0.85} />
          </mesh>
        </group>
      </group>

      {/* RIGHT ARM */}
      <group ref={rightArmRef} position={[0.98, 1.95, 0]}>
        <mesh position={[0, -0.14, 0]}>
          <boxGeometry args={[0.44, 0.44, 0.54]} />
          <meshStandardMaterial color={outfitColors.base} roughness={0.75} />
        </mesh>
        <mesh position={[0, -0.48, 0]}>
          <boxGeometry args={[0.36, 0.54, 0.42]} />
          <meshStandardMaterial color={outfitColors.base} roughness={0.75} />
        </mesh>

        <group position={[0, -0.78, 0]} rotation={[0.2, 0, 0]}>
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[0.33, 0.12, 0.4]} />
            <meshStandardMaterial color={outfitColors.dark} roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.24, 0]}>
            <boxGeometry args={[0.32, 0.46, 0.38]} />
            <meshStandardMaterial
              color={isShortSleeve ? skin.base : outfitColors.base}
              roughness={0.78}
            />
          </mesh>
          <mesh position={[0, -0.48, 0]}>
            <boxGeometry args={[0.34, 0.12, 0.4]} />
            <meshStandardMaterial
              color={isShortSleeve ? skin.shade : outfitColors.dark}
              roughness={0.8}
            />
          </mesh>
          <mesh position={[0, -0.62, 0]}>
            <boxGeometry args={[0.3, 0.26, 0.34]} />
            <meshStandardMaterial color={skin.base} roughness={0.85} />
          </mesh>
        </group>
      </group>

      {/* LEFT LEG */}
      <group ref={leftLegRef} position={[-0.42, 0.9, 0]}>
        <mesh position={[0, -0.36, 0]}>
          <boxGeometry args={[0.46, 0.72, 0.54]} />
          <meshStandardMaterial color={pantsColors.base} roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.73, 0]}>
          <boxGeometry args={[0.43, 0.12, 0.5]} />
          <meshStandardMaterial color={pantsColors.dark} roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.97, 0]}>
          <boxGeometry args={[0.4, 0.5, 0.46]} />
          <meshStandardMaterial color={pantsColors.base} roughness={0.8} />
        </mesh>

        <mesh position={[0, -1.27, -0.06]}>
          <boxGeometry args={[0.42, 0.14, 0.6]} />
          <meshStandardMaterial color={shoeColors.base} roughness={0.6} />
        </mesh>
        <mesh position={[0, -1.3, -0.06]}>
          <boxGeometry args={[0.44, 0.05, 0.6]} />
          <meshStandardMaterial color={shoeColors.base} roughness={0.5} />
        </mesh>
        <mesh position={[0, -1.28, -0.34]}>
          <boxGeometry args={[0.4, 0.1, 0.14]} />
          <meshStandardMaterial color={shoeColors.base} roughness={0.6} />
        </mesh>
        <mesh position={[0, -1.37, -0.07]}>
          <boxGeometry args={[0.46, 0.07, 0.64]} />
          <meshStandardMaterial color={shoeColors.sole} roughness={0.7} />
        </mesh>
      </group>

      {/* RIGHT LEG */}
      <group ref={rightLegRef} position={[0.42, 0.9, 0]}>
        <mesh position={[0, -0.36, 0]}>
          <boxGeometry args={[0.46, 0.72, 0.54]} />
          <meshStandardMaterial color={pantsColors.base} roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.73, 0]}>
          <boxGeometry args={[0.43, 0.12, 0.5]} />
          <meshStandardMaterial color={pantsColors.dark} roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.97, 0]}>
          <boxGeometry args={[0.4, 0.5, 0.46]} />
          <meshStandardMaterial color={pantsColors.base} roughness={0.8} />
        </mesh>

        <mesh position={[0, -1.27, -0.06]}>
          <boxGeometry args={[0.42, 0.14, 0.6]} />
          <meshStandardMaterial color={shoeColors.base} roughness={0.6} />
        </mesh>
        <mesh position={[0, -1.3, -0.06]}>
          <boxGeometry args={[0.44, 0.05, 0.6]} />
          <meshStandardMaterial color={shoeColors.base} roughness={0.5} />
        </mesh>
        <mesh position={[0, -1.28, -0.34]}>
          <boxGeometry args={[0.4, 0.1, 0.14]} />
          <meshStandardMaterial color={shoeColors.base} roughness={0.6} />
        </mesh>
        <mesh position={[0, -1.37, -0.07]}>
          <boxGeometry args={[0.46, 0.07, 0.64]} />
          <meshStandardMaterial color={shoeColors.sole} roughness={0.7} />
        </mesh>
      </group>

    </group>
  )
}

export default NPC
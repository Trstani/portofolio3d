import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'
import { getTerrainPosition } from '../../world/terrainHelper'
import { Html } from '@react-three/drei'

/* ============================================================
   PALETTE
   ============================================================ */
const FOX = {
  orange: '#D97706',
  orangeLight: '#F59E0B',
  orangeDark: '#A84E00',
  white: '#FFFFFF',
  cream: '#F3D9B6',
  dark: '#1F2937',
  darker: '#111827',
  metal: '#94A3B8',
  eye: '#111111',
  eyeWhite: '#F8FAFC',
  nose: '#171717',
  coat: '#ECE6DB',
  coatLight: '#F8F7F3',
  coatShade: '#CFC8BC',
  sole: '#CBD5E1',
  badge: '#D6B45A',
}

/* ============================================================
   SCRATCH + HELPERS
   ============================================================ */
const _worldPos = new THREE.Vector3()
const _playerPos = [0, 0, 0]
const _terrainInput = [0, 0, 0]
const _terrainOut = [0, 0, 0]

function damp(current, target, speed, delta) {
  const k = 1 - Math.exp(-speed * delta)
  return current + (target - current) * k
}

function dampYaw(current, desired, speed, delta) {
  let diff = desired - current
  diff = Math.atan2(Math.sin(diff), Math.cos(diff))
  return current + diff * Math.min(speed * delta, 1)
}

function readPlayerPosition(ref, out = _playerPos) {
  if (!ref || !ref.current) return null
  const p = ref.current

  if (typeof p.getWorldPosition === 'function') {
    p.getWorldPosition(_worldPos)
    out[0] = _worldPos.x
    out[1] = _worldPos.y
    out[2] = _worldPos.z
    return out
  }
  if (p.position && typeof p.position.x === 'number') {
    out[0] = p.position.x
    out[1] = p.position.y
    out[2] = p.position.z
    return out
  }
  if (Array.isArray(p)) {
    out[0] = p[0]
    out[1] = p[1]
    out[2] = p[2]
    return out
  }
  if (typeof p.translation === 'function') {
    const t = p.translation()
    out[0] = t.x
    out[1] = t.y
    out[2] = t.z
    return out
  }
  return null
}

/* ============================================================
   FOX HEAD (tidak berubah)
   ============================================================ */
function FoxHead({ headRef }) {
  return (
    <group ref={headRef} position={[0, 2.72, 0]}>
      <mesh>
        <boxGeometry args={[1.32, 1.15, 1.12]} />
        <meshStandardMaterial color={FOX.orange} roughness={0.82} flatShading />
      </mesh>

      <mesh position={[0, 0.48, -0.02]}>
        <boxGeometry args={[1.08, 0.28, 0.92]} />
        <meshStandardMaterial color={FOX.orangeLight} roughness={0.8} flatShading />
      </mesh>

      <mesh position={[-0.38, 0.57, -0.06]} rotation={[0, 0, -0.12]}>
        <boxGeometry args={[0.42, 0.28, 0.72]} />
        <meshStandardMaterial color={FOX.orange} roughness={0.82} flatShading />
      </mesh>
      <mesh position={[0.38, 0.57, -0.06]} rotation={[0, 0, 0.12]}>
        <boxGeometry args={[0.42, 0.28, 0.72]} />
        <meshStandardMaterial color={FOX.orange} roughness={0.82} flatShading />
      </mesh>

      <mesh position={[-0.68, -0.04, -0.02]} rotation={[0, 0, -0.08]}>
        <boxGeometry args={[0.18, 0.52, 0.74]} />
        <meshStandardMaterial color={FOX.orangeLight} roughness={0.84} flatShading />
      </mesh>
      <mesh position={[0.68, -0.04, -0.02]} rotation={[0, 0, 0.08]}>
        <boxGeometry args={[0.18, 0.52, 0.74]} />
        <meshStandardMaterial color={FOX.orangeLight} roughness={0.84} flatShading />
      </mesh>

      <mesh position={[-0.36, -0.22, -0.58]}>
        <boxGeometry args={[0.55, 0.55, 0.18]} />
        <meshStandardMaterial color={FOX.white} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.36, -0.22, -0.58]}>
        <boxGeometry args={[0.55, 0.55, 0.18]} />
        <meshStandardMaterial color={FOX.white} roughness={0.9} flatShading />
      </mesh>

      <mesh position={[0, -0.30, -0.78]}>
        <boxGeometry args={[0.78, 0.42, 0.24]} />
        <meshStandardMaterial color={FOX.white} roughness={0.9} flatShading />
      </mesh>

      <mesh position={[0, -0.16, -0.82]}>
        <boxGeometry args={[0.22, 0.17, 0.18]} />
        <meshStandardMaterial color={FOX.nose} roughness={0.4} />
      </mesh>

      <group position={[-0.30, 0.12, -0.59]}>
        <mesh rotation={[0, 0, -0.12]}>
          <boxGeometry args={[0.31, 0.20, 0.08]} />
          <meshStandardMaterial color={FOX.eye} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.015, -0.045]}>
          <boxGeometry args={[0.09, 0.09, 0.025]} />
          <meshStandardMaterial color={FOX.eyeWhite} roughness={0.25} />
        </mesh>
      </group>

      <group position={[0.30, 0.12, -0.59]}>
        <mesh rotation={[0, 0, 0.12]}>
          <boxGeometry args={[0.31, 0.20, 0.08]} />
          <meshStandardMaterial color={FOX.eye} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.015, -0.045]}>
          <boxGeometry args={[0.09, 0.09, 0.025]} />
          <meshStandardMaterial color={FOX.eyeWhite} roughness={0.25} />
        </mesh>
      </group>

      <mesh position={[-0.30, 0.34, -0.62]} rotation={[0, 0, -0.12]}>
        <boxGeometry args={[0.34, 0.075, 0.07]} />
        <meshStandardMaterial color={FOX.orangeDark} roughness={0.85} />
      </mesh>
      <mesh position={[0.30, 0.34, -0.62]} rotation={[0, 0, 0.12]}>
        <boxGeometry args={[0.34, 0.075, 0.07]} />
        <meshStandardMaterial color={FOX.orangeDark} roughness={0.85} />
      </mesh>

      <mesh position={[0, -0.39, -0.82]}>
        <boxGeometry args={[0.16, 0.035, 0.035]} />
        <meshStandardMaterial color={FOX.dark} roughness={0.7} />
      </mesh>

      <mesh position={[-0.43, 0.96, -0.02]} rotation={[0, 0, 0.16]}>
        <coneGeometry args={[0.34, 0.78, 4]} />
        <meshStandardMaterial color={FOX.orange} roughness={0.82} flatShading />
      </mesh>
      <mesh position={[0.43, 0.96, -0.02]} rotation={[0, 0, -0.16]}>
        <coneGeometry args={[0.34, 0.78, 4]} />
        <meshStandardMaterial color={FOX.orange} roughness={0.82} flatShading />
      </mesh>

      <mesh position={[-0.43, 0.98, -0.20]} rotation={[0, 0, 0.16]}>
        <coneGeometry args={[0.18, 0.44, 4]} />
        <meshStandardMaterial color={FOX.cream} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.43, 0.98, -0.20]} rotation={[0, 0, -0.16]}>
        <coneGeometry args={[0.18, 0.44, 4]} />
        <meshStandardMaterial color={FOX.cream} roughness={0.9} flatShading />
      </mesh>

      <mesh position={[-0.43, 1.25, -0.02]} rotation={[0, 0, 0.16]}>
        <coneGeometry args={[0.17, 0.27, 4]} />
        <meshStandardMaterial color={FOX.darker} roughness={0.82} flatShading />
      </mesh>
      <mesh position={[0.43, 1.25, -0.02]} rotation={[0, 0, -0.16]}>
        <coneGeometry args={[0.17, 0.27, 4]} />
        <meshStandardMaterial color={FOX.darker} roughness={0.82} flatShading />
      </mesh>
    </group>
  )
}

/* ============================================================
   SUIT
   ============================================================ */
function Suit() {
  return (
    <>
      <mesh position={[0, 1.53, -0.40]}>
        <boxGeometry args={[0.86, 1.02, 0.14]} />
        <meshStandardMaterial color={FOX.dark} roughness={0.72} />
      </mesh>
      <mesh position={[0, 1.90, -0.49]}>
        <boxGeometry args={[0.38, 0.42, 0.07]} />
        <meshStandardMaterial color={FOX.white} roughness={0.82} />
      </mesh>
      <mesh position={[0, 1.60, -0.54]}>
        <boxGeometry args={[0.11, 0.62, 0.055]} />
        <meshStandardMaterial color={FOX.darker} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.96, -0.53]}>
        <boxGeometry args={[0.14, 0.12, 0.07]} />
        <meshStandardMaterial color={FOX.darker} roughness={0.7} />
      </mesh>
      {[1.72, 1.48, 1.24].map((y) => (
        <mesh key={y} position={[0, y, -0.53]}>
          <sphereGeometry args={[0.035, 8, 6]} />
          <meshStandardMaterial color={FOX.metal} roughness={0.5} metalness={0.4} />
        </mesh>
      ))}
    </>
  )
}

/* ============================================================
   LAB COAT
   ============================================================ */
function LabCoat() {
  return (
    <>
      <mesh position={[-0.40, 1.48, 0]}>
        <boxGeometry args={[0.74, 1.28, 0.82]} />
        <meshStandardMaterial color={FOX.coat} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.40, 1.48, 0]}>
        <boxGeometry args={[0.74, 1.28, 0.82]} />
        <meshStandardMaterial color={FOX.coatLight} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-0.48, 0.88, 0.02]} rotation={[0, 0, -0.04]}>
        <boxGeometry args={[0.62, 0.56, 0.78]} />
        <meshStandardMaterial color={FOX.coat} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.48, 0.88, 0.02]} rotation={[0, 0, 0.04]}>
        <boxGeometry args={[0.62, 0.56, 0.78]} />
        <meshStandardMaterial color={FOX.coatLight} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-0.24, 2.02, -0.39]} rotation={[0.15, 0, -0.32]}>
        <boxGeometry args={[0.22, 0.62, 0.10]} />
        <meshStandardMaterial color={FOX.coatLight} roughness={0.82} />
      </mesh>
      <mesh position={[0.24, 2.02, -0.39]} rotation={[0.15, 0, 0.32]}>
        <boxGeometry args={[0.22, 0.62, 0.10]} />
        <meshStandardMaterial color={FOX.coatLight} roughness={0.82} />
      </mesh>
      <mesh position={[0, 1.48, -0.425]}>
        <boxGeometry args={[0.10, 1.18, 0.05]} />
        <meshStandardMaterial color={FOX.coatShade} roughness={0.82} />
      </mesh>
      <mesh position={[-0.49, 1.18, -0.43]} rotation={[0, 0, -0.08]}>
        <boxGeometry args={[0.34, 0.08, 0.06]} />
        <meshStandardMaterial color={FOX.coatShade} roughness={0.85} />
      </mesh>
      <mesh position={[0.49, 1.18, -0.43]} rotation={[0, 0, 0.08]}>
        <boxGeometry args={[0.34, 0.08, 0.06]} />
        <meshStandardMaterial color={FOX.coatShade} roughness={0.85} />
      </mesh>
      {[-0.68, -0.34, 0.34, 0.68].map((x) => (
        <mesh
          key={x}
          position={[x, 0.66 + Math.abs(x) * 0.05, -0.01]}
          rotation={[0, 0, x * 0.08]}
        >
          <boxGeometry args={[0.20, 0.10, 0.82]} />
          <meshStandardMaterial color={FOX.coatLight} roughness={0.9} />
        </mesh>
      ))}
    </>
  )
}

/* ============================================================
   STETHOSCOPE
   ============================================================ */
function Stethoscope() {
  return (
    <group position={[0, 1.98, -0.56]}>
      <mesh position={[-0.22, -0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.035, 8, 16, Math.PI]} />
        <meshStandardMaterial color={FOX.metal} roughness={0.45} metalness={0.7} />
      </mesh>
      <mesh position={[0.22, -0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.035, 8, 16, Math.PI]} />
        <meshStandardMaterial color={FOX.metal} roughness={0.45} metalness={0.7} />
      </mesh>
      <mesh position={[-0.20, -0.43, 0]}>
        <boxGeometry args={[0.055, 0.48, 0.055]} />
        <meshStandardMaterial color={FOX.dark} roughness={0.6} />
      </mesh>
      <mesh position={[0.20, -0.43, 0]}>
        <boxGeometry args={[0.055, 0.48, 0.055]} />
        <meshStandardMaterial color={FOX.dark} roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.78, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.07, 12]} />
        <meshStandardMaterial color={FOX.metal} roughness={0.38} metalness={0.8} />
      </mesh>
      <mesh position={[0, -0.83, -0.02]}>
        <cylinderGeometry args={[0.08, 0.08, 0.075, 12]} />
        <meshStandardMaterial color={FOX.darker} roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  )
}

/* ============================================================
   DOCTOR BADGE
   ============================================================ */
function DoctorBadge() {
  return (
    <group position={[0.49, 1.72, -0.47]}>
      <mesh>
        <boxGeometry args={[0.22, 0.28, 0.045]} />
        <meshStandardMaterial color={FOX.badge} roughness={0.35} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.035, -0.03]}>
        <boxGeometry args={[0.12, 0.045, 0.018]} />
        <meshStandardMaterial color={FOX.white} roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.045, -0.03]}>
        <boxGeometry args={[0.08, 0.025, 0.018]} />
        <meshStandardMaterial color={FOX.white} roughness={0.8} />
      </mesh>
    </group>
  )
}

/* ============================================================
   ARM
   ============================================================ */
function DoctorArm({ side, armRef }) {
  const x = side === 'left' ? -0.98 : 0.98
  return (
    <group ref={armRef} position={[x, 1.92, 0]}>
      <mesh position={[0, -0.14, 0]}>
        <boxGeometry args={[0.48, 0.48, 0.58]} />
        <meshStandardMaterial color={FOX.coat} roughness={0.88} flatShading />
      </mesh>
      <mesh position={[0, -0.46, 0]}>
        <boxGeometry args={[0.42, 0.58, 0.50]} />
        <meshStandardMaterial color={FOX.coatLight} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, -0.76, -0.01]}>
        <boxGeometry args={[0.43, 0.14, 0.51]} />
        <meshStandardMaterial color={FOX.darker} roughness={0.72} />
      </mesh>
      <mesh position={[0, -0.96, 0]}>
        <boxGeometry args={[0.34, 0.30, 0.40]} />
        <meshStandardMaterial color={FOX.cream} roughness={0.86} flatShading />
      </mesh>
    </group>
  )
}

/* ============================================================
   LEG
   ============================================================ */
function DoctorLeg({ side, legRef }) {
  const x = side === 'left' ? -0.42 : 0.42
  return (
    <group ref={legRef} position={[x, 0.88, 0]}>
      <mesh position={[0, -0.34, 0]}>
        <boxGeometry args={[0.48, 0.68, 0.54]} />
        <meshStandardMaterial color={FOX.dark} roughness={0.78} flatShading />
      </mesh>
      <mesh position={[0, -0.74, 0]}>
        <boxGeometry args={[0.44, 0.40, 0.50]} />
        <meshStandardMaterial color={FOX.darker} roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0, -1.02, -0.08]}>
        <boxGeometry args={[0.48, 0.30, 0.66]} />
        <meshStandardMaterial color={FOX.white} roughness={0.68} flatShading />
      </mesh>
      <mesh position={[0, -0.92, -0.20]}>
        <boxGeometry args={[0.42, 0.18, 0.40]} />
        <meshStandardMaterial color={FOX.coatLight} roughness={0.62} flatShading />
      </mesh>
      <mesh position={[0, -0.99, -0.35]}>
        <boxGeometry args={[0.30, 0.05, 0.05]} />
        <meshStandardMaterial color={FOX.dark} roughness={0.7} />
      </mesh>
      <mesh position={[0, -1.18, -0.08]}>
        <boxGeometry args={[0.50, 0.08, 0.70]} />
        <meshStandardMaterial color={FOX.sole} roughness={0.72} />
      </mesh>
    </group>
  )
}

/* ============================================================
   FOX TAIL
   ============================================================ */
function FoxTail() {
  return (
    <group position={[0, 0.86, 0.44]} rotation={[0.12, 0, 0]}>
      <mesh position={[0, 0.10, 0.18]} rotation={[0.45, 0, 0]}>
        <boxGeometry args={[0.40, 0.52, 0.42]} />
        <meshStandardMaterial color={FOX.orange} roughness={0.84} flatShading />
      </mesh>
      <mesh position={[0, 0.46, 0.40]} rotation={[0.52, 0, 0]}>
        <boxGeometry args={[0.36, 0.58, 0.38]} />
        <meshStandardMaterial color={FOX.orange} roughness={0.84} flatShading />
      </mesh>
      <mesh position={[0, 0.82, 0.64]} rotation={[0.55, 0, 0]}>
        <boxGeometry args={[0.30, 0.48, 0.32]} />
        <meshStandardMaterial color={FOX.orangeLight} roughness={0.86} flatShading />
      </mesh>
      <mesh position={[0, 1.10, 0.83]} rotation={[0.58, 0, 0]}>
        <boxGeometry args={[0.27, 0.30, 0.29]} />
        <meshStandardMaterial color={FOX.white} roughness={0.9} flatShading />
      </mesh>
    </group>
  )
}

/* ============================================================
   MAIN FOX DOCTOR — self-contained
   ============================================================ */
function FoxDoctor({
  position = [0, 0, 0],
  rotation = [0, 0, 0],

  /* Doctor config */
  playerPositionRef = null,
  patrolOffset = [4, 0, 0],
  walkSpeed = 1.6,
  turnSpeed = 5,
  detectionDistance = 6,
  greetingDistance = 2.5,
  lostDistance = 9,
  greetDuration = 4.5,
  onGreet = null,
}) {
  /* ---------- REFS ---------- */
  const characterRef = useRef()

  const isMovingRef = useRef(false)
  const walkTimeRef = useRef(0)
  const isTalkingRef = useRef(false)

  const currentRotation = useRef(rotation[1])

  const [greetingMessage, setGreetingMessage] = useState('')
  const greetingBubbleRef = useRef()

  const doctorRef = useRef({
    state: 'patrol',
    patrolTarget: 1,
    patrolPause: 0,
    greetTimer: 0,
    greetFired: false,
  })

  /* ---------- ANIMATION REFS ---------- */
  const headRef = useRef()
  const torsoRef = useRef()
  const leftArmRef = useRef()
  const rightArmRef = useRef()
  const leftLegRef = useRef()
  const rightLegRef = useRef()

  /* Hard-coded: FoxDoctor selalu serious & greet */
  const walkStyle = 'serious'
  const talkPose = 'greet'

  /* ---------- GREET ---------- */
  const handleGreet = (message) => {
    setGreetingMessage(message)
    if (typeof onGreet === 'function') onGreet(message)
  }

  /* ---------- MOVEMENT ---------- */
  const moveToward = (npc, tx, tz, delta) => {
    const dx = tx - npc.position.x
    const dz = tz - npc.position.z
    const dist = Math.sqrt(dx * dx + dz * dz)
    if (dist < 0.05) return true

    const step = Math.min(walkSpeed * delta, dist)
    const nx = npc.position.x + (dx / dist) * step
    const nz = npc.position.z + (dz / dist) * step

    _terrainInput[0] = nx
    _terrainInput[1] = 0
    _terrainInput[2] = nz

    getTerrainPosition(_terrainInput, 0.47, _terrainOut)
    npc.position.set(_terrainOut[0], _terrainOut[1], _terrainOut[2])

    walkTimeRef.current += delta * 6

    const desiredYaw = Math.atan2(-dx, -dz)
    currentRotation.current = dampYaw(
      currentRotation.current,
      desiredYaw,
      turnSpeed,
      delta
    )
    npc.rotation.y = currentRotation.current
    return false
  }

  const facePlayer = (npc, player, delta) => {
    if (!player) return
    const dx = player[0] - npc.position.x
    const dz = player[2] - npc.position.z
    if (Math.abs(dx) < 0.001 && Math.abs(dz) < 0.001) return

    const desiredYaw = Math.atan2(-dx, -dz)
    currentRotation.current = dampYaw(
      currentRotation.current,
      desiredYaw,
      turnSpeed,
      delta
    )
    npc.rotation.y = currentRotation.current
  }

  /* ============================================================
     USE FRAME — state machine + animation
     ============================================================ */
  useFrame((state, delta) => {
    if (!characterRef.current) return
    if (!leftArmRef.current || !rightArmRef.current) return
    if (!leftLegRef.current || !rightLegRef.current) return

    const npc = characterRef.current
    const t = state.clock.elapsedTime

    /* ========================================================
       1. STATE MACHINE
       ======================================================== */
    const d = doctorRef.current

    const homeX = position[0]
    const homeZ = position[2]
    const offX = patrolOffset[0]
    const offZ = patrolOffset[2]

    const pointAX = homeX
    const pointAZ = homeZ
    const pointBX = homeX + offX
    const pointBZ = homeZ + offZ

    const player = readPlayerPosition(playerPositionRef, _playerPos)
    const dxP = player ? npc.position.x - player[0] : 0
    const dzP = player ? npc.position.z - player[2] : 0
    const distToPlayer = player
      ? Math.sqrt(dxP * dxP + dzP * dzP)
      : Infinity

    switch (d.state) {
      case 'patrol': {
        if (player && distToPlayer < detectionDistance) {
          d.state = 'approach'
          isMovingRef.current = false
          isTalkingRef.current = false
          break
        }

        if (d.patrolPause > 0) {
          d.patrolPause -= delta
          isMovingRef.current = false
          break
        }

        const targetX = d.patrolTarget === 0 ? pointAX : pointBX
        const targetZ = d.patrolTarget === 0 ? pointAZ : pointBZ

        isMovingRef.current = true
        const arrived = moveToward(npc, targetX, targetZ, delta)

        if (arrived) {
          isMovingRef.current = false
          d.patrolPause = 1.5
          d.patrolTarget = d.patrolTarget === 0 ? 1 : 0
        }
        break
      }

      case 'approach': {
        if (!player || distToPlayer > lostDistance) {
          d.state = 'return'
          isMovingRef.current = false
          isTalkingRef.current = false
          break
        }

        if (distToPlayer <= greetingDistance) {
          d.state = 'greet'
          d.greetTimer = 0
          d.greetFired = false
          isMovingRef.current = false
          isTalkingRef.current = true
          break
        }

        isMovingRef.current = true
        isTalkingRef.current = false

        const dx = player[0] - npc.position.x
        const dz = player[2] - npc.position.z
        const dist = Math.sqrt(dx * dx + dz * dz) || 1
        const stopDistance = greetingDistance * 0.95
        const maxStep = Math.max(dist - stopDistance, 0)

        if (maxStep > 0.001) {
          const step = Math.min(walkSpeed * delta, maxStep)
          const nx = npc.position.x + (dx / dist) * step
          const nz = npc.position.z + (dz / dist) * step

          _terrainInput[0] = nx
          _terrainInput[1] = 0
          _terrainInput[2] = nz

          getTerrainPosition(_terrainInput, 0.47, _terrainOut)
          npc.position.set(_terrainOut[0], _terrainOut[1], _terrainOut[2])
          walkTimeRef.current += delta * 6
        }

        facePlayer(npc, player, delta)
        break
      }

      case 'greet': {
        isMovingRef.current = false
        isTalkingRef.current = true
        d.greetTimer += delta

        facePlayer(npc, player, delta)

        if (!d.greetFired) {
          d.greetFired = true

          const greetings = [
            "Oya oya, if it's not you traveler. Are you alright?",
            "Doumoo, traveler. What brings you here?",
            "Araa, if it's not you traveler.",
          ]

          const randomGreeting =
            greetings[Math.floor(Math.random() * greetings.length)]

          handleGreet(randomGreeting)
        }

        const playerLeft = !player || distToPlayer > lostDistance
        const greetDone = d.greetTimer >= greetDuration

        if (playerLeft || greetDone) {
          d.state = 'return'
          isTalkingRef.current = false
          isMovingRef.current = false
          setGreetingMessage('')
        }
        break
      }

      case 'return': {
        isTalkingRef.current = false

        if (player && distToPlayer < detectionDistance) {
          d.state = 'approach'
          isMovingRef.current = false
          break
        }

        const dxHome = npc.position.x - pointAX
        const dzHome = npc.position.z - pointAZ
        const distHome = Math.sqrt(dxHome * dxHome + dzHome * dzHome)

        if (distHome < 0.4) {
          d.state = 'patrol'
          d.patrolTarget = 0
          d.patrolPause = 1.0
          isMovingRef.current = false
          break
        }

        isMovingRef.current = true
        moveToward(npc, pointAX, pointAZ, delta)
        break
      }

      default:
        d.state = 'patrol'
        break
    }

    /* ========================================================
       2. ANIMATION
       ======================================================== */
    const moving = isMovingRef.current
    const talking = isTalkingRef.current
    const walkT = walkTimeRef.current

    let leftArmX = 0
    let rightArmX = 0
    let leftArmZ = 0
    let rightArmZ = 0
    let leftLegX = 0
    let rightLegX = 0
    let headX = 0
    let headY = 0
    let headZ = 0
    let torsoY = 0
    let torsoX = 0
    let bodySpeed = 18

    /* ---- WALK ---- */
    if (moving) {
      if (walkStyle === 'serious') {
        leftArmX = -0.80
        rightArmX = -0.80
        leftArmZ = 0.35
        rightArmZ = -0.35

        const legSwing = Math.sin(walkT) * 0.45
        leftLegX = legSwing
        rightLegX = -legSwing
      } else {
        const swing = Math.sin(walkT) * 0.55
        leftArmX = -swing
        rightArmX = swing
        leftLegX = swing
        rightLegX = -swing
      }
      bodySpeed = 28
    }

    /* ---- IDLE / TALK ---- */
    else {
      const breath = Math.sin(t * 1.35)
      torsoY = breath * 0.025
      leftArmX = breath * 0.035
      rightArmX = breath * 0.035
      leftArmZ = Math.sin(t * 0.85) * 0.012
      rightArmZ = -Math.sin(t * 0.85) * 0.012
      headX = Math.sin(t * 0.72) * 0.018
      headY = Math.sin(t * 0.53) * 0.045
      headZ = Math.sin(t * 0.61) * 0.012

      if (talking) {
        if (talkPose === 'greet') {
          const phase = (t % 3.0) / 0.65
          const rise = Math.min(phase, 1)
          const env = rise * rise * (3 - 2 * rise)

          leftArmX = -0.16 * env
          rightArmX = -0.16 * env
          leftArmZ = -2.00 * env
          rightArmZ = 2.00 * env

          const wave = Math.sin(t * 2.0) * 0.07 * env
          leftArmZ += wave
          rightArmZ -= wave

          headX = Math.sin(t * 1.2) * 0.025
          headY = Math.sin(t * 1.6) * 0.055
          headZ = Math.sin(t * 0.9) * 0.018
          torsoX = -0.035 * env
          bodySpeed = 12
        } else {
          const gesture = Math.sin(t * 1.4)
          leftArmX = -0.25 + gesture * 0.10
          rightArmX = -0.15 - gesture * 0.08
          leftArmZ = -0.25
          rightArmZ = 0.20
          headY = Math.sin(t * 0.75) * 0.065
          torsoX = Math.sin(t * 0.6) * 0.018
          bodySpeed = 12
        }
      }
    }

    /* ---- APPLY ARM ---- */
    leftArmRef.current.rotation.x = damp(
      leftArmRef.current.rotation.x, leftArmX, bodySpeed, delta
    )
    rightArmRef.current.rotation.x = damp(
      rightArmRef.current.rotation.x, rightArmX, bodySpeed, delta
    )
    leftArmRef.current.rotation.z = damp(
      leftArmRef.current.rotation.z, leftArmZ, bodySpeed, delta
    )
    rightArmRef.current.rotation.z = damp(
      rightArmRef.current.rotation.z, rightArmZ, bodySpeed, delta
    )

    /* ---- APPLY LEG ---- */
    leftLegRef.current.rotation.x = damp(
      leftLegRef.current.rotation.x, leftLegX, bodySpeed, delta
    )
    rightLegRef.current.rotation.x = damp(
      rightLegRef.current.rotation.x, rightLegX, bodySpeed, delta
    )

    /* ---- APPLY HEAD ---- */
    if (headRef.current) {
      headRef.current.rotation.x = damp(
        headRef.current.rotation.x, headX, bodySpeed, delta
      )
      headRef.current.rotation.y = damp(
        headRef.current.rotation.y, headY, bodySpeed, delta
      )
      headRef.current.rotation.z = damp(
        headRef.current.rotation.z, headZ, bodySpeed, delta
      )
    }

    /* ---- APPLY TORSO ---- */
    if (torsoRef.current) {
      torsoRef.current.position.y = damp(
        torsoRef.current.position.y, torsoY, bodySpeed, delta
      )
      torsoRef.current.rotation.x = damp(
        torsoRef.current.rotation.x, torsoX, bodySpeed, delta
      )
    }

    /* ---- GREETING BUBBLE FOLLOW ---- */
    if (greetingBubbleRef.current) {
      greetingBubbleRef.current.position.set(
        npc.position.x,
        npc.position.y + 5.0,
        npc.position.z
      )
    }
  })

  return (
    <>
      <group
        ref={characterRef}
        position={getTerrainPosition(position, 0.47)}
        rotation={rotation}
      >
        <FoxHead headRef={headRef} />

        <mesh position={[0, 2.05, 0]}>
          <boxGeometry args={[0.42, 0.32, 0.42]} />
          <meshStandardMaterial color={FOX.white} roughness={0.9} />
        </mesh>

        <group ref={torsoRef}>
          <mesh position={[0, 1.50, 0]}>
            <boxGeometry args={[1.50, 1.12, 0.82]} />
            <meshStandardMaterial color={FOX.coatShade} roughness={0.9} flatShading />
          </mesh>

          <Suit />
          <LabCoat />
          <Stethoscope />
          <DoctorBadge />

          <mesh position={[-0.78, 1.90, 0]}>
            <boxGeometry args={[0.28, 0.28, 0.76]} />
            <meshStandardMaterial color={FOX.coatLight} roughness={0.9} flatShading />
          </mesh>
          <mesh position={[0.78, 1.90, 0]}>
            <boxGeometry args={[0.28, 0.28, 0.76]} />
            <meshStandardMaterial color={FOX.coatLight} roughness={0.9} flatShading />
          </mesh>
        </group>

        <FoxTail />

        <DoctorArm side="left" armRef={leftArmRef} />
        <DoctorArm side="right" armRef={rightArmRef} />
        <DoctorLeg side="left" legRef={leftLegRef} />
        <DoctorLeg side="right" legRef={rightLegRef} />
      </group>

      {greetingMessage && (
        <group ref={greetingBubbleRef}>
          <Html
            position={[0, 0, 0]}
            center
            distanceFactor={10}
            zIndexRange={[300, 400]}
          >
            <div
              style={{
                minWidth: '360px',
                maxWidth: '440px',
                padding: '14px 18px',
                borderRadius: '16px',
                background: 'rgba(5, 15, 35, 0.96)',
                border: '2px solid rgba(96, 165, 250, 0.8)',
                boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5)',
                color: '#ffffff',
                fontFamily: 'Josefin Sans, sans-serif',
                fontSize: '15px',
                fontWeight: 600,
                lineHeight: 1.5,
                textAlign: 'center',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              {greetingMessage}
            </div>
          </Html>
        </group>
      )}
    </>
  )
}

export default FoxDoctor
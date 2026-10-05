import { RigidBody, CylinderCollider } from '@react-three/rapier'
import { getTerrainPosition } from './terrainHelper'

/* ============================================================
   PALETTE
   ============================================================ */
const COLORS = {
  trunk: '#5B4636',
  trunkDark: '#4A3728',

  leavesDark: '#285943',
  leavesMedium: '#347A55',
  leavesLight: '#4F9568',
  leavesBright: '#5FAE78',
}

/* ============================================================
   PINE
   ============================================================ */
function PineTree() {
  return (
    <>
      {/* TRUNK */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.38, 3.0, 8]} />
        <meshStandardMaterial
          color={COLORS.trunk}
          roughness={0.9}
        />
      </mesh>

      {/* LEAVES — LAYER 1 */}
      <mesh position={[0, 2.1, 0]} castShadow>
        <coneGeometry args={[1.55, 1.9, 8]} />
        <meshStandardMaterial
          color={COLORS.leavesDark}
          roughness={0.9}
        />
      </mesh>

      {/* LEAVES — LAYER 2 */}
      <mesh position={[0, 3.1, 0]} castShadow>
        <coneGeometry args={[1.3, 1.7, 8]} />
        <meshStandardMaterial
          color={COLORS.leavesMedium}
          roughness={0.9}
        />
      </mesh>

      {/* LEAVES — LAYER 3 */}
      <mesh position={[0, 4.0, 0]} castShadow>
        <coneGeometry args={[1.05, 1.5, 8]} />
        <meshStandardMaterial
          color={COLORS.leavesDark}
          roughness={0.9}
        />
      </mesh>

      {/* LEAVES — TOP */}
      <mesh position={[0, 4.85, 0]} castShadow>
        <coneGeometry args={[0.75, 1.3, 8]} />
        <meshStandardMaterial
          color={COLORS.leavesLight}
          roughness={0.9}
        />
      </mesh>
    </>
  )
}

/* ============================================================
   ROUND
   ============================================================ */
function RoundTree() {
  return (
    <>
      {/* TRUNK */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.45, 1.8, 8]} />
        <meshStandardMaterial
          color={COLORS.trunk}
          roughness={0.9}
        />
      </mesh>

      {/* CANOPY — MAIN */}
      <mesh position={[0, 2.4, 0]} castShadow>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial
          color={COLORS.leavesDark}
          roughness={0.85}
          flatShading
        />
      </mesh>

      {/* CANOPY — SIDE LEFT */}
      <mesh position={[-0.95, 2.05, 0.3]} castShadow>
        <icosahedronGeometry args={[1.0, 0]} />
        <meshStandardMaterial
          color={COLORS.leavesMedium}
          roughness={0.85}
          flatShading
        />
      </mesh>

      {/* CANOPY — SIDE RIGHT */}
      <mesh position={[0.95, 2.1, -0.25]} castShadow>
        <icosahedronGeometry args={[0.95, 0]} />
        <meshStandardMaterial
          color={COLORS.leavesMedium}
          roughness={0.85}
          flatShading
        />
      </mesh>

      {/* CANOPY — FRONT */}
      <mesh position={[0.1, 2.15, 0.9]} castShadow>
        <icosahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color={COLORS.leavesLight}
          roughness={0.85}
          flatShading
        />
      </mesh>

      {/* CANOPY — TOP LEFT */}
      <mesh position={[-0.45, 3.25, -0.2]} castShadow>
        <icosahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial
          color={COLORS.leavesLight}
          roughness={0.85}
          flatShading
        />
      </mesh>

      {/* CANOPY — TOP RIGHT */}
      <mesh position={[0.5, 3.15, 0.3]} castShadow>
        <icosahedronGeometry args={[0.75, 0]} />
        <meshStandardMaterial
          color={COLORS.leavesBright}
          roughness={0.85}
          flatShading
        />
      </mesh>
    </>
  )
}

/* ============================================================
   WIDE
   ============================================================ */
function WideTree() {
  return (
    <>
      {/* TRUNK */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.55, 1.5, 8]} />
        <meshStandardMaterial
          color={COLORS.trunkDark}
          roughness={0.9}
        />
      </mesh>

      {/* CANOPY — LOWER */}
      <mesh
        position={[0, 1.85, 0]}
        scale={[1.0, 0.55, 1.0]}
        castShadow
      >
        <icosahedronGeometry args={[2.1, 0]} />
        <meshStandardMaterial
          color={COLORS.leavesDark}
          roughness={0.85}
          flatShading
        />
      </mesh>

      {/* CANOPY — MIDDLE */}
      <mesh
        position={[0, 2.15, 0]}
        scale={[1.0, 0.5, 1.0]}
        castShadow
      >
        <icosahedronGeometry args={[1.75, 0]} />
        <meshStandardMaterial
          color={COLORS.leavesMedium}
          roughness={0.85}
          flatShading
        />
      </mesh>

      {/* CANOPY — TOP */}
      <mesh
        position={[0, 2.5, 0]}
        scale={[1.0, 0.45, 1.0]}
        castShadow
      >
        <icosahedronGeometry args={[1.25, 0]} />
        <meshStandardMaterial
          color={COLORS.leavesLight}
          roughness={0.85}
          flatShading
        />
      </mesh>
    </>
  )
}

/* ============================================================
   SMALL
   ============================================================ */
function SmallTree() {
  return (
    <>
      {/* TRUNK */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.22, 0.7, 6]} />
        <meshStandardMaterial
          color={COLORS.trunk}
          roughness={0.9}
        />
      </mesh>

      {/* CANOPY — MAIN */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <icosahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial
          color={COLORS.leavesMedium}
          roughness={0.85}
          flatShading
        />
      </mesh>

      {/* CANOPY — HIGHLIGHT */}
      <mesh position={[0.35, 1.4, 0.2]} castShadow>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={COLORS.leavesLight}
          roughness={0.85}
          flatShading
        />
      </mesh>

      {/* CANOPY — DARK */}
      <mesh position={[-0.4, 1.25, -0.15]} castShadow>
        <icosahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial
          color={COLORS.leavesDark}
          roughness={0.85}
          flatShading
        />
      </mesh>
    </>
  )
}

/* ============================================================
   VARIANT REGISTRY
   ============================================================ */
const VARIANTS = {
  pine: PineTree,
  round: RoundTree,
  wide: WideTree,
  small: SmallTree,
}

/* ============================================================
   TREE
   ============================================================ */
function Tree({
  variant = 'pine',
  position = [0, 0, 0],
  scale = 4,
}) {
  const VariantComponent =
    VARIANTS[variant] || PineTree

  /* ==========================================================
     COLLIDER SETTINGS

     Ukuran collider mengikuti BATANG.
     Bukan daun.
     ========================================================== */

  let colliderHalfHeight = 1.5
  let colliderRadius = 0.30
  let colliderY = 1.5

  if (variant === 'round') {
    colliderHalfHeight = 0.9
    colliderRadius = 0.36
    colliderY = 0.9
  }

  if (variant === 'wide') {
    colliderHalfHeight = 0.75
    colliderRadius = 0.44
    colliderY = 0.75
  }

  if (variant === 'small') {
    colliderHalfHeight = 0.35
    colliderRadius = 0.18
    colliderY = 0.35
  }

  const terrainPosition =
    getTerrainPosition(position)

  return (
    <>
      {/* ======================================================
          VISUAL TREE

          PENTING:
          Visual tree berada DI LUAR RigidBody.

          Jadi daun dan batang visual TIDAK akan menjadi
          collider Rapier.
          ====================================================== */}
      <group
        position={terrainPosition}
        scale={scale}
        userData={{
          cameraOccluder: true,
        }}
      >
        <VariantComponent />
      </group>

      {/* ======================================================
          PHYSICS TREE

          Hanya RigidBody + CylinderCollider.

          colliders={false} memastikan Rapier TIDAK membuat
          collider otomatis dari mesh visual.
          ====================================================== */}
      <RigidBody
        type="fixed"
        position={terrainPosition}
        colliders={false}
      >
        <CylinderCollider
          args={[
            colliderHalfHeight * scale,
            colliderRadius * scale,
          ]}
          position={[
            0,
            colliderY * scale,
            0,
          ]}
        />
      </RigidBody>
    </>
  )
}

export default Tree

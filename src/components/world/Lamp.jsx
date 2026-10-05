import { RigidBody, CylinderCollider } from '@react-three/rapier'

import { getTerrainPosition } from './terrainHelper'

const COLORS = {
  postDark: '#1A1F27',
  post: '#252B35',
  postLight: '#2F3744',
  bulb: '#FFD58A',
}

const LIGHT = {
  color: '#FFD58A',
  intensity: 6,
  distance: 8,
  decay: 2,
}

const EMISSIVE = 2.0

function ClassicLamp() {
  return (
    <>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.3, 8]} />
        <meshStandardMaterial
          color={COLORS.postDark}
          roughness={0.75}
          metalness={0.35}
        />
      </mesh>

      <mesh position={[0, 2.05, 0]}>
        <cylinderGeometry args={[0.09, 0.11, 3.5, 8]} />
        <meshStandardMaterial
          color={COLORS.post}
          roughness={0.7}
          metalness={0.4}
        />
      </mesh>

      <mesh position={[0, 3.5, 0]}>
        <sphereGeometry args={[0.2, 8, 6]} />
        <meshStandardMaterial
          color={COLORS.bulb}
          emissive={COLORS.bulb}
          emissiveIntensity={EMISSIVE}
          roughness={0.4}
        />
      </mesh>

      <mesh position={[0, 3.85, 0]}>
        <coneGeometry args={[0.42, 0.42, 8]} />
        <meshStandardMaterial
          color={COLORS.post}
          roughness={0.7}
          metalness={0.4}
          flatShading
        />
      </mesh>

      <pointLight
        position={[0, 3.5, 0]}
        color={LIGHT.color}
        intensity={LIGHT.intensity}
        distance={LIGHT.distance}
        decay={LIGHT.decay}
      />

      <CylinderCollider
        args={[1.9, 0.15]}
        position={[0, 1.9, 0]}
      />
    </>
  )
}

function ModernLamp() {
  return (
    <>
      <mesh position={[0, 0.075, 0]}>
        <boxGeometry args={[0.4, 0.15, 0.4]} />
        <meshStandardMaterial
          color={COLORS.postDark}
          roughness={0.75}
          metalness={0.4}
        />
      </mesh>

      <mesh position={[0, 2.05, 0]}>
        <boxGeometry args={[0.13, 4.0, 0.13]} />
        <meshStandardMaterial
          color={COLORS.post}
          roughness={0.65}
          metalness={0.45}
        />
      </mesh>

      <mesh position={[0, 4.18, 0]}>
        <boxGeometry args={[0.5, 0.06, 0.5]} />
        <meshStandardMaterial
          color={COLORS.post}
          roughness={0.65}
          metalness={0.45}
        />
      </mesh>

      <mesh position={[0, 4.36, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.28, 8]} />
        <meshStandardMaterial
          color={COLORS.bulb}
          emissive={COLORS.bulb}
          emissiveIntensity={EMISSIVE}
          roughness={0.4}
        />
      </mesh>

      <mesh position={[0, 4.53, 0]}>
        <boxGeometry args={[0.5, 0.06, 0.5]} />
        <meshStandardMaterial
          color={COLORS.post}
          roughness={0.65}
          metalness={0.45}
        />
      </mesh>

      <pointLight
        position={[0, 4.36, 0]}
        color={LIGHT.color}
        intensity={LIGHT.intensity}
        distance={LIGHT.distance}
        decay={LIGHT.decay}
      />

      <CylinderCollider
        args={[2.075, 0.15]}
        position={[0, 2.075, 0]}
      />
    </>
  )
}

/* ============================================================
   SHORT — Square Lantern
   ------------------------------------------------------------
   Struktur (bottom → top):
     base plate → 4 corner posts → inner glowing box (glass)
       → pyramid roof (4-sided) → top finial → ring
   Total tinggi ~1.5 unit. Lebar ~0.5 unit.
   ============================================================ */
function ShortLamp() {
  const postHalf = 0.22
  const postThickness = 0.05
  const bodyHeight = 0.85
  const bodyBottom = 0.2
  const bodyTop = bodyBottom + bodyHeight
  const bodyCenterY = bodyBottom + bodyHeight / 2

  const cornerPositions = [
    [-postHalf, -postHalf],
    [postHalf, -postHalf],
    [-postHalf, postHalf],
    [postHalf, postHalf],
  ]

  return (
    <>
      {/* BASE PLATE — square pedestal */}
      <mesh position={[0, 0.075, 0]}>
        <boxGeometry args={[0.55, 0.15, 0.55]} />
        <meshStandardMaterial
          color={COLORS.postDark}
          roughness={0.75}
          metalness={0.4}
        />
      </mesh>

      {/* BASE TOP TRIM — slightly inset top of base */}
      <mesh position={[0, 0.17, 0]}>
        <boxGeometry args={[0.48, 0.04, 0.48]} />
        <meshStandardMaterial
          color={COLORS.post}
          roughness={0.7}
          metalness={0.4}
        />
      </mesh>

      {/* INNER GLOWING BODY (glass) — warm emissive core */}
      <mesh position={[0, bodyCenterY, 0]}>
        <boxGeometry args={[0.36, bodyHeight, 0.36]} />
        <meshStandardMaterial
          color={COLORS.bulb}
          emissive={COLORS.bulb}
          emissiveIntensity={EMISSIVE}
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>

      {/* 4 CORNER POSTS — thin square frames around glowing box */}
      {cornerPositions.map(([x, z], i) => (
        <mesh
          key={i}
          position={[x, bodyCenterY, z]}
        >
          <boxGeometry
            args={[
              postThickness,
              bodyHeight + 0.05,
              postThickness,
            ]}
          />
          <meshStandardMaterial
            color={COLORS.post}
            roughness={0.7}
            metalness={0.45}
          />
        </mesh>
      ))}

      {/* TOP FRAME — ring square penutup atas body */}
      <mesh position={[0, bodyTop + 0.02, 0]}>
        <boxGeometry args={[0.5, 0.06, 0.5]} />
        <meshStandardMaterial
          color={COLORS.post}
          roughness={0.7}
          metalness={0.4}
        />
      </mesh>

      {/* BOTTOM FRAME — ring square penutup bawah body */}
      <mesh position={[0, bodyBottom - 0.02, 0]}>
        <boxGeometry args={[0.5, 0.06, 0.5]} />
        <meshStandardMaterial
          color={COLORS.post}
          roughness={0.7}
          metalness={0.4}
        />
      </mesh>

      {/* ROOF — 4-sided pyramid (low-poly) */}
      <mesh position={[0, bodyTop + 0.28, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.42, 0.42, 4]} />
        <meshStandardMaterial
          color={COLORS.postDark}
          roughness={0.7}
          metalness={0.4}
          flatShading
        />
      </mesh>

      {/* ROOF CAP — small square di atas pyramid */}
      <mesh position={[0, bodyTop + 0.52, 0]}>
        <boxGeometry args={[0.1, 0.06, 0.1]} />
        <meshStandardMaterial
          color={COLORS.postDark}
          roughness={0.7}
          metalness={0.45}
        />
      </mesh>

      {/* TOP RING — decorative small ring above cap */}
      <mesh position={[0, bodyTop + 0.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.06, 0.018, 6, 12]} />
        <meshStandardMaterial
          color={COLORS.post}
          roughness={0.6}
          metalness={0.5}
        />
      </mesh>

      {/* POINT LIGHT — inside the lantern body */}
      <pointLight
        position={[0, bodyCenterY, 0]}
        color={LIGHT.color}
        intensity={LIGHT.intensity}
        distance={LIGHT.distance}
        decay={LIGHT.decay}
      />

      {/* COLLIDER — matches lantern body footprint */}
      <CylinderCollider
        args={[0.6, 0.28]}
        position={[0, 0.6, 0]}
      />
    </>
  )
}

const VARIANTS = {
  classic: ClassicLamp,
  modern: ModernLamp,
  short: ShortLamp,
}

function Lamp({
  variant = 'classic',
  position = [0, 0, 0],
  scale = 1,
}) {
  const VariantComponent =
    VARIANTS[variant] || ClassicLamp

  const terrainPosition =
    getTerrainPosition(position)

  return (
    <RigidBody
      type="fixed"
      position={terrainPosition}
    >
      <group scale={scale}>
        <VariantComponent />
      </group>
    </RigidBody>
  )
}

export default Lamp
import { useMemo } from 'react'
import * as THREE from 'three'
import { RigidBody, TrimeshCollider } from '@react-three/rapier'

const MAP_SIZE = 200
const VISUAL_SEGMENTS = 100   // tetap seperti semula — visual tidak berubah
const PHYSICS_SEGMENTS = 40   // physics lebih ringan (3.200 vs 20.000 triangle)

const BASE_HEIGHT = -1

export function getTerrainHeight(x, z) {
  // ... SAMA PERSIS seperti kode Anda ...
  const northProgress = THREE.MathUtils.clamp((100 - z) / 200, 0, 1)

  const mainElevation =
    THREE.MathUtils.smoothstep(northProgress, 0, 1) * 8

  const southHill =
    Math.exp(
      -(((x + 28) * (x + 28)) / 1400 + ((z - 55) * (z - 55)) / 1800)
    ) * 1.8

  const hillOne =
    Math.exp(
      -(((x + 38) * (x + 38)) / 1200 + ((z + 38) * (z + 38)) / 1600)
    ) * 3.2

  const hillTwo =
    Math.exp(
      -(((x - 32) * (x - 32)) / 1400 + ((z + 65) * (z + 65)) / 1300)
    ) * 3.8

  const hillThree =
    Math.exp(
      -(((x + 5) * (x + 5)) / 1800 + ((z - 5) * (z - 5)) / 2000)
    ) * 1.8

  const finishHill =
    Math.exp(
      -((x * x) / 1800 + ((z + 82) * (z + 82)) / 1000)
    ) * 5

  return (
    BASE_HEIGHT +
    mainElevation +
    southHill +
    hillOne +
    hillTwo +
    hillThree +
    finishHill
  )
}

/* Hoisted — dibuat sekali, bukan per vertex */
const LOW_COLOR = new THREE.Color('#163d22')
const MID_COLOR = new THREE.Color('#245c30')
const HIGH_COLOR = new THREE.Color('#3f7540')

/* Sekarang menulis ke `target`, tidak mengalokasikan Color baru */
function getTerrainColor(x, z, height, target) {
  const heightProgress = THREE.MathUtils.clamp(
    (height + 1) / 10,
    0,
    1
  )

  const variation =
    Math.sin(x * 0.08) * 0.5 +
    Math.sin(z * 0.065) * 0.35 +
    Math.sin((x + z) * 0.035) * 0.25

  const normalizedVariation = (variation + 1.1) / 2.2

  if (heightProgress < 0.55) {
    target.lerpColors(LOW_COLOR, MID_COLOR, heightProgress / 0.55)
  } else {
    target.lerpColors(MID_COLOR, HIGH_COLOR, (heightProgress - 0.55) / 0.45)
  }

  const variationStrength = 0.035 * (normalizedVariation - 0.5)
  target.r += variationStrength
  target.g += variationStrength
  target.b += variationStrength

  return target
}

function createTerrainGeometry(segments, withColors) {
  const geometry = new THREE.PlaneGeometry(
    MAP_SIZE,
    MAP_SIZE,
    segments,
    segments
  )

  const position = geometry.attributes.position

  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i)
    const z = -position.getY(i)
    const height = getTerrainHeight(x, z)
    position.setZ(i, height)
  }

  geometry.rotateX(-Math.PI / 2)
  geometry.computeVertexNormals()

  if (withColors) {
    const colors = new Float32Array(position.count * 3)
    const tmpColor = new THREE.Color()

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i)
      const y = position.getY(i)
      const z = position.getZ(i)

      getTerrainColor(x, z, y, tmpColor)

      colors[i * 3 + 0] = tmpColor.r
      colors[i * 3 + 1] = tmpColor.g
      colors[i * 3 + 2] = tmpColor.b
    }

    geometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colors, 3)
    )
  }

  return geometry
}

function Ground() {
  const visualGeometry = useMemo(
    () => createTerrainGeometry(VISUAL_SEGMENTS, true),
    []
  )

  const physicsGeometry = useMemo(
    () => createTerrainGeometry(PHYSICS_SEGMENTS, false),
    []
  )

  /* Ekstrak vertices + indices untuk TrimeshCollider */
  const { vertices, indices } = useMemo(() => {
    const pos = physicsGeometry.attributes.position.array
    const idx = physicsGeometry.index.array
    return {
      vertices: new Float32Array(pos),
      indices: new Uint32Array(idx),
    }
  }, [physicsGeometry])

  return (
    <RigidBody type="fixed" colliders={false}>
      {/* Physics collider — 3.200 triangle, friction 0 */}
      <TrimeshCollider
        args={[vertices, indices]}
        friction={0}
        restitution={0}
      />

      {/* Visual mesh — 20.000 triangle, tidak terpengaruh physics */}
      <mesh geometry={visualGeometry} receiveShadow>
        <meshStandardMaterial
          vertexColors
          roughness={0.95}
          metalness={0}
          flatShading={false}
        />
      </mesh>
    </RigidBody>
  )
}

export default Ground
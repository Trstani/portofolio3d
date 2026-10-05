import * as THREE from 'three'
import Ground, { getTerrainHeight } from './Ground'
import Path from './path'
import MapBoundary from './MapBoundary'
import Tree from './Tree'
import Stone from './Stone'
import Bush from './Bush'
import Grass from './Grass'
import Lamp from './Lamp'
import ProjectBoard from './ProjectBoard'
import CertificatesRail from './CertificatesRail'
import NPCManager from '../player/NPCManager'
import NPCStatic from '../player/NPCStatic'
import PicnicTable from './PicnicTable'
import { projectBoards, getBoardProjects,} from './projectBoards'
import {certificateRails,} from './certificateRail'


/* ============================================================
   TERRAIN HELPER
   ============================================================ */
const h = (x, z) => getTerrainHeight(x, z)

/* ============================================================
   PATH AWARENESS
   ============================================================ */
const PATH_POINTS = [
  [0, 85], [-8, 72], [-16, 58], [-18, 43], [-10, 30],
  [4, 19], [15, 7], [18, -7], [10, -21], [2, -34],
  [12, -47], [16, -61], [8, -74], [0, -85],
].map(([x, z]) => new THREE.Vector3(x, 0, z))

const PATH_CURVE = new THREE.CatmullRomCurve3(
  PATH_POINTS,
  false,
  'catmullrom',
  0.5
)

const PATH_HALF_WIDTH = 5.5 / 2
const PATH_SAFE_MARGIN = 1.0

const PATH_SAMPLES = (() => {
  const N = 240
  const arr = []
  for (let i = 0; i <= N; i++) arr.push(PATH_CURVE.getPointAt(i / N))
  return arr
})()

function distToPath(x, z) {
  let min2 = Infinity
  for (let i = 0; i < PATH_SAMPLES.length; i++) {
    const p = PATH_SAMPLES[i]
    const dx = p.x - x
    const dz = p.z - z
    const d2 = dx * dx + dz * dz
    if (d2 < min2) min2 = d2
  }
  return Math.sqrt(min2)
}

function isClearOfPath(x, z, assetRadius = 0) {
  return (
    distToPath(x, z) >
    PATH_HALF_WIDTH + PATH_SAFE_MARGIN + assetRadius
  )
}

function keepClear(candidates, assetRadius) {
  return candidates.filter(c =>
    isClearOfPath(c.x, c.z, assetRadius)
  )
}

/* ============================================================
   DISTANT LANDSCAPE
   ============================================================ */

function DistantLandscape() {
  const distantGroundY = -1.35

  const hills = [
    // SOUTH-WEST
    {
      position: [-105, 8, 82],
      scale: [42, 16, 24],
      rotation: [0, 0.15, 0],
    },

    // SOUTH
    {
      position: [-45, 6, 112],
      scale: [38, 14, 22],
      rotation: [0, -0.25, 0],
    },

    {
      position: [35, 7, 115],
      scale: [46, 18, 26],
      rotation: [0, 0.2, 0],
    },

    // SOUTH-EAST
    {
      position: [105, 9, 78],
      scale: [40, 17, 25],
      rotation: [0, -0.15, 0],
    },

    // WEST
    {
      position: [-118, 11, 10],
      scale: [48, 22, 28],
      rotation: [0, 0.1, 0],
    },

    // EAST
    {
      position: [118, 13, -8],
      scale: [46, 24, 30],
      rotation: [0, -0.1, 0],
    },

    // NORTH-WEST
    {
      position: [-108, 18, -75],
      scale: [48, 28, 32],
      rotation: [0, 0.2, 0],
    },

    // NORTH
    {
      position: [-35, 20, -118],
      scale: [48, 30, 34],
      rotation: [0, -0.15, 0],
    },

    {
      position: [38, 22, -120],
      scale: [52, 32, 36],
      rotation: [0, 0.15, 0],
    },

    // NORTH-EAST
    {
      position: [108, 19, -76],
      scale: [46, 27, 30],
      rotation: [0, -0.2, 0],
    },
  ]

  return (
    <group>
      {/* =====================================================
          DISTANT GROUND
          ===================================================== */}

      <mesh
        position={[0, distantGroundY, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[600, 600]} />

        <meshStandardMaterial
          color="#102d22"
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* =====================================================
          DISTANT HILLS
          ===================================================== */}

      {hills.map((hill, index) => (
        <mesh
          key={`distant-hill-${index}`}
          position={hill.position}
          rotation={hill.rotation}
          scale={hill.scale}
        >
          <icosahedronGeometry args={[1, 1]} />

          <meshStandardMaterial
            color="#163d2d"
            roughness={1}
            metalness={0}
            flatShading
          />
        </mesh>
      ))}
    </group>
  )
}

/* ============================================================
   LANDMARK INLINE
   ============================================================ */

function AboutMonument({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.7, 1.9, 0.24, 8]} />
        <meshStandardMaterial color="#3a4353" roughness={0.92} flatShading />
      </mesh>
      <mesh position={[0, 0.36, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.35, 1.5, 0.24, 8]} />
        <meshStandardMaterial color="#2f3846" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.9, 1.3, 0.9]} />
        <meshStandardMaterial color="#252b35" roughness={0.85} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.35, 0.46]} castShadow>
        <boxGeometry args={[0.72, 0.82, 0.04]} />
        <meshStandardMaterial color="#1a1f27" roughness={0.7} metalness={0.4} />
      </mesh>
      <mesh position={[0, 1.35, 0.49]}>
        <boxGeometry args={[0.62, 0.72, 0.06]} />
        <meshStandardMaterial
          color="#1e3a8a"
          emissive="#3b82f6"
          emissiveIntensity={0.55}
          roughness={0.45}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0, 1.85, 0]} castShadow>
        <boxGeometry args={[1.15, 0.18, 1.15]} />
        <meshStandardMaterial color="#1a1f27" roughness={0.75} metalness={0.3} />
      </mesh>
      <mesh position={[0, 2.05, 0]}>
        <sphereGeometry args={[0.14, 8, 6]} />
        <meshStandardMaterial
          color="#ffd58a"
          emissive="#ffd58a"
          emissiveIntensity={1.4}
          roughness={0.4}
        />
      </mesh>
    </group>
  )
}

function ContactPavilion({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) {
  const size = 3.4
  const roofY = 5.2
  const posts = [
    [-size, -size], [size, -size],
    [-size, size], [size, size],
  ]

  return (
    <group position={position} rotation={rotation}>
      {posts.map(([x, z], i) => (
        <mesh key={i} position={[x, roofY / 2, z]} castShadow>
          <cylinderGeometry args={[0.18, 0.24, roofY, 8]} />
          <meshStandardMaterial
            color="#1a1f27"
            roughness={0.7}
            metalness={0.4}
          />
        </mesh>
      ))}

      <mesh position={[0, roofY + 0.12, 0]} castShadow>
        <boxGeometry args={[8.4, 0.3, 8.4]} />
        <meshStandardMaterial
          color="#252b35"
          roughness={0.75}
          metalness={0.3}
        />
      </mesh>

      <mesh position={[0, roofY + 0.43, 0]} castShadow>
        <boxGeometry args={[6.2, 0.24, 6.2]} />
        <meshStandardMaterial
          color="#2f3846"
          roughness={0.75}
          metalness={0.25}
        />
      </mesh>

      <mesh position={[0, roofY - 0.35, 0]}>
        <sphereGeometry args={[0.24, 8, 6]} />
        <meshStandardMaterial
          color="#ffd58a"
          emissive="#ffd58a"
          emissiveIntensity={1.6}
          roughness={0.4}
        />
      </mesh>

      {[-1, 1].map((z, i) => (
        <group key={i} position={[0, 0, z * 1.4]}>
          <mesh position={[0, 0.48, 0]} castShadow>
            <boxGeometry args={[4.2, 0.2, 0.8]} />
            <meshStandardMaterial
              color="#5b4636"
              roughness={0.85}
            />
          </mesh>

          {[-1.65, 1.65].map((x, j) => (
            <mesh key={j} position={[x, 0.24, 0]}>
              <boxGeometry args={[0.2, 0.42, 0.65]} />
              <meshStandardMaterial
                color="#4a3728"
                roughness={0.9}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

function FinishMarker({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.4, 0.16, 12]} />
        <meshStandardMaterial color="#3a4353" roughness={0.92} flatShading />
      </mesh>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.9, 1.1, 0.5, 8]} />
        <meshStandardMaterial color="#2f3846" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, 2.2, 0]} castShadow>
        <boxGeometry args={[0.5, 3.2, 0.5]} />
        <meshStandardMaterial color="#252b35" roughness={0.8} metalness={0.2} />
      </mesh>
      <mesh position={[0, 3.9, 0]} castShadow>
        <boxGeometry args={[0.7, 0.2, 0.7]} />
        <meshStandardMaterial color="#1a1f27" roughness={0.75} metalness={0.35} />
      </mesh>
      <mesh position={[0, 4.2, 0]}>
        <sphereGeometry args={[0.22, 10, 8]} />
        <meshStandardMaterial
          color="#ffd58a"
          emissive="#ffd58a"
          emissiveIntensity={1.8}
          roughness={0.35}
        />
      </mesh>
      <pointLight
        position={[0, 4.2, 0]}
        color="#ffd58a"
        intensity={5}
        distance={14}
        decay={2}
      />
      <mesh position={[2.2, 0.3, 0.4]} castShadow>
        <dodecahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color="#5a6472" roughness={0.95} flatShading />
      </mesh>
      <mesh position={[-2.0, 0.28, -0.6]} castShadow>
        <dodecahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color="#3f4753" roughness={0.95} flatShading />
      </mesh>
    </group>
  )
}

/* ============================================================
   ASSET CANDIDATES
   ============================================================ */

const TREE_RADIUS = 2.5
const BUSH_RADIUS = 1.2
const GRASS_RADIUS = 0.8
const STONE_RADIUS = 1.0
const LAMP_RADIUS = 0.4

const TREE_CANDIDATES = [
  /* ---- SW WOODS ---- */
  { variant: 'pine',  x: -40, z: 90, scale: 4.5 },
  { variant: 'round', x: -35, z: 84, scale: 4.0 },
  { variant: 'wide',  x: -44, z: 76, scale: 4.2 },
  { variant: 'pine',  x: -38, z: 68, scale: 4.3 },
  { variant: 'small', x: -46, z: 82, scale: 3.2 },
  { variant: 'round', x: -34, z: 92, scale: 3.8 },

  /* ---- SE WOODS ---- */
  { variant: 'pine',  x: 40, z: 88, scale: 4.3 },
  { variant: 'round', x: 36, z: 80, scale: 4.0 },
  { variant: 'wide',  x: 44, z: 74, scale: 4.2 },
  { variant: 'pine',  x: 38, z: 66, scale: 4.4 },
  { variant: 'small', x: 48, z: 82, scale: 3.2 },

  /* ---- MID-W WOODS ---- */
  { variant: 'pine',  x: -42, z: 30, scale: 4.4 },
  { variant: 'round', x: -36, z: 24, scale: 4.0 },
  { variant: 'wide',  x: -46, z: 18, scale: 4.3 },
  { variant: 'pine',  x: -40, z: 12, scale: 4.5 },
  { variant: 'small', x: -34, z: 36, scale: 3.3 },

  /* ---- MID-E WOODS ---- */
  { variant: 'pine',  x: 42, z: 30, scale: 4.3 },
  { variant: 'round', x: 36, z: 24, scale: 4.1 },
  { variant: 'wide',  x: 46, z: 18, scale: 4.2 },
  { variant: 'pine',  x: 40, z: 12, scale: 4.4 },
  { variant: 'small', x: 34, z: 36, scale: 3.2 },

  /* ---- MID-W2 WOODS ---- */
  { variant: 'pine',  x: -42, z: -20, scale: 4.4 },
  { variant: 'round', x: -38, z: -26, scale: 4.0 },
  { variant: 'wide',  x: -46, z: -14, scale: 4.3 },
  { variant: 'pine',  x: -40, z: -32, scale: 4.5 },
  { variant: 'small', x: -34, z: -22, scale: 3.2 },

  /* ---- MID-E2 WOODS ---- */
  { variant: 'pine',  x: 40, z: -22, scale: 4.3 },
  { variant: 'round', x: 36, z: -28, scale: 4.1 },
  { variant: 'wide',  x: 44, z: -16, scale: 4.2 },
  { variant: 'pine',  x: 42, z: -34, scale: 4.4 },

  /* ---- NW WOODS ---- */
  { variant: 'pine',  x: -38, z: -70, scale: 4.5 },
  { variant: 'round', x: -44, z: -74, scale: 4.2 },
  { variant: 'wide',  x: -40, z: -80, scale: 4.3 },
  { variant: 'pine',  x: -46, z: -66, scale: 4.4 },
  { variant: 'small', x: -34, z: -76, scale: 3.2 },

  /* ---- NE WOODS ---- */
  { variant: 'pine',  x: 38, z: -72, scale: 4.4 },
  { variant: 'round', x: 44, z: -78, scale: 4.1 },
  { variant: 'wide',  x: 40, z: -84, scale: 4.3 },
  { variant: 'pine',  x: 46, z: -68, scale: 4.2 },

  /* ---- MID-BAND ---- */
  { variant: 'pine',  x: -30, z: 92, scale: 4.0 },
  { variant: 'round', x: 30, z: 90, scale: 3.8 },
  { variant: 'wide',  x: -30, z: 78, scale: 3.6 },
  { variant: 'pine',  x: 28, z: 78, scale: 4.0 },
  { variant: 'small', x: -28, z: 86, scale: 3.0 },

  { variant: 'pine',  x: -30, z: 56, scale: 4.0 },
  { variant: 'round', x: -26, z: 42, scale: 3.6 },
  { variant: 'wide',  x: 26, z: 60, scale: 3.5 },
  { variant: 'pine',  x: 26, z: 42, scale: 4.0 },
  { variant: 'small', x: -30, z: 62, scale: 2.8 },
  { variant: 'round', x: 30, z: 50, scale: 3.6 },

  { variant: 'pine',  x: -28, z: 28, scale: 4.0 },
  { variant: 'wide',  x: 28, z: 22, scale: 3.5 },
  { variant: 'pine',  x: 30, z: 6,  scale: 4.0 },
  { variant: 'round', x: 26, z: -4, scale: 3.6 },
  { variant: 'small', x: -28, z: 12, scale: 2.8 },

  { variant: 'pine',  x: 28, z: -18, scale: 4.0 },
  { variant: 'round', x: 28, z: -35, scale: 3.6 },
  { variant: 'pine',  x: -18, z: -30, scale: 4.0 },
  { variant: 'small', x: -18, z: -42, scale: 2.8 },

  { variant: 'round', x: 32, z: -46, scale: 3.6 },
  { variant: 'pine',  x: 30, z: -64, scale: 4.0 },
  { variant: 'wide',  x: 30, z: -58, scale: 3.5 },

  { variant: 'pine',  x: 16, z: -72, scale: 4.0 },
  { variant: 'round', x: -14, z: -78, scale: 3.6 },
  { variant: 'pine',  x: -20, z: -90, scale: 4.0 },
  { variant: 'wide',  x: 18, z: -84, scale: 3.5 },

  /* ============================================================
     ENRICHMENT — Area context
     ============================================================ */

  /* ABOUT — framing monument */
  { variant: 'round', x: 2,  z: 56, scale: 3.6 },
  { variant: 'small', x: -22, z: 54, scale: 3.0 },

  /* PROJECTS — west edge */
  { variant: 'round', x: -22, z: 18, scale: 3.6 },
  { variant: 'wide',  x: -25, z: 14, scale: 3.5 },

  /* CERTIFICATES — east edge */
  { variant: 'pine',  x: 22, z: -24, scale: 4.0 },
  { variant: 'round', x: 26, z: -32, scale: 3.6 },

  /* CONTACT — behind pavilion */
  { variant: 'pine',  x: 28, z: -52, scale: 4.0 },
  { variant: 'wide',  x: 30, z: -60, scale: 3.5 },

  /* SOCIAL GARDEN — around PicnicTable [-22, 0, -4] */
  { variant: 'round', x: -26, z: -8, scale: 3.8 },
  { variant: 'pine',  x: -28, z: -1, scale: 4.0 },
  { variant: 'wide',  x: -30, z: -7, scale: 3.5 },
]

const BUSH_CANDIDATES = [
  { variant: 'round',  x: -8,  z: 88, scale: 1.0 },
  { variant: 'flower', x: 7,   z: 88, scale: 1.0 },
  { variant: 'wide',   x: -14, z: 80, scale: 0.95 },
  { variant: 'round',  x: 12,  z: 80, scale: 1.0 },
  { variant: 'small',  x: -16, z: 74, scale: 1.0 },
  { variant: 'flower', x: 10,  z: 72, scale: 0.95 },

  { variant: 'round',  x: -5,  z: 48, scale: 1.0 },
  { variant: 'flower', x: -12, z: 52, scale: 1.0 },
  { variant: 'small',  x: -6,  z: 54, scale: 1.0 },
  { variant: 'wide',   x: -10, z: 46, scale: 0.9 },
  { variant: 'round',  x: -4,  z: 52, scale: 0.95 },

  { variant: 'round',  x: -8,  z: 24, scale: 1.0 },
  { variant: 'wide',   x: 12,  z: 28, scale: 0.95 },
  { variant: 'flower', x: 24,  z: 14, scale: 1.0 },
  { variant: 'round',  x: 8,   z: 4,  scale: 1.0 },
  { variant: 'small',  x: -4,  z: 32, scale: 1.0 },

  { variant: 'round',  x: 24, z: -14, scale: 1.0 },
  { variant: 'flower', x: 24, z: -28, scale: 1.0 },
  { variant: 'round',  x: 4,  z: -42, scale: 1.0 },
  { variant: 'wide',   x: -10, z: -22, scale: 0.9 },

  { variant: 'round',  x: 20, z: -46, scale: 1.0 },
  { variant: 'flower', x: 30, z: -56, scale: 0.95 },
  { variant: 'small',  x: 18, z: -62, scale: 1.0 },
  { variant: 'wide',   x: 8,  z: -56, scale: 0.9 },

  { variant: 'round',  x: 7,   z: -78, scale: 1.0 },
  { variant: 'flower', x: -7,  z: -86, scale: 0.95 },
  { variant: 'small',  x: 10,  z: -90, scale: 1.0 },
  { variant: 'round',  x: -12, z: -94, scale: 0.9 },

  { variant: 'round',  x: -16, z: 62, scale: 0.95 },
  { variant: 'flower', x: -18, z: 38, scale: 0.95 },
  { variant: 'round',  x: 20, z: -4,  scale: 0.95 },
  { variant: 'wide',   x: 14, z: 42,  scale: 0.9 },
  { variant: 'flower', x: -20, z: 20, scale: 0.95 },

  /* ============================================================
     ENRICHMENT
     ============================================================ */

  /* ABOUT — around monument */
  { variant: 'small', x: -5,  z: 47, scale: 1.0 },
  { variant: 'round', x: -11, z: 53, scale: 1.0 },

  /* CERTIFICATES */
  { variant: 'round', x: 17, z: -25, scale: 1.0 },

  /* SOCIAL GARDEN — greenery around picnic table */
  { variant: 'round',  x: -18, z: -2, scale: 1.0 },
  { variant: 'flower', x: -18, z: -6, scale: 0.95 },
  { variant: 'wide',   x: -26, z: -2, scale: 0.9 },
]

const GRASS_CANDIDATES = [
  { variant: 'medium', x: 5,  z: 84, scale: 1.0 },
  { variant: 'patch',  x: -5, z: 78, scale: 1.15 },
  { variant: 'small',  x: 9,  z: 92, scale: 1.0 },
  { variant: 'tall',   x: -12, z: 90, scale: 0.95 },
  { variant: 'medium', x: 14, z: 84, scale: 1.0 },
  { variant: 'patch',  x: -18, z: 84, scale: 1.1 },

  { variant: 'patch',  x: -4, z: 50, scale: 1.2 },
  { variant: 'medium', x: -14, z: 55, scale: 1.0 },
  { variant: 'small',  x: -6, z: 56, scale: 1.0 },
  { variant: 'tall',   x: -13, z: 48, scale: 1.0 },
  { variant: 'medium', x: 0,  z: 55, scale: 1.0 },

  { variant: 'medium', x: -6, z: 20, scale: 1.0 },
  { variant: 'patch',  x: 14, z: 18, scale: 1.15 },
  { variant: 'small',  x: 9,  z: 10, scale: 1.0 },
  { variant: 'tall',   x: -2, z: 26, scale: 1.0 },
  { variant: 'medium', x: 20, z: 8,  scale: 1.0 },

  { variant: 'medium', x: 18, z: -20, scale: 1.0 },
  { variant: 'patch',  x: 20, z: -34, scale: 1.15 },
  { variant: 'small',  x: 8,  z: -28, scale: 1.0 },

  { variant: 'medium', x: 26, z: -52, scale: 1.0 },
  { variant: 'patch',  x: 20, z: -60, scale: 1.15 },
  { variant: 'small',  x: 14, z: -50, scale: 1.0 },

  { variant: 'medium', x: 5,  z: -82, scale: 1.0 },
  { variant: 'patch',  x: -4, z: -90, scale: 1.15 },
  { variant: 'tall',   x: 8,  z: -94, scale: 1.0 },
  { variant: 'medium', x: -8, z: -78, scale: 1.0 },

  { variant: 'patch',  x: -16, z: 66, scale: 1.1 },
  { variant: 'medium', x: -6,  z: 64, scale: 1.0 },
  { variant: 'medium', x: -14, z: 38, scale: 1.0 },
  { variant: 'patch',  x: -4,  z: 40, scale: 1.1 },
  { variant: 'patch',  x: 10,  z: -2, scale: 1.1 },
  { variant: 'medium', x: 20,  z: -2, scale: 1.0 },
  { variant: 'medium', x: 16,  z: 30, scale: 1.0 },
  { variant: 'small',  x: -22, z: 24, scale: 1.0 },
  { variant: 'tall',   x: -22, z: 52, scale: 1.0 },
  { variant: 'medium', x: 26,  z: -52, scale: 1.0 },

  /* ============================================================
     ENRICHMENT
     ============================================================ */

  /* ABOUT */
  { variant: 'medium', x: -12, z: 44, scale: 1.0 },

  /* PROJECTS */
  { variant: 'patch',  x: -20, z: 22, scale: 1.1 },

  /* SOCIAL GARDEN */
  { variant: 'patch',  x: -23, z: -5, scale: 1.1 },
  { variant: 'medium', x: -19, z: 0,  scale: 1.0 },
]

const STONE_CANDIDATES = [
  { variant: 'small',  x: -11, z: 84, scale: 1.0 },
  { variant: 'medium', x: 9,   z: 78, scale: 1.0 },
  { variant: 'flat',   x: -20, z: 78, scale: 1.0 },

  { variant: 'small', x: -4,  z: 53, scale: 1.0 },
  { variant: 'flat',  x: -14, z: 46, scale: 1.0 },

  { variant: 'medium', x: -6, z: 16, scale: 1.0 },
  { variant: 'flat',   x: 22, z: 4,  scale: 1.0 },
  { variant: 'small',  x: 4,  z: 28, scale: 1.0 },

  { variant: 'small', x: 8,  z: -24, scale: 1.0 },
  { variant: 'large', x: 21, z: -42, scale: 0.95 },
  { variant: 'flat',  x: -10, z: -36, scale: 1.0 },

  { variant: 'medium', x: 22, z: -46, scale: 1.0 },
  { variant: 'small',  x: 30, z: -62, scale: 1.0 },

  { variant: 'medium', x: 10,  z: -84, scale: 1.0 },
  { variant: 'large',  x: -12, z: -92, scale: 0.95 },
  { variant: 'small',  x: 14,  z: -92, scale: 1.0 },

  /* ============================================================
     ENRICHMENT — Social Garden
     ============================================================ */
  { variant: 'medium', x: -24, z: -1, scale: 1.0 },
  { variant: 'small',  x: -20, z: -7, scale: 1.0 },
]

const LAMP_CANDIDATES = [
  { variant: 'modern',  x: 4,   z: 84 },
  { variant: 'classic', x: -12, z: 72 },
  { variant: 'short',   x: -3,  z: 92 },
  { variant: 'modern',  x: -14, z: 55 },
  { variant: 'classic', x: -14, z: 45 },
  { variant: 'modern',  x: -8,  z: 32 },
  { variant: 'classic', x: 12,  z: 16 },
  { variant: 'modern',  x: 20,  z: 2 },
  { variant: 'short',   x: -5,  z: 26 },
  { variant: 'modern',  x: 14,  z: -12 },
  { variant: 'classic', x: 7,   z: -26 },
  { variant: 'modern',  x: 4,   z: -40 },
  { variant: 'classic', x: 18,  z: -45 },
  { variant: 'modern',  x: 19,  z: -58 },
  { variant: 'modern',  x: 4,   z: -78 },
  { variant: 'classic', x: -4,  z: -88 },

  /* ============================================================
     ENRICHMENT — ambient lighting for social garden & areas
     ============================================================ */
  { variant: 'modern',  x: -19, z: -1 },   // social garden edge
  { variant: 'short',   x: -25, z: -7 },   // social garden back
  { variant: 'classic', x: 12,  z: -32 },  // certificates
]

const TREES  = keepClear(TREE_CANDIDATES,  TREE_RADIUS)
const BUSHES = keepClear(BUSH_CANDIDATES,  BUSH_RADIUS)
const GRASSES = keepClear(GRASS_CANDIDATES, GRASS_RADIUS)
const STONES = keepClear(STONE_CANDIDATES, STONE_RADIUS)
const LAMPS  = keepClear(LAMP_CANDIDATES,  LAMP_RADIUS)

/* ============================================================
   ENVIRONMENT
   ============================================================ */
function Environment({
  playerVisualRef,
  playerRef,
}) {
  return (
    <>
     <DistantLandscape />
      {/* =====================================================
          FOUNDATION
          ===================================================== */}
      <Ground />
      <Path />
      <MapBoundary />

      {/* =====================================================
          TREES
          ===================================================== */}
      {TREES.map((t, i) => (
        <Tree
          key={`tree-${i}`}
          variant={t.variant}
          position={[t.x, 0, t.z]}
          scale={t.scale}
        />
      ))}

      {/* =====================================================
          BUSHES
          ===================================================== */}
      {BUSHES.map((b, i) => (
        <Bush
          key={`bush-${i}`}
          variant={b.variant}
          position={[b.x, 0, b.z]}
          scale={b.scale}
        />
      ))}

      {/* =====================================================
          GRASS
          ===================================================== */}
      {GRASSES.map((g, i) => (
        <Grass
          key={`grass-${i}`}
          variant={g.variant}
          position={[g.x, 0, g.z]}
          scale={g.scale}
        />
      ))}

      {/* =====================================================
          STONES
          ===================================================== */}
      {STONES.map((s, i) => (
        <Stone
          key={`stone-${i}`}
          variant={s.variant}
          position={[s.x, 0, s.z]}
          scale={s.scale}
        />
      ))}

      {/* =====================================================
          LAMPS
          ===================================================== */}
      {LAMPS.map((l, i) => (
        <Lamp
          key={`lamp-${i}`}
          variant={l.variant}
          position={[l.x, 0, l.z]}
          scale={2}
        />
      ))}

      {/* =====================================================
          SOCIAL GARDEN — PicnicTable
          Tetap di posisi existing.
          ===================================================== */}
      <PicnicTable
        position={[-22, 0, -4]}
        rotation={[0, Math.PI * 0.15, 0]}
        scale={1.5}
      />

      {/* =====================================================
          LANDMARKS — posisi existing dipertahankan
          ===================================================== */}
      <AboutMonument
        position={[-8, h(-8, 50), 50]}
        rotation={[0, 0.35, 0]}
      />

      <ProjectBoard
        position={projectBoards[0].position}
        rotation={projectBoards[0].rotation}
        projects={getBoardProjects(projectBoards[0])}
        motif={projectBoards[0].motif}
        board={projectBoards[0]}
      />

      <ProjectBoard
        position={projectBoards[1].position}
        rotation={projectBoards[1].rotation}
        projects={getBoardProjects(projectBoards[1])}
        motif={projectBoards[1].motif}
        board={projectBoards[1]}
      />

      <ProjectBoard
        position={projectBoards[2].position}
        rotation={projectBoards[2].rotation}
        projects={getBoardProjects(projectBoards[2])}
        motif={projectBoards[1].motif}
        board={projectBoards[1]}
      />

     {certificateRails.map((rail) => (
        <CertificatesRail
          key={rail.id}
          position={rail.position}
          rotation={rail.rotation}
        />
      ))}

      <ContactPavilion
        position={[5, h(24, -58), -54]}
        rotation={[0, -0.4, 0]}
      />

      <FinishMarker position={[0, h(0, -92), -92]} />

      {/* =====================================================
          NPC MANAGER — traveler/tourist, tidak diubah
          ===================================================== */}
      <NPCManager />

      {/* =====================================================
          NPC STATIC — FOX DOCTOR
          HANYA SATU, tidak diubah.
          ===================================================== */}
      <NPCStatic
        position={[-14, 0, -10]}
        rotation={[0, Math.PI * 0.35, 0]}
        behavior="doctor"
        appearance="foxDoctor"
        playerPositionRef={playerRef}
        patrolOffset={[4, 0, 0]}
        detectionDistance={10}
        greetingDistance={4.5}
        lostDistance={9}
        walkSpeed={1.6}
      />

      {/* =====================================================
          NPC STATIC — EXISTING (dipertahankan)
          ===================================================== */}

      {/* Projects — melihat ProjectBoard [-13, 0, 26] */}
      <NPCStatic
        position={[-14, 0, 28]}
        behavior="lookAt"
        target={[-13, 0, 26]}
        gender="female"
        skinTone="fair"
        hair="bob"
        hairColor="brown"
        outfit="hoodie"
        pants="black"
        shoes="white"
      />

      {/* Social Garden — Conversation pair */}
      <NPCStatic
        position={[-25, 0, 2]}
        rotation={[0, 0, 0]}
        behavior="conversation"
        target={[-20, 0, 2]}
        gender="female"
        skinTone="fair"
        hair="ponytail"
        hairColor="brown"
        outfit="jacket"
        pants="black"
        shoes="white"
      />
      <NPCStatic
        position={[-20, 0, 2]}
        rotation={[0, Math.PI, 0]}
        behavior="conversation"
        target={[-25, 0, 2]}
        gender="male"
        skinTone="medium"
        hair="swept"
        hairColor="black"
        outfit="hoodie"
        pants="navy"
        shoes="white"
      />

      {/* =====================================================
          NPC STATIC — ENRICHMENT (baru)
          ===================================================== */}

      {/* ABOUT — pengunjung melihat monumen */}
      <NPCStatic
        position={[-3, 0, 47]}
        behavior="lookAt"
        target={[-8, 0, 50]}
        gender="male"
        skinTone="light"
        hair="short"
        hairColor="darkBrown"
        outfit="sweater"
        pants="navy"
        shoes="black"
      />

      {/* PROJECTS — pengunjung melihat board kedua [20, 0, 12] */}
      <NPCStatic
        position={[22, 0, 16]}
        behavior="lookAt"
        target={[20, 0, 12]}
        gender="female"
        skinTone="tan"
        hair="long"
        hairColor="blonde"
        outfit="tshirt"
        pants="gray"
        shoes="blue"
      />

      {/* CERTIFICATES — pengunjung melihat rail */}
      <NPCStatic
        position={[16, 0, -24]}
        behavior="lookAt"
        target={[13, 0, -28]}
        gender="male"
        skinTone="medium"
        hair="swept"
        hairColor="blueBlack"
        outfit="jacket"
        pants="black"
        shoes="black"
      />

      {/* CONTACT — pengunjung santai di dekat pavilion */}
      <NPCStatic
        position={[1, 0, -50]}
        behavior="lookAt"
        target={[0, 0, -18]}
        gender="female"
        skinTone="light"
        hair="bob"
        hairColor="black"
        outfit="sweater"
        pants="gray"
        shoes="white"
      />

      {/* FINISH — pengunjung merenung di viewpoint */}
      <NPCStatic
        position={[-6, 0, -90]}
        behavior="lookAt"
        target={[0, 0, -92]}
        gender="male"
        skinTone="dark"
        hair="short"
        hairColor="black"
        outfit="jacket"
        pants="navy"
        shoes="black"
      />

      {/* SOCIAL GARDEN — anggota ketiga di area piknik */}
      <NPCStatic
        position={[-10, 0, -6]}
        rotation={[0, Math.PI, 0]}
        behavior="conversation"
        target={[-10, 0, -3]}
        gender="female"
        skinTone="medium"
        hair="ponytail"
        hairColor="black"
        outfit="hoodie"
        pants="gray"
        shoes="white"
      />
      <NPCStatic
        position={[-10, 0, -3]}
        rotation={[0, Math.PI, 0]}
        behavior="conversation"
        target={[-10, 0, -6]}
        gender="female"
        skinTone="medium"
        hair="bob"
        hairColor="black"
        outfit="sweater"
        pants="navy"
        shoes="blue"
      />
    </>
  )
}

export default Environment
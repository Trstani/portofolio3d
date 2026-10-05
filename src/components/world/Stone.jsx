import { RigidBody, BallCollider } from '@react-three/rapier'
import { getTerrainPosition } from './terrainHelper'
/* ============================================================
   PALETTE — satu family warna batu (cool gray, blue-gray,
   sedikit warm gray). Tetap kalem & menyatu dengan tema
   navy / white / blue portfolio.
   ============================================================ */
const COLORS = {
  stoneDark: '#3F4753',    // cool dark gray (bayangan)
  stoneBase: '#5A6472',    // base gray
  stoneBlue: '#6E7889',    // blue-gray (sedikit navy)
  stoneLight: '#8A93A1',   // highlight gray
  stoneWarm: '#7A726A',    // warm gray aksen
}

/* ============================================================
   SMALL — batu kecil untuk dekorasi sekitar jalan/taman
   Bentuk: cluster 2-3 pecahan kecil, tidak beraturan
   ============================================================ */
function SmallStone() {
  return (
    <>
      {/* MAIN PIECE */}
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color={COLORS.stoneBase}
          roughness={0.95}
          flatShading
        />
      </mesh>

      {/* SIDE PIECE — sedikit menempel, ukuran lebih kecil */}
      <mesh
        position={[0.32, 0.12, 0.14]}
        rotation={[0.3, 0.9, 0.15]}
        castShadow
        receiveShadow
      >
        <dodecahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial
          color={COLORS.stoneDark}
          roughness={0.95}
          flatShading
        />
      </mesh>

      {/* TINY PIECE — highlight kecil di sisi lain */}
      <mesh
        position={[-0.28, 0.09, -0.16]}
        rotation={[0.6, 1.2, 0.4]}
        castShadow
        receiveShadow
      >
        <dodecahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial
          color={COLORS.stoneBlue}
          roughness={0.95}
          flatShading
        />
      </mesh>

      {/* COLLIDER — satu bola untuk cluster utama */}
      <BallCollider args={[0.35]} position={[0, 0.18, 0]} />
    </>
  )
}

/* ============================================================
   MEDIUM — batu sedang, terlihat jelas tapi tidak mendominasi
   Bentuk: boulder tunggal, sedikit gepeng & miring
   ============================================================ */
function MediumStone() {
  return (
    <>
      {/* MAIN BOULDER — icosahedron scaled sedikit gepeng */}
      <mesh
        position={[0, 0.42, 0]}
        rotation={[0.15, 0.6, 0.1]}
        scale={[1.0, 0.78, 0.95]}
        castShadow
        receiveShadow
      >
        <icosahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color={COLORS.stoneBase}
          roughness={0.92}
          flatShading
        />
      </mesh>

      {/* TOP CAP — potongan kecil di atas supaya tidak simetris */}
      <mesh
        position={[0.18, 0.85, -0.12]}
        rotation={[0.5, 0.3, 0.7]}
        castShadow
        receiveShadow
      >
        <dodecahedronGeometry args={[0.28, 0]} />
        <meshStandardMaterial
          color={COLORS.stoneLight}
          roughness={0.92}
          flatShading
        />
      </mesh>

      {/* SIDE ACCENT — pecahan kecil di samping */}
      <mesh
        position={[-0.55, 0.2, 0.3]}
        rotation={[0.9, 0.2, 0.3]}
        castShadow
        receiveShadow
      >
        <dodecahedronGeometry args={[0.24, 0]} />
        <meshStandardMaterial
          color={COLORS.stoneDark}
          roughness={0.95}
          flatShading
        />
      </mesh>

      {/* COLLIDER — bola membungkus boulder utama */}
      <BallCollider args={[0.72]} position={[0, 0.45, 0]} />
    </>
  )
}

/* ============================================================
   LARGE — batu besar sebagai landmark/dekorasi area
   Bentuk: dua boulder besar yang overlap → siluet dramatis
   ============================================================ */
function LargeStone() {
  return (
    <>
      {/* MAIN BOULDER BESAR */}
      <mesh
        position={[0, 0.9, 0]}
        rotation={[0.1, 0.4, 0.05]}
        scale={[1.15, 0.95, 1.0]}
        castShadow
        receiveShadow
      >
        <icosahedronGeometry args={[1.25, 0]} />
        <meshStandardMaterial
          color={COLORS.stoneBase}
          roughness={0.92}
          flatShading
        />
      </mesh>

      {/* SECONDARY BOULDER — lebih rendah, di samping */}
      <mesh
        position={[1.15, 0.55, 0.35]}
        rotation={[0.35, 0.9, 0.2]}
        scale={[1.0, 0.85, 0.9]}
        castShadow
        receiveShadow
      >
        <icosahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial
          color={COLORS.stoneBlue}
          roughness={0.92}
          flatShading
        />
      </mesh>

      {/* SMALL CHUNK di sisi lain — pecahan yang jatuh */}
      <mesh
        position={[-0.95, 0.28, -0.55]}
        rotation={[0.7, 1.1, 0.3]}
        castShadow
        receiveShadow
      >
        <dodecahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial
          color={COLORS.stoneDark}
          roughness={0.95}
          flatShading
        />
      </mesh>

      {/* TOP HIGHLIGHT ROCK — duduk di atas boulder utama */}
      <mesh
        position={[0.3, 1.95, -0.2]}
        rotation={[0.4, 0.2, 0.6]}
        castShadow
        receiveShadow
      >
        <dodecahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color={COLORS.stoneLight}
          roughness={0.9}
          flatShading
        />
      </mesh>

      {/* COLLIDER — satu bola besar menutup cluster utama */}
      <BallCollider args={[1.3]} position={[0, 0.95, 0]} />
    </>
  )
}

/* ============================================================
   FLAT — batu pipih/gepeng, cocok untuk tepi jalan & taman
   Bentuk: octahedron yang di-flatten kuat di sumbu Y
   ============================================================ */
function FlatStone() {
  return (
    <>
      {/* MAIN SLAB — pipih & lebar */}
      <mesh
        position={[0, 0.15, 0]}
        rotation={[0.05, 0.5, 0.03]}
        scale={[1.3, 0.35, 1.1]}
        castShadow
        receiveShadow
      >
        <octahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial
          color={COLORS.stoneBase}
          roughness={0.95}
          flatShading
        />
      </mesh>

      {/* SECOND SLAB — overlap, agak lebih kecil & miring */}
      <mesh
        position={[0.7, 0.1, 0.4]}
        rotation={[0.1, 1.3, 0.08]}
        scale={[1.05, 0.3, 0.9]}
        castShadow
        receiveShadow
      >
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color={COLORS.stoneBlue}
          roughness={0.95}
          flatShading
        />
      </mesh>

      {/* THIRD SLAB — kecil di sisi lain */}
      <mesh
        position={[-0.75, 0.08, -0.35]}
        rotation={[0.08, 2.1, 0.05]}
        scale={[1.0, 0.28, 0.85]}
        castShadow
        receiveShadow
      >
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={COLORS.stoneWarm}
          roughness={0.95}
          flatShading
        />
      </mesh>

      {/* COLLIDER — bola pipih via posisi rendah (bukan canopy) */}
      <BallCollider args={[0.7]} position={[0, 0.1, 0]} />
    </>
  )
}

/* ============================================================
   VARIANT REGISTRY — sama pola dengan Tree.jsx
   ============================================================ */
const VARIANTS = {
  small: SmallStone,
  medium: MediumStone,
  large: LargeStone,
  flat: FlatStone,
}

/* ============================================================
   STONE — komponen utama
   API:
     <Stone variant="small|medium|large|flat" position={[x,y,z]} scale={n} />
   Default: variant="small", position=[0,0,0], scale=1
   ============================================================ */
function Stone({
  variant = 'small',
  position = [0, 0, 0],
  scale = 1,
}) {
  const VariantComponent = VARIANTS[variant] || SmallStone

  return (
    <RigidBody type="fixed" position={getTerrainPosition(position)}>
      <group scale={scale}>
        <VariantComponent />
      </group>
    </RigidBody>
  )
}

export default Stone
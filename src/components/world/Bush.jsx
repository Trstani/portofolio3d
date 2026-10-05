import { getTerrainPosition } from './terrainHelper'
/* ============================================================
   PALETTE — hijau natural, satu family dengan Tree,
   tapi sedikit lebih gelap & bervariasi antar layer.
   ============================================================ */
const COLORS = {
  bushDark: '#1F4734',      // dark green (dasar)
  bushBase: '#2A6042',      // medium green
  bushMid: '#357A50',       // medium green (lebih terang)
  bushLight: '#4B9163',     // light green
  bushHighlight: '#5FAE78', // highlight lembut

  // Aksen bunga — semua muted, tidak neon
  flowerCream: '#EFE6D2',
  flowerYellow: '#E5D28A',
  flowerBlue: '#8FA8C8',
  flowerPink: '#D9A6AE',
}

/* ============================================================
   ROUND — semak bulat padat. Cluster icosahedron overlap.
   Cocok untuk taman & pinggir jalan.
   ============================================================ */
function RoundBush() {
  return (
    <>
      {/* CORE VOLUME — besar di tengah */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <icosahedronGeometry args={[0.75, 0]} />
        <meshStandardMaterial
          color={COLORS.bushBase}
          roughness={0.9}
          flatShading
        />
      </mesh>

      {/* LOBE KIRI */}
      <mesh
        position={[-0.55, 0.42, 0.15]}
        rotation={[0.4, 0.8, 0.2]}
        castShadow
        receiveShadow
      >
        <icosahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color={COLORS.bushDark}
          roughness={0.9}
          flatShading
        />
      </mesh>

      {/* LOBE KANAN */}
      <mesh
        position={[0.55, 0.45, -0.1]}
        rotation={[0.2, 1.2, 0.5]}
        castShadow
        receiveShadow
      >
        <icosahedronGeometry args={[0.58, 0]} />
        <meshStandardMaterial
          color={COLORS.bushMid}
          roughness={0.9}
          flatShading
        />
      </mesh>

      {/* LOBE BELAKANG */}
      <mesh
        position={[0.1, 0.6, 0.5]}
        rotation={[0.6, 0.3, 0.7]}
        castShadow
        receiveShadow
      >
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={COLORS.bushLight}
          roughness={0.9}
          flatShading
        />
      </mesh>

      {/* TOP HIGHLIGHT */}
      <mesh
        position={[-0.15, 0.95, -0.2]}
        rotation={[0.3, 1.5, 0.4]}
        castShadow
        receiveShadow
      >
        <icosahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial
          color={COLORS.bushHighlight}
          roughness={0.9}
          flatShading
        />
      </mesh>

    </>
  )
}

/* ============================================================
   WIDE — semak melebar. Lebih rendah, lebih lebar.
   Cocok untuk mengisi area kosong.
   ============================================================ */
function WideBush() {
  return (
    <>
      {/* MAIN SLAB — bagian tengah lebar & rendah */}
      <mesh
        position={[0, 0.4, 0]}
        scale={[1.5, 0.8, 1.3]}
        castShadow
        receiveShadow
      >
        <icosahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color={COLORS.bushBase}
          roughness={0.9}
          flatShading
        />
      </mesh>

      {/* SIDE LEFT — melebar ke kiri */}
      <mesh
        position={[-1.0, 0.32, 0.1]}
        rotation={[0.3, 0.6, 0.2]}
        scale={[1.1, 0.75, 0.95]}
        castShadow
        receiveShadow
      >
        <icosahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color={COLORS.bushDark}
          roughness={0.9}
          flatShading
        />
      </mesh>

      {/* SIDE RIGHT — melebar ke kanan */}
      <mesh
        position={[1.0, 0.35, -0.15]}
        rotation={[0.2, 1.4, 0.4]}
        scale={[1.1, 0.75, 0.95]}
        castShadow
        receiveShadow
      >
        <icosahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color={COLORS.bushMid}
          roughness={0.9}
          flatShading
        />
      </mesh>

      {/* FRONT LOBE */}
      <mesh
        position={[0.2, 0.45, 0.75]}
        rotation={[0.5, 0.4, 0.6]}
        scale={[1.0, 0.7, 0.9]}
        castShadow
        receiveShadow
      >
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={COLORS.bushLight}
          roughness={0.9}
          flatShading
        />
      </mesh>

      {/* BACK LOBE */}
      <mesh
        position={[-0.35, 0.5, -0.7]}
        rotation={[0.4, 1.1, 0.3]}
        scale={[1.0, 0.7, 0.9]}
        castShadow
        receiveShadow
      >
        <icosahedronGeometry args={[0.52, 0]} />
        <meshStandardMaterial
          color={COLORS.bushHighlight}
          roughness={0.9}
          flatShading
        />
      </mesh>

      
    </>
  )
}

/* ============================================================
   SMALL — semak kecil untuk dekorasi / grouping dengan batu.
   Volume kecil, kompak, satu / dua lobe.
   ============================================================ */
function SmallBush() {
  return (
    <>
      {/* MAIN PIECE */}
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <icosahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial
          color={COLORS.bushBase}
          roughness={0.9}
          flatShading
        />
      </mesh>

      {/* SIDE LOBE */}
      <mesh
        position={[0.3, 0.22, 0.08]}
        rotation={[0.5, 0.7, 0.3]}
        castShadow
        receiveShadow
      >
        <icosahedronGeometry args={[0.26, 0]} />
        <meshStandardMaterial
          color={COLORS.bushMid}
          roughness={0.9}
          flatShading
        />
      </mesh>

      {/* TOP HIGHLIGHT */}
      <mesh
        position={[-0.12, 0.52, -0.08]}
        rotation={[0.3, 1.3, 0.4]}
        castShadow
        receiveShadow
      >
        <icosahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial
          color={COLORS.bushLight}
          roughness={0.9}
          flatShading
        />
      </mesh>

     
    </>
  )
}

/* ============================================================
   FLOWER — semak dekoratif dengan aksen bunga lembut.
   Tidak colorful — hanya 4 titik bunga muted di atas foliage.
   ============================================================ */
function FlowerBush() {
  return (
    <>
      {/* CORE VOLUME */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <icosahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial
          color={COLORS.bushBase}
          roughness={0.9}
          flatShading
        />
      </mesh>

      {/* SIDE LOBE */}
      <mesh
        position={[-0.5, 0.4, 0.15]}
        rotation={[0.4, 0.9, 0.2]}
        castShadow
        receiveShadow
      >
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={COLORS.bushDark}
          roughness={0.9}
          flatShading
        />
      </mesh>

      {/* SIDE LOBE */}
      <mesh
        position={[0.5, 0.42, -0.12]}
        rotation={[0.2, 1.1, 0.5]}
        castShadow
        receiveShadow
      >
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={COLORS.bushMid}
          roughness={0.9}
          flatShading
        />
      </mesh>

      {/* TOP HIGHLIGHT */}
      <mesh
        position={[0, 0.9, 0]}
        rotation={[0.3, 0.5, 0.2]}
        castShadow
        receiveShadow
      >
        <icosahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial
          color={COLORS.bushLight}
          roughness={0.9}
          flatShading
        />
      </mesh>

      {/* ============ FLOWER ACCENTS ============ */}
      {/* Cream */}
      <mesh position={[-0.2, 1.15, 0.15]} castShadow>
        <icosahedronGeometry args={[0.08, 0]} />
        <meshStandardMaterial
          color={COLORS.flowerCream}
          roughness={0.7}
          flatShading
        />
      </mesh>

      {/* Soft yellow */}
      <mesh position={[0.3, 1.0, -0.2]} castShadow>
        <icosahedronGeometry args={[0.075, 0]} />
        <meshStandardMaterial
          color={COLORS.flowerYellow}
          roughness={0.7}
          flatShading
        />
      </mesh>

      {/* Soft blue */}
      <mesh position={[0.05, 0.85, 0.55]} castShadow>
        <icosahedronGeometry args={[0.07, 0]} />
        <meshStandardMaterial
          color={COLORS.flowerBlue}
          roughness={0.7}
          flatShading
        />
      </mesh>

      {/* Soft pink */}
      <mesh position={[-0.5, 0.85, -0.3]} castShadow>
        <icosahedronGeometry args={[0.07, 0]} />
        <meshStandardMaterial
          color={COLORS.flowerPink}
          roughness={0.7}
          flatShading
        />
      </mesh>

      
    </>
  )
}

/* ============================================================
   VARIANT REGISTRY — pola sama dengan Tree.jsx & Stone.jsx
   ============================================================ */
const VARIANTS = {
  round: RoundBush,
  wide: WideBush,
  small: SmallBush,
  flower: FlowerBush,
}

/* ============================================================
   BUSH — komponen utama
   API:
     <Bush variant="round|wide|small|flower" position={[x,y,z]} scale={n} />
   Default: variant="round", position=[0,0,0], scale=1
   ============================================================ */
function Bush({
  variant = 'round',
  position = [0, 0, 0],
  scale = 1,
}) {
  const VariantComponent = VARIANTS[variant] || RoundBush

  return (
    
      <group position={getTerrainPosition(position)} scale={scale}>
        <VariantComponent />
      </group>

  )
}

export default Bush
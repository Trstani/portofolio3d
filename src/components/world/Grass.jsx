import { getTerrainPosition } from './terrainHelper'
/* ============================================================
   PALETTE — hijau natural, satu family dengan Bush & Tree
   tetapi sedikit lebih segar supaya terlihat seperti rumput.
   ============================================================ */
const COLORS = {
  grassDark: '#24523A',       // dark grass green
  grassBase: '#2E6647',       // medium grass green
  grassMid: '#3B7D54',        // slightly brighter mid
  grassLight: '#4E9463',      // light grass green
  grassHighlight: '#5FA877',  // tip highlight
}

/* Radius blade — kecil supaya terlihat seperti helai, bukan spike */
const BLADE_RADIUS = 0.035

/* ============================================================
   BLADE — satu helai rumput low-poly.
   Group pivot berada di BASE blade, sehingga saat di-tilt,
   bagian bawah tetap menempel di permukaan (tidak melayang).
   ============================================================ */
function Blade({
  x = 0,
  z = 0,
  height = 0.4,
  tiltX = 0,
  tiltZ = 0,
  yaw = 0,
  color = COLORS.grassBase,
}) {
  return (
    <group position={[x, 0, z]} rotation={[tiltX, yaw, tiltZ]}>
      <mesh position={[0, height / 2, 0]}>
        <coneGeometry args={[BLADE_RADIUS, height, 3]} />
        <meshStandardMaterial
          color={color}
          roughness={0.9}
          flatShading
        />
      </mesh>
    </group>
  )
}

/* ============================================================
   SMALL — cluster kecil, 4 blade pendek.
   Cocok di dekat jalan, batu, atau bush.
   ============================================================ */
function SmallGrass() {
  return (
    <>
      <Blade x={0}     z={0}     height={0.34} tiltX={0.08}  yaw={0.2} color={COLORS.grassBase} />
      <Blade x={0.08}  z={0.05}  height={0.28} tiltX={-0.12} yaw={0.9} color={COLORS.grassMid} />
      <Blade x={-0.07} z={0.06}  height={0.31} tiltX={0.15}  yaw={1.7} color={COLORS.grassDark} />
      <Blade x={0.03}  z={-0.08} height={0.25} tiltX={-0.05} yaw={2.4} color={COLORS.grassLight} />
    </>
  )
}

/* ============================================================
   MEDIUM — cluster lebih penuh, 6 blade sedang.
   Cocok untuk area taman.
   ============================================================ */
function MediumGrass() {
  return (
    <>
      <Blade x={0}     z={0}     height={0.50} tiltX={0.06}  yaw={0.3} color={COLORS.grassBase} />
      <Blade x={0.10}  z={0.06}  height={0.42} tiltX={-0.10} yaw={1.0} color={COLORS.grassMid} />
      <Blade x={-0.10} z={0.05}  height={0.48} tiltX={0.12}  yaw={1.8} color={COLORS.grassDark} />
      <Blade x={0.05}  z={-0.10} height={0.38} tiltX={-0.08} yaw={2.5} color={COLORS.grassLight} />
      <Blade x={-0.06} z={-0.09} height={0.45} tiltX={0.05}  yaw={3.1} color={COLORS.grassBase} />
      <Blade x={0.02}  z={0.12}  height={0.40} tiltX={0.10}  yaw={3.8} color={COLORS.grassHighlight} />
    </>
  )
}

/* ============================================================
   TALL — 7 blade tinggi, beberapa lebih miring.
   Cocok untuk landscape yang lebih natural.
   ============================================================ */
function TallGrass() {
  return (
    <>
      <Blade x={0}     z={0}     height={0.75} tiltX={0.10}  yaw={0.2} color={COLORS.grassBase} />
      <Blade x={0.12}  z={0.08}  height={0.62} tiltX={-0.15} yaw={1.1} color={COLORS.grassMid} />
      <Blade x={-0.12} z={0.06}  height={0.70} tiltX={0.18}  yaw={1.9} color={COLORS.grassDark} />
      <Blade x={0.08}  z={-0.12} height={0.55} tiltX={-0.20} yaw={2.6} color={COLORS.grassLight} />
      <Blade x={-0.08} z={-0.10} height={0.65} tiltX={0.15}  yaw={3.3} color={COLORS.grassBase} />
      <Blade x={0.03}  z={0.15}  height={0.58} tiltX={-0.12} yaw={4.0} color={COLORS.grassMid} />
      <Blade x={-0.02} z={-0.15} height={0.60} tiltX={0.08}  yaw={4.7} color={COLORS.grassHighlight} />
    </>
  )
}

/* ============================================================
   PATCH — beberapa sub-cluster tersebar, rendah tapi lebar.
   Cocok untuk mengisi area kosong.
   ============================================================ */
function PatchGrass() {
  return (
    <>
      {/* Cluster A — di pusat */}
      <Blade x={0}     z={0}     height={0.32} tiltX={0.07}  yaw={0.2} color={COLORS.grassBase} />
      <Blade x={0.08}  z={0.05}  height={0.26} tiltX={-0.10} yaw={0.9} color={COLORS.grassMid} />
      <Blade x={-0.06} z={0.06}  height={0.30} tiltX={0.13}  yaw={1.7} color={COLORS.grassDark} />

      {/* Cluster B — kanan depan */}
      <Blade x={0.36}  z={0.22}  height={0.28} tiltX={0.06}  yaw={2.1} color={COLORS.grassMid} />
      <Blade x={0.43}  z={0.26}  height={0.24} tiltX={-0.12} yaw={2.8} color={COLORS.grassBase} />
      <Blade x={0.31}  z={0.29}  height={0.27} tiltX={0.10}  yaw={3.4} color={COLORS.grassLight} />

      {/* Cluster C — kiri belakang */}
      <Blade x={-0.32} z={-0.16} height={0.30} tiltX={0.05}  yaw={3.9} color={COLORS.grassBase} />
      <Blade x={-0.40} z={-0.10} height={0.25} tiltX={-0.08} yaw={4.6} color={COLORS.grassDark} />
      <Blade x={-0.34} z={-0.23} height={0.28} tiltX={0.11}  yaw={5.2} color={COLORS.grassMid} />

      {/* Cluster D — kecil, depan kiri */}
      <Blade x={0.14}  z={-0.30} height={0.22} tiltX={-0.10} yaw={5.8} color={COLORS.grassLight} />
      <Blade x={0.21}  z={-0.36} height={0.26} tiltX={0.09}  yaw={6.3} color={COLORS.grassBase} />
    </>
  )
}

/* ============================================================
   VARIANT REGISTRY — pola sama dengan Tree.jsx, Stone.jsx, Bush.jsx
   ============================================================ */
const VARIANTS = {
  small: SmallGrass,
  medium: MediumGrass,
  tall: TallGrass,
  patch: PatchGrass,
}

/* ============================================================
   GRASS — komponen utama
   API:
     <Grass variant="small|medium|tall|patch" position={[x,y,z]} scale={n} />
   Default: variant="small", position=[0,0,0], scale=1

   Catatan:
   - TIDAK memakai RigidBody / collider (grass = dekorasi).
   - Base blade berada di y=0 lokal, sehingga dengan
     position=[x, -1, z] rumput berdiri tepat di ground.
   - Tidak ada castShadow / receiveShadow untuk performa
     (grass dipakai ratusan kali di map 80x80).
   ============================================================ */
function Grass({
  variant = 'small',
  position = [0, 0, 0],
  scale = 1,
}) {
  const VariantComponent = VARIANTS[variant] || SmallGrass

  return (
    <group position={getTerrainPosition(position)} scale={scale}>
      <VariantComponent />
    </group>
  )
}

export default Grass
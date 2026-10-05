import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { getTerrainPosition } from './terrainHelper'

/* ============================================================
   MATERIAL
   ============================================================ */

const WOOD = '#5B4636'
const WOOD_DARK = '#463426'

/* ============================================================
   TABLE
   ============================================================ */

const TABLE_LENGTH = 4.2
const TABLE_DEPTH = 1.5
const TABLE_THICKNESS = 0.14

const TABLE_SURFACE_Y = 1.35
const TABLE_CENTER_Y =
  TABLE_SURFACE_Y - TABLE_THICKNESS / 2

/* ============================================================
   BENCH
   ============================================================ */

const BENCH_LENGTH = 4.2
const BENCH_DEPTH = 0.45
const BENCH_THICKNESS = 0.12

const BENCH_SURFACE_Y = 0.68
const BENCH_CENTER_Y =
  BENCH_SURFACE_Y - BENCH_THICKNESS / 2

const BENCH_OFFSET_Z = 1.05

/* ============================================================
   A-FRAME
   ============================================================ */

const LEG_CROSS = 0.16

const LEG_TOP_Y = TABLE_SURFACE_Y
const LEG_BOTTOM_Z = 1.45
const LEG_BOTTOM_X = 1.55

const LEG_MID_Y =
  LEG_TOP_Y / 2

const LEG_MID_Z =
  LEG_BOTTOM_Z / 2

const LEG_LENGTH = Math.sqrt(
  LEG_TOP_Y * LEG_TOP_Y +
  LEG_BOTTOM_Z * LEG_BOTTOM_Z
)

const LEG_TILT = Math.atan2(
  LEG_BOTTOM_Z,
  LEG_TOP_Y
)

/* ============================================================
   UNDER TABLE SUPPORT
   ============================================================ */

const CLEAT_LENGTH = 3.5
const CLEAT_THICKNESS = 0.16
const CLEAT_DEPTH = 0.22
const CLEAT_Y = 1.20

/* ============================================================
   A-FRAME LEG
   ============================================================ */

function Leg({ x, bottomZ }) {
  const tilt =
    bottomZ > 0
      ? -LEG_TILT
      : LEG_TILT

  return (
    <mesh
      position={[
        x,
        LEG_MID_Y,
        bottomZ / 2,
      ]}
      rotation={[tilt, 0, 0]}
      castShadow
      receiveShadow
    >
      <boxGeometry
        args={[
          LEG_CROSS,
          LEG_LENGTH,
          LEG_CROSS,
        ]}
      />

      <meshStandardMaterial
        color={WOOD_DARK}
        roughness={0.9}
        flatShading
      />
    </mesh>
  )
}

/* ============================================================
   PICNIC TABLE
   ============================================================ */

function PicnicTable({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) {
  const rootPosition =
    getTerrainPosition(position, 0)

  return (
    <RigidBody
      type="fixed"
      position={rootPosition}
      rotation={rotation}
    >
      <group scale={scale}>

        {/* =====================================================
            TABLETOP
           ===================================================== */}

        <mesh
          position={[
            0,
            TABLE_CENTER_Y,
            0,
          ]}
          castShadow
          receiveShadow
        >
          <boxGeometry
            args={[
              TABLE_LENGTH,
              TABLE_THICKNESS,
              TABLE_DEPTH,
            ]}
          />

          <meshStandardMaterial
            color={WOOD}
            roughness={0.9}
            flatShading
          />
        </mesh>

        {/* Subtle underside */}

        <mesh
          position={[
            0,
            TABLE_CENTER_Y - 0.10,
            0,
          ]}
          castShadow
        >
          <boxGeometry
            args={[
              TABLE_LENGTH + 0.06,
              0.06,
              TABLE_DEPTH + 0.06,
            ]}
          />

          <meshStandardMaterial
            color={WOOD_DARK}
            roughness={0.92}
            flatShading
          />
        </mesh>

        {/* =====================================================
            BENCH -Z
           ===================================================== */}

        <mesh
          position={[
            0,
            BENCH_CENTER_Y,
            -BENCH_OFFSET_Z,
          ]}
          castShadow
          receiveShadow
        >
          <boxGeometry
            args={[
              BENCH_LENGTH,
              BENCH_THICKNESS,
              BENCH_DEPTH,
            ]}
          />

          <meshStandardMaterial
            color={WOOD}
            roughness={0.9}
            flatShading
          />
        </mesh>

        {/* =====================================================
            BENCH +Z
           ===================================================== */}

        <mesh
          position={[
            0,
            BENCH_CENTER_Y,
            BENCH_OFFSET_Z,
          ]}
          castShadow
          receiveShadow
        >
          <boxGeometry
            args={[
              BENCH_LENGTH,
              BENCH_THICKNESS,
              BENCH_DEPTH,
            ]}
          />

          <meshStandardMaterial
            color={WOOD}
            roughness={0.9}
            flatShading
          />
        </mesh>

        {/* =====================================================
            A-FRAME LEGS
           ===================================================== */}

        <Leg
          x={-LEG_BOTTOM_X}
          bottomZ={-LEG_BOTTOM_Z}
        />

        <Leg
          x={-LEG_BOTTOM_X}
          bottomZ={LEG_BOTTOM_Z}
        />

        <Leg
          x={LEG_BOTTOM_X}
          bottomZ={-LEG_BOTTOM_Z}
        />

        <Leg
          x={LEG_BOTTOM_X}
          bottomZ={LEG_BOTTOM_Z}
        />

        {/* =====================================================
            TOP CLEAT
           ===================================================== */}

        <mesh
          position={[
            0,
            CLEAT_Y,
            0,
          ]}
          castShadow
          receiveShadow
        >
          <boxGeometry
            args={[
              CLEAT_LENGTH,
              CLEAT_THICKNESS,
              CLEAT_DEPTH,
            ]}
          />

          <meshStandardMaterial
            color={WOOD_DARK}
            roughness={0.9}
            flatShading
          />
        </mesh>

        {/* =====================================================
            BENCH SUPPORT -Z
           ===================================================== */}

        <mesh
          position={[
            0,
            BENCH_SURFACE_Y - 0.18,
            -BENCH_OFFSET_Z,
          ]}
          castShadow
        >
          <boxGeometry
            args={[
              3.5,
              0.14,
              0.16,
            ]}
          />

          <meshStandardMaterial
            color={WOOD_DARK}
            roughness={0.9}
            flatShading
          />
        </mesh>

        {/* =====================================================
            BENCH SUPPORT +Z
           ===================================================== */}

        <mesh
          position={[
            0,
            BENCH_SURFACE_Y - 0.18,
            BENCH_OFFSET_Z,
          ]}
          castShadow
        >
          <boxGeometry
            args={[
              3.5,
              0.14,
              0.16,
            ]}
          />

          <meshStandardMaterial
            color={WOOD_DARK}
            roughness={0.9}
            flatShading
          />
        </mesh>

      </group>

      {/* =======================================================
          COLLIDERS
         ======================================================= */}

      {/* TABLETOP */}

      <CuboidCollider
        position={[
          0,
          TABLE_CENTER_Y * scale,
          0,
        ]}
        args={[
          (TABLE_LENGTH / 2) * scale,
          (TABLE_THICKNESS / 2) * scale,
          (TABLE_DEPTH / 2) * scale,
        ]}
      />

      {/* BENCH -Z */}

      <CuboidCollider
        position={[
          0,
          BENCH_CENTER_Y * scale,
          -BENCH_OFFSET_Z * scale,
        ]}
        args={[
          (BENCH_LENGTH / 2) * scale,
          (BENCH_THICKNESS / 2) * scale,
          (BENCH_DEPTH / 2) * scale,
        ]}
      />

      {/* BENCH +Z */}

      <CuboidCollider
        position={[
          0,
          BENCH_CENTER_Y * scale,
          BENCH_OFFSET_Z * scale,
        ]}
        args={[
          (BENCH_LENGTH / 2) * scale,
          (BENCH_THICKNESS / 2) * scale,
          (BENCH_DEPTH / 2) * scale,
        ]}
      />

      {/* =======================================================
          LEG COLLIDERS
         ======================================================= */}

      <CuboidCollider
        position={[
          -LEG_BOTTOM_X * scale,
          LEG_MID_Y * scale,
          -LEG_MID_Z * scale,
        ]}
        rotation={[
          LEG_TILT,
          0,
          0,
        ]}
        args={[
          (LEG_CROSS / 2) * scale,
          (LEG_LENGTH / 2) * scale,
          (LEG_CROSS / 2) * scale,
        ]}
      />

      <CuboidCollider
        position={[
          -LEG_BOTTOM_X * scale,
          LEG_MID_Y * scale,
          LEG_MID_Z * scale,
        ]}
        rotation={[
          -LEG_TILT,
          0,
          0,
        ]}
        args={[
          (LEG_CROSS / 2) * scale,
          (LEG_LENGTH / 2) * scale,
          (LEG_CROSS / 2) * scale,
        ]}
      />

      <CuboidCollider
        position={[
          LEG_BOTTOM_X * scale,
          LEG_MID_Y * scale,
          -LEG_MID_Z * scale,
        ]}
        rotation={[
          LEG_TILT,
          0,
          0,
        ]}
        args={[
          (LEG_CROSS / 2) * scale,
          (LEG_LENGTH / 2) * scale,
          (LEG_CROSS / 2) * scale,
        ]}
      />

      <CuboidCollider
        position={[
          LEG_BOTTOM_X * scale,
          LEG_MID_Y * scale,
          LEG_MID_Z * scale,
        ]}
        rotation={[
          -LEG_TILT,
          0,
          0,
        ]}
        args={[
          (LEG_CROSS / 2) * scale,
          (LEG_LENGTH / 2) * scale,
          (LEG_CROSS / 2) * scale,
        ]}
      />

    </RigidBody>
  )
}

export default PicnicTable
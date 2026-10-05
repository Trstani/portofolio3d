import { useTexture } from '@react-three/drei'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { getTerrainPosition } from './terrainHelper'
import BoardMotifs from './BoardMotifs'

const COLORS = {
  frame: '#1A2028',
  frameLight: '#2A3340',
  board: '#D8D0C2',
  boardDark: '#C2B8A8',
  metal: '#343D49',
  paper: '#F3EEE4',
  pin: '#B86E4B',
  title: '#18202A',
}

function Poster({
  project,
  position = [0, 0, 0],
  rotation = 0,
  scale = 1,
}) {
  const texture = useTexture(project.image)

  return (
    <group
      position={position}
      rotation={[0, 0, rotation]}
      scale={scale}
    >
      {/* =====================================================
          POSTER BACKING
          ===================================================== */}

      <mesh
        position={[0, 0, -0.055]}
        castShadow
      >
        <boxGeometry args={[1.75, 1.9, 0.08]} />

        <meshStandardMaterial
          color={COLORS.frame}
          roughness={0.8}
        />
      </mesh>

      {/* =====================================================
          POSTER PAPER
          ===================================================== */}

      <mesh
        position={[0, 0, 0.02]}
        castShadow
      >
        <boxGeometry args={[1.62, 1.77, 0.035]} />

        <meshStandardMaterial
          color={COLORS.paper}
          roughness={0.9}
        />
      </mesh>

      {/* =====================================================
          IMAGE BACKGROUND
          ===================================================== */}

      <mesh
        position={[0, 0.18, 0.045]}
      >
        <boxGeometry
          args={[1.32, 0.92, 0.02]}
        />

        <meshStandardMaterial
          color={COLORS.boardDark}
          roughness={0.9}
        />
      </mesh>

      {/* =====================================================
          PROJECT IMAGE
          ===================================================== */}

      <mesh
        position={[0, 0.18, 0.058]}
      >
        <planeGeometry
          args={[1.28, 0.88]}
        />

        <meshStandardMaterial
          map={texture}
          roughness={0.8}
        />
      </mesh>

      {/* =====================================================
          PROJECT TITLE
          ===================================================== */}

      <mesh
        position={[0, -0.48, 0.05]}
      >
        <boxGeometry
          args={[1.08, 0.11, 0.02]}
        />

        <meshStandardMaterial
          color={COLORS.title}
          roughness={0.8}
        />
      </mesh>

      {/* =====================================================
          DESCRIPTION LINE
          ===================================================== */}

      <mesh
        position={[0, -0.67, 0.05]}
      >
        <boxGeometry
          args={[0.75, 0.06, 0.02]}
        />

        <meshStandardMaterial
          color={COLORS.boardDark}
          roughness={0.85}
        />
      </mesh>

      {/* =====================================================
          PIN
          ===================================================== */}

      <mesh
        position={[0, 0.72, 0.075]}
        castShadow
      >
        <sphereGeometry
          args={[0.075, 8, 6]}
        />

        <meshStandardMaterial
          color={COLORS.pin}
          roughness={0.45}
          metalness={0.25}
        />
      </mesh>
    </group>
  )
}

/* ============================================================
   POSTER LAYOUT
   ============================================================ */

const POSTER_LAYOUTS = {
  1: [
    [0, 0.15, 0],
  ],

  2: [
    [-1.55, 0.15, -0.025],
    [1.55, 0.15, 0.025],
  ],

  3: [
    [-1.9, 0.15, -0.03],
    [0, 0.35, 0],
    [1.9, 0.15, 0.03],
  ],

  4: [
    [-1.55, 0.95, -0.02],
    [1.55, 0.95, 0.02],
    [-1.55, -0.95, 0.02],
    [1.55, -0.95, -0.02],
  ],

  5: [
    [-1.55, 1.35, -0.02],
    [0, 1.45, 0],
    [1.55, 1.35, 0.02],

    [-0.78, -0.05, 0.02],
    [0.78, -0.05, -0.02],
  ],
}

/* ============================================================
   A-FRAME SUPPORT LEG
   ============================================================ */

function SupportLeg({ side = 1 }) {
  return (
    <group>
      {/* Main angled leg */}
      <mesh
        position={[side * 2.55, -2.15, 0.12]}
        rotation={[0, 0, side * -0.12]}
        castShadow
      >
        <boxGeometry args={[0.32, 2.6, 0.32]} />
        <meshStandardMaterial
          color={COLORS.metal}
          roughness={0.65}
          metalness={0.5}
        />
      </mesh>

      {/* Rear support */}
      <mesh
        position={[side * 2.45, -2.1, -0.35]}
        rotation={[0, 0, side * -0.08]}
        castShadow
      >
        <boxGeometry args={[0.22, 2.45, 0.22]} />
        <meshStandardMaterial
          color={COLORS.frameLight}
          roughness={0.7}
          metalness={0.45}
        />
      </mesh>

      {/* Foot / base */}
      <mesh
        position={[side * 2.65, -3.45, 0.02]}
        castShadow
      >
        <boxGeometry args={[0.95, 0.22, 1.05]} />
        <meshStandardMaterial
          color={COLORS.frame}
          roughness={0.75}
          metalness={0.35}
        />
      </mesh>

      {/* Small front foot */}
      <mesh
        position={[side * 2.65, -3.3, 0.38]}
        castShadow
      >
        <boxGeometry args={[0.7, 0.14, 0.28]} />
        <meshStandardMaterial
          color={COLORS.metal}
          roughness={0.65}
          metalness={0.5}
        />
      </mesh>
    </group>
  )
}

/* ============================================================
   PROJECT BOARD
   ============================================================ */

function ProjectBoard({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  board,
  projects = [],
  motif = 'development',
  onPlayerEnter,
  onPlayerExit,
}) {
  const visibleProjects = projects.slice(0, 5)

  const posterCount = visibleProjects.length

  const layout =
    POSTER_LAYOUTS[posterCount] || POSTER_LAYOUTS[5]

  return (
    <RigidBody type="fixed"  position={getTerrainPosition(position)}>
      {/* ======================================================
          WORLD ORIGIN

          position={[x, 0, z]} = ground position

          Ground surface is around Y = -1.
          The entire board structure is lifted by 2.5 units
          so the feet sit on the ground.
         ====================================================== */}

      <group
        position={[0, 4, 0]}
        rotation={rotation}
        scale={scale}
      >
        {/* ====================================================
            MAIN BOARD
           ==================================================== */}

        <mesh
          position={[0, 1.2, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[7.2, 4.2, 0.3]} />

          <meshStandardMaterial
            color={COLORS.board}
            roughness={0.88}
          />
        </mesh>

        {/* ====================================================
            INNER BOARD PANEL
           ==================================================== */}

        <mesh
          position={[0, 1.2, 0.17]}
          receiveShadow
        >
          <boxGeometry args={[6.72, 3.72, 0.035]} />

          <meshStandardMaterial
            color={COLORS.boardDark}
            roughness={0.92}
          />
        </mesh>
        <BoardMotifs variant={motif} />

        {/* ====================================================
            OUTER FRAME
           ==================================================== */}

        {/* Top */}
        <mesh
          position={[0, 3.35, 0]}
          castShadow
        >
          <boxGeometry args={[7.55, 0.24, 0.38]} />

          <meshStandardMaterial
            color={COLORS.frame}
            roughness={0.75}
            metalness={0.25}
          />
        </mesh>

        {/* Bottom */}
        <mesh
          position={[0, -0.95, 0]}
          castShadow
        >
          <boxGeometry args={[7.55, 0.24, 0.38]} />

          <meshStandardMaterial
            color={COLORS.frame}
            roughness={0.75}
            metalness={0.25}
          />
        </mesh>

        {/* Left */}
        <mesh
          position={[-3.65, 1.2, 0]}
          castShadow
        >
          <boxGeometry args={[0.24, 4.2, 0.38]} />

          <meshStandardMaterial
            color={COLORS.frame}
            roughness={0.75}
            metalness={0.25}
          />
        </mesh>

        {/* Right */}
        <mesh
          position={[3.65, 1.2, 0]}
          castShadow
        >
          <boxGeometry args={[0.24, 4.2, 0.38]} />

          <meshStandardMaterial
            color={COLORS.frame}
            roughness={0.75}
            metalness={0.25}
          />
        </mesh>

        {/* ====================================================
            HEADER
           ==================================================== */}

        <group position={[0, 2.82, 0.22]}>
          <mesh castShadow>
            <boxGeometry args={[6.45, 0.62, 0.16]} />

            <meshStandardMaterial
              color={COLORS.frame}
              roughness={0.75}
              metalness={0.25}
            />
          </mesh>

          {/* Decorative line */}
          <mesh position={[0, -0.19, 0.09]}>
            <boxGeometry args={[4.8, 0.06, 0.025]} />

            <meshStandardMaterial
              color={COLORS.frameLight}
              roughness={0.7}
              metalness={0.2}
            />
          </mesh>
        </group>

        {/* ====================================================
            POSTERS
           ==================================================== */}

        {visibleProjects.map((project, index) => {
          const [x, y, rotationZ] = layout[index]

          return (
            <Poster
              key={
                project.id ??
                `${project.title ?? 'project'}-${index}`
              }
              project={project}
              position={[x, y, 0.25]}
              rotation={rotationZ}
              scale={0.72}
            />
          )
        })}

        {/* ====================================================
            A-FRAME LEGS
           ==================================================== */}

        <SupportLeg side={-1} />
        <SupportLeg side={1} />

        {/* ====================================================
            LOWER CROSS SUPPORT
           ==================================================== */}

        <mesh
          position={[0, -2.35, -0.15]}
          castShadow
        >
          <boxGeometry args={[4.7, 0.22, 0.22]} />

          <meshStandardMaterial
            color={COLORS.frameLight}
            roughness={0.7}
            metalness={0.45}
          />
        </mesh>

        {/* ====================================================
            COLLIDERS
           ==================================================== */}

        {/* Board */}
        <CuboidCollider
          position={[0, 1.2, 0]}
          args={[3.78, 2.1, 0.2]}
        />

        {/* INTERACTION SENSOR */}
        <CuboidCollider
          position={[0, -0.15, 2.2]}
          args={[3.2, 1.2, 2.0]}
          sensor

          onIntersectionEnter={({ other }) => {
            if (
              other.rigidBodyObject?.userData?.type !==
              'player'
            ) {
              return
            }

            onPlayerEnter?.(board)
          }}

          onIntersectionExit={({ other }) => {
            if (
              other.rigidBodyObject?.userData?.type !==
              'player'
            ) {
              return
            }

            onPlayerExit?.(board)
          }}
        />

        {/* Left support */}
        <CuboidCollider
          position={[-2.55, -2.15, 0.12]}
          args={[0.18, 1.3, 0.18]}
        />

        {/* Right support */}
        <CuboidCollider
          position={[2.55, -2.15, 0.12]}
          args={[0.18, 1.3, 0.18]}
        />
      </group>
    </RigidBody>
  )
}

export default ProjectBoard
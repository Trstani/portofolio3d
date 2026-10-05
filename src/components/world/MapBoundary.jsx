import { RigidBody, CuboidCollider } from '@react-three/rapier'

function MapBoundary() {
  const mapSize = 200
  const wallThickness = 1
  const wallHeight = 5

  const half = mapSize / 2

  return (
    <RigidBody type="fixed">
      {/* NORTH */}
      <CuboidCollider
        position={[0, 1.5, -half]}
        args={[
          half,
          wallHeight / 2,
          wallThickness / 2,
        ]}
      />

      {/* SOUTH */}
      <CuboidCollider
        position={[0, 1.5, half]}
        args={[
          half,
          wallHeight / 2,
          wallThickness / 2,
        ]}
      />

      {/* WEST */}
      <CuboidCollider
        position={[-half, 1.5, 0]}
        args={[
          wallThickness / 2,
          wallHeight / 2,
          half,
        ]}
      />

      {/* EAST */}
      <CuboidCollider
        position={[half, 1.5, 0]}
        args={[
          wallThickness / 2,
          wallHeight / 2,
          half,
        ]}
      />
    </RigidBody>
  )
}

export default MapBoundary
import {
  RigidBody,
  CuboidCollider,
} from '@react-three/rapier'

import { getTerrainPosition } from './terrainHelper'

function CertificatesRail({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  certificates = [],
}) {
  const framesX = [-1.6, 0, 1.6]

  return (
    <RigidBody
      type="fixed"
      position={getTerrainPosition(position)}
      rotation={rotation}
    >
      {/* MAIN COLLIDER */}
      <CuboidCollider
        position={[0, 1.5, 0]}
        args={[2.45, 1.5, 0.2]}
      />

      {/* LEFT POST COLLIDER */}
      <CuboidCollider
        position={[-2.3, 1.5, 0]}
        args={[0.15, 1.5, 0.15]}
      />

      {/* RIGHT POST COLLIDER */}
      <CuboidCollider
        position={[2.3, 1.5, 0]}
        args={[0.15, 1.5, 0.15]}
      />

      {/* POST KIRI */}
      <mesh position={[-2.3, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 3.0, 8]} />

        <meshStandardMaterial
          color="#1a1f27"
          roughness={0.7}
          metalness={0.4}
        />
      </mesh>

      {/* POST KANAN */}
      <mesh position={[2.3, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 3.0, 8]} />

        <meshStandardMaterial
          color="#1a1f27"
          roughness={0.7}
          metalness={0.4}
        />
      </mesh>

      {/* TOP BEAM */}
      <mesh position={[0, 3.0, 0]} castShadow>
        <boxGeometry args={[4.9, 0.16, 0.3]} />

        <meshStandardMaterial
          color="#252b35"
          roughness={0.7}
          metalness={0.35}
        />
      </mesh>

      {/* CERTIFICATE FRAMES */}
      {framesX.map((x, i) => (
        <group
          key={i}
          position={[x, 0, 0]}
        >
          {/* HANGER */}
          <mesh position={[0, 2.3, 0]}>
            <boxGeometry
              args={[0.02, 1.2, 0.02]}
            />

            <meshStandardMaterial
              color="#4b5563"
              roughness={0.6}
              metalness={0.5}
            />
          </mesh>

          {/* FRAME */}
          <mesh
            position={[0, 1.4, 0]}
            castShadow
          >
            <boxGeometry
              args={[1.0, 0.75, 0.08]}
            />

            <meshStandardMaterial
              color="#252b35"
              roughness={0.75}
              metalness={0.3}
            />
          </mesh>

          {/* CERTIFICATE */}
          <mesh position={[0, 1.4, 0.05]}>
            <boxGeometry
              args={[0.86, 0.62, 0.03]}
            />

            <meshStandardMaterial
              color="#f3eee4"
              roughness={0.85}
            />
          </mesh>

          {/* CERTIFICATE LABEL */}
          <mesh position={[0, 1.28, 0.07]}>
            <boxGeometry
              args={[0.6, 0.04, 0.02]}
            />

            <meshStandardMaterial
              color="#1a1f27"
              roughness={0.7}
            />
          </mesh>
        </group>
      ))}

      {/* FOOT KIRI */}
      <mesh
        position={[-2.3, 0.1, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[0.22, 0.26, 0.2, 8]}
        />

        <meshStandardMaterial
          color="#1a1f27"
          roughness={0.8}
          metalness={0.3}
        />
      </mesh>

      {/* FOOT KANAN */}
      <mesh
        position={[2.3, 0.1, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[0.22, 0.26, 0.2, 8]}
        />

        <meshStandardMaterial
          color="#1a1f27"
          roughness={0.8}
          metalness={0.3}
        />
      </mesh>
    </RigidBody>
  )
}

export default CertificatesRail
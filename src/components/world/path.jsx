import * as THREE from 'three'

import { getTerrainHeight } from './Ground'

function Path() {
  const points = [
    new THREE.Vector3(0, 0, 85),
    new THREE.Vector3(-8, 0, 72),
    new THREE.Vector3(-16, 0, 58),
    new THREE.Vector3(-18, 0, 43),
    new THREE.Vector3(-10, 0, 30),
    new THREE.Vector3(4, 0, 19),
    new THREE.Vector3(15, 0, 7),
    new THREE.Vector3(18, 0, -7),
    new THREE.Vector3(10, 0, -21),
    new THREE.Vector3(2, 0, -34),
    new THREE.Vector3(12, 0, -47),
    new THREE.Vector3(16, 0, -61),
    new THREE.Vector3(8, 0, -74),
    new THREE.Vector3(0, 0, -85),
  ]

  const curve = new THREE.CatmullRomCurve3(
    points,
    false,
    'catmullrom',
    0.5
  )

  const segments = 160
  const width = 5.5

  const vertices = []
  const indices = []

  for (let i = 0; i <= segments; i++) {
    const t = i / segments

    const point = curve.getPointAt(t)
    const tangent = curve.getTangentAt(t)

    const side = new THREE.Vector3(
      -tangent.z,
      0,
      tangent.x
    ).normalize()

    const left = point.clone().add(
      side.clone().multiplyScalar(width / 2)
    )

    const right = point.clone().add(
      side.clone().multiplyScalar(-width / 2)
    )

    const leftHeight =
      getTerrainHeight(
        left.x,
        left.z
      )

    const rightHeight =
      getTerrainHeight(
        right.x,
        right.z
      )

    // Sedikit di atas terrain
    left.y = leftHeight + 0.04
    right.y = rightHeight + 0.04

    vertices.push(
      left.x,
      left.y,
      left.z,

      right.x,
      right.y,
      right.z
    )
  }

  for (let i = 0; i < segments; i++) {
    const current = i * 2
    const next = current + 2

    indices.push(
      current,
      next,
      current + 1,

      current + 1,
      next,
      next + 1
    )
  }

  const geometry =
    new THREE.BufferGeometry()

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(
      vertices,
      3
    )
  )

  geometry.setIndex(indices)

  geometry.computeVertexNormals()

  return (
    <mesh
      geometry={geometry}
      receiveShadow
    >
      <meshStandardMaterial
        color="#374151"
        roughness={0.9}
      />
    </mesh>
  )
}

export default Path
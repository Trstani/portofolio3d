import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

const FADE_OPACITY = 0.15
const FADE_SPEED = 0.12

function CameraOcclusion({ target }) {
  const { camera, scene } = useThree()

  const raycaster = useRef(new THREE.Raycaster())
  const direction = useRef(new THREE.Vector3())
  const cameraPosition = useRef(new THREE.Vector3())
  const playerPosition = useRef(new THREE.Vector3())

  const fadedMeshes = useRef(new Set())

  // ==========================================================
  // FIND OCCLUDER ROOT
  // ==========================================================

  function findOccluder(object) {
    let current = object

    while (current) {
      if (current.userData?.cameraOccluder) {
        return current
      }

      current = current.parent
    }

    return null
  }

  // ==========================================================
  // FADE OBJECT
  // ==========================================================

  function fadeObject(root) {
    root.traverse((child) => {
      if (!child.isMesh || !child.material) {
        return
      }

      child.material.transparent = true
      child.material.depthWrite = false
      child.material.needsUpdate = true

      child.material.opacity =
        THREE.MathUtils.lerp(
          child.material.opacity,
          FADE_OPACITY,
          FADE_SPEED
        )

      fadedMeshes.current.add(child)
    })
  }

  // ==========================================================
  // RESTORE OBJECT
  // ==========================================================

  function restoreObject(root) {
    root.traverse((child) => {
      if (!child.isMesh || !child.material) {
        return
      }

      child.material.opacity =
        THREE.MathUtils.lerp(
          child.material.opacity,
          1,
          FADE_SPEED
        )

      // Fully restored
      if (child.material.opacity > 0.99) {
        child.material.opacity = 1

        child.material.transparent = false
        child.material.depthWrite = true
        child.material.needsUpdate = true

        fadedMeshes.current.delete(child)
      }
    })
  }

  // ==========================================================
  // FRAME
  // ==========================================================

  useFrame(() => {
    if (!target.current) return

    // ========================================================
    // CAMERA POSITION
    // ========================================================

    camera.getWorldPosition(
      cameraPosition.current
    )

    // ========================================================
    // PLAYER POSITION
    // ========================================================

    target.current.getWorldPosition(
      playerPosition.current
    )

    // ========================================================
    // TARGET POINTS ON PLAYER
    // ========================================================

    const targets = [
      // Head
      new THREE.Vector3(
        playerPosition.current.x,
        playerPosition.current.y + 1.8,
        playerPosition.current.z
      ),

      // Chest
      new THREE.Vector3(
        playerPosition.current.x,
        playerPosition.current.y + 1.2,
        playerPosition.current.z
      ),

      // Body
      new THREE.Vector3(
        playerPosition.current.x,
        playerPosition.current.y + 0.7,
        playerPosition.current.z
      ),

      // Left side
      new THREE.Vector3(
        playerPosition.current.x - 0.45,
        playerPosition.current.y + 1.0,
        playerPosition.current.z
      ),

      // Right side
      new THREE.Vector3(
        playerPosition.current.x + 0.45,
        playerPosition.current.y + 1.0,
        playerPosition.current.z
      ),
    ]

    // ========================================================
    // CURRENT OCCLUDERS
    // ========================================================

    const currentOccluders = new Set()

    // ========================================================
    // CAST MULTIPLE RAYS
    // ========================================================

    targets.forEach((targetPoint) => {
      direction.current
        .subVectors(
          targetPoint,
          cameraPosition.current
        )
        .normalize()

      const distance =
        cameraPosition.current.distanceTo(
          targetPoint
        )

      raycaster.current.set(
        cameraPosition.current,
        direction.current
      )

      raycaster.current.near = 0
      raycaster.current.far = distance

      const hits =
        raycaster.current.intersectObjects(
          scene.children,
          true
        )

      for (const hit of hits) {
        const occluder = findOccluder(
          hit.object
        )

        if (occluder) {
          currentOccluders.add(occluder)

          // One occluder is enough for this ray
          break
        }
      }
    })

    // ========================================================
    // FADE OBJECTS CURRENTLY BLOCKING PLAYER
    // ========================================================

    currentOccluders.forEach((root) => {
      fadeObject(root)
    })

    // ========================================================
    // RESTORE OBJECTS THAT NO LONGER BLOCK PLAYER
    // ========================================================

    const rootsToRestore = new Set()

    fadedMeshes.current.forEach((mesh) => {
      let root = mesh

      while (
        root &&
        !root.userData?.cameraOccluder
      ) {
        root = root.parent
      }

      if (
        root &&
        !currentOccluders.has(root)
      ) {
        rootsToRestore.add(root)
      }
    })

    rootsToRestore.forEach((root) => {
      restoreObject(root)
    })
  })

  return null
}

export default CameraOcclusion
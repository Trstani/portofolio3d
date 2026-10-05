import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

function FollowCamera({ target }) {
  const { camera } = useThree()

  const playerPosition = useRef(
    new THREE.Vector3()
  )

  useFrame(() => {
    if (!target.current) return

    // =========================
    // PLAYER POSITION
    // =========================

    target.current.getWorldPosition(
      playerPosition.current
    )

    // =========================
    // FIXED 45° CAMERA
    // =========================

    // Kamera selalu berada:
    // +X = kanan player/world
    // +Z = belakang player/world
    //
    // X dan Z sama-sama 6
    // menghasilkan sudut diagonal 45°

    camera.position.set(
      playerPosition.current.x + 8,
      playerPosition.current.y + 12,
      playerPosition.current.z + 24
    )

    // =========================
    // LOOK AT PLAYER
    // =========================

    camera.lookAt(
      playerPosition.current.x,
      playerPosition.current.y + 1,
      playerPosition.current.z
    )
  })

  return null
}

export default FollowCamera
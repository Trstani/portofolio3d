import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  RigidBody,
  CapsuleCollider,
  CuboidCollider,
  useBeforePhysicsStep,
} from '@react-three/rapier'

import { isKeyDown } from '../../hooks/keyboardStore'
import { touchInput } from '../../hooks/touchInput'
import Character from './Character'
import { getTerrainHeight } from '../world/Ground'

const PLAYER_SPEED = 5
const ROTATION_SPEED = 10
const JUMP_IMPULSE = 70
const GROUND_SENSOR_OFFSET = [0, -1.08, 0]
const CHARACTER_OFFSET = [0, -0.5, 0]

const MOVE_DEADZONE = 0.01

function Player({ playerRef, playerVisualRef }) {
  const grounded = useRef(false)
  const hasGroundedOnce = useRef(false)
  const jumpWasPressed = useRef(false)

  const startX = 0
  const startZ = 85
  const startY = getTerrainHeight(startX, startZ) + 3

  const isJumping = useRef(false)
  const isFalling = useRef(false)
  const targetRotation = useRef(0)
  const walkTime = useRef(0)
  const isMoving = useRef(false)

  const nextVel = useRef({ x: 0, y: 0, z: 0 })
  const jumpImpulse = useRef({ x: 0, y: JUMP_IMPULSE, z: 0 })

  useFrame((_, delta) => {
    if (isMoving.current) {
      walkTime.current += delta * 10
    } else {
      walkTime.current = 0
    }

    if (playerVisualRef.current) {
      const currentRotation = playerVisualRef.current.rotation.y
      let rotationDifference = targetRotation.current - currentRotation
      rotationDifference = Math.atan2(
        Math.sin(rotationDifference),
        Math.cos(rotationDifference)
      )
      playerVisualRef.current.rotation.y +=
        rotationDifference * Math.min(ROTATION_SPEED * delta, 1)
    }
  })

  useBeforePhysicsStep(() => {
    if (!playerRef.current) return
    const body = playerRef.current

    const velocity = body.linvel()

    /* Baca keyboard langsung dari store — tidak butuh re-render */
    let moveX = touchInput.x
    let moveZ = touchInput.z

    if (isKeyDown('KeyW')) moveZ -= 1
    if (isKeyDown('KeyS')) moveZ += 1
    if (isKeyDown('KeyA')) moveX -= 1
    if (isKeyDown('KeyD')) moveX += 1

    const rawLength = Math.sqrt(moveX * moveX + moveZ * moveZ)
    if (rawLength > 1) {
      moveX /= rawLength
      moveZ /= rawLength
    }

    const movementLength = Math.sqrt(moveX * moveX + moveZ * moveZ)

    if (movementLength > MOVE_DEADZONE) {
      const directionX = moveX / movementLength
      const directionZ = moveZ / movementLength

      targetRotation.current = Math.atan2(-directionX, -directionZ)

      const speedScale = Math.min(movementLength, 1)
      moveX = directionX * PLAYER_SPEED * speedScale
      moveZ = directionZ * PLAYER_SPEED * speedScale
    } else {
      moveX = 0
      moveZ = 0
    }

    isMoving.current = movementLength > MOVE_DEADZONE

    nextVel.current.x = moveX
    nextVel.current.y = velocity.y
    nextVel.current.z = moveZ
    body.setLinvel(nextVel.current, true)

    /* Jump: keyboard Space atau tombol JUMP */
    const jumpInput = isKeyDown('Space') || touchInput.jump
    const jumpPressed = jumpInput && !jumpWasPressed.current

    if (jumpPressed && grounded.current) {
      body.applyImpulse(jumpImpulse.current, true)
    }
    jumpWasPressed.current = jumpInput

    if (!hasGroundedOnce.current) {
      isJumping.current = false
      isFalling.current = false
      return
    }

    const currentVelocity = body.linvel()
    if (!grounded.current) {
      if (currentVelocity.y > 0.5) {
        isJumping.current = true
        isFalling.current = false
      } else if (currentVelocity.y < -0.5) {
        isJumping.current = false
        isFalling.current = true
      }
    } else {
      isJumping.current = false
      isFalling.current = false
    }
  })

  return (
    <RigidBody
      ref={playerRef}
      position={[startX, startY, startZ]}
      mass={1}
      lockRotations
      userData={{ type: 'player' }}
    >
      <CapsuleCollider
        args={[0.65, 0.55]}
        friction={0}
        restitution={0}
      />

      <CuboidCollider
        args={[0.7, 0.22, 0.45]}
        position={GROUND_SENSOR_OFFSET}
        sensor
        onIntersectionEnter={() => {
          grounded.current = true
          hasGroundedOnce.current = true
        }}
        onIntersectionExit={() => {
          grounded.current = false
        }}
      />

      <group position={CHARACTER_OFFSET}>
        <Character
          characterRef={playerVisualRef}
          isMovingRef={isMoving}
          walkTimeRef={walkTime}
          isJumpingRef={isJumping}
          isFallingRef={isFalling}
        />
      </group>
    </RigidBody>
  )
}

export default Player
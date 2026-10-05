import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

import { getTerrainHeight } from '../world/Ground'
import NPC from './NPC'

const PATH_POINTS = [
  [0, 0, 85],
  [-8, 0, 72],
  [-16, 0, 58],
  [-18, 0, 43],
  [-10, 0, 30],
  [4, 0, 19],
  [15, 0, 7],
  [18, 0, -7],
  [10, 0, -21],
  [2, 0, -34],
  [12, 0, -47],
  [16, 0, -61],
  [8, 0, -74],
  [0, 0, -85],
]

const PATH_CURVE = new THREE.CatmullRomCurve3(
  PATH_POINTS.map(
    ([x, y, z]) =>
      new THREE.Vector3(x, y, z)
  ),
  false,
  'catmullrom',
  0.5
)

const PATH_STEPS = 500
const PATH_LENGTH = PATH_CURVE.getLength()

const CHECKPOINTS = {
  about: {
    stop: [-9, 50],
    lookAt: [-8, 50],
  },

  project1: {
    stop: [-11, 28],
    lookAt: [-13, 26],
  },

  project2: {
    stop: [20, 17],
    lookAt: [20, 12],
  },

  project3: {
    stop: [8, 5],
    lookAt: [8, 1],
  },

  certificate1: {
    stop: [13, -23],
    lookAt: [13, -28],
  },

  certificate2: {
    stop: [-2, -23],
    lookAt: [-2, -28],
  },

  contact: {
    stop: [4, -48],
    lookAt: [5, -54],
  },
}

function findClosestPathT(x, z) {
  let closestT = 0
  let closestDistance = Infinity

  for (let i = 0; i <= PATH_STEPS; i++) {
    const t = i / PATH_STEPS
    const point =
      PATH_CURVE.getPointAt(t)

    const dx = point.x - x
    const dz = point.z - z

    const distance =
      dx * dx + dz * dz

    if (distance < closestDistance) {
      closestDistance = distance
      closestT = t
    }
  }

  return closestT
}

function moveTowards(
  npc,
  targetX,
  targetZ,
  speed,
  delta
) {
  const dx =
    targetX - npc.position.x

  const dz =
    targetZ - npc.position.z

  const distance = Math.sqrt(
    dx * dx + dz * dz
  )

  if (distance < 0.05) {
    npc.position.x = targetX
    npc.position.z = targetZ

    return true
  }

  const directionX = dx / distance
  const directionZ = dz / distance

  const movement =
    Math.min(
      speed * delta,
      distance
    )

  npc.position.x +=
    directionX * movement

  npc.position.z +=
    directionZ * movement

  npc.position.y =
    getTerrainHeight(
      npc.position.x,
      npc.position.z
    ) + 0.47

  return false
}

function rotateTowards(
  npc,
  targetX,
  targetZ,
  rotationSpeed,
  delta
) {
  const dx =
    targetX - npc.position.x

  const dz =
    targetZ - npc.position.z

  const targetRotation =
    Math.atan2(-dx, -dz)

  let difference =
    targetRotation -
    npc.rotation.y

  difference =
    Math.atan2(
      Math.sin(difference),
      Math.cos(difference)
    )

  npc.rotation.y +=
    difference *
    Math.min(
      rotationSpeed * delta,
      1
    )
}

function NPCMovement({
  position = [0, 0, 0],
  rotation = [0, 0, 0],

  behavior = 'traveler',

  checkpoints = [],

  speed = 1.2,
  rotationSpeed = 8,
  walkCycleSpeed = 8,
  waitTime = 5,

  onFinish,

  ...npcProps
}) {
  const characterRef = useRef()

  const isMovingRef = useRef(false)
  const walkTimeRef = useRef(0)

  const pathT = useRef(null)

  const checkpointIndex = useRef(0)

  const state = useRef('path')

  const waitTimer = useRef(0)

  const currentCheckpoint = useRef(null)

  useFrame((_, delta) => {
    const npc = characterRef.current

    if (!npc) return

    // ==================================================
    // STATIONARY
    // ==================================================

    if (behavior === 'stationary') {
      isMovingRef.current = false

      return
    }

    // ==================================================
    // INITIAL PATH POSITION
    // ==================================================

    if (pathT.current === null) {
      pathT.current =
        findClosestPathT(
          npc.position.x,
          npc.position.z
        )
    }

    // ==================================================
    // WAITING AT LANDMARK
    // ==================================================

    if (state.current === 'waiting') {
      isMovingRef.current = false

      if (currentCheckpoint.current) {
        rotateTowards(
          npc,
          currentCheckpoint.current.lookAt[0],
          currentCheckpoint.current.lookAt[1],
          rotationSpeed,
          delta
        )
      }

      waitTimer.current -= delta

      if (waitTimer.current <= 0) {
        state.current = 'returning'
      }

      return
    }

    // ==================================================
    // RETURNING FROM LANDMARK TO PATH
    // ==================================================

    if (state.current === 'returning') {
      const targetT =
        findClosestPathT(
          npc.position.x,
          npc.position.z
        )

      const pathPoint =
        PATH_CURVE.getPointAt(
          targetT
        )

      isMovingRef.current = true

      walkTimeRef.current +=
        delta * walkCycleSpeed

      const reached =
        moveTowards(
          npc,
          pathPoint.x,
          pathPoint.z,
          speed,
          delta
        )

      rotateTowards(
        npc,
        pathPoint.x,
        pathPoint.z,
        rotationSpeed,
        delta
      )

      if (reached) {
        pathT.current = targetT

        currentCheckpoint.current = null

        state.current = 'path'

        checkpointIndex.current++
      }

      return
    }

    // ==================================================
    // GOING TO LANDMARK
    // ==================================================

    if (state.current === 'checkpoint') {
      const checkpoint =
        currentCheckpoint.current

      if (!checkpoint) {
        state.current = 'path'
        return
      }

      isMovingRef.current = true

      walkTimeRef.current +=
        delta * walkCycleSpeed

      const reached =
        moveTowards(
          npc,
          checkpoint.stop[0],
          checkpoint.stop[1],
          speed,
          delta
        )

      rotateTowards(
        npc,
        checkpoint.lookAt[0],
        checkpoint.lookAt[1],
        rotationSpeed,
        delta
      )

      if (reached) {
        npc.position.y =
          getTerrainHeight(
            checkpoint.stop[0],
            checkpoint.stop[1]
          ) + 0.47

        waitTimer.current =
          waitTime

        state.current = 'waiting'

        isMovingRef.current = false
      }

      return
    }

    // ==================================================
    // FINISH
    // ==================================================

    if (pathT.current >= 0.999) {
      isMovingRef.current = false

      if (onFinish) {
        onFinish()
      }

      return
    }

    // ==================================================
    // CHECK NEXT CHECKPOINT
    // ==================================================

    if (
      behavior === 'tourist' &&
      checkpointIndex.current <
        checkpoints.length
    ) {
      const checkpointName =
        checkpoints[
          checkpointIndex.current
        ]

      const checkpoint =
        CHECKPOINTS[checkpointName]

      if (checkpoint) {
        const checkpointT =
          findClosestPathT(
            checkpoint.stop[0],
            checkpoint.stop[1]
          )

        if (
          pathT.current >=
          checkpointT - 0.002
        ) {
          currentCheckpoint.current =
            checkpoint

          state.current =
            'checkpoint'

          return
        }
      }
    }

    // ==================================================
    // FOLLOW PATH
    // ==================================================

    isMovingRef.current = true

    walkTimeRef.current +=
      delta * walkCycleSpeed

    const point =
      PATH_CURVE.getPointAt(
        pathT.current
      )

    const tangent =
      PATH_CURVE.getTangentAt(
        pathT.current
      )

    npc.position.x = point.x
    npc.position.z = point.z

    npc.position.y =
      getTerrainHeight(
        point.x,
        point.z
      ) + 0.47

    const targetRotation =
      Math.atan2(
        -tangent.x,
        -tangent.z
      )

    let difference =
      targetRotation -
      npc.rotation.y

    difference =
      Math.atan2(
        Math.sin(difference),
        Math.cos(difference)
      )

    npc.rotation.y +=
      difference *
      Math.min(
        rotationSpeed * delta,
        1
      )

    const tStep =
      (speed * delta) /
      PATH_LENGTH

    pathT.current =
      Math.min(
        pathT.current + tStep,
        1
      )
  })

  return (
    <NPC
      {...npcProps}
      position={position}
      rotation={rotation}
      characterRef={characterRef}
      isMovingRef={isMovingRef}
      walkTimeRef={walkTimeRef}
    />
  )
}

export default NPCMovement
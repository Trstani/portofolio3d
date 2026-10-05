import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import NPC from './NPC'
import FoxDoctor from './npcs/FoxDoctor'

/* ============================================================
   HELPER — damping yaw untuk behavior lookAt / conversation
   ============================================================ */
function dampYaw(current, desired, speed, delta) {
  let diff = desired - current
  diff = Math.atan2(Math.sin(diff), Math.cos(diff))
  return current + diff * Math.min(speed * delta, 1)
}

/* ============================================================
   DISPATCHER — tidak ada hooks di sini, hanya routing.
   FoxDoctor punya file sendiri yang self-contained.
   ============================================================ */
function NPCStatic(props) {
  if (props.appearance === 'foxDoctor') {
    return (
      <FoxDoctor
        position={props.position}
        rotation={props.rotation}
        playerPositionRef={props.playerPositionRef}
        patrolOffset={props.patrolOffset}
        walkSpeed={props.walkSpeed}
        turnSpeed={props.turnSpeed}
        detectionDistance={props.detectionDistance}
        greetingDistance={props.greetingDistance}
        lostDistance={props.lostDistance}
        greetDuration={props.greetDuration}
        onGreet={props.onGreet}
      />
    )
  }
  return <RegularNPC {...props} />
}

/* ============================================================
   REGULAR NPC — hanya behavior idle, lookAt, conversation
   ============================================================ */
function RegularNPC({
  position = [0, 0, 0],
  rotation = [0, 0, 0],

  behavior = 'idle',
  target = null,

  /* Appearance */
  gender = 'male',
  skinTone = 'medium',
  hair = 'short',
  hairColor = 'black',
  outfit = 'hoodie',
  pants = 'navy',
  shoes = 'white',
  appearance = 'default',

  walkStyle: walkStyleProp,
  talkPose: talkPoseProp,
}) {
  const characterRef = useRef()

  const isMovingRef = useRef(false)
  const walkTimeRef = useRef(0)
  const isTalkingRef = useRef(false)

  const currentRotation = useRef(rotation[1])

  const walkStyle =
    walkStyleProp !== undefined ? walkStyleProp : 'normal'

  const talkPose =
    talkPoseProp !== undefined ? talkPoseProp : 'conversation'

  useFrame((_, delta) => {
    if (!characterRef.current) return
    const npc = characterRef.current

    /* ---------------- IDLE ---------------- */
    if (behavior === 'idle') {
      isMovingRef.current = false
      isTalkingRef.current = false
      return
    }

    /* ---------------- LOOK AT ---------------- */
    if (behavior === 'lookAt') {
      isMovingRef.current = false
      isTalkingRef.current = false
      if (!target) return

      const dx = target[0] - npc.position.x
      const dz = target[2] - npc.position.z
      if (Math.abs(dx) < 0.001 && Math.abs(dz) < 0.001) return

      const desiredYaw = Math.atan2(-dx, -dz)

      /* Early return — skip perhitungan kalau sudah sejajar */
      let diff = desiredYaw - currentRotation.current
      diff = Math.atan2(Math.sin(diff), Math.cos(diff))
      if (Math.abs(diff) < 0.001) return

      currentRotation.current = dampYaw(
        currentRotation.current,
        desiredYaw,
        5,
        delta
      )
      npc.rotation.y = currentRotation.current
      return
    }

    /* ---------------- CONVERSATION ---------------- */
    if (behavior === 'conversation') {
      isMovingRef.current = false
      isTalkingRef.current = true
      if (!target) return

      const dx = target[0] - npc.position.x
      const dz = target[2] - npc.position.z
      if (Math.abs(dx) < 0.001 && Math.abs(dz) < 0.001) return

      const desiredYaw = Math.atan2(-dx, -dz)

      let diff = desiredYaw - currentRotation.current
      diff = Math.atan2(Math.sin(diff), Math.cos(diff))
      if (Math.abs(diff) < 0.001) return

      currentRotation.current = dampYaw(
        currentRotation.current,
        desiredYaw,
        5,
        delta
      )
      npc.rotation.y = currentRotation.current
      return
    }
  })

  return (
    <NPC
      position={position}
      rotation={rotation}
      gender={gender}
      skinTone={skinTone}
      hair={hair}
      hairColor={hairColor}
      outfit={outfit}
      pants={pants}
      shoes={shoes}
      appearance={appearance}
      walkStyle={walkStyle}
      talkPose={talkPose}
      characterRef={characterRef}
      isMovingRef={isMovingRef}
      walkTimeRef={walkTimeRef}
      isTalkingRef={isTalkingRef}
    />
  )
}

export default NPCStatic
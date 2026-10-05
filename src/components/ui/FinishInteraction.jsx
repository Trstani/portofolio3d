import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const FINISH_POSITION = [0, -92]
const FINISH_DISTANCE = 10

function FinishInteraction({
  playerRef,
  onOpen,
}) {
  const triggered = useRef(false)

  useFrame(() => {
    if (!playerRef.current) return
    if (triggered.current) return

    const playerPosition =
      playerRef.current.translation()

    const distanceX =
      playerPosition.x - FINISH_POSITION[0]

    const distanceZ =
      playerPosition.z - FINISH_POSITION[1]

    const distance = Math.sqrt(
      distanceX * distanceX +
      distanceZ * distanceZ
    )

    if (distance <= FINISH_DISTANCE) {
      console.log('FINISH REACHED!')

      triggered.current = true

      onOpen?.()
    }
  })

  return null
}

export default FinishInteraction
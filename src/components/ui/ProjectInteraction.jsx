import { useEffect, useRef, useState } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import { useKeyPressed } from '../../hooks/useKeyPressed'

function ProjectInteraction({
  playerRef,
  board,
  onOpen,
}) {
  const isKeyEPressed = useKeyPressed('KeyE')

  const [nearBoard, setNearBoard] = useState(false)
  const nearBoardRef = useRef(false)
  const wasPressed = useRef(false)

  useFrame(() => {
    if (!playerRef.current || !board) return

    const playerPosition = playerRef.current.translation()

    const distanceX = playerPosition.x - board.position[0]
    const distanceZ = playerPosition.z - board.position[2]

    const distance = Math.sqrt(
      distanceX * distanceX + distanceZ * distanceZ
    )

    const isNear = distance <= board.interactionDistance

    if (isNear !== nearBoardRef.current) {
      nearBoardRef.current = isNear
      setNearBoard(isNear)
    }
  })

  useEffect(() => {
    if (isKeyEPressed && !wasPressed.current && nearBoard) {
      onOpen?.(board)
    }
    wasPressed.current = isKeyEPressed
  }, [isKeyEPressed, nearBoard, board, onOpen])

  if (!nearBoard || !board) {
    return null
  }

  return (
    <Html
      position={[
        board.position[0],
        board.position[1] + 4.8,
        board.position[2],
      ]}
      center
      distanceFactor={14}
      zIndexRange={[100, 200]}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          minWidth: '270px',
          padding: '16px 20px',
          borderRadius: '15px',
          background: 'rgba(5, 15, 35, 0.97)',
          border: '2px solid rgba(59, 130, 246, 0.9)',
          boxShadow: '0 14px 40px rgba(0, 0, 0, 0.55)',
          color: '#ffffff',
          fontFamily: 'Josefin Sans, sans-serif',
          fontSize: '19px',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            flexShrink: 0,
            borderRadius: '12px',
            background: '#2563eb',
            color: '#ffffff',
            fontSize: '23px',
            fontWeight: 900,
            boxShadow: '0 6px 18px rgba(37, 99, 235, 0.5)',
          }}
        >
          E
        </span>
        <span>Explore {board.title}</span>
      </div>
    </Html>
  )
}

export default ProjectInteraction
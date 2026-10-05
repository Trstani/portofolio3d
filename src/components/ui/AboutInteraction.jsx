import { useEffect, useRef, useState } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import { useKeyPressed } from '../../hooks/useKeyPressed'

const ABOUT_POSITION = [-8, 0, 50]
const INTERACTION_DISTANCE = 6

function AboutInteraction({ playerRef, onOpen }) {
  const isKeyEPressed = useKeyPressed('KeyE')

  const [nearAbout, setNearAbout] = useState(false)
  const nearAboutRef = useRef(false)          // ← baru
  const wasPressed = useRef(false)

  useFrame(() => {
    if (!playerRef.current) return

    const playerPosition = playerRef.current.translation()
    const dx = playerPosition.x - ABOUT_POSITION[0]
    const dz = playerPosition.z - ABOUT_POSITION[2]
    const distance = Math.sqrt(dx * dx + dz * dz)
    const isNear = distance <= INTERACTION_DISTANCE

    /* Hanya panggil setState saat nilai benar-benar berubah.
       Ini menghilangkan 59 render per detik yang sia-sia
       saat player diam di dalam atau di luar radius. */
    if (isNear !== nearAboutRef.current) {
      nearAboutRef.current = isNear
      setNearAbout(isNear)
    }
  })

  useEffect(() => {
    if (isKeyEPressed && !wasPressed.current && nearAbout) {
      onOpen()
    }
    wasPressed.current = isKeyEPressed
  }, [isKeyEPressed, nearAbout, onOpen])

  return (
    <>
      {nearAbout && (
        <Html
          position={[ABOUT_POSITION[0], 4.2, ABOUT_POSITION[2]]}
          center
          distanceFactor={12}
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
            <span>Explore About</span>
          </div>
        </Html>
      )}
    </>
  )
}

export default AboutInteraction
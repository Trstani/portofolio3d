import { useEffect, useRef } from 'react'
import { touchInput, isTouchDevice } from '../../hooks/touchInput'
import { getEGestureTracker } from '../../hooks/useEGestureTracker'

const BASE_SIZE = 140
const STICK_SIZE = 60
const MAX_DIST = (BASE_SIZE - STICK_SIZE) / 2

/* ============================================================
   SYNTHETIC KEYBOARD EVENT
   ------------------------------------------------------------
   Dispatch keydown/keyup untuk KeyE ke window. useKeyboard.js
   listen di window dan membaca event.code, jadi tombol E di
   layar bisa memicu semua interaksi (About, Project, Contact,
   Certificate) tanpa mengubah file interaksi manapun.
   ============================================================ */
function dispatchKey(type, code, key, keyCode) {
  const event = new KeyboardEvent(type, {
    code,
    key,
    bubbles: true,
    cancelable: true,
  })
  /* keyCode / which read-only di constructor — definisikan ulang
     untuk jaga-jaga kalau ada konsumer yang pakai keyCode */
  Object.defineProperty(event, 'keyCode', { get: () => keyCode })
  Object.defineProperty(event, 'which', { get: () => keyCode })
  window.dispatchEvent(event)
}

function pressInteractKey() {
  dispatchKey('keydown', 'KeyE', 'e', 69)
}
function releaseInteractKey() {
  dispatchKey('keyup', 'KeyE', 'e', 69)
}

/* ============================================================
   JOYSTICK
   ============================================================ */
function VirtualJoystick({ disabled }) {
  const baseRef = useRef()
  const stickRef = useRef()
  const activeIdRef = useRef(null)

  const resetStick = () => {
    if (stickRef.current) {
      stickRef.current.style.transform = 'translate(-50%, -50%)'
    }
    touchInput.x = 0
    touchInput.z = 0
  }

  const updateFromPointer = (clientX, clientY) => {
    const base = baseRef.current
    if (!base) return

    const rect = base.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2

    let dx = clientX - cx
    let dy = clientY - cy
    const dist = Math.hypot(dx, dy)

    if (dist > MAX_DIST) {
      dx = (dx / dist) * MAX_DIST
      dy = (dy / dist) * MAX_DIST
    }

    if (stickRef.current) {
      stickRef.current.style.transform =
        `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`
    }

    /* Normalisasi ke -1..1. Y di layar ke bawah = +1,
       dan di scene Player, +Z = mundur. Jadi drag ke atas
       (dy negatif) → touchInput.z negatif → maju. Konsisten
       dengan tombol W di keyboard. */
    touchInput.x = dx / MAX_DIST
    touchInput.z = dy / MAX_DIST
  }

  const handleDown = (e) => {
    if (disabled) return
    if (activeIdRef.current !== null) return

    const base = baseRef.current
    if (!base) return

    activeIdRef.current = e.pointerId

    /* Coba setPointerCapture secara aman.
       Jika browser menolak atau throw exception, tetap lanjutkan.
       Pointer capture adalah optimization, bukan requirement untuk joystick bekerja. */
    try {
      base.setPointerCapture(e.pointerId)
    } catch {
      /* setPointerCapture failed, tapi joystick masih bisa bergerak */
    }

    updateFromPointer(e.clientX, e.clientY)
  }

  const handleMove = (e) => {
    if (e.pointerId !== activeIdRef.current) return
    updateFromPointer(e.clientX, e.clientY)
  }

  const handleUp = (e) => {
    if (e.pointerId !== activeIdRef.current) return
    activeIdRef.current = null
    resetStick()
  }

  const handleLostPointerCapture = (e) => {
    /* Jika browser melepas pointer capture secara paksa,
       reset state agar joystick tidak stuck. */
    if (e.pointerId === activeIdRef.current) {
      activeIdRef.current = null
      resetStick()
    }
  }

  useEffect(() => {
    return () => resetStick()
  }, [])

  return (
    <div
      ref={baseRef}
      className="touch-joystick-base"
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={handleUp}
      onPointerCancel={handleUp}
      onLostPointerCapture={handleLostPointerCapture}
    >
      <div ref={stickRef} className="touch-joystick-stick" />
    </div>
  )
}

/* ============================================================
   JUMP BUTTON
   ============================================================ */
function JumpButton({ disabled }) {
  const handleDown = (e) => {
    e.preventDefault()
    if (disabled) return
    touchInput.jump = true
  }
  const handleUp = (e) => {
    e.preventDefault()
    touchInput.jump = false
  }

  return (
    <button
      className="touch-jump-button"
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      onPointerCancel={handleUp}
      onPointerLeave={handleUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      JUMP
    </button>
  )
}

/* ============================================================
   INTERACT BUTTON (memicu KeyE)
   ============================================================ */
function InteractButton({ disabled }) {
  const pressedRef = useRef(false)
  const buttonRef = useRef(null)

  const handleDown = (e) => {
    const tracker = getEGestureTracker()
    tracker.onEDown(e.pointerId)
    
    e.preventDefault()
    if (disabled) return
    if (pressedRef.current) return
    pressedRef.current = true

    /* Capture pointer so pointerup events stay on this button
       even if the modal renders over it. This prevents accidental
       clicks on underlying UI elements (e.g., project cards). */
    const button = buttonRef.current
    if (button) {
      try {
        button.setPointerCapture(e.pointerId)
      } catch (err) {
        /* setPointerCapture may fail on some browsers/devices.
           E button still works without capture, just less safe. */
      }
    }

    pressInteractKey()
  }

  const handleUp = (e) => {
    const tracker = getEGestureTracker()
    tracker.onEUp()
    
    e.preventDefault()
    if (!pressedRef.current) return

    /* Release pointer capture safely. */
    const button = buttonRef.current
    if (button) {
      try {
        button.releasePointerCapture(e.pointerId)
      } catch (err) {
        /* Release may fail, but doesn't break functionality. */
      }
    }

    pressedRef.current = false
    releaseInteractKey()
  }

  const handleLostPointerCapture = (e) => {
    /* If browser releases pointer capture unexpectedly,
       clean up state so KeyE doesn't remain stuck. */
    if (pressedRef.current) {
      pressedRef.current = false
      releaseInteractKey()
    }
  }

  /* Kalau `disabled` berubah jadi true saat tombol masih
     ditekan (misalnya modal terbuka di tengah tap), lepas
     key supaya tidak "nyangkut" true. */
  useEffect(() => {
    if (disabled && pressedRef.current) {
      pressedRef.current = false
      releaseInteractKey()
    }
  }, [disabled])

  return (
    <button
      ref={buttonRef}
      className="touch-interact-button"
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      onPointerCancel={handleUp}
      onPointerLeave={handleUp}
      onLostPointerCapture={handleLostPointerCapture}
      onContextMenu={(e) => e.preventDefault()}
    >
      E
    </button>
  )
}

/* ============================================================
   MAIN
   ============================================================ */
export default function TouchControls({ disabled = false }) {
  if (!isTouchDevice()) return null

  return (
    <div className="touch-controls" aria-hidden="true">
      <VirtualJoystick disabled={disabled} />
      <InteractButton disabled={disabled} />
      <JumpButton disabled={disabled} />
    </div>
  )
}
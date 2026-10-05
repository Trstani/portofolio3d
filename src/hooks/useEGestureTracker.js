import { useRef, useCallback } from 'react'

// Global state to track E button gestures across component boundaries
let eGestureState = {
  gestureActive: false,
  suppressUntil: 0,
}

// SUPPRESS_WINDOW_MS starts AFTER E pointerup completes
// This ensures all tap-to-click synthesis happens within the suppression window
const SUPPRESS_WINDOW_MS = 350 // Increased from 200ms to safely catch tap-to-click synthesis

export function useEGestureTracker() {
  const trackerRef = useRef(eGestureState)

  const onEDown = useCallback((pointerId) => {
    trackerRef.current.gestureActive = true
  }, [])

  const onEUp = useCallback(() => {
    // Mark gesture as complete and start click-suppression window
    trackerRef.current.gestureActive = false
    trackerRef.current.suppressUntil = performance.now() + SUPPRESS_WINDOW_MS
  }, [])

  const shouldSuppressClick = useCallback(() => {
    const now = performance.now()
    if (now > eGestureState.suppressUntil) {
      // Suppression window has expired
      return false
    }
    return true
  }, [])

  return { onEDown, onEUp, shouldSuppressClick }
}

export function getEGestureState() {
  return {
    gestureActive: eGestureState.gestureActive,
    suppressUntil: eGestureState.suppressUntil,
  }
}

export function getEGestureTracker() {
  return {
    gestureActive: eGestureState.gestureActive,
    suppressUntil: eGestureState.suppressUntil,
    onEDown: (pointerId) => {
      const ts = performance.now().toFixed(2)
      eGestureState.gestureActive = true
      console.log(`[${ts}] GESTURE_TRACKER.onEDown`, {
        pointerId,
        gestureActive: eGestureState.gestureActive,
      })
    },
    onEUp: () => {
      const ts = performance.now().toFixed(2)
      eGestureState.gestureActive = false
      eGestureState.suppressUntil = performance.now() + SUPPRESS_WINDOW_MS
      console.log(`[${ts}] GESTURE_TRACKER.onEUp`, {
        suppressUntil: eGestureState.suppressUntil.toFixed(2),
        suppressWindowMs: SUPPRESS_WINDOW_MS,
        expiresAt: (eGestureState.suppressUntil - performance.now()).toFixed(2),
      })
    },
    shouldSuppressClick: () => {
      const now = performance.now()
      const shouldSuppress = now <= eGestureState.suppressUntil
      const ts = now.toFixed(2)
      if (shouldSuppress) {
        console.log(`[${ts}] shouldSuppressClick TRUE`, {
          now: ts,
          suppressUntil: eGestureState.suppressUntil.toFixed(2),
          timeRemaining: (eGestureState.suppressUntil - now).toFixed(2),
        })
      }
      return shouldSuppress
    },
  }
}

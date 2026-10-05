/* ============================================================
   SHARED TOUCH INPUT STATE
   ------------------------------------------------------------
   Module-level mutable object. Ditulis oleh TouchControls.jsx
   (overlay DOM di luar Canvas), dibaca oleh Player.jsx (di
   dalam Canvas). Tidak memicu re-render React.
   ============================================================ */

export const touchInput = {
  x: 0,
  z: 0,
  jump: false,
}

export function isTouchDevice() {
  if (typeof window === 'undefined') return false
  return (
    'ontouchstart' in window ||
    (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
    window.matchMedia('(pointer: coarse)').matches
  )
}
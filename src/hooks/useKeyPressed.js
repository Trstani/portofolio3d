import { useSyncExternalStore } from 'react'
import { subscribeKeys, isKeyDown } from './keyboardStore'

/* ============================================================
   useKeyPressed('KeyE')
   ------------------------------------------------------------
   Return boolean. Komponen hanya re-render ketika status
   key yang di-subscribe berubah — bukan setiap ada key lain
   yang ditekan.
   ============================================================ */
export function useKeyPressed(code) {
  return useSyncExternalStore(
    subscribeKeys,
    () => isKeyDown(code),
    () => false
  )
}
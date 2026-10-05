/* ============================================================
   KEYBOARD STORE
   ------------------------------------------------------------
   Module-level singleton. Tidak ada React state. Listener
   window dipasang sekali saat modul ini di-import.

   - Player membaca via isKeyDown() — zero re-render.
   - Interaksi subscribe via useKeyPressed() — re-render hanya
     saat key yang di-subscribe berubah.
   ============================================================ */

const keyState = {}

const listeners = new Set()

function notify() {
  for (const fn of listeners) fn()
}

/* Reset semua key saat window blur — mencegah tombol
   "nyangkut" true ketika user alt-tab saat menahan tombol. */
function clearAllKeys() {
  let changed = false
  for (const k in keyState) {
    if (keyState[k]) {
      keyState[k] = false
      changed = true
    }
  }
  if (changed) notify()
}

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (!keyState[e.code]) {
      keyState[e.code] = true
      notify()
    }
  })

  window.addEventListener('keyup', (e) => {
    if (keyState[e.code]) {
      keyState[e.code] = false
      notify()
    }
  })

  window.addEventListener('blur', clearAllKeys)
}

/* Subscribe ke semua perubahan key. Dipakai useSyncExternalStore. */
export function subscribeKeys(callback) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

/* Baca status key langsung, tanpa subscribe. Aman dipanggil
   kapan saja, termasuk di dalam useFrame / useBeforePhysicsStep. */
export function isKeyDown(code) {
  return !!keyState[code]
}
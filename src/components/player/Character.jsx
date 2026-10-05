import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

/* ============================================================
   PALETTE — navy / white / blue, clean & premium
   ============================================================ */
const C = {
  skin: '#e7b189',
  skinShade: '#d39a70',

  hair: '#151d2f',
  hairLight: '#13325a',

  hoodie: '#1e3a8a',
  hoodieDark: '#172554',
  hoodieLight: '#2b4bb5',

  accent: '#3b82f6',
  accentSoft: '#60a5fa',

  pants: '#1b2a4e',
  pantsDark: '#152238',

  shoe: '#f1f5f9',
  shoeSole: '#cbd5e1',

  dark: '#0f172a',
  navyDeep: '#0b1428',

  eyeWhite: '#f8fafc',
  iris: '#2f6fed',
  mouth: '#8a3b3b',
}

/* ============================================================
   IDLE EXPRESSION TIMELINE
   ============================================================ */
const IDLE_TIMELINE = [
  { name: 'normal', duration: 3.0 },
  { name: 'blink', duration: 0.16 },
  { name: 'normal', duration: 2.4 },
  { name: 'smile', duration: 2.2 },
  { name: 'normal', duration: 3.0 },
  { name: 'curious', duration: 2.6 },
  { name: 'normal', duration: 2.0 },
  { name: 'blink', duration: 0.16 },
  { name: 'normal', duration: 3.4 },
]

/* ============================================================
   MOUTH SCALE CONSTANTS
   ------------------------------------------------------------
   Base disc: radius 0.08 → diameter 0.16
     - Normal : 0.9 x 0.2   → 0.144 w × 0.032 h  (thin line)
     - Smile  : 1.1 x 0.35  → 0.176 w × 0.056 h  (subtle arc)
     - Fall O : 0.80 x 0.80 → 0.128 w × 0.128 h  (small O)
   ============================================================ */
const MOUTH_NORMAL_X = 0.9
const MOUTH_NORMAL_Y = 0.2

const MOUTH_SMILE_X_MAX = 1.1
const MOUTH_SMILE_Y_MAX = 0.35

const MOUTH_O_X = 0.80
const MOUTH_O_Y = 0.80

/* ============================================================
   UTIL — frame-rate independent exponential damp
   ============================================================ */
function damp(current, target, speed, delta) {
  const k = 1 - Math.exp(-speed * delta)
  return current + (target - current) * k
}

/* Smoothstep 0..1 (clamped) */
function smoothstep(x) {
  const c = Math.max(0, Math.min(x, 1))
  return c * c * (3 - 2 * c)
}

function Character({
  characterRef,
  isMovingRef,
  walkTimeRef,
  isJumpingRef,
  isFallingRef,
}) {
  /* ------------------------------------------------------------
     REF ANIMASI WALK (dipertahankan persis)
     ------------------------------------------------------------ */
  const leftArmRef = useRef()
  const rightArmRef = useRef()

  const leftLegRef = useRef()
  const rightLegRef = useRef()

  /* ------------------------------------------------------------
     REF ANIMASI IDLE
     ------------------------------------------------------------ */
  const headRef = useRef()
  const torsoRef = useRef()

  const leftEyeRef = useRef()
  const rightEyeRef = useRef()
  const leftBrowRef = useRef()
  const rightBrowRef = useRef()
  const mouthRef = useRef()

  /* ------------------------------------------------------------
     STATE
     ------------------------------------------------------------ */
  const idleStateRef = useRef({
    phaseIndex: 0,
    phaseTime: 0,
  })

  const fallTimeRef = useRef(0)

  useFrame((state, delta) => {
    if (!leftArmRef.current) return
    if (!rightArmRef.current) return
    if (!leftLegRef.current) return
    if (!rightLegRef.current) return

    const isMoving = !!(isMovingRef && isMovingRef.current)
    const isJumping = !!(isJumpingRef && isJumpingRef.current)
    const isFalling = !!(isFallingRef && isFallingRef.current)

    const walkTime = walkTimeRef.current
    const t = state.clock.elapsedTime

    /* =========================
       FALL TIMER
       ========================= */
    if (isFalling) {
      fallTimeRef.current += delta
    } else {
      fallTimeRef.current = 0
    }
    const fallTime = fallTimeRef.current

    /* =========================
       COMPUTE TARGETS
       ========================= */

    let tLeftArmX = 0
    let tRightArmX = 0
    let tLeftArmZ = 0
    let tRightArmZ = 0

    let tLeftLegX = 0
    let tRightLegX = 0

    let tTorsoY = 0
    let tTorsoRotX = 0

    let tHeadRotX = 0
    let tHeadRotY = 0
    let tHeadRotZ = 0

    let tEyeScaleY = 1

    /* Mouth targets start from NORMAL (thin line) */
    let tMouthScaleX = MOUTH_NORMAL_X
    let tMouthScaleY = MOUTH_NORMAL_Y

    let tLeftBrowY = 0.25
    let tRightBrowY = 0.25

    let bodySpeed = 18

    /* ============================================================
       PRIORITY 1 — FALLING
       ============================================================ */
    if (isFalling) {
      /* Intensitas jatuh: smoothstep 0..1 pada 0..0.75s */
      const k = smoothstep(fallTime / 0.75)

      /* ARMS — raised high and outward, slight forward, asymmetric */
      tLeftArmX = -0.22 * k
      tLeftArmZ = -2.20 * k

      tRightArmX = -0.32 * k
      tRightArmZ = 2.40 * k

      /* LEGS — knees lifted forward (asymmetric dangle) */
      tLeftLegX = 0.35 * k
      tRightLegX = 0.55 * k

      /* TORSO — lean back */
      tTorsoY = 0
      tTorsoRotX = 0.18 * k

      /* HEAD — tilt up (looking up while falling) */
      tHeadRotX = -0.35 * k
      tHeadRotY = 0
      tHeadRotZ = 0

      /* FACIAL: AAARGH! (interpolasi 0.35s - 0.80s) */
      const fk = smoothstep((fallTime - 0.35) / 0.45)

      /* Eyes wider */
      tEyeScaleY = 1 + 0.40 * fk

      /* Brows raised */
      tLeftBrowY = 0.25 + 0.10 * fk
      tRightBrowY = 0.25 + 0.10 * fk

      /* MOUTH → small round O.
         Mulai dari normal (0.9 x 0.2), menuju (0.8 x 0.8).
         Hasil akhir: ~0.128 × 0.128 → O kecil, jelas, tidak menyentuh hidung. */
      tMouthScaleX = MOUTH_NORMAL_X + (MOUTH_O_X - MOUTH_NORMAL_X) * fk
      tMouthScaleY = MOUTH_NORMAL_Y + (MOUTH_O_Y - MOUTH_NORMAL_Y) * fk

      bodySpeed = 13

      /* Reset idle timeline saat airborne */
      idleStateRef.current.phaseIndex = 0
      idleStateRef.current.phaseTime = 0
    }

    /* ============================================================
       PRIORITY 2 — JUMPING
       ============================================================ */
    else if (isJumping) {
      /* ARMS — raised up & outward, forward, symmetric clean pose */
      tLeftArmX = -0.40
      tLeftArmZ = -1.90

      tRightArmX = -0.40
      tRightArmZ = 1.90

      /* LEGS — slightly bent/lifted forward (asymmetric) */
      tLeftLegX = 0.45
      tRightLegX = 0.25

      /* TORSO — slight forward/upward jump posture */
      tTorsoRotX = -0.08

      /* HEAD — subtle upward tilt */
      tHeadRotX = -0.12

      /* Facial: neutral / energetic (mouth = normal line) */
      tEyeScaleY = 1
      tMouthScaleX = MOUTH_NORMAL_X
      tMouthScaleY = MOUTH_NORMAL_Y
      tLeftBrowY = 0.25
      tRightBrowY = 0.25

      bodySpeed = 15

      idleStateRef.current.phaseIndex = 0
      idleStateRef.current.phaseTime = 0
    }

    /* ============================================================
       PRIORITY 3 — WALKING
       ============================================================ */
    else if (isMoving) {
      /* Logika walk asli dipertahankan */
      const swing = Math.sin(walkTime) * 0.6

      tLeftArmX = -swing
      tRightArmX = swing
      tLeftLegX = swing
      tRightLegX = -swing

      /* Netral untuk sisa channel */
      tLeftArmZ = 0
      tRightArmZ = 0
      tTorsoY = 0
      tTorsoRotX = 0
      tHeadRotX = 0
      tHeadRotY = 0
      tHeadRotZ = 0
      tEyeScaleY = 1
      tMouthScaleX = MOUTH_NORMAL_X
      tMouthScaleY = MOUTH_NORMAL_Y
      tLeftBrowY = 0.25
      tRightBrowY = 0.25

      bodySpeed = 30

      idleStateRef.current.phaseIndex = 0
      idleStateRef.current.phaseTime = 0
    }

    /* ============================================================
       PRIORITY 4 — IDLE
       ============================================================ */
    else {
      /* ---------- 1. BREATHING ---------- */
      const breath = Math.sin(t * 1.35)
      const breathOffset = breath * 0.030

      tTorsoY = breathOffset

      /* ---------- 3. ARM MOVEMENT ---------- */
      tLeftArmX = breathOffset * 1.8
      tRightArmX = breathOffset * 1.8
      tLeftArmZ = Math.sin(t * 0.85) * 0.015
      tRightArmZ = -Math.sin(t * 0.85) * 0.015

      /* ---------- 2. HEAD MOVEMENT ---------- */
      tHeadRotX = Math.sin(t * 0.72) * 0.022
      tHeadRotY = Math.sin(t * 0.53) * 0.05
      tHeadRotZ = Math.sin(t * 0.61) * 0.012

      /* ---------- 4. FACIAL TIMELINE ---------- */
      const idle = idleStateRef.current
      idle.phaseTime += delta

      let current = IDLE_TIMELINE[idle.phaseIndex]
      if (idle.phaseTime >= current.duration) {
        idle.phaseTime -= current.duration
        idle.phaseIndex = (idle.phaseIndex + 1) % IDLE_TIMELINE.length
        current = IDLE_TIMELINE[idle.phaseIndex]
      }

      const progress = Math.min(idle.phaseTime / current.duration, 1)
      const phase = current.name

      switch (phase) {
        /* ---------- 5. BLINK ---------- */
        case 'blink': {
          const k = Math.sin(progress * Math.PI)
          tEyeScaleY = 1 - k * 0.92
          break
        }

        /* ---------- 6. SMALL SMILE ----------
           Mulut menjadi sedikit lebih lebar & sedikit lebih terbuka,
           tapi tetap jelas horizontal (bukan O). */
        case 'smile': {
          const k = Math.sin(progress * Math.PI)
          tMouthScaleX =
            MOUTH_NORMAL_X + (MOUTH_SMILE_X_MAX - MOUTH_NORMAL_X) * k
          tMouthScaleY =
            MOUTH_NORMAL_Y + (MOUTH_SMILE_Y_MAX - MOUTH_NORMAL_Y) * k
          break
        }

        /* ---------- 7. CURIOUS ---------- */
        case 'curious': {
          const k = Math.sin(progress * Math.PI)
          tRightBrowY = 0.25 + k * 0.06
          tHeadRotZ += k * 0.09
          break
        }

        default:
          break
      }

      bodySpeed = 18
    }

    /* =========================
       APPLY (damped — smooth transitions)
       ========================= */
    const faceSpeed = 22

    leftArmRef.current.rotation.x = damp(
      leftArmRef.current.rotation.x, tLeftArmX, bodySpeed, delta
    )
    rightArmRef.current.rotation.x = damp(
      rightArmRef.current.rotation.x, tRightArmX, bodySpeed, delta
    )
    leftArmRef.current.rotation.z = damp(
      leftArmRef.current.rotation.z, tLeftArmZ, bodySpeed, delta
    )
    rightArmRef.current.rotation.z = damp(
      rightArmRef.current.rotation.z, tRightArmZ, bodySpeed, delta
    )

    leftLegRef.current.rotation.x = damp(
      leftLegRef.current.rotation.x, tLeftLegX, bodySpeed, delta
    )
    rightLegRef.current.rotation.x = damp(
      rightLegRef.current.rotation.x, tRightLegX, bodySpeed, delta
    )

    if (torsoRef.current) {
      torsoRef.current.position.y = damp(
        torsoRef.current.position.y, tTorsoY, bodySpeed, delta
      )
      torsoRef.current.rotation.x = damp(
        torsoRef.current.rotation.x, tTorsoRotX, bodySpeed, delta
      )
    }

    if (headRef.current) {
      headRef.current.rotation.x = damp(
        headRef.current.rotation.x, tHeadRotX, bodySpeed, delta
      )
      headRef.current.rotation.y = damp(
        headRef.current.rotation.y, tHeadRotY, bodySpeed, delta
      )
      headRef.current.rotation.z = damp(
        headRef.current.rotation.z, tHeadRotZ, bodySpeed, delta
      )
    }

    if (leftEyeRef.current) {
      leftEyeRef.current.scale.y = damp(
        leftEyeRef.current.scale.y, tEyeScaleY, faceSpeed, delta
      )
    }
    if (rightEyeRef.current) {
      rightEyeRef.current.scale.y = damp(
        rightEyeRef.current.scale.y, tEyeScaleY, faceSpeed, delta
      )
    }

    if (mouthRef.current) {
      mouthRef.current.scale.x = damp(
        mouthRef.current.scale.x, tMouthScaleX, faceSpeed, delta
      )
      mouthRef.current.scale.y = damp(
        mouthRef.current.scale.y, tMouthScaleY, faceSpeed, delta
      )
    }

    if (leftBrowRef.current) {
      leftBrowRef.current.position.y = damp(
        leftBrowRef.current.position.y, tLeftBrowY, faceSpeed, delta
      )
    }
    if (rightBrowRef.current) {
      rightBrowRef.current.position.y = damp(
        rightBrowRef.current.position.y, tRightBrowY, faceSpeed, delta
      )
    }
  })

  return (
    <group ref={characterRef}>

      {/* ============================================================
          HEAD
          Pivot di leher (y = 2.62)
          FRONT = -Z
          ============================================================ */}
      <group ref={headRef} position={[0, 2.62, 0]}>

        {/* NECK */}
        <mesh position={[0, -0.72, 0]}>
          <boxGeometry args={[0.4, 0.34, 0.4]} />
          <meshStandardMaterial color={C.skinShade} roughness={0.85} />
        </mesh>

        {/* SKULL */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.1, 1.15, 1.05]} />
          <meshStandardMaterial color={C.skin} roughness={0.85} />
        </mesh>

        {/* EARS */}
        <mesh position={[-0.565, -0.02, 0.03]}>
          <boxGeometry args={[0.1, 0.24, 0.18]} />
          <meshStandardMaterial color={C.skin} roughness={0.85} />
        </mesh>
        <mesh position={[0.565, -0.02, 0.03]}>
          <boxGeometry args={[0.1, 0.24, 0.18]} />
          <meshStandardMaterial color={C.skin} roughness={0.85} />
        </mesh>

        {/* EYE GROUP (LEFT) */}
        <group ref={leftEyeRef} position={[-0.23, 0.1, 0]}>
          <mesh position={[0, 0, -0.53]}>
            <boxGeometry args={[0.2, 0.15, 0.04]} />
            <meshStandardMaterial color={C.eyeWhite} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, -0.548]}>
            <boxGeometry args={[0.1, 0.13, 0.03]} />
            <meshStandardMaterial color={C.iris} roughness={0.35} />
          </mesh>
        </group>

        {/* EYE GROUP (RIGHT) */}
        <group ref={rightEyeRef} position={[0.23, 0.1, 0]}>
          <mesh position={[0, 0, -0.53]}>
            <boxGeometry args={[0.2, 0.15, 0.04]} />
            <meshStandardMaterial color={C.eyeWhite} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, -0.548]}>
            <boxGeometry args={[0.1, 0.13, 0.03]} />
            <meshStandardMaterial color={C.iris} roughness={0.35} />
          </mesh>
        </group>

        {/* EYEBROWS */}
        <mesh ref={leftBrowRef} position={[-0.23, 0.25, -0.53]}>
          <boxGeometry args={[0.22, 0.055, 0.04]} />
          <meshStandardMaterial color={C.hair} roughness={0.9} />
        </mesh>
        <mesh ref={rightBrowRef} position={[0.23, 0.25, -0.53]}>
          <boxGeometry args={[0.22, 0.055, 0.04]} />
          <meshStandardMaterial color={C.hair} roughness={0.9} />
        </mesh>

        {/* NOSE */}
        <mesh position={[0, 0.0, -0.56]}>
          <boxGeometry args={[0.13, 0.15, 0.1]} />
          <meshStandardMaterial color={C.skinShade} roughness={0.85} />
        </mesh>

        {/* MOUTH — disc kecil
            Base: radius 0.08 → diameter 0.16
            Default scale (0.9, 0.2) = garis horizontal tipis.
            Scale diatur lewat ref, bukan lewat re-render. */}
        <group
          ref={mouthRef}
          position={[0, -0.2, -0.53]}
          scale={[MOUTH_NORMAL_X, MOUTH_NORMAL_Y, 1]}
        >
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
            <meshStandardMaterial color={C.mouth} roughness={0.7} />
          </mesh>
        </group>

        {/* HAIR BASE / CROWN */}
        <mesh position={[0, 0.56, 0.02]}>
          <boxGeometry args={[1.16, 0.18, 1.08]} />
          <meshStandardMaterial color={C.hair} roughness={0.85} />
        </mesh>

        {/* BACK HAIR */}
        <mesh position={[0, 0.30, 0.51]}>
          <boxGeometry args={[1.02, 0.42, 0.12]} />
          <meshStandardMaterial color={C.hair} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.08, 0.51]}>
          <boxGeometry args={[0.92, 0.28, 0.10]} />
          <meshStandardMaterial color={C.hair} roughness={0.88} />
        </mesh>

        {/* SIDE HAIR */}
        <mesh position={[-0.54, 0.27, 0.03]} rotation={[0, 0, -0.08]}>
          <boxGeometry args={[0.10, 0.46, 0.78]} />
          <meshStandardMaterial color={C.hair} roughness={0.88} />
        </mesh>
        <mesh position={[0.54, 0.27, 0.03]} rotation={[0, 0, 0.08]}>
          <boxGeometry args={[0.10, 0.46, 0.78]} />
          <meshStandardMaterial color={C.hair} roughness={0.88} />
        </mesh>

        {/* MAIN TOP VOLUME */}
        <mesh position={[-0.20, 0.68, -0.02]} rotation={[0, 0, -0.12]}>
          <boxGeometry args={[0.72, 0.24, 0.86]} />
          <meshStandardMaterial color={C.hairLight} roughness={0.82} />
        </mesh>
        <mesh position={[0.22, 0.70, 0.02]} rotation={[0, 0, 0.10]}>
          <boxGeometry args={[0.72, 0.22, 0.82]} />
          <meshStandardMaterial color={C.hair} roughness={0.82} />
        </mesh>

        {/* TEXTURED HAIR TUFTS */}
        <mesh position={[-0.34, 0.78, -0.28]} rotation={[0.08, 0, -0.28]}>
          <boxGeometry args={[0.42, 0.18, 0.48]} />
          <meshStandardMaterial color={C.hairLight} roughness={0.78} />
        </mesh>
        <mesh position={[-0.12, 0.86, -0.34]} rotation={[0.04, 0, -0.16]}>
          <boxGeometry args={[0.48, 0.18, 0.44]} />
          <meshStandardMaterial color={C.hair} roughness={0.78} />
        </mesh>
        <mesh position={[0.10, 0.88, -0.30]} rotation={[0.03, 0, 0.08]}>
          <boxGeometry args={[0.52, 0.20, 0.42]} />
          <meshStandardMaterial color={C.hairLight} roughness={0.78} />
        </mesh>
        <mesh position={[0.30, 0.82, -0.24]} rotation={[0.06, 0, 0.22]}>
          <boxGeometry args={[0.44, 0.18, 0.38]} />
          <meshStandardMaterial color={C.hair} roughness={0.78} />
        </mesh>

        {/* FRONT FRINGE */}
        <mesh position={[-0.30, 0.55, -0.53]} rotation={[0.08, 0, -0.20]}>
          <boxGeometry args={[0.38, 0.18, 0.12]} />
          <meshStandardMaterial color={C.hair} roughness={0.82} />
        </mesh>
        <mesh position={[-0.02, 0.62, -0.54]} rotation={[0.05, 0, -0.08]}>
          <boxGeometry args={[0.46, 0.18, 0.12]} />
          <meshStandardMaterial color={C.hairLight} roughness={0.80} />
        </mesh>
        <mesh position={[0.25, 0.67, -0.51]} rotation={[0.02, 0, 0.14]}>
          <boxGeometry args={[0.42, 0.16, 0.12]} />
          <meshStandardMaterial color={C.hair} roughness={0.80} />
        </mesh>

        {/* HAIR HIGHLIGHT / TEXTURE */}
        <mesh position={[-0.18, 0.77, -0.40]} rotation={[0.02, 0, -0.18]}>
          <boxGeometry args={[0.24, 0.06, 0.30]} />
          <meshStandardMaterial color={C.hairLight} roughness={0.70} />
        </mesh>
        <mesh position={[0.16, 0.82, -0.38]} rotation={[0.02, 0, 0.16]}>
          <boxGeometry args={[0.24, 0.06, 0.28]} />
          <meshStandardMaterial color={C.hairLight} roughness={0.70} />
        </mesh>

        {/* HEADPHONE — BAND TOP */}
        <mesh position={[0, 0.74, 0.02]}>
          <boxGeometry args={[1.3, 0.1, 0.18]} />
          <meshStandardMaterial color={C.dark} roughness={0.5} metalness={0.25} />
        </mesh>

        {/* BAND ARMS */}
        <mesh position={[-0.62, 0.42, 0.02]}>
          <boxGeometry args={[0.1, 0.62, 0.16]} />
          <meshStandardMaterial color={C.dark} roughness={0.5} metalness={0.25} />
        </mesh>
        <mesh position={[0.62, 0.42, 0.02]}>
          <boxGeometry args={[0.1, 0.62, 0.16]} />
          <meshStandardMaterial color={C.dark} roughness={0.5} metalness={0.25} />
        </mesh>

        {/* EAR CUPS */}
        <mesh position={[-0.64, -0.02, 0.02]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.21, 0.21, 0.16, 12]} />
          <meshStandardMaterial color={C.dark} roughness={0.45} metalness={0.3} flatShading />
        </mesh>
        <mesh position={[0.64, -0.02, 0.02]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.21, 0.21, 0.16, 12]} />
          <meshStandardMaterial color={C.dark} roughness={0.45} metalness={0.3} flatShading />
        </mesh>

        {/* EAR CUP ACCENT RING */}
        <mesh position={[-0.645, -0.02, 0.02]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.18, 12]} />
          <meshStandardMaterial color={C.accent} roughness={0.35} metalness={0.2} flatShading />
        </mesh>
        <mesh position={[0.645, -0.02, 0.02]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.18, 12]} />
          <meshStandardMaterial color={C.accent} roughness={0.35} metalness={0.2} flatShading />
        </mesh>
      </group>

      {/* ============================================================
          PELVIS
          ============================================================ */}
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[1.28, 0.52, 0.72]} />
        <meshStandardMaterial color={C.pants} roughness={0.8} />
      </mesh>

      {/* ============================================================
          TORSO GROUP — ref untuk breathing / jump / fall
          ============================================================ */}
      <group ref={torsoRef}>

        {/* TORSO / HOODIE */}
        <mesh position={[0, 1.47, 0]}>
          <boxGeometry args={[1.42, 1.06, 0.78]} />
          <meshStandardMaterial color={C.hoodie} roughness={0.75} />
        </mesh>

        {/* SHOULDER SLAB */}
        <mesh position={[0, 1.9, 0]}>
          <boxGeometry args={[1.62, 0.24, 0.84]} />
          <meshStandardMaterial color={C.hoodie} roughness={0.75} />
        </mesh>

        {/* HOODIE HEM */}
        <mesh position={[0, 1.0, 0]}>
          <boxGeometry args={[1.52, 0.16, 0.86]} />
          <meshStandardMaterial color={C.hoodieDark} roughness={0.8} />
        </mesh>

        {/* COLLAR */}
        <mesh position={[0, 2.0, 0.04]}>
          <boxGeometry args={[0.72, 0.22, 0.68]} />
          <meshStandardMaterial color={C.hoodieDark} roughness={0.8} />
        </mesh>

        {/* HOOD (belakang) */}
        <mesh position={[0, 1.98, 0.36]}>
          <boxGeometry args={[0.92, 0.52, 0.34]} />
          <meshStandardMaterial color={C.hoodieDark} roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.98, 0.3]}>
          <boxGeometry args={[0.72, 0.36, 0.2]} />
          <meshStandardMaterial color={C.navyDeep} roughness={0.85} />
        </mesh>

        {/* KANGAROO POCKET */}
        <mesh position={[0, 1.14, -0.41]}>
          <boxGeometry args={[0.88, 0.38, 0.09]} />
          <meshStandardMaterial color={C.hoodieDark} roughness={0.8} />
        </mesh>

        {/* POCKET TRIM */}
        <mesh position={[0, 1.31, -0.42]}>
          <boxGeometry args={[0.88, 0.05, 0.08]} />
          <meshStandardMaterial color={C.hoodieLight} roughness={0.7} />
        </mesh>

        {/* DRAWSTRINGS */}
        <mesh position={[-0.15, 1.72, -0.4]}>
          <boxGeometry args={[0.05, 0.34, 0.05]} />
          <meshStandardMaterial color={C.accentSoft} roughness={0.6} />
        </mesh>
        <mesh position={[0.15, 1.72, -0.4]}>
          <boxGeometry args={[0.05, 0.34, 0.05]} />
          <meshStandardMaterial color={C.accentSoft} roughness={0.6} />
        </mesh>

        {/* CHEST BADGE */}
        <mesh position={[-0.45, 1.7, -0.4]}>
          <boxGeometry args={[0.3, 0.22, 0.06]} />
          <meshStandardMaterial color={C.accent} roughness={0.4} metalness={0.15} />
        </mesh>
        <mesh position={[-0.45, 1.7, -0.435]}>
          <boxGeometry args={[0.16, 0.1, 0.04]} />
          <meshStandardMaterial color={C.shoe} roughness={0.4} />
        </mesh>

        {/* SIDE SEAM DETAIL */}
        <mesh position={[-0.72, 1.5, 0]}>
          <boxGeometry args={[0.04, 0.7, 0.5]} />
          <meshStandardMaterial color={C.hoodieLight} roughness={0.7} />
        </mesh>
        <mesh position={[0.72, 1.5, 0]}>
          <boxGeometry args={[0.04, 0.7, 0.5]} />
          <meshStandardMaterial color={C.hoodieLight} roughness={0.7} />
        </mesh>
      </group>

      {/* ============================================================
          LEFT ARM
          Pivot di SHOULDER
          ============================================================ */}
      <group ref={leftArmRef} position={[-0.98, 1.95, 0]}>

        <mesh position={[0, -0.14, 0]}>
          <boxGeometry args={[0.44, 0.44, 0.54]} />
          <meshStandardMaterial color={C.hoodie} roughness={0.75} />
        </mesh>

        <mesh position={[0, -0.48, 0]}>
          <boxGeometry args={[0.36, 0.54, 0.42]} />
          <meshStandardMaterial color={C.hoodie} roughness={0.75} />
        </mesh>

        <group position={[0, -0.78, 0]} rotation={[0.2, 0, 0]}>

          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[0.33, 0.12, 0.4]} />
            <meshStandardMaterial color={C.hoodieDark} roughness={0.8} />
          </mesh>

          <mesh position={[0, -0.24, 0]}>
            <boxGeometry args={[0.32, 0.46, 0.38]} />
            <meshStandardMaterial color={C.hoodie} roughness={0.75} />
          </mesh>

          <mesh position={[0, -0.34, 0]}>
            <boxGeometry args={[0.36, 0.16, 0.42]} />
            <meshStandardMaterial color={C.dark} roughness={0.5} metalness={0.25} />
          </mesh>

          <mesh position={[-0.19, -0.34, 0]}>
            <boxGeometry args={[0.04, 0.11, 0.17]} />
            <meshStandardMaterial color={C.accentSoft} roughness={0.3} metalness={0.3} />
          </mesh>

          <mesh position={[0, -0.48, 0]}>
            <boxGeometry args={[0.34, 0.12, 0.4]} />
            <meshStandardMaterial color={C.hoodieDark} roughness={0.8} />
          </mesh>

          <mesh position={[0, -0.62, 0]}>
            <boxGeometry args={[0.3, 0.26, 0.34]} />
            <meshStandardMaterial color={C.skin} roughness={0.85} />
          </mesh>
        </group>
      </group>

      {/* ============================================================
          RIGHT ARM
          Pivot di SHOULDER
          ============================================================ */}
      <group ref={rightArmRef} position={[0.98, 1.95, 0]}>

        <mesh position={[0, -0.14, 0]}>
          <boxGeometry args={[0.44, 0.44, 0.54]} />
          <meshStandardMaterial color={C.hoodie} roughness={0.75} />
        </mesh>

        <mesh position={[0, -0.48, 0]}>
          <boxGeometry args={[0.36, 0.54, 0.42]} />
          <meshStandardMaterial color={C.hoodie} roughness={0.75} />
        </mesh>

        <group position={[0, -0.78, 0]} rotation={[0.2, 0, 0]}>

          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[0.33, 0.12, 0.4]} />
            <meshStandardMaterial color={C.hoodieDark} roughness={0.8} />
          </mesh>

          <mesh position={[0, -0.24, 0]}>
            <boxGeometry args={[0.32, 0.46, 0.38]} />
            <meshStandardMaterial color={C.hoodie} roughness={0.75} />
          </mesh>

          <mesh position={[0, -0.48, 0]}>
            <boxGeometry args={[0.34, 0.12, 0.4]} />
            <meshStandardMaterial color={C.hoodieDark} roughness={0.8} />
          </mesh>

          <mesh position={[0, -0.62, 0]}>
            <boxGeometry args={[0.3, 0.26, 0.34]} />
            <meshStandardMaterial color={C.skin} roughness={0.85} />
          </mesh>
        </group>
      </group>

      {/* ============================================================
          LEFT LEG
          Pivot di HIP
          ============================================================ */}
      <group ref={leftLegRef} position={[-0.42, 0.9, 0]}>

        <mesh position={[0, -0.36, 0]}>
          <boxGeometry args={[0.46, 0.72, 0.54]} />
          <meshStandardMaterial color={C.pants} roughness={0.8} />
        </mesh>

        <mesh position={[0, -0.73, 0]}>
          <boxGeometry args={[0.43, 0.12, 0.5]} />
          <meshStandardMaterial color={C.pantsDark} roughness={0.8} />
        </mesh>

        <mesh position={[0, -0.97, 0]}>
          <boxGeometry args={[0.4, 0.5, 0.46]} />
          <meshStandardMaterial color={C.pants} roughness={0.8} />
        </mesh>

        <mesh position={[0, -1.27, -0.06]}>
          <boxGeometry args={[0.42, 0.14, 0.6]} />
          <meshStandardMaterial color={C.shoe} roughness={0.6} />
        </mesh>

        <mesh position={[0, -1.3, -0.06]}>
          <boxGeometry args={[0.44, 0.05, 0.6]} />
          <meshStandardMaterial color={C.accent} roughness={0.45} />
        </mesh>

        <mesh position={[0, -1.28, -0.34]}>
          <boxGeometry args={[0.4, 0.1, 0.14]} />
          <meshStandardMaterial color={C.shoe} roughness={0.6} />
        </mesh>

        <mesh position={[0, -1.37, -0.07]}>
          <boxGeometry args={[0.46, 0.07, 0.64]} />
          <meshStandardMaterial color={C.shoeSole} roughness={0.7} />
        </mesh>
      </group>

      {/* ============================================================
          RIGHT LEG
          Pivot di HIP
          ============================================================ */}
      <group ref={rightLegRef} position={[0.42, 0.9, 0]}>

        <mesh position={[0, -0.36, 0]}>
          <boxGeometry args={[0.46, 0.72, 0.54]} />
          <meshStandardMaterial color={C.pants} roughness={0.8} />
        </mesh>

        <mesh position={[0, -0.73, 0]}>
          <boxGeometry args={[0.43, 0.12, 0.5]} />
          <meshStandardMaterial color={C.pantsDark} roughness={0.8} />
        </mesh>

        <mesh position={[0, -0.97, 0]}>
          <boxGeometry args={[0.4, 0.5, 0.46]} />
          <meshStandardMaterial color={C.pants} roughness={0.8} />
        </mesh>

        <mesh position={[0, -1.27, -0.06]}>
          <boxGeometry args={[0.42, 0.14, 0.6]} />
          <meshStandardMaterial color={C.shoe} roughness={0.6} />
        </mesh>

        <mesh position={[0, -1.3, -0.06]}>
          <boxGeometry args={[0.44, 0.05, 0.6]} />
          <meshStandardMaterial color={C.accent} roughness={0.45} />
        </mesh>

        <mesh position={[0, -1.28, -0.34]}>
          <boxGeometry args={[0.4, 0.1, 0.14]} />
          <meshStandardMaterial color={C.shoe} roughness={0.6} />
        </mesh>

        <mesh position={[0, -1.37, -0.07]}>
          <boxGeometry args={[0.46, 0.07, 0.64]} />
          <meshStandardMaterial color={C.shoeSole} roughness={0.7} />
        </mesh>
      </group>

    </group>
  )
}

export default Character
import { useEffect, useRef, useState } from 'react'
import NPCMovement from './NPCMovement'

const MAX_NPCS = 6

/* Posisi spawn tersebar agar NPC tidak tumpang tindih saat muncul.
   Minimal 6 posisi (satu per NPC), jarak antar posisi > 2 unit. */
const SPAWN_POSITIONS = [
  [-6.0, 0, 86],
  [-3.6, 0, 88],
  [-1.2, 0, 90],
  [ 1.2, 0, 90],
  [ 3.6, 0, 88],
  [ 6.0, 0, 86],
]

/* Jeda antar spawn (2–3 detik) */
const SPAWN_DELAY_MIN = 2000
const SPAWN_DELAY_MAX = 3000

const SKIN_TONES = [
  'light',
  'fair',
  'medium',
  'tan',
  'dark',
]

const HAIRS = [
  'short',
  'swept',
  'bob',
  'long',
  'ponytail',
]

const HAIR_COLORS = [
  'black',
  'darkBrown',
  'brown',
  'blueBlack',
  'blonde',
]

const OUTFITS = [
  'hoodie',
  'jacket',
  'sweater',
  'tshirt',
]

const PANTS = [
  'navy',
  'black',
  'blue',
  'gray',
]

const SHOES = [
  'white',
  'black',
  'blue',
]

const GENDERS = [
  'male',
  'female',
]

const EARLY_CHECKPOINTS = [
  'about',
]

const PROJECT_CHECKPOINTS = [
  'project1',
  'project2',
]

const CERTIFICATE_CHECKPOINTS = [
  'certificate1',
  'certificate2',
]

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function randomCharacter() {
  return {
    gender: randomItem(GENDERS),
    skinTone: randomItem(SKIN_TONES),
    hair: randomItem(HAIRS),
    hairColor: randomItem(HAIR_COLORS),
    outfit: randomItem(OUTFITS),
    pants: randomItem(PANTS),
    shoes: randomItem(SHOES),
  }
}

function randomTouristRoute() {
  const route = []

  if (Math.random() < 0.5) {
    route.push(randomItem(EARLY_CHECKPOINTS))
  }

  if (Math.random() < 0.7) {
    route.push(randomItem(PROJECT_CHECKPOINTS))
  }

  if (Math.random() < 0.65) {
    route.push(randomItem(CERTIFICATE_CHECKPOINTS))
  }

  if (Math.random() < 0.4) {
    route.push('contact')
  }

  if (route.length === 0) {
    route.push(
      randomItem([
        'about',
        'project1',
        'project2',
        'project3',
        'certificate1',
        'certificate2',
        'contact',
      ])
    )
  }

  return route
}

function createNPC(spawnIndex) {
  const isTourist = Math.random() < 0.65

  return {
    id: `${Date.now()}-${Math.random()}`,
    spawnIndex,                                       // track posisi yang dipakai
    position: SPAWN_POSITIONS[spawnIndex],
    behavior: isTourist ? 'tourist' : 'traveler',
    checkpoints: isTourist ? randomTouristRoute() : [],
    ...randomCharacter(),
  }
}

/* Pilih spawnIndex yang belum terpakai oleh NPC yang sedang ada.
   Kalau semua terpakai (harusnya tidak terjadi karena
   MAX_NPCS === SPAWN_POSITIONS.length), fallback ke modulo. */
function pickFreeSpawnIndex(currentNPCs) {
  const used = new Set(currentNPCs.map((n) => n.spawnIndex))
  for (let i = 0; i < SPAWN_POSITIONS.length; i++) {
    if (!used.has(i)) return i
  }
  return currentNPCs.length % SPAWN_POSITIONS.length
}

function randomDelay(min, max) {
  return Math.random() * (max - min) + min
}

function NPCManager() {
  const [npcs, setNpcs] = useState([])

  /* ============================================================
     SPAWN LOOP
     - Spawn pertama instan (delay 0).
     - Spawn berikutnya: 2–3 detik setelah spawn sebelumnya.
     - Setiap spawn memakai spawnIndex unik → tidak overlap.
     - Ketika NPC finish (removed), useEffect akan re-run
       karena npcs.length berubah, dan spawn pengganti
       dijadwalkan otomatis.
     ============================================================ */
  useEffect(() => {
    if (npcs.length >= MAX_NPCS) return

    const delay = npcs.length === 0
      ? 0
      : randomDelay(SPAWN_DELAY_MIN, SPAWN_DELAY_MAX)

    const timer = setTimeout(() => {
      setNpcs((current) => {
        if (current.length >= MAX_NPCS) return current

        const spawnIndex = pickFreeSpawnIndex(current)
        return [...current, createNPC(spawnIndex)]
      })
    }, delay)

    return () => clearTimeout(timer)
  }, [npcs.length])

  /* NPC selesai → cukup remove dari list.
     Spawn pengganti dijadwalkan otomatis oleh useEffect di atas. */
  function handleNPCFinish(npcId) {
    setNpcs((current) => current.filter((npc) => npc.id !== npcId))
  }

  return (
    <>
      {npcs.map((npc) => (
        <NPCMovement
          key={npc.id}
          position={npc.position}
          behavior={npc.behavior}
          checkpoints={npc.checkpoints}
          gender={npc.gender}
          skinTone={npc.skinTone}
          hair={npc.hair}
          hairColor={npc.hairColor}
          outfit={npc.outfit}
          pants={npc.pants}
          shoes={npc.shoes}
          speed={3.5}
          rotationSpeed={8}
          walkCycleSpeed={8}
          waitTime={6}
          onFinish={() => handleNPCFinish(npc.id)}
        />
      ))}
    </>
  )
}

export default NPCManager
import { useCallback, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'

import Environment from './components/world/Environment'
import Player from './components/player/Player'
import FollowCamera from './components/camera/FollowCamera'
import CameraOcclusion from './components/camera/CameraOcculsion'
import TouchControls from './components/ui/TouchControls'
import DebugOverlay from './components/ui/DebugOverlay'

import AboutInteraction from './components/ui/AboutInteraction'
import CertificateInteraction from './components/ui/CertificateInteraction'
import CertificateRailUI from './components/ui/CertificateRailUi'
import ProjectInteraction from './components/ui/ProjectInteraction'
import ProjectBoardUI from './components/ui/ProjectBoardUI'
import AboutModal from './components/ui/AboutModal'
import ContactInteraction from './components/ui/ContactInteraction'
import ContactModal from './components/ui/ContactModal'

import FinishInteraction from './components/ui/FinishInteraction'
import FinishModal from './components/ui/FinishModal'

import {
  projectBoards,
} from './components/world/projectBoards'

import {
  certificateRails,
} from './components/world/certificateRail'

import './App.css'

function App() {
  const playerRef = useRef()
  const playerVisualRef = useRef()

  const [aboutOpen, setAboutOpen] =
    useState(false)

  const [contactOpen, setContactOpen] =
    useState(false)

  const [activeProjectBoard, setActiveProjectBoard] =
    useState(null)

  const [projectBoardOpen, setProjectBoardOpen] =
    useState(false)

  const [activeCertificateRail, setActiveCertificateRail] =
    useState(null)

  const [certificateRailOpen, setCertificateRailOpen] =
    useState(false)

  const [finishOpen, setFinishOpen] =
    useState(false)

  /* ============================================================
     MEMOIZED CALLBACKS
     Stabilized callback references to prevent unnecessary useEffect
     runs in interaction components when App re-renders.
     ============================================================ */

  const handleAboutOpen = useCallback(() => {
    setAboutOpen(true)
  }, [])

  const handleAboutClose = useCallback(() => {
    setAboutOpen(false)
  }, [])

  const handleContactOpen = useCallback(() => {
    setContactOpen(true)
  }, [])

  const handleContactClose = useCallback(() => {
    setContactOpen(false)
  }, [])

  const handleProjectOpen = useCallback((selectedBoard) => {
    setActiveProjectBoard(selectedBoard)
    setProjectBoardOpen(true)
  }, [])

  const handleProjectClose = useCallback(() => {
    setProjectBoardOpen(false)
  }, [])

  const handleCertificateOpen = useCallback((selectedRail) => {
    setActiveCertificateRail(selectedRail)
    setCertificateRailOpen(true)
  }, [])

  const handleCertificateClose = useCallback(() => {
    setCertificateRailOpen(false)
    setActiveCertificateRail(null)
  }, [])

  const handleFinishOpen = useCallback(() => {
    setFinishOpen(true)
  }, [])

  const handleFinishClose = useCallback(() => {
    setFinishOpen(false)
  }, [])

  /* True kalau salah satu modal sedang terbuka.
     Dipakai untuk mematikan TouchControls agar player tidak
     bergerak-gerak saat user membaca modal. */
  const anyModalOpen =
    aboutOpen ||
    contactOpen ||
    projectBoardOpen ||
    certificateRailOpen ||
    finishOpen

  return (
    <div className="app">

      <Canvas
        camera={{
          position: [6, 5, 6],
          fov: 50,
        }}
      >

        <color
          attach="background"
          args={['#0b1830']}
        />

        <fog
          attach="fog"
          args={[
            '#0b1830',
            45,
            150,
          ]}
        />

        <ambientLight
          intensity={0.35}
        />

        <directionalLight
          position={[35, 70, 20]}
          intensity={2.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={1}
          shadow-camera-far={200}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
        />

        <Physics timeStep="vary">

          <Environment
            playerVisualRef={playerVisualRef}
            playerRef={playerRef}
          />

          <Player
            playerRef={playerRef}
            playerVisualRef={playerVisualRef}
          />

          <FinishInteraction
            playerRef={playerRef}
            onOpen={handleFinishOpen}
          />

          {!finishOpen && (
            <>
              <AboutInteraction
                playerRef={playerRef}
                onOpen={handleAboutOpen}
              />

              <ContactInteraction
                playerRef={playerRef}
                onOpen={handleContactOpen}
              />

              {!projectBoardOpen &&
                projectBoards.map((board) => (
                  <ProjectInteraction
                    key={board.id}
                    playerRef={playerRef}
                    board={board}
                    onOpen={handleProjectOpen}
                  />
                ))
              }

              {!certificateRailOpen &&
                certificateRails.map((rail) => (
                  <CertificateInteraction
                    key={rail.id}
                    playerRef={playerRef}
                    rail={rail}
                    onOpen={handleCertificateOpen}
                  />
                ))
              }
            </>
          )}

        </Physics>

        <FollowCamera
          target={playerVisualRef}
        />

        <CameraOcclusion
          target={playerVisualRef}
        />

      </Canvas>

      {/* TOUCH CONTROLS — hanya render di device sentuh.
          Disabled saat modal terbuka. */}
      <TouchControls disabled={anyModalOpen} />

      {/* ABOUT MODAL */}
      <AboutModal
        open={aboutOpen}
        onClose={handleAboutClose}
      />

      <ContactModal
        open={contactOpen}
        onClose={handleContactClose}
      />

      {/* PROJECT BOARD UI */}
      {projectBoardOpen && activeProjectBoard && (
        <ProjectBoardUI
          board={activeProjectBoard}
          onClose={handleProjectClose}
        />
      )}

      {certificateRailOpen && activeCertificateRail && (
        <CertificateRailUI
          rail={activeCertificateRail}
          onClose={handleCertificateClose}
        />
      )}

      <FinishModal
        open={finishOpen}
        onClose={handleFinishClose}
      />

      <DebugOverlay />

    </div>
  )
}

export default App
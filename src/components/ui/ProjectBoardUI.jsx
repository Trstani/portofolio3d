import { useState, useEffect } from 'react'
import { portfolio } from '../../data/portofolio'
import { addGlobalLog } from '../../hooks/useDebugLogger'
import { getEGestureTracker } from '../../hooks/useEGestureTracker'
import ProjectDetailUI from './ProjectDetailUI'

function ProjectBoardUI({
  board,
  onClose,
}) {
  const [selectedProject, setSelectedProject] =
    useState(null)

  useEffect(() => {
    const timestamp = performance.now()
    const ts = timestamp.toFixed(2)
    console.log(`[${ts}] ProjectBoardUI MOUNT`, {
      selectedProject: selectedProject,
      boardTitle: board?.title,
    })
    addGlobalLog(timestamp, 'ProjectBoard MOUNT', {
      selectedProject: selectedProject?.id || 'null',
    })
    return () => {
      const unmountTime = performance.now()
      const unmountTs = unmountTime.toFixed(2)
      console.log(`[${unmountTs}] ProjectBoardUI UNMOUNT`, {
        selectedProject: selectedProject?.id || 'null',
      })
      addGlobalLog(unmountTime, 'ProjectBoard UNMOUNT', {
        selectedProject: selectedProject?.id || 'null',
      })
    }
  }, [])

  // Log every selectedProject change
  useEffect(() => {
    const timestamp = performance.now()
    const ts = timestamp.toFixed(2)
    console.log(`[${ts}] selectedProject CHANGED`, {
      newValue: selectedProject?.id || 'null',
      newTitle: selectedProject?.title || 'none',
      stackTrace: new Error().stack.split('\n').slice(0, 5).join('\n'),
    })
    addGlobalLog(timestamp, 'selectedProject CHANGED', {
      newValue: selectedProject?.id || 'null',
    })
  }, [selectedProject])

  if (!board) return null

  const projects =
    board.projectIds
      .map((id) =>
        portfolio.projects.find(
          (project) =>
            project.id === id
        )
      )
      .filter(Boolean)

  /*
   * =========================
   * PROJECT DETAIL
   * =========================
   */

  if (selectedProject) {
    return (
      <ProjectDetailUI
        project={selectedProject}
        onBack={() =>
          setSelectedProject(null)
        }
      />
    )
  }

  return (
    <div className="project-board-overlay">
      <div className="project-board-window">

        {/* =========================
            HEADER
        ========================= */}

        <div className="project-board-header">

          <div>
            <span className="project-board-kicker">
              PROJECT ARCHIVE
            </span>

            <h1>
              {board.title}
            </h1>

            <p>
              Explore the projects behind
              the work.
            </p>
          </div>

          <button
            type="button"
            className="project-board-close"
            onClick={onClose}
          >
            ESC
          </button>

        </div>

        {/* =========================
            PROJECTS
        ========================= */}

        <div className="project-board-content">

          {projects.map((project) => (
            <button
              type="button"
              key={project.id}
              className="project-card"
              onClick={() =>{
                const timestamp = performance.now()
                const ts = timestamp.toFixed(2)
                
                // Get gesture tracker state for detailed logging
                const tracker = getEGestureTracker()
                const trackerState = {
                  activePointerId: tracker.activePointerId,
                  suppress: tracker.suppress,
                  suppressUntil: tracker.suppressUntil,
                  shouldSuppress: tracker.shouldSuppressClick(),
                  now: timestamp,
                  timeUntilExpiry: Math.max(0, tracker.suppressUntil - timestamp),
                }
                
                // Check if this click should be suppressed due to E gesture
                const shouldSuppress = tracker.shouldSuppressClick()
                
                if (shouldSuppress) {
                  console.log(`[${ts}] PROJECT CARD CLICK SUPPRESSED`, {
                    projectId: project.id,
                    projectTitle: project.title,
                    reason: 'E gesture active',
                    gestureState: trackerState,
                  })
                  addGlobalLog(timestamp, 'CARD CLICK SUPPRESSED', {
                    projectId: project.id,
                    gestureState: trackerState,
                  })
                  return
                }
                
                console.log(`[${ts}] PROJECT CARD CLICK`, {
                  projectId: project.id,
                  projectName: project.title,
                  eventType: 'click',
                  gestureState: trackerState,
                  timestamp: ts,
                })
                addGlobalLog(timestamp, 'CARD CLICK', {
                  projectId: project.id,
                  gestureState: trackerState,
                })
                
                // Log the setSelectedProject call
                console.log(`[${ts}] CALLING setSelectedProject`, {
                  projectId: project.id,
                  projectTitle: project.title,
                })
                setSelectedProject(project)}
              }
              onPointerDown={(e) => {
                const timestamp = performance.now()
                const ts = timestamp.toFixed(2)
                console.log(`[${ts}] PROJECT CARD POINTERDOWN`, {
                  projectId: project.id,
                  pointerId: e.pointerId,
                  clientX: e.clientX,
                  clientY: e.clientY,
                  target: e.target?.className,
                  currentTarget: e.currentTarget?.className,
                })
                addGlobalLog(timestamp, 'CARD POINTERDOWN', {
                  projectId: project.id,
                  pointerId: e.pointerId,
                })
              }}
              onPointerUp={(e) => {
                const timestamp = performance.now()
                const ts = timestamp.toFixed(2)
                console.log(`[${ts}] PROJECT CARD POINTERUP`, {
                  projectId: project.id,
                  pointerId: e.pointerId,
                  clientX: e.clientX,
                  clientY: e.clientY,
                  target: e.target?.className,
                  currentTarget: e.currentTarget?.className,
                })
                addGlobalLog(timestamp, 'CARD POINTERUP', {
                  projectId: project.id,
                  pointerId: e.pointerId,
                })
              }}
            >

              <div className="project-card-image">
                <img
                  src={project.image}
                  alt={project.title}
                />
              </div>

              <div className="project-card-info">

                <span>
                  {project.category}
                </span>

                <h2>
                  {project.title}
                </h2>

                <small>
                  {project.year}
                </small>

              </div>

            </button>
          ))}

        </div>

        {/* =========================
            FOOTER
        ========================= */}

        <div className="project-board-footer">

          <span>
            {projects.length} PROJECTS
          </span>

          <span>
            SELECT A PROJECT TO EXPLORE
          </span>

        </div>

      </div>
    </div>
  )
}

export default ProjectBoardUI
import { useState } from 'react'
import { portfolio } from '../../data/portofolio'
import ProjectDetailUI from './ProjectDetailUI'

function ProjectBoardUI({
  board,
  onClose,
}) {
  const [selectedProject, setSelectedProject] =
    useState(null)

  if (!board) return null

  console.log(
  'SELECTED PROJECT:',
  selectedProject
)

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
                console.log('PROJECT CLICKED:', project)
                    setSelectedProject(project)}
              }
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
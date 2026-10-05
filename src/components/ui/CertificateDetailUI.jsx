import { useState } from 'react'
import { portfolio } from '../../data/portofolio'
import ProjectDetailUI from './ProjectDetailUI'

function CertificateDetailUI({
  certificate,
  onBack,
}) {
  const [selectedProject, setSelectedProject] =
    useState(null)

  if (!certificate) return null

  const relatedProjects =
    certificate.relatedProjects
      ?.map((id) =>
        portfolio.projects.find(
          (project) =>
            project.id === id
        )
      )
      .filter(Boolean) || []

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

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 700

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        padding: isMobile ? '12px' : '40px',
        boxSizing: 'border-box',

        background:
          'rgba(5, 10, 20, 0.82)',

        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter:
          'blur(10px)',

        fontFamily: 'Josefin Sans, sans-serif',
      }}
    >

      {/* WINDOW */}

      <div
        style={{
          width: isMobile ? 'calc(100% - 0px)' : 'min(1000px, 100%)',
          maxHeight: isMobile ? 'calc(100dvh - 24px)' : 'calc(100vh - 80px)',

          overflowY: 'auto',

          boxSizing: 'border-box',

          padding: isMobile ? '28px' : '42px',

          borderRadius: isMobile ? '16px' : '24px',

          background:
            'linear-gradient(145deg, #101f3d, #081329)',

          border:
            '1px solid rgba(96, 165, 250, 0.4)',

          boxShadow:
            '0 35px 100px rgba(0, 0, 0, 0.7)',

          color: '#e5edf9',
        }}
      >

        {/* =========================
            HEADER
        ========================= */}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',

            gap: isMobile ? '16px' : '30px',

            marginBottom: isMobile ? '20px' : '30px',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
          }}
        >

          <div style={{ flex: 1, minWidth: 0 }}>

            <div
              style={{
                marginBottom: isMobile ? '8px' : '10px',

                color: '#60a5fa',

                fontSize: isMobile ? '11px' : '13px',
                fontWeight: 800,

                letterSpacing: '0.16em',

                textTransform:
                  'uppercase',
              }}
            >
              CERTIFICATE DETAIL
            </div>

            <h1
              style={{
                margin: 0,

                color: '#ffffff',

                fontSize: isMobile
                  ? 'clamp(24px, 5.5vw, 38px)'
                  : 'clamp(38px, 5vw, 60px)',

                lineHeight: 1.05,

                fontWeight: 800,
              }}
            >
              {certificate.title}
            </h1>

            <p
              style={{
                margin: isMobile ? '8px 0 0' : '12px 0 0',

                color: '#93c5fd',

                fontSize: '17px',
                fontWeight: 600,
              }}
            >
              {certificate.issuer}
              {' · '}
              {certificate.year}
            </p>

          </div>

          <button
            type="button"
            onClick={onBack}
            style={{
              flexShrink: 0,

              padding: isMobile ? '8px 12px' : '11px 18px',

              border:
                '1px solid rgba(96, 165, 250, 0.35)',

              borderRadius: isMobile ? '8px' : '10px',

              background:
                'rgba(37, 99, 235, 0.12)',

              color: '#bfdbfe',

              fontSize: isMobile ? '10px' : '12px',
              fontWeight: 800,

              letterSpacing: '0.1em',

              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            BACK
          </button>

        </div>

        {/* =========================
            CERTIFICATE IMAGE
        ========================= */}

        <div
          style={{
            width: '100%',

            maxHeight: isMobile ? '40vh' : '55vh',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            overflow: 'hidden',

            marginBottom: isMobile ? '20px' : '32px',

            padding: isMobile ? '12px' : '18px',

            boxSizing: 'border-box',

            borderRadius: isMobile ? '12px' : '18px',

            background:
              'rgba(15, 23, 42, 0.75)',

            border:
              '1px solid rgba(96, 165, 250, 0.18)',
          }}
        >
          <img
            src={certificate.image}
            alt={certificate.title}
            style={{
              display: 'block',

              width: '100%',
              maxHeight: isMobile ? '38vh' : '50vh',

              objectFit: 'contain',

              borderRadius: isMobile ? '8px' : '10px',
            }}
          />
        </div>

        {/* =========================
            ABOUT
        ========================= */}

        <div
          style={{
            marginBottom: '34px',
          }}
        >

          <div
            style={{
              marginBottom: '12px',

              color: '#60a5fa',

              fontSize: '13px',
              fontWeight: 800,

              letterSpacing: '0.1em',

              textTransform:
                'uppercase',
            }}
          >
            About The Certificate
          </div>

          <p
            style={{
              margin: 0,

              color: '#cbd5e1',

              fontSize: '17px',

              lineHeight: 1.8,
            }}
          >
            {certificate.description}
          </p>

        </div>

        {/* =========================
            RELATED PROJECTS
        ========================= */}

        <div
          style={{
            marginBottom: '30px',
          }}
        >

          <div
            style={{
              marginBottom: '14px',

              color: '#60a5fa',

              fontSize: '13px',
              fontWeight: 800,

              letterSpacing: '0.1em',

              textTransform:
                'uppercase',
            }}
          >
            Related Projects
          </div>

          {relatedProjects.length === 0 ? (

            <div
              style={{
                padding: '20px',

                borderRadius: '14px',

                background:
                  'rgba(30, 41, 59, 0.55)',

                color: '#94a3b8',

                fontSize: '14px',
              }}
            >
              No related projects.
            </div>

          ) : (

            <div
              style={{
                display: 'grid',

                gridTemplateColumns:
                  'repeat(auto-fit, minmax(220px, 1fr))',

                gap: '16px',
              }}
            >

              {relatedProjects.map(
                (project) => (

                  <button
                    type="button"
                    key={project.id}
                    onClick={() =>
                      setSelectedProject(
                        project
                      )
                    }
                    style={{
                      padding: 0,

                      overflow: 'hidden',

                      border:
                        '1px solid rgba(96, 165, 250, 0.2)',

                      borderRadius: '14px',

                      background:
                        'rgba(15, 23, 42, 0.75)',

                      textAlign: 'left',

                      cursor: 'pointer',

                      color: '#ffffff',
                    }}
                  >

                    <div
                      style={{
                        width: '100%',

                        aspectRatio:
                          '16 / 9',

                        overflow: 'hidden',

                        background:
                          '#0f172a',
                      }}
                    >

                      <img
                        src={project.image}
                        alt={project.title}
                        style={{
                          width: '100%',
                          height: '100%',

                          display: 'block',

                          objectFit: 'cover',
                        }}
                      />

                    </div>

                    <div
                      style={{
                        padding: '16px',
                      }}
                    >

                      <div
                        style={{
                          marginBottom:
                            '6px',

                          color:
                            '#60a5fa',

                          fontSize: '11px',
                          fontWeight: 800,

                          letterSpacing:
                            '0.08em',

                          textTransform:
                            'uppercase',
                        }}
                      >
                        {project.category}
                      </div>

                      <h2
                        style={{
                          margin: 0,

                          color: '#ffffff',

                          fontSize: '22px',
                          fontWeight: 700,
                        }}
                      >
                        {project.title}
                      </h2>

                      <div
                        style={{
                          marginTop:
                            '6px',

                          color:
                            '#94a3b8',

                          fontSize: '13px',
                        }}
                      >
                        {project.year}
                      </div>

                    </div>

                  </button>

                )
              )}

            </div>

          )}

        </div>

        {/* =========================
            FOOTER
        ========================= */}

        <div
          style={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems: 'center',

            gap: '20px',

            paddingTop: '20px',

            borderTop:
              '1px solid rgba(148, 163, 184, 0.12)',
          }}
        >

          <span
            style={{
              color: '#64748b',

              fontSize: '12px',
            }}
          >
            {certificate.title}
          </span>

          <button
            type="button"
            onClick={onBack}
            style={{
              border: 'none',

              background:
                'transparent',

              color: '#93c5fd',

              fontSize: '12px',

              fontWeight: 700,

              cursor: 'pointer',
            }}
          >
            BACK TO CERTIFICATES
          </button>

        </div>

      </div>

    </div>
  )
}

export default CertificateDetailUI
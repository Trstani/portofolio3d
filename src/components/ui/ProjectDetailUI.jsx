function ProjectDetailUI({
  project,
  onBack,
}) {
  if (!project) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        padding: '40px',
        boxSizing: 'border-box',

        background: 'rgba(2, 8, 23, 0.82)',

        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',

        fontFamily: 'Josefin Sans, sans-serif',
      }}
    >

      {/* WINDOW */}

      <div
        style={{
          width: 'min(1000px, 100%)',
          maxHeight: 'calc(100vh - 80px)',

          overflowY: 'auto',

          boxSizing: 'border-box',

          padding: '42px',

          borderRadius: '24px',

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

            gap: '30px',

            marginBottom: '30px',
          }}
        >

          <div>

            <div
              style={{
                marginBottom: '10px',

                color: '#60a5fa',

                fontSize: '13px',
                fontWeight: 800,

                letterSpacing: '0.16em',

                textTransform: 'uppercase',
              }}
            >
              PROJECT DETAIL
            </div>

            <h1
              style={{
                margin: 0,

                color: '#ffffff',

                fontSize:
                  'clamp(40px, 6vw, 64px)',

                lineHeight: 1,

                fontWeight: 800,
              }}
            >
              {project.title}
            </h1>

            <p
              style={{
                margin: '12px 0 0',

                color: '#93c5fd',

                fontSize: '17px',
                fontWeight: 600,
              }}
            >
              {project.category} · {project.year}
            </p>

          </div>

          <button
            type="button"
            onClick={onBack}
            style={{
              flexShrink: 0,

              padding: '11px 18px',

              border:
                '1px solid rgba(96, 165, 250, 0.35)',

              borderRadius: '10px',

              background:
                'rgba(37, 99, 235, 0.12)',

              color: '#bfdbfe',

              fontSize: '12px',
              fontWeight: 800,

              letterSpacing: '0.1em',

              cursor: 'pointer',
            }}
          >
            BACK
          </button>

        </div>

        {/* =========================
            IMAGE
        ========================= */}

        <div
          style={{
            width: '100%',

            aspectRatio: '16 / 8',

            overflow: 'hidden',

            marginBottom: '32px',

            borderRadius: '18px',

            background: '#0f172a',

            border:
              '1px solid rgba(96, 165, 250, 0.18)',
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

        {/* =========================
            DESCRIPTION
        ========================= */}

        <div
          style={{
            marginBottom: '32px',
          }}
        >

          <div
            style={{
              marginBottom: '12px',

              color: '#60a5fa',

              fontSize: '13px',
              fontWeight: 800,

              letterSpacing: '0.1em',

              textTransform: 'uppercase',
            }}
          >
            About The Project
          </div>

          <p
            style={{
              margin: 0,

              color: '#cbd5e1',

              fontSize: '17px',

              lineHeight: 1.8,
            }}
          >
            {project.description}
          </p>

        </div>

        {/* =========================
            TECHNOLOGIES
        ========================= */}

        <div
          style={{
            marginBottom: '34px',
          }}
        >

          <div
            style={{
              marginBottom: '13px',

              color: '#60a5fa',

              fontSize: '13px',
              fontWeight: 800,

              letterSpacing: '0.1em',

              textTransform: 'uppercase',
            }}
          >
            Technologies
          </div>

          <div
            style={{
              display: 'flex',

              flexWrap: 'wrap',

              gap: '10px',
            }}
          >

            {project.tech?.map((tech) => (
              <span
                key={tech}
                style={{
                  padding: '9px 14px',

                  borderRadius: '999px',

                  background:
                    'rgba(37, 99, 235, 0.15)',

                  border:
                    '1px solid rgba(59, 130, 246, 0.4)',

                  color: '#bfdbfe',

                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                {tech}
              </span>
            ))}

          </div>

        </div>

        {/* =========================
            ACTIONS
        ========================= */}

        <div
          style={{
            display: 'flex',

            flexWrap: 'wrap',

            gap: '12px',
          }}
        >

          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              style={{
                flex: 1,

                minWidth: '220px',

                minHeight: '58px',

                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',

                boxSizing: 'border-box',

                borderRadius: '12px',

                background: '#2563eb',

                color: '#ffffff',

                textDecoration: 'none',

                fontSize: '15px',
                fontWeight: 800,

                boxShadow:
                  '0 10px 28px rgba(37, 99, 235, 0.3)',
              }}
            >
              VIEW LIVE PROJECT
            </a>
          )}

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              style={{
                flex: 1,

                minWidth: '220px',

                minHeight: '58px',

                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',

                boxSizing: 'border-box',

                borderRadius: '12px',

                background:
                  'rgba(30, 41, 59, 0.8)',

                border:
                  '1px solid rgba(148, 163, 184, 0.25)',

                color: '#e2e8f0',

                textDecoration: 'none',

                fontSize: '15px',
                fontWeight: 800,
              }}
            >
              VIEW GITHUB
            </a>
          )}

        </div>

        {/* =========================
            FOOTER
        ========================= */}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',

            gap: '20px',

            marginTop: '28px',
            paddingTop: '18px',

            borderTop:
              '1px solid rgba(148, 163, 184, 0.12)',

            color: '#64748b',

            fontSize: '12px',
          }}
        >

          <span>
            {project.title}
          </span>

          <button
            type="button"
            onClick={onBack}
            style={{
              border: 'none',

              background: 'transparent',

              color: '#93c5fd',

              fontSize: '12px',
              fontWeight: 700,

              cursor: 'pointer',
            }}
          >
            BACK TO PROJECTS
          </button>

        </div>

      </div>
    </div>
  )
}

export default ProjectDetailUI
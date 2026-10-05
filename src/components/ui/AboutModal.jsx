import { portfolio } from '../../data/portofolio'

function AboutModal({ open, onClose }) {
  if (!open) return null

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 700

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        padding: isMobile ? '12px' : '40px',
        boxSizing: 'border-box',

        background: 'rgba(2, 8, 23, 0.78)',

        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',

        fontFamily: 'Josefin Sans, sans-serif',
      }}
    >
      <div
        style={{
          width: isMobile ? 'calc(100% - 0px)' : 'min(850px, 100%)',
          maxHeight: isMobile ? 'calc(100dvh - 24px)' : 'calc(100vh - 80px)',
          overflowY: 'auto',

          boxSizing: 'border-box',

          padding: isMobile ? '28px' : '44px',

          borderRadius: isMobile ? '16px' : '24px',

          background:
            'linear-gradient(145deg, #101f3d, #081329)',

          border:
            '1px solid rgba(96, 165, 250, 0.4)',

          boxShadow:
            '0 35px 100px rgba(0, 0, 0, 0.65)',

          color: '#e5edf9',
        }}
      >
        {/* HEADER */}

        <div
          style={{
            marginBottom: isMobile ? '20px' : '32px',
          }}
        >
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
            About Me
          </div>

          <h1
            style={{
              margin: 0,
              color: '#ffffff',
              fontSize: 'clamp(42px, 6vw, 62px)',
              lineHeight: 1,
              fontWeight: 800,
            }}
          >
            {portfolio.about.name}
          </h1>

          <p
            style={{
              margin: '12px 0 0',
              color: '#93c5fd',
              fontSize: '19px',
              fontWeight: 600,
            }}
          >
            {portfolio.about.role}
          </p>
        </div>

        {/* INTRODUCTION */}

        <p
          style={{
            margin: '0 0 30px',
            color: '#cbd5e1',
            fontSize: '17px',
            lineHeight: 1.8,
          }}
        >
          {portfolio.about.introduction}
        </p>

        {/* EDUCATION */}

        <div
          style={{
            padding: '22px 24px',
            marginBottom: '30px',
            borderRadius: '16px',
            background: 'rgba(30, 58, 138, 0.22)',
            border:
              '1px solid rgba(96, 165, 250, 0.16)',
          }}
        >
          <div
            style={{
              marginBottom: '9px',
              color: '#60a5fa',
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Education
          </div>

          <div
            style={{
              color: '#f8fafc',
              fontSize: '17px',
              fontWeight: 500,
            }}
          >
            {portfolio.about.education}
          </div>
        </div>

        {/* EXPERIENCE */}

        <div
          style={{
            marginBottom: '30px',
          }}
        >
          <div
            style={{
              marginBottom: '9px',
              color: '#60a5fa',
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Experience
          </div>

          <p
            style={{
              margin: 0,
              color: '#cbd5e1',
              fontSize: '17px',
              lineHeight: 1.8,
            }}
          >
            {portfolio.about.experience}
          </p>
        </div>

        {/* SKILLS */}

        <div
          style={{
            marginBottom: '36px',
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
            Skills
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            {portfolio.about.skills.map((skill) => (
              <span
                key={skill}
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
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* CLOSE */}

        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            minHeight: isMobile ? '44px' : '62px',

            border: 'none',
            borderRadius: isMobile ? '10px' : '14px',

            background: '#2563eb',

            color: '#ffffff',

            fontSize: isMobile ? '14px' : '18px',
            fontWeight: 800,

            cursor: 'pointer',

            boxShadow:
              '0 10px 28px rgba(37, 99, 235, 0.35)',
          }}
        >
          Close
        </button>

        <div
          style={{
            marginTop: '14px',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '13px',
          }}
        >
          Press E near the monument to open About
        </div>
      </div>
    </div>
  )
}

export default AboutModal
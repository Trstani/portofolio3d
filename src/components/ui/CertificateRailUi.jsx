import { useState } from 'react'
import { portfolio } from '../../data/portofolio'
import { getEGestureTracker } from '../../hooks/useEGestureTracker'
import CertificateDetailUI from './CertificateDetailUI'

function CertificateRailUI({
  rail,
  onClose,
}) {
  const [selectedCertificate, setSelectedCertificate] =
    useState(null)

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 700

  if (!rail) return null

  const certificates =
    rail.certificateIds
      .map((id) =>
        portfolio.certificates.find(
          (certificate) =>
            certificate.id === id
        )
      )
      .filter(Boolean)

  if (selectedCertificate) {
    return (
      <CertificateDetailUI
        certificate={selectedCertificate}
        onBack={() =>
          setSelectedCertificate(null)
        }
      />
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        padding: isMobile ? '12px' : '40px',

        background: 'rgba(5, 10, 20, 0.78)',

        backdropFilter: 'blur(8px)',

        fontFamily: 'Josefin Sans, sans-serif',
      }}
    >

      <div
        style={{
          width: isMobile ? 'calc(100% - 0px)' : 'min(1180px, 94vw)',
          maxHeight: isMobile ? 'calc(100dvh - 24px)' : '88vh',

          display: 'flex',
          flexDirection: 'column',

          overflow: 'hidden',

          background: '#eee8dc',

          border:
            '1px solid rgba(70, 65, 57, 0.25)',

          borderRadius: isMobile ? '12px' : '18px',

          boxShadow:
            '0 30px 90px rgba(0,0,0,0.45)',
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

            padding: isMobile ? '20px' : '32px 38px 26px',
            paddingBottom: isMobile ? '16px' : '26px',

            borderBottom:
              '1px solid rgba(70,65,57,0.16)',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            gap: isMobile ? '12px' : '0',
          }}
        >

          <div style={{ flex: 1, minWidth: 0 }}>

            <span
              style={{
                display: 'block',

                marginBottom: isMobile ? '6px' : '8px',

                color: '#777268',

                fontSize: isMobile ? '10px' : '11px',

                fontWeight: 800,

                letterSpacing: '0.18em',
              }}
            >
              CERTIFICATE ARCHIVE
            </span>

            <h1
              style={{
                margin: 0,

                color: '#242622',

                fontFamily: 'Josefin Sans, sans-serif',

                fontSize: isMobile
                  ? 'clamp(24px, 5vw, 36px)'
                  : 'clamp(32px, 4vw, 52px)',

                lineHeight: 1,
              }}
            >
              {rail.title}
            </h1>

            <p
              style={{
                margin: isMobile ? '8px 0 0' : '12px 0 0',

                color: '#706d65',

                fontSize: isMobile ? '12px' : '14px',
              }}
            >
              Explore the certifications behind
              the work.
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              flexShrink: 0,
              
              padding: isMobile ? '8px 12px' : '10px 14px',

              border:
                '1px solid rgba(70,65,57,0.25)',

              borderRadius: isMobile ? '6px' : '8px',

              background: 'transparent',

              color: '#4f514c',

              fontSize: isMobile ? '9px' : '11px',

              fontWeight: 800,

              letterSpacing: '0.1em',

              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            ESC
          </button>

        </div>

        {/* =========================
            CERTIFICATES
        ========================= */}

        <div
          style={{
            flex: 1,

            display: 'grid',

            gridTemplateColumns: isMobile
              ? 'repeat(auto-fit, minmax(150px, 1fr))'
              : 'repeat(auto-fit, minmax(220px, 1fr))',

            gap: isMobile ? '14px' : '22px',

            padding: isMobile ? '18px' : '30px 38px',

            overflowY: 'auto',
          }}
        >

          {certificates.map((certificate) => (

            <button
              type="button"
              key={certificate.id}
              onClick={() => {
                const tracker = getEGestureTracker()
                
                if (tracker.shouldSuppressClick()) {
                  return
                }
                
                setSelectedCertificate(
                  certificate
                )
              }}
              style={{
                padding: 0,

                border: 0,

                background: 'transparent',

                textAlign: 'left',

                cursor: 'pointer',

                color: 'inherit',

                fontFamily: 'Josefin Sans, sans-serif',
              }}
            >

              {/* IMAGE */}

              <div
                style={{
                  position: 'relative',

                  aspectRatio: '16 / 10',

                  overflow: 'hidden',

                  borderRadius: isMobile ? '8px' : '10px',

                  background: '#d4cec1',

                  boxShadow:
                    '0 8px 20px rgba(50,45,38,0.16)',
                }}
              >

                <img
                  src={certificate.image}
                  alt={certificate.title}
                  style={{
                    width: '100%',
                    height: '100%',

                    display: 'block',

                    objectFit: 'cover',
                  }}
                />

              </div>

              {/* INFO */}

              <div
                style={{
                  padding: isMobile
                    ? '10px 2px 2px'
                    : '14px 3px 4px',
                }}
              >

                <span
                  style={{
                    display: 'block',

                    marginBottom: isMobile ? '3px' : '5px',

                    color: '#888278',

                    fontSize: isMobile ? '8px' : '10px',

                    fontWeight: 800,

                    letterSpacing:
                      '0.12em',

                    textTransform:
                      'uppercase',
                  }}
                >
                  {certificate.issuer}
                </span>

                <h2
                  style={{
                    margin: 0,

                    color: '#272925',

                    fontFamily: 'Josefin Sans, sans-serif',

                    fontSize: isMobile ? '16px' : '23px',

                    fontWeight: 600,
                    lineHeight: 1.2,
                  }}
                >
                  {certificate.title}
                </h2>

                <small
                  style={{
                    display: 'block',

                    marginTop: isMobile ? '3px' : '5px',

                    color: '#77746c',

                    fontSize: isMobile ? '10px' : '12px',
                  }}
                >
                  {certificate.year}
                </small>

              </div>

            </button>

          ))}

        </div>

        {/* =========================
            FOOTER
        ========================= */}

        <div
          style={{
            display: 'flex',
            justifyContent:
              'space-between',

            padding: isMobile ? '12px' : '15px 38px',
            paddingLeft: isMobile ? '12px' : '38px',
            paddingRight: isMobile ? '12px' : '38px',

            borderTop:
              '1px solid rgba(70,65,57,0.16)',

            color: '#858078',

            fontSize: isMobile ? '8px' : '10px',

            fontWeight: 800,

            letterSpacing: '0.12em',
            
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            gap: isMobile ? '8px' : '0',
          }}
        >

          <span>
            {certificates.length} CERTIFICATES
          </span>

          <span>
            SELECT A CERTIFICATE TO EXPLORE
          </span>

        </div>

      </div>

    </div>
  )
}

export default CertificateRailUI
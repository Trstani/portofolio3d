function FinishModal({
  open,
  onClose,
}) {
  if (!open) return null

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

        background:
          'rgba(2, 8, 23, 0.86)',

        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',

        fontFamily: 'Josefin Sans, sans-serif',
      }}
    >

      <div
        style={{
          width: 'min(850px, 100%)',

          padding: '64px 50px',

          boxSizing: 'border-box',

          borderRadius: '28px',

          background:
            'linear-gradient(145deg, #101f3d, #081329)',

          border:
            '1px solid rgba(96, 165, 250, 0.4)',

          boxShadow:
            '0 35px 100px rgba(0, 0, 0, 0.7)',

          color: '#e5edf9',

          textAlign: 'center',
        }}
      >

        <div
          style={{
            marginBottom: '14px',

            color: '#60a5fa',

            fontSize: '13px',

            fontWeight: 800,

            letterSpacing: '0.18em',
          }}
        >
          JOURNEY COMPLETE
        </div>

        <h1
          style={{
            margin: 0,

            color: '#ffffff',

            fontSize:
              'clamp(42px, 7vw, 68px)',

            lineHeight: 1.05,

            fontWeight: 800,
          }}
        >
          Thank You
          <br />
          for Visiting.
        </h1>

        <p
          style={{
            maxWidth: '620px',

            margin:
              '26px auto 0',

            color: '#cbd5e1',

            fontSize: '17px',

            lineHeight: 1.8,
          }}
        >
          You've reached the end of my portfolio.
          I hope you enjoyed the journey and got
          a glimpse of what I create.
        </p>

        <p
          style={{
            margin:
              '26px 0 0',

            color: '#93c5fd',

            fontSize: '21px',

            fontWeight: 600,

            fontStyle: 'italic',
          }}
        >
          Until we meet again.
        </p>

        <div
          style={{
            width: '80px',
            height: '1px',

            margin:
              '34px auto',

            background:
              'rgba(96, 165, 250, 0.45)',
          }}
        />

        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',

            minHeight: '60px',

            border: 'none',

            borderRadius: '14px',

            background: '#2563eb',

            color: '#ffffff',

            fontSize: '17px',

            fontWeight: 800,

            cursor: 'pointer',

            boxShadow:
              '0 10px 28px rgba(37, 99, 235, 0.35)',
          }}
        >
          Return to Portfolio
        </button>

      </div>

    </div>
  )
}

export default FinishModal
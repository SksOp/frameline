export const socialSize = { width: 1200, height: 630 };
export const socialAlt =
  'Frameline — Floating teleprompter for creators. Talk like you mean it.';

export function SocialCard() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '54px 64px',
        background: '#0a0a0a',
        color: '#ffffff',
        fontFamily: 'sans-serif',
        border: '14px solid #ccff00',
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 34,
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: '#ccff00',
            }}
          >
            FRAMELINE*
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: '0.08em',
              padding: '5px 12px',
              border: '1.5px solid #3f3f46',
              color: '#d4d4d8',
              textTransform: 'uppercase',
            }}
          >
            Camera Teleprompter
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 15,
            fontWeight: 800,
            padding: '8px 18px',
            background: '#ff4d8d',
            color: '#0a0a0a',
            letterSpacing: '0.04em',
            boxShadow: '4px 4px 0 #ffffff',
          }}
        >
          <span>●</span>
          <span>PIP OVER CAMERA</span>
        </div>
      </div>

      {/* Main Content: Hero Pitch + Live Prompter Mockup */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 40,
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        {/* Left: Teleprompter Value & Headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 530,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 18,
              fontWeight: 700,
              color: '#a1a1aa',
              letterSpacing: '0.04em',
              marginBottom: 14,
              textTransform: 'uppercase',
            }}
          >
            Talk like you mean it
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 66,
              fontWeight: 900,
              lineHeight: 1.02,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ color: '#ffffff' }}>Floating</span>
            <span style={{ color: '#ccff00' }}>Teleprompter</span>
          </div>
        </div>
      </div>
    </div>
  );
}

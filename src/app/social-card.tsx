export const socialSize = { width: 1200, height: 630 };
export const socialAlt = "Frameline — Talk like you mean it. Private on-device teleprompter.";
export function SocialCard() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#0a0a0a",
        color: "#ffffff",
        fontFamily: "sans-serif",
        border: "16px solid #ccff00",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", fontSize: 38, fontWeight: 900, letterSpacing: "-0.04em", color: "#ccff00" }}>
          FRAMELINE*
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 20,
            fontWeight: 800,
            padding: "8px 16px",
            background: "#ff4d8d",
            color: "#0a0a0a",
            boxShadow: "4px 4px 0 #ffffff",
          }}
        >
          LOCAL-FIRST
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 80, fontWeight: 900, lineHeight: 1.02, letterSpacing: "-0.04em", textTransform: "uppercase" }}>
          <span style={{ color: "#ffffff" }}>Talk like</span>
          <span style={{ color: "#ccff00" }}>you mean it.</span>
        </div>
        <div style={{ display: "flex", fontSize: 24, fontWeight: 600, marginTop: 28, color: "#a1a1aa", gap: 16 }}>
          <span>On-device processing</span>
          <span>·</span>
          <span>No account required</span>
          <span>·</span>
          <span>Android Chrome</span>
        </div>
      </div>
    </div>
  );
}

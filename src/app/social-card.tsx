import { socialPalette as color } from "./social-palette";

export const socialSize = { width: 1200, height: 630 };
export const socialAlt = "Frameline — focused creator tools. Make the thing and skip the setup.";

export function SocialCard() {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden", padding: "58px 64px", background: color.canvas, color: color.textPrimary, fontFamily: "sans-serif" }}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 13, background: color.coralStrong, color: color.textInverted, fontSize: 25, fontWeight: 800 }}>F</div>
            <div style={{ display: "flex", fontSize: 25, fontWeight: 750, letterSpacing: "-0.04em" }}>Frameline</div>
          </div>
          <div style={{ display: "flex", padding: "9px 16px", border: `2px solid ${color.border}`, borderRadius: 999, color: color.textSecondary, fontSize: 15, fontWeight: 700, letterSpacing: "0.04em" }}>CREATOR STUDIO</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", width: 720 }}>
          <div style={{ display: "flex", marginBottom: 14, color: color.coralStrong, fontSize: 18, fontWeight: 750, letterSpacing: "0.08em" }}>FOCUSED · PRIVATE · IMMEDIATE</div>
          <div style={{ display: "flex", flexDirection: "column", fontFamily: "serif", fontSize: 74, fontWeight: 600, lineHeight: 0.94, letterSpacing: "-0.045em" }}>
            <span>Make the thing.</span>
            <span style={{ color: color.coralStrong }}>Skip the setup.</span>
          </div>
          <div style={{ display: "flex", marginTop: 24, color: color.textSecondary, fontSize: 20 }}>One live tool. Three honest directions. Start with Teleprompter.</div>
        </div>
      </div>

      <div style={{ position: "absolute", right: 54, bottom: 42, width: 300, height: 330, display: "flex", flexDirection: "column", padding: 24, border: `2px solid ${color.border}`, borderRadius: 42, background: color.surfaceElevated, boxShadow: `0 24px 60px ${color.coralSoft}`, transform: "rotate(4deg)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div style={{ display: "flex", fontSize: 16, fontWeight: 750 }}>Teleprompter</div>
          <div style={{ display: "flex", width: 12, height: 12, borderRadius: 999, background: color.sageStrong }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 22, borderRadius: 24, background: color.textPrimary, color: color.textInverted, fontSize: 22, lineHeight: 1.35 }}>
          <span>Look into the lens.</span>
          <span style={{ color: color.gold }}>Your next line stays close.</span>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          <span style={{ display: "flex", width: 62, height: 12, borderRadius: 999, background: color.coral }} />
          <span style={{ display: "flex", width: 42, height: 12, borderRadius: 999, background: color.sage }} />
          <span style={{ display: "flex", width: 28, height: 12, borderRadius: 999, background: color.gold }} />
        </div>
      </div>
      <div style={{ position: "absolute", right: 240, top: 112, width: 138, height: 138, display: "flex", borderRadius: 999, background: color.sageSoft }} />
      <div style={{ position: "absolute", right: 24, top: 48, width: 120, height: 82, display: "flex", borderRadius: 28, background: color.goldSoft, transform: "rotate(-8deg)" }} />
    </div>
  );
}

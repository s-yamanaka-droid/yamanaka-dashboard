import { ImageResponse } from "next/og";

export const alt = "Lakkan — People & Work";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", background: "#F4F0E8", color: "#B4382B", padding: "54px 62px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 23, fontWeight: 700, letterSpacing: 2 }}><span>LAKKAN INC.</span><span>2026</span></div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", borderTop: "3px solid #B4382B", borderBottom: "3px solid #B4382B", padding: "46px 0 32px" }}>
        <span style={{ fontSize: 172, fontWeight: 800, letterSpacing: -14, lineHeight: 1 }}>LAKKAN</span>
        <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: 7, marginTop: 24 }}>PEOPLE &amp; WORK</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 21, fontWeight: 700, letterSpacing: 2 }}><span>IDEAS TO ACTION</span><span>lakkan-inc.vercel.app</span></div>
    </div>,
    size,
  );
}

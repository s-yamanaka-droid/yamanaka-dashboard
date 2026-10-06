import { ImageResponse } from "next/og";

export const alt = "Lakkan — Interactive workshop";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", background: "#080808", color: "#F4F1EA", padding: "44px 48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 700 }}><span>Lakkan Inc.</span><span>lakkan-inc.vercel.app</span></div>
      <div style={{ display: "flex", fontSize: 140, fontWeight: 400, letterSpacing: "-8px", lineHeight: 1 }}>Lakkan<span style={{ color: "#ff7a1a", fontSize: 80, marginLeft: 32 }}>↗</span></div>
      <div style={{ display: "flex", fontSize: 28, fontWeight: 400 }}>Explore the interactive workshop.</div>
    </div>,
    size,
  );
}

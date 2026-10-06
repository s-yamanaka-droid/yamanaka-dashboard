import { ImageResponse } from "next/og";

export const alt = "Lakkan — Flexible thinking. Solid building.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", background: "#234DEB", color: "#FFFFFF", padding: "44px 48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 700 }}><span>Lakkan Inc.</span><span>lakkan-inc.vercel.app</span></div>
      <div style={{ display: "flex", fontSize: 300, fontWeight: 700, letterSpacing: "-18px", lineHeight: 1 }}>Lakkan</div>
      <div style={{ display: "flex", fontSize: 32, fontWeight: 700 }}>Flexible thinking. Solid building.</div>
    </div>,
    size,
  );
}

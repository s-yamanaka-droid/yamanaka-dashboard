import { ACCENT, SANS } from "@/lib/design-tokens";

export function LiveBadge({ products }: { products: number }) {
  return (
    <div
      className="hero-live-badge"
      style={{
        position: "absolute",
        top: 78,
        right: 56,
        zIndex: 4,
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontFamily: SANS,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "#132126",
        background: "rgba(255,255,255,0.65)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(19,33,38,0.18)",
        borderRadius: 999,
        padding: "6px 12px",
      }}
    >
      <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8 }}>
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: ACCENT.forest,
            animation: "lakkan-pulse 1.6s ease-in-out infinite",
          }}
        />
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: ACCENT.forest,
            opacity: 0.55,
          }}
        />
      </span>
      <span>PUBLIC</span>
      <span style={{ opacity: 0.4 }}>—</span>
      <span className="hero-live-badge-count" style={{ letterSpacing: "0.08em" }}>{products} works</span>
      <style>{`@keyframes lakkan-pulse { 0%,100% { transform:scale(1); opacity:1 } 50% { transform:scale(1.6); opacity:0.2 } }`}</style>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { ACCENT, FRANK, SANS } from "@/lib/design-tokens";
import projectsData from "@/data/projects.json";
import type { Project } from "@/types";

const projects = (projectsData as Project[])
  .filter((project) => project.status === "live" && project.url)
  .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  .slice(0, 5);

const TONE = [ACCENT.forest, ACCENT.vermillion, ACCENT.blue, "#647672", "#5B5871"];

export function LiveFeed() {
  return (
    <div style={{ width: "100%", maxWidth: 400 }}>
      <div
        style={{
          fontFamily: SANS,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.22em",
          color: "#132126",
          opacity: 0.5,
          marginBottom: 14,
          textTransform: "uppercase",
        }}
      >
        Latest public work
      </div>

      <div>
        {projects.map((project, i) => (
          <motion.a
            className="hero-feed-link"
            key={project.id}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 + i * 0.08, duration: 0.45 }}
            style={{
              display: "grid",
              gridTemplateColumns: "auto auto 1fr",
              alignItems: "center",
              gap: 10,
              padding: "10px 0",
              borderTop: i === 0 ? "none" : "1px solid rgba(19,33,38,0.1)",
              textDecoration: "none",
              color: "#132126",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: TONE[i % TONE.length] }} />
            <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, opacity: 0.5, letterSpacing: "0.04em" }}>
              {project.updatedAt.slice(5).replace("-", "/")}
            </span>
            <span style={{ fontFamily: FRANK, fontSize: 14, lineHeight: 1.35 }}>
              {project.name}
            </span>
          </motion.a>
        ))}
      </div>

      <a
        className="hero-feed-all"
        href="/works"
        style={{
          display: "inline-block",
          borderTop: "1px solid rgba(19,33,38,0.18)",
          paddingTop: 12,
          marginTop: 6,
          width: "100%",
          fontFamily: SANS,
          fontSize: 9,
          color: "#132126",
          opacity: 0.55,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          textDecoration: "none",
        }}
      >
        View all public works →
      </a>
    </div>
  );
}

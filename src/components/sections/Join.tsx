"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FRANK, INSTRUMENT, SANS, EASE, ACCENT } from "@/lib/design-tokens";
import { SectionShell, Em } from "@/components/primitives/SectionShell";

const ROLES = [
  {
    code: "R.01",
    title: "AI Product Engineer",
    jp: "プロダクトエンジニア / AIネイティブ",
    type: "Full-time / 業務委託",
    desc: "Claude Code を相棒にして、新規プロダクトを 1〜2 週間で立ち上げる人。",
  },
  {
    code: "R.02",
    title: "Brand & Editorial Designer",
    jp: "ブランドデザイナー / エディトリアル",
    type: "業務委託",
    desc: "Anthropic / Pallas Partners 級のサイトと提案資料を、AI と編集の両軸で組む人。",
  },
  {
    code: "R.03",
    title: "Growth Operator",
    jp: "グロースオペレーター / 採用 × 広告",
    type: "Full-time",
    desc: "AI スカウト基盤と広告運用を回しながら、KPI を週次で動かす人。",
  },
];

const EXPECT = [
  "楽観的に動けて、悲観的に考えられる人",
  "AI を道具として使える（または使えるようになりたい）人",
  "肩書ではなく、出力で語れる人",
  "矛盾を抱えたまま走れる人",
];

const OFFERS = [
  { k: "Tools", v: "Claude Max / ChatGPT / Gemini Pro / Cursor 全部支給" },
  { k: "Stack", v: "仕事に必要なAI・開発ツールを提供" },
  { k: "Learn", v: "Lunaが判断と修正を蓄積し、仕事の再現性を高める" },
  { k: "Place", v: "東京・渋谷 / フルリモート可" },
];

const PROCESS = [
  { step: "01", label: "メールでカジュアル面談" },
  { step: "02", label: "30分の対話 (代表 山中)" },
  { step: "03", label: "1 週間トライアル (有償)" },
  { step: "04", label: "Offer / Decision" },
];

export function Join() {
  return (
    <SectionShell id="join" tone="cream" eyebrow="Join · Open Roles" accent="vermillion">
        {/* Headline */}
        <div
          data-mobile-stack="join-head"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
            gap: "6vw",
            alignItems: "end",
            marginBottom: 64,
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{
              fontFamily: INSTRUMENT,
              fontSize: "clamp(56px, 9vw, 144px)",
              fontWeight: 400,
              lineHeight: 0.92,
              color: "#0D0D0D",
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            一緒に、
            <br />
            <Em accent="vermillion">走ろう。</Em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
            style={{
              fontFamily: SANS,
              fontSize: 14,
              color: "#5A554D",
              lineHeight: 1.85,
              margin: 0,
              maxWidth: 380,
              paddingBottom: 16,
            }}
          >
            Lakkanは少人数のまま、AI 倍率で動きます。
            肩書ではなく、AI と組んで何を出力できるか。
            その一点で、新しい仲間を探しています。
          </motion.p>
        </div>

        {/* Roles */}
        <div
          style={{
            borderTop: "1px solid rgba(13,13,13,0.12)",
            marginBottom: 80,
          }}
        >
          {ROLES.map((r, i) => (
            <motion.a
              key={r.code}
              href="mailto:s-yamanaka@tre-pro.co.jp?subject=Lakkan%20Roles%20-%20"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: EASE }}
              whileHover={{ x: 6 }}
              data-mobile-stack="role-row"
              style={{
                display: "grid",
                gridTemplateColumns: "84px minmax(0, 2fr) minmax(0, 1.4fr) auto",
                alignItems: "center",
                gap: 24,
                padding: "28px 0",
                borderBottom: "1px solid rgba(13,13,13,0.12)",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <span
                style={{
                  fontFamily: INSTRUMENT,
                  fontStyle: "italic",
                  fontSize: 18,
                  color: ACCENT.vermillion,
                }}
              >
                {r.code}
              </span>
              <div>
                <h3
                  style={{
                    fontFamily: FRANK,
                    fontSize: "clamp(22px, 2.8vw, 36px)",
                    fontWeight: 400,
                    color: "#0D0D0D",
                    lineHeight: 1.1,
                    margin: "0 0 6px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {r.title}
                </h3>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 12,
                    color: "#8A857C",
                  }}
                >
                  {r.jp}
                </div>
              </div>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 13,
                  color: "#5A554D",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {r.desc}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: SANS,
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    color: "#0D0D0D",
                    border: "1px solid rgba(13,13,13,0.18)",
                    borderRadius: 100,
                    padding: "4px 10px",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.type}
                </span>
                <ArrowUpRight size={18} color={ACCENT.vermillion} />
              </div>
            </motion.a>
          ))}
        </div>

        {/* Expectations + Offers */}
        <div
          data-mobile-stack="join-cols"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            gap: "6vw",
            marginBottom: 80,
          }}
        >
          {/* Expectations */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div
              style={{
                fontFamily: SANS,
                fontSize: 9,
                letterSpacing: "0.22em",
                color: ACCENT.vermillion,
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              We&apos;re looking for
            </div>
            <h3
              style={{
                fontFamily: INSTRUMENT,
                fontSize: "clamp(28px,3.8vw,52px)",
                fontWeight: 400,
                color: "#0D0D0D",
                lineHeight: 1.1,
                margin: "0 0 28px",
                letterSpacing: "-0.02em",
              }}
            >
              <em style={{ fontStyle: "italic" }}>こんな人</em>と働きたい。
            </h3>
            <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {EXPECT.map((cond, i) => (
                <motion.li
                  key={cond}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{
                    delay: i * 0.07,
                    duration: 0.45,
                    ease: EASE,
                  }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "32px 1fr",
                    gap: 12,
                    padding: "18px 0",
                    borderBottom: "1px solid rgba(13,13,13,0.08)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: INSTRUMENT,
                      fontStyle: "italic",
                      fontSize: 14,
                      color: ACCENT.vermillion,
                      paddingTop: 3,
                    }}
                  >
                    0{i + 1}
                  </span>
                  <span
                    style={{
                      fontFamily: FRANK,
                      fontSize: 17,
                      color: "#0D0D0D",
                      lineHeight: 1.55,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {cond}
                  </span>
                </motion.li>
              ))}
            </ol>
          </motion.div>

          {/* Offers */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.15, duration: 0.6, ease: EASE }}
          >
            <div
              style={{
                fontFamily: SANS,
                fontSize: 9,
                letterSpacing: "0.22em",
                color: ACCENT.blue,
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              What you get
            </div>
            <h3
              style={{
                fontFamily: INSTRUMENT,
                fontSize: "clamp(28px,3.8vw,52px)",
                fontWeight: 400,
                color: "#0D0D0D",
                lineHeight: 1.1,
                margin: "0 0 28px",
                letterSpacing: "-0.02em",
              }}
            >
              Lakkan で
              <em style={{ fontStyle: "italic" }}>得られるもの</em>。
            </h3>
            <dl style={{ margin: 0, padding: 0 }}>
              {OFFERS.map((o, i) => (
                <motion.div
                  key={o.k}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{
                    delay: i * 0.07,
                    duration: 0.45,
                    ease: EASE,
                  }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "92px 1fr",
                    gap: 16,
                    padding: "18px 0",
                    borderBottom: "1px solid rgba(13,13,13,0.08)",
                  }}
                >
                  <dt
                    style={{
                      fontFamily: SANS,
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      color: ACCENT.blue,
                      textTransform: "uppercase",
                      paddingTop: 4,
                    }}
                  >
                    {o.k}
                  </dt>
                  <dd
                    style={{
                      fontFamily: SANS,
                      fontSize: 13.5,
                      color: "#0D0D0D",
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {o.v}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        </div>

        {/* Process strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{
            borderTop: "1px solid rgba(13,13,13,0.12)",
            paddingTop: 32,
            marginBottom: 64,
          }}
        >
          <div
            style={{
              fontFamily: SANS,
              fontSize: 9,
              letterSpacing: "0.22em",
              color: "#B0ADA6",
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            Selection Process
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 0,
              border: "1px solid rgba(13,13,13,0.12)",
              borderRadius: 16,
              overflow: "hidden",
              background: "#FFFFFF",
            }}
          >
            {PROCESS.map((p, i, arr) => (
              <div
                key={p.step}
                style={{
                  padding: "26px 24px",
                  borderRight:
                    i < arr.length - 1
                      ? "1px solid rgba(13,13,13,0.1)"
                      : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: INSTRUMENT,
                    fontStyle: "italic",
                    fontSize: 14,
                    color: ACCENT.vermillion,
                    marginBottom: 8,
                  }}
                >
                  Step {p.step}
                </div>
                <div
                  style={{
                    fontFamily: FRANK,
                    fontSize: 16,
                    color: "#0D0D0D",
                    lineHeight: 1.4,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {p.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 24,
            paddingTop: 32,
            borderTop: "1px solid rgba(13,13,13,0.12)",
          }}
        >
          <p
            style={{
              fontFamily: INSTRUMENT,
              fontStyle: "italic",
              fontSize: "clamp(22px,3vw,40px)",
              fontWeight: 400,
              color: "#0D0D0D",
              lineHeight: 1.3,
              margin: 0,
              maxWidth: "20ch",
              letterSpacing: "-0.005em",
            }}
          >
            まずは、1 通のメールから。
          </p>
          <motion.a
            href="mailto:s-yamanaka@tre-pro.co.jp?subject=Lakkan%20-%20Hello"
            whileHover={{ x: 4 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontFamily: FRANK,
              fontSize: "clamp(18px,2vw,26px)",
              fontWeight: 400,
              color: "#0D0D0D",
              textDecoration: "none",
              borderBottom: `1px solid ${ACCENT.vermillion}`,
              paddingBottom: 6,
            }}
          >
            s-yamanaka@tre-pro.co.jp <ArrowUpRight size={20} />
          </motion.a>
        </motion.div>
    </SectionShell>
  );
}

"use client";

import { motion } from "framer-motion";
import { FRANK, INSTRUMENT, SANS, EASE, ACCENT } from "@/lib/design-tokens";
import { SectionShell } from "@/components/primitives/SectionShell";

const CREDOS = [
  { num: "01", text: "速度は構造を超える。 — まず動く、それから整える。" },
  { num: "02", text: "AIは目的でなく、武器。 — 道具にだけは飲まれない。" },
  { num: "03", text: "矛盾を抱えて走れ。 — 楽観的に動き、悲観的に計画する。" },
];

/* 6社マルチハット — 現在の役職構成（2026-05時点） */
const ROLES = [
  { co: "楽観 / Lakkan",        role: "代表",        domain: "AIリスキリング / 人材 / 売上管理",         phase: "2026.05 登記完了" },
  { co: "トレプロ",             role: "COO",         domain: "TikTok → PR → 経営 / 営業",               phase: "上場グループ・本業" },
  { co: "LunaTech",              role: "COO",         domain: "AI 5本立て（プランナー他）",                phase: "2026.06.16 ローンチ" },
  { co: "SKYLINK",               role: "CTO",         domain: "Engine 開発 → 求人プラットフォーム",         phase: "開発・移行中" },
  { co: "KANOA",                 role: "AI 外部相談役", domain: "KANOA JOB",                                phase: "アドバイザリー" },
  { co: "Solve",                 role: "代表",        domain: "競合調査 / ホームページ制作",                phase: "柔軟枠" },
];

const TIMELINE = [
  { year: "2016", text: "全日本大学バスケットボール大会 出場（愛知学泉大学）", note: "バスケが、すべての原点。" },
  { year: "2018", text: "岡山県成年国体選手 / 3×3日本代表候補", note: "競技の頂点を目指した時代。" },
  { year: "2020", text: "株式会社ホシザキ 入社 — エンジニアセールス / バスケスクール立ち上げ", note: "社会人1年目。営業とゼロイチを同時に学んだ。" },
  { year: "2022", text: "株式会社ネオキャリア 入社 — SaaS CS / 職種特化型求人シェアリング", note: "約3年半、新規・新設エージェントの立ち上げに一気通貫で従事。" },
  { year: "2023", text: "合同会社Sinple 設立 → 売却", note: "最初の起業と、最初の出口。" },
  { year: "2024", text: "株式会社Solve 設立", note: "二度目の創業。課題解決に特化した事業を動かす。" },
  { year: "2025.09", text: "トレプロ株式会社 執行役員 就任（東証グロース上場）", note: "上場グループの経営に参画。組織とスピードを同時に動かす。" },
  { year: "2026.02", text: "トレプロ株式会社 COO 就任", note: "経営の座へ。スピードと構造を両立する立場に。" },
  { year: "2026.03", text: "株式会社Lakkan 始動", note: "楽観と、計画と。自分の言葉で走りはじめる。" },
  { year: "2026.04", text: "SKYLINK CTO 就任 / KANOA AI 外部相談役 就任", note: "技術選定と、外からの第三者視点。同時に。" },
  { year: "2026.05", text: "株式会社Lakkan 法人登記完了（5/11）", note: "ペンを取った瞬間、楽観が法人になった。" },
  { year: "2026.06", text: "LunaTech 法人ローンチ予定（6/16） — COO 就任", note: "AIプロダクト 5本立て。プランナー / ベース / AIラボ / ソラリス / かぐや・みこと。" },
];

export function About() {
  return (
    <SectionShell id="about" tone="cream" eyebrow="People · Founder" accent="vermillion">
        {/* Hero block: Portrait + Name */}
        <div
          data-mobile-stack="hero"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)",
            gap: 64,
            alignItems: "center",
            marginBottom: 96,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "3/2",
              background: "#C7CFCA",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <img
              src="/photo.jpg"
              alt="Shuto Yamanaka"
              style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.15, duration: 0.7, ease: EASE }}
          >
            <h2
              className="editorial-heading"
              style={{
                fontFamily: INSTRUMENT,
                fontSize: "clamp(48px, 7vw, 104px)",
                fontWeight: 400,
                lineHeight: 0.92,
                color: "#132126",
                letterSpacing: "-0.025em",
                margin: "0 0 12px",
              }}
            >
              Shuto<br />Yamanaka<em style={{ fontStyle: "italic", color: ACCENT.vermillion }}>.</em>
            </h2>
            <p style={{ fontFamily: FRANK, fontSize: 18, fontWeight: 300, color: "#45545A", margin: "0 0 8px", letterSpacing: "0.06em" }}>
              山中 秀斗
            </p>
            <p style={{ fontFamily: SANS, fontSize: 13, color: "#45545A", lineHeight: 1.8, margin: 0, letterSpacing: "0.02em" }}>
              Founder, Lakkan Inc.<br />
              COO, Trepro Co., Ltd. (TSE Growth)<br />
              東京・渋谷 / 1997年生
            </p>
          </motion.div>
        </div>

        {/* Personal essay */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE }}
          data-mobile-stack="essay"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: 48,
            paddingTop: 64,
            borderTop: "1px solid rgba(19,33,38,0.12)",
            marginBottom: 96,
          }}
        >
          <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.22em", color: "#45545A", textTransform: "uppercase" }}>
            Essay · 01<br />
            <span style={{ color: "#6E7A7C" }}>2026 / Self-portrait</span>
          </div>
          <div>
            <p
              style={{
                fontFamily: INSTRUMENT,
                fontSize: "clamp(20px,2.2vw,30px)",
                fontStyle: "italic",
                fontWeight: 400,
                lineHeight: 1.55,
                color: "#132126",
                margin: "0 0 32px",
                letterSpacing: "-0.005em",
              }}
            >
              バスケが原点。
              <br />
              負けても、また立つ。
            </p>
            <p
              style={{
                fontFamily: FRANK,
                fontSize: 16,
                fontWeight: 300,
                lineHeight: 1.95,
                color: "#3a352d",
                margin: 0,
                maxWidth: "62ch",
              }}
            >
              28歳。
              この瞬間に、AIが世界の前提を書き換えはじめた。<br />
              ホシザキでの営業、ネオキャリアでの SaaS 立ち上げ、Sinple、Solve、トレプロでの COO──
              いくつもの会社を渡り歩きながら、僕は同じことをやり続けてきた。
              <strong style={{ color: "#132126", fontWeight: 500 }}>「うまくいく仕組みを、もう一度作り直す。」</strong>
              <br /><br />
              Lakkan は、その延長線上にある。
              人とAIが矛盾なく走れる組織。
              失敗を恐れない速度。
              そして、楽観と計画を同時に握りしめる態度。<br /><br />
              <em style={{ fontStyle: "italic", color: ACCENT.vermillion }}>
                「楽観と、計画と。」
              </em>
              ──これは標語じゃない。僕の生き方そのものだ。
            </p>
          </div>
        </motion.div>

        {/* Credos */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ marginBottom: 96 }}
        >
          <div
            style={{
              fontFamily: SANS, fontSize: 11, letterSpacing: "0.22em",
              color: "#45545A", textTransform: "uppercase", marginBottom: 32,
            }}
          >
            Three Credos · I — III
          </div>
          <div
            data-mobile-stack="credos"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 0,
              borderTop: "1px solid rgba(19,33,38,0.12)",
            }}
          >
            {CREDOS.map((c, i) => (
              <motion.div
                key={c.num}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: EASE }}
                style={{
                  padding: "32px 28px 32px 0",
                  paddingLeft: i > 0 ? 28 : 0,
                  borderRight: i < 2 ? "1px solid rgba(19,33,38,0.12)" : "none",
                  borderBottom: "1px solid rgba(19,33,38,0.12)",
                }}
              >
                <div style={{ fontFamily: INSTRUMENT, fontStyle: "italic", fontSize: 18, color: ACCENT.vermillion, marginBottom: 14 }}>
                  {c.num}
                </div>
                <p style={{ fontFamily: FRANK, fontSize: 18, lineHeight: 1.55, color: "#132126", margin: 0, letterSpacing: "-0.005em" }}>
                  {c.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 6社マルチハット — Roles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ marginBottom: 96 }}
        >
          <div style={{
            fontFamily: SANS, fontSize: 11, letterSpacing: "0.22em",
            color: "#45545A", textTransform: "uppercase", marginBottom: 32,
          }}>
            Multi-Hat · 6 Companies (2026)
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 0,
            borderTop: "1px solid rgba(19,33,38,0.12)",
          }}>
            {ROLES.map((r, i) => (
              <motion.div
                key={r.co}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: EASE }}
                style={{
                  padding: "28px 24px",
                  borderRight: "1px solid rgba(19,33,38,0.08)",
                  borderBottom: "1px solid rgba(19,33,38,0.08)",
                }}
              >
                <div style={{
                  fontFamily: INSTRUMENT, fontStyle: "italic", fontSize: 13,
                  color: ACCENT.vermillion, letterSpacing: "0.04em", marginBottom: 8,
                }}>
                  {r.role}
                </div>
                <div style={{
                  fontFamily: FRANK, fontSize: 22, fontWeight: 500,
                  color: "#132126", marginBottom: 12, letterSpacing: "-0.01em",
                }}>
                  {r.co}
                </div>
                <div style={{
                  fontFamily: SANS, fontSize: 13, lineHeight: 1.55,
                  color: "#45545A", marginBottom: 8,
                }}>
                  {r.domain}
                </div>
                <div style={{
                  fontFamily: SANS, fontSize: 11, letterSpacing: "0.08em",
                  color: "#8A857A", textTransform: "uppercase",
                }}>
                  {r.phase}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <div
          style={{
            fontFamily: SANS, fontSize: 11, letterSpacing: "0.22em",
            color: "#45545A", textTransform: "uppercase", marginBottom: 32,
          }}
        >
          Timeline · 2016 — 2026
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {TIMELINE.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: i * 0.04, duration: 0.5, ease: EASE }}
              data-mobile-stack="timeline-row"
              style={{
                display: "grid",
                gridTemplateColumns: "100px 1fr",
                gap: 32,
                padding: "24px 0",
                borderBottom: "1px solid rgba(19,33,38,0.06)",
              }}
            >
              <span style={{ fontFamily: INSTRUMENT, fontStyle: "italic", fontSize: 20, fontWeight: 400, color: ACCENT.vermillion, letterSpacing: "-0.01em" }}>
                {item.year}
              </span>
              <div>
                <span style={{ fontFamily: FRANK, fontSize: 18, fontWeight: 400, color: "#132126", lineHeight: 1.45, display: "block", marginBottom: 6 }}>
                  {item.text}
                </span>
                <span style={{ fontFamily: INSTRUMENT, fontStyle: "italic", fontSize: 15, fontWeight: 400, color: "#45545A", lineHeight: 1.55 }}>
                  {item.note}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
    </SectionShell>
  );
}

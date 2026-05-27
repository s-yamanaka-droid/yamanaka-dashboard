import type { Metadata } from "next";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Vigil / Now — Lakkan Inc.",
  description:
    "Vigil AI のライブ稼働状況。Phase 4 ハーネス・直近24時間の進化・蓄積メトリクス・稼働サービス。",
  openGraph: {
    title: "Vigil / Now — 育つ第二の脳",
    description: "Phase 4 ハーネス稼働・直近進化記録・メトリクスライブ表示。",
  },
};

const FRANK = "var(--font-frank), 'Frank Ruhl Libre', Georgia, serif";
const SANS  = "var(--font-display), 'Space Grotesk', system-ui, sans-serif";

const BG = "#FAFAF7";
const INK = "#0D0D0D";
const ORANGE = "#FF4F00";
const GREEN = "#2BA84A";
const W = (a: number) => `rgba(13,13,13,${a})`;

export default function VigilPage() {
  return (
    <main id="main" style={{ background: BG, color: INK, minHeight: "100vh" }}>
      {/* TOP BAR */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100, background: "rgba(250,250,247,0.88)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${W(0.08)}`, padding: "0 32px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24
      }}>
        <Link href="/" style={{ display:"inline-flex", alignItems:"center", gap:8, fontFamily:SANS, fontSize:11, letterSpacing:"0.18em", color:W(0.65), textDecoration:"none" }}>
          <ArrowLeft size={14}/> LAKKAN
        </Link>
        <div style={{ display:"flex", gap:0, fontFamily:SANS, fontSize:11, letterSpacing:"0.18em" }}>
          {[
            { href:"/vigil",            label:"NOW",       active:true  },
            { href:"/skills",           label:"SKILLS",    active:false },
            { href:"/evolution",        label:"EVOLUTION", active:false },
            { href:"/vigil/brief/01",   label:"BRIEF",     active:false },
          ].map(t => (
            <Link key={t.label} href={t.href} style={{
              color: t.active ? INK : W(0.5),
              padding: "8px 16px", textDecoration:"none",
              borderBottom: `1px solid ${t.active ? ORANGE : "transparent"}`,
            }}>{t.label}</Link>
          ))}
        </div>
        <span style={{ fontFamily:SANS, fontSize:10, letterSpacing:"0.15em", color:GREEN }}>● LIVE</span>
      </div>

      {/* Unified PageHero */}
      <PageHero
        section="Vigil / Now"
        version="v.0.4"
        title="Engine Room of Lakkan"
        lede="「楽観と計画」の計画側。8つのAI役員が24/7で自律稼働し、毎晩学習し、毎日進化する — その生中継"
        background={BG}
      />

      {/* HERO badges */}
      <section style={{ padding: "32px 56px 96px", borderBottom: `1px solid ${W(0.08)}`, position:"relative", overflow:"hidden" }}>
        <div >
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:0 }}>
            {[
              { t:"● LIVE", green:true },
              { t:"+ phase-4 HARNESS" },
              { t:"+ pj-threads-30", green:true },
              { t:"+ stream-resume-abort", green:true },
              { t:"+ skills-27" },
              { t:"+ knowledge-80" },
              { t:"+ cxo-8" },
              { t:"+ v2-shipped" },
            ].map(p => (
              <span key={p.t} style={{
                fontFamily:SANS, fontSize:10, letterSpacing:"0.1em",
                color: p.green ? GREEN : W(0.65),
                border: `1px solid ${p.green ? "rgba(43,168,74,0.45)" : W(0.18)}`,
                background: p.green ? "rgba(43,168,74,0.08)" : "transparent",
                padding:"5px 12px", borderRadius:4
              }}>{p.t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* PHASE */}
      <section style={{ padding: "96px 56px", borderBottom: `1px solid ${W(0.08)}` }}>
        <SectionLabel num="01" text="PHASE" tag="フェーズ進捗"/>
        <h2 style={{ fontFamily:FRANK, fontSize:"clamp(34px,5vw,60px)", fontWeight:400, letterSpacing:"-0.01em", marginBottom:16 }}>
          いま、<em style={{ color:ORANGE, fontStyle:"italic" }}>どこにいるか</em>
        </h2>
        <p style={{ fontFamily:SANS, fontSize:14, color:W(0.55), maxWidth:720, lineHeight:1.9, borderLeft:`2px solid ${W(0.15)}`, paddingLeft:16, marginBottom:48 }}>
          対話型 AI から稼働型ハーネスへ。フェーズ 1〜4 の 4 段階で、いま <strong style={{ color:INK }}>Phase 4 — Harness 稼働</strong> 段階。自律実行・自己学習・遠隔指示の 3 つが日常運用に入っている。
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:2 }}>
          {[
            { num:"PHASE 01–02",   name:"対話 AI",         desc:"人間が都度指示。毎回コンテキストを渡す。",               status:"● COMPLETE",    state:"done" },
            { num:"PHASE 03",      name:"Skill & Playbook 化", desc:"繰り返し処理を 1 コマンド化。再現性のある実行。",      status:"● COMPLETE — 27 SKILLS", state:"done" },
            { num:"PHASE 04 — NOW",name:"Harness 稼働",    desc:"8 つの AI 役員が自律稼働。判断・実行・記録まで完結。",    status:"● LIVE BUILDING", state:"now" },
            { num:"PHASE 05",      name:"完全モビリティ",   desc:"スマホ一台で組織を動かす。タクシー・ゴルフ場が執務室。", status:"○ IN DESIGN",   state:"next" },
          ].map((p, i) => (
            <div key={p.num} style={{
                background: p.state==="now" ? INK : p.state==="done" ? "#FFFFFF" : "rgba(13,13,13,0.02)",
                color: p.state==="now" ? "#FFFFFF" : INK,
                border: `1px solid ${W(0.1)}`, padding:"28px 24px"
              }}>
              <div style={{ fontFamily:SANS, fontSize:10, letterSpacing:"0.18em", color: p.state==="now" ? ORANGE : W(0.5), marginBottom:14 }}>{p.num}</div>
              <div style={{ fontFamily:FRANK, fontSize:22, fontWeight:700, marginBottom:10, letterSpacing:"-0.01em" }}>{p.name}</div>
              <div style={{ fontFamily:SANS, fontSize:12, color: p.state==="now" ? "rgba(255,255,255,0.7)" : W(0.6), lineHeight:1.7 }}>{p.desc}</div>
              <div style={{ fontFamily:SANS, fontSize:9, letterSpacing:"0.15em", color: p.state==="now" ? GREEN : (p.state==="done" ? GREEN : W(0.5)), marginTop:14 }}>{p.status}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT SHIPPED */}
      <section style={{ padding: "96px 56px", borderBottom: `1px solid ${W(0.08)}` }}>
        <SectionLabel num="02" text="WHAT SHIPPED" tag="直近 24 時間の進化"/>
        <h2 style={{ fontFamily:FRANK, fontSize:"clamp(34px,5vw,60px)", fontWeight:400, letterSpacing:"-0.01em", marginBottom:16 }}>
          昨日から今日、<em style={{ color:ORANGE, fontStyle:"italic" }}>何が動き出したか</em>
        </h2>
        <p style={{ fontFamily:SANS, fontSize:14, color:W(0.55), maxWidth:720, lineHeight:1.9, borderLeft:`2px solid ${W(0.15)}`, paddingLeft:16, marginBottom:48 }}>
          直近 24 時間で Slack ↔ Claude Code が完全双方向化し、自律実行・自動コミット・モデル振り分け・承認フローまで 4 つのベストプラクティスが本番デプロイ。
        </p>
        <div style={{ borderLeft:`2px solid ${W(0.15)}`, paddingLeft:0 }}>
          {[
            {
              fresh:true, date:"2026.04.26", tag:"PJ THREAD CONVERSATION · LIVE",
              title:"スレッドが、本物の Claude Code 対話チャネルに",
              body:"30 プロジェクトを Slack スレッドに展開。スレッド返信を AI が意図分類（PROCEED / COMMAND / QUESTION / NOTE / REACTION）し、自然文で Claude Code が PJ パスで起動。リアルタイム進捗ストリーム、会話継続（resume）、中止 UI まで本日デプロイ。経営者は iPhone のスレッドだけで会社が動く状態。",
              bullets:[
                "🗂️ Project Index — 30 PJ をカテゴリ別にスレッド親として展開（Core / Vigil / KANOA / Buddy / Trepro / Gakken / Tools / Finance ...）",
                "🧠 AI Intent Classifier — Gemma 12B（local）で 5 カテゴリ判別、テスト 7/7 正解",
                "🛠️ Streaming Progress — chat.update で起動メッセージを 4 秒ごとに書き換え。ツール使用とアシスタント出力をライブ可視化",
                "🔁 Session Resume — thread_ts ↔ session_uuid を永続化。同じスレッドで Claude が文脈を覚え続ける",
                "🛑 Abort UI — 進捗メッセージに 🛑 リアクションで /tmp/pj_abort_<ts> フラグ → SIGTERM 即停止",
                "♻️ Auto Registry — nightly_review が ~/apps/ から毎晩 registry.json 再生成（thread_ts 保持）",
              ]
            },
            {
              fresh:true, date:"2026.04.26", tag:"VIGIL BRIEF №01 · UPDATED",
              title:"Mobile AI Harness ピッチに LIVE OPS を追記",
              body:"mobile-ai-harness.vercel.app — 既存の Vigil Brief №01（ROI 試算 / 6 ステップキッティング / セキュリティ / 重役の1日）に §08 LIVE OPERATIONS を新設し、30 PJ / Intent / Stream / Resume / Abort / Router / Registry の 6 仕掛けと「経営者が30人分動く」キャッチを統合。重複していた jarvis-pitch は archive へ退避し、ピッチを 1 本に集約。",
            },
            {
              date:"2026.04.25", tag:"JARVIS ROUTER V2 · DEPLOYED",
              title:"Slack ↔ Claude Code 完全双方向",
              body:"ハッシュタグ不要。「Claude Codeで〜やって」「何やってる？」と書くだけで Air 側 Claude Code が起動。ステータス質問と実行指示を自動判別し、Slack スレッドに結果を返す。",
              bullets:[
                "⑥ Haiku / Sonnet 自動振り分け — 軽い質問は Haiku、重い処理は Sonnet",
                "① 危険操作 承認フロー — 削除系は OK <ID> で明示承認",
                "② 同時実行ロック — /tmp/jarvis_code.lock で並行衝突を防ぐ",
                "⑨ git 自動コミット — [claude-code via slack] プレフィックスで記録",
              ]
            },
            {
              fresh:true, date:"2026.04.24", tag:"PULSE BRIEFING · 4×/DAY",
              title:"Jarvis 執事の 4 回ブリーフィング",
              body:"朝 07:00 / 昼 12:00 / 夕 18:00 / 夜 22:00。Claude Haiku が Vault と feedback を読み、熟練の司書口調で「最優先 3 件 / 進捗 / 残件 / 振り返り」を Slack に投下。朝のブリーフィングは TODAY.md も自動更新。",
            },
            {
              date:"2026.04.24", tag:"OBSOLETE PROCESS · TERMINATED",
              title:"旧 morning_report 系の警報を停止",
              body:"孤児プロセス化していた旧 vigil 自動修復アラートを停止。新しい pulse_briefing に責務を一本化し、ノイズを完全に除去。",
            },
            {
              date:"2026.04.25", tag:"VIGIL ARCHITECTURE",
              title:"Vigil ↔ Lakkan 統合構造を確定",
              body:"コーポレート（Lakkan）= 玄関・思想・サービス紹介。Vigil = 中身・実装証跡・進化記録。両者を同一サイト上の /vigil 系ルートで接続。",
            },
          ].map((s, i) => (
            <div key={i} style={{ position:"relative", padding:"24px 0 24px 32px", borderBottom:`1px solid ${W(0.06)}` }}>
              <span style={{
                position:"absolute", left:-7, top:32, width:12, height:12,
                background: s.fresh ? GREEN : ORANGE, borderRadius:"50%", border:`2px solid ${BG}`,
              }}/>
              <div style={{ fontFamily:SANS, fontSize:10, letterSpacing:"0.12em", color:W(0.4), marginBottom:8 }}>
                <span style={{ color: s.fresh ? GREEN : ORANGE, marginRight:12 }}>● {s.date}{s.fresh?" · FRESH":""}</span>
                <span>{s.tag}</span>
              </div>
              <div style={{ fontFamily:FRANK, fontSize:22, fontWeight:700, marginBottom:10, letterSpacing:"-0.01em" }}>{s.title}</div>
              <p style={{ fontFamily:SANS, fontSize:13, color:W(0.65), lineHeight:1.85, maxWidth:780 }}>{s.body}</p>
              {s.bullets && (
                <ul style={{ marginTop:12, paddingLeft:18, color:W(0.55), fontFamily:SANS, fontSize:12.5, lineHeight:1.95 }}>
                  {s.bullets.map(b => <li key={b}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* METRICS */}
      <section style={{ padding: "0", borderBottom: `1px solid ${W(0.08)}` }}>
        <div style={{ padding:"80px 56px 0" }}>
          <SectionLabel num="03" text="METRICS" tag="蓄積資産"/>
          <h2 style={{ fontFamily:FRANK, fontSize:"clamp(34px,5vw,60px)", fontWeight:400, letterSpacing:"-0.01em", marginBottom:40 }}>
            使うほど <em style={{ color:ORANGE, fontStyle:"italic" }}>賢くなる</em>
          </h2>
        </div>
        <div style={{ background:INK, padding:"60px 56px", display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:0 }}>
          {[
            { num:"30", unit:"+ {projects}",  label:"Slack スレッド稼働中", hot:true },
            { num:"27", unit:"+ {skills}",    label:"動的 Skill カタログ" },
            { num:"80", unit:"+ {knowledge}", label:"商談ナレッジ" },
            { num:"11", unit:"+ {patterns}",  label:"学習パターン" },
            { num:"8",  unit:"+ {cxo}",       label:"AI 役員チーム" },
          ].map((m, i) => (
            <div key={m.label} style={{ padding:"0 24px", borderRight: i<4 ? `1px solid rgba(255,255,255,0.12)` : "none" }}>
              <div style={{ fontFamily:FRANK, fontSize:"clamp(40px,5.2vw,72px)", fontWeight:900, lineHeight:1, color: m.hot ? ORANGE : "#CBFF4D" }}>{m.num}</div>
              <div style={{ fontFamily:SANS, fontSize:11, letterSpacing:"0.15em", color:"rgba(255,255,255,0.45)", marginTop:12, textTransform:"uppercase" }}>{m.unit}</div>
              <div style={{ fontFamily:SANS, fontSize:12, color:"rgba(255,255,255,0.7)", marginTop:6 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LIVE STATUS */}
      <section style={{ padding: "96px 56px", borderBottom: `1px solid ${W(0.08)}` }}>
        <SectionLabel num="04" text="LIVE STATUS" tag="稼働中サービス"/>
        <h2 style={{ fontFamily:FRANK, fontSize:"clamp(34px,5vw,60px)", fontWeight:400, letterSpacing:"-0.01em", marginBottom:16 }}>
          いま、<em style={{ color:ORANGE, fontStyle:"italic" }}>動いているもの</em>
        </h2>
        <p style={{ fontFamily:SANS, fontSize:14, color:W(0.55), maxWidth:720, lineHeight:1.9, borderLeft:`2px solid ${W(0.15)}`, paddingLeft:16, marginBottom:48 }}>
          MacBook Air が家常駐 24/7 サーバー、Pro が外出用クライアント。Tailscale で直結。launchd が常駐プロセスを管理し、停止しても自動復旧する。
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:2 }}>
          {[
            { name:"PJ Manager · Threads", status:"LIVE", rows:[["projects","30 (Slack thread roots)"],["intent","Gemma 12B · 5-class"],["sessions","thread_ts ↔ uuid 永続化"],["abort","🛑 reaction → SIGTERM"]] },
            { name:"Air · Server", status:"UP",    rows:[["tailscale","100.86.81.47"],["role","24/7 home server"],["processes","orchestrator · slack-watcher · nightly-review · pulse-briefing"]] },
            { name:"Pro · Client", status:"UP",    rows:[["tailscale","100.99.131.109"],["role","外出用 / 設計・開発"],["tools","Claude Code · Obsidian · IDE"]] },
            { name:"Jarvis Router V2", status:"LIVE", rows:[["model","Haiku / Sonnet auto"],["lock","/tmp/jarvis_code.lock"],["approval","OK <ID> flow"],["git","auto-commit"]] },
            { name:"Pulse Briefing", status:"4×/DAY", rows:[["07:00","朝 — 最優先 3 件"],["12:00","昼 — 午前進捗 / 午後推奨"],["18:00","夕 — 達成状況 / 残件"],["22:00","夜 — 振り返り / 引き継ぎ"]] },
            { name:"Nightly Review", status:"23:30 JST", rows:[["学習","feedback → patterns 抽出"],["蓄積","brain/patterns 更新"],["配信","Slack に学習レポート"]] },
            { name:"Vault · 第二の脳", status:"SYNC", rows:[["repo","s-yamanaka-droid/vault"],["structure","0-常駐 / 1-受信箱 / 2-日次 / 3-プロジェクト"],["mobile","Working Copy + Obsidian iPhone"]] },
          ].map(c => (
            <div key={c.name} style={{ background:"#FFFFFF", border:`1px solid ${W(0.1)}`, padding:24 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                <span style={{ fontFamily:SANS, fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:INK }}>{c.name}</span>
                <span style={{ fontFamily:SANS, fontSize:9, letterSpacing:"0.12em", padding:"3px 8px", background:INK, color:"#CBFF4D" }}>● {c.status}</span>
              </div>
              <div style={{ fontFamily:"DM Mono, monospace", fontSize:11, lineHeight:2, color:W(0.7) }}>
                {c.rows.map(([k,v]) => (
                  <div key={k}><span style={{ color:W(0.4), display:"inline-block", minWidth:90, marginRight:8 }}>{k}</span><span style={{ color:INK }}>{v}</span></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NAVIGATE */}
      <section style={{ padding: "96px 56px" }}>
        <SectionLabel num="05" text="NAVIGATE" tag="深く見る"/>
        <h2 style={{ fontFamily:FRANK, fontSize:"clamp(34px,5vw,60px)", fontWeight:400, letterSpacing:"-0.01em", marginBottom:16 }}>
          続きは、<em style={{ color:ORANGE, fontStyle:"italic" }}>ここから</em>
        </h2>
        <p style={{ fontFamily:SANS, fontSize:14, color:W(0.55), maxWidth:720, lineHeight:1.9, borderLeft:`2px solid ${W(0.15)}`, paddingLeft:16, marginBottom:48 }}>
          Vigil は 4 つのレイヤーで「今・スキル・思想・歴史」を分けている。
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:2 }}>
          {[
            { num:"+ 01 · BRIEF №01", href:"https://mobile-ai-harness.vercel.app/", title:"Mobile AI", titleEm:"Harness", sub:"経営者向け Vigil Brief №01。ROI 試算・キッティング手順・スレッド対話モード（2026.04.26 追加）まで 9 セクション。", arrow:"OPEN BRIEF" },
            { num:"+ 02 · SKILLS",    href:"/skills",        title:"Skills",    titleEm:"Catalog",     sub:"27 件の動的 Skill。カテゴリ別に探せる、Supabase 連携でリアルタイム反映。", arrow:"VIEW SKILLS" },
            { num:"+ 03 · BRIEF №01", href:"/vigil/brief/01", title:"Mobile AI", titleEm:"Harness",    sub:"月給 50 万円超の重役だけが使う AI 実行環境。ROI 試算と 6 ステップ・キッティング。", arrow:"READ BRIEF №01" },
            { num:"+ 04 · EVOLUTION", href:"/evolution",     title:"Evolution", titleEm:"Timeline",   sub:"Shoot Agent v2 の進化記録。毎晩 nightly_review が更新する歴史書。", arrow:"SEE TIMELINE" },
          ].map(c => (
            <Link key={c.num} href={c.href} style={{
              display:"block", background:"#FFFFFF", border:`1px solid ${W(0.1)}`, padding:32, textDecoration:"none", color:INK,
              transition:"background 0.2s",
            }} className="vigil-nav-card">
              <div style={{ fontFamily:SANS, fontSize:10, letterSpacing:"0.18em", color:ORANGE, marginBottom:24 }}>{c.num}</div>
              <div style={{ fontFamily:FRANK, fontSize:28, fontWeight:700, marginBottom:10, letterSpacing:"-0.01em" }}>{c.title} <em style={{ color:ORANGE, fontStyle:"italic" }}>{c.titleEm}</em></div>
              <div style={{ fontFamily:SANS, fontSize:12, color:W(0.55), lineHeight:1.8, marginBottom:24 }}>{c.sub}</div>
              <div style={{ fontFamily:SANS, fontSize:11, letterSpacing:"0.15em", color:W(0.4), display:"inline-flex", alignItems:"center", gap:6 }}>
                {c.arrow} <ArrowUpRight size={13}/>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding:"56px", background:INK, borderTop:`1px solid ${W(0.08)}`, color:"rgba(255,255,255,0.65)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:24, fontFamily:SANS, fontSize:11, letterSpacing:"0.1em" }}>
          <span>© 2026 株式会社 Lakkan · 山中秀斗</span>
          <span>VIGIL / NOW · LIVE EDITION</span>
          <Link href="/" style={{ color:ORANGE, textDecoration:"none" }}>← Home</Link>
        </div>
      </footer>
    </main>
  );
}

function SectionLabel({ num, text, tag }: { num:string; text:string; tag:string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:32 }}>
      <span style={{ width:40, height:1, background: ORANGE }}/>
      <span style={{ fontFamily:SANS, fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:INK }}>{num} · {text}</span>
      <span style={{ marginLeft:"auto", fontFamily:SANS, fontSize:9, letterSpacing:"0.12em", color:W(0.4), border:`1px solid ${W(0.15)}`, padding:"2px 8px" }}>{tag}</span>
    </div>
  );
}

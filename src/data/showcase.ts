// Showcase data — 商談で「AIで何ができるか」を見せるためのキュレーション
// 全URLを実測で稼働確認済み（404・空ページは除外）

export type ShowcaseCategory =
  | "recruit_lp"         // 採用LP
  | "hearing_card"       // ヒアリング・インタビュー
  | "onboarding"         // オンボーディング
  | "dashboard"          // 経営ダッシュボード
  | "plan_pl"            // 経営計画・PL
  | "job_portal"         // 求人ポータル
  | "scorecard"          // スコアカード・レポート
  | "ai_platform"        // AI プラットフォーム
  | "research"           // 調査・分析ツール
  | "corp_site"          // コーポレートサイト
  | "profile_card"       // 求職者カード
  | "internal_tool";     // 社内ツール

export const CATEGORY_META: Record<ShowcaseCategory, { label: string; desc: string }> = {
  recruit_lp:    { label: "採用LP",            desc: "応募導線・社員の声・FAQ" },
  hearing_card:  { label: "ヒアリング",        desc: "Kickoff前後の構造化資料" },
  onboarding:    { label: "オンボーディング",  desc: "新規クライアントの導入" },
  dashboard:     { label: "ダッシュボード",    desc: "KPI/進捗/経営指標可視化" },
  plan_pl:       { label: "経営計画・PL",      desc: "数値・資金繰り・ガント" },
  job_portal:    { label: "求人ポータル",      desc: "Indeed型・AIマッチング" },
  scorecard:     { label: "スコアカード",      desc: "案件評価・採点" },
  ai_platform:   { label: "AIプラットフォーム", desc: "AI学習・ハーネス基盤" },
  research:      { label: "調査・分析",        desc: "競合・市場・データ" },
  corp_site:     { label: "コーポレートサイト", desc: "会社情報・サービス紹介" },
  profile_card:  { label: "求職者カード",      desc: "ブルーカラー人材プロファイル" },
  internal_tool: { label: "社内ツール",        desc: "業務効率化・運用ハーネス" },
};

export type ShowcaseItem = {
  id: string;
  name: string;
  url: string;
  tagline: string;
  desc: string;
  category: ShowcaseCategory;
  featured?: boolean;
  metric?: string;
  gated?: boolean;    // クライアント認証ゲートあり（商談中に山中本人が通せばOK）
};

export type Company = {
  id: string;
  name: string;
  role: string;
  tagline: string;
  accent: string;
  items: ShowcaseItem[];
};

// ─── トレプロ ─────────────────────────────────────────
const TREPRO: ShowcaseItem[] = [
  // クライアントオンボーディング・ヒアリング
  { id: "otake-onboarding",   name: "大竹 オンボーディング",   url: "https://otake-onboarding.vercel.app",   tagline: "新規クライアント導入資料",            desc: "大竹グループ向けのオンボーディング。導入フロー全体図を1ページで提示。", category: "onboarding", featured: true },
  { id: "uemoto-onboarding",  name: "植本 オンボーディング",   url: "https://uemoto-onboarding.vercel.app",  tagline: "個別クライアント導入",                 desc: "植本氏向けオンボーディング資料。",                                       category: "onboarding" },
  { id: "nakachu-hearing",    name: "ナカチュー ヒアリング",   url: "https://nakachu-hearing.vercel.app",    tagline: "Kickoff後のヒアリング構造化",         desc: "Kickoff後のヒアリング内容を構造化資料に変換。",                          category: "hearing_card", featured: true },
  { id: "oono-hearing",       name: "大野興産 ヒアリング",     url: "https://oono-hearing.vercel.app",       tagline: "建設業向けヒアリング",                 desc: "建設業クライアント向け。採用課題と現状のヒアリング結果。",                category: "hearing_card" },
  { id: "senri-funky",        name: "千里 ブランディング検証", url: "https://senri-funky.vercel.app",        tagline: "千里グループ ブランディング案",       desc: "千里グループ向けブランディング検証案。",                                  category: "hearing_card" },
  { id: "senri-tanimitsu",    name: "千里 谷光プロフィール",   url: "https://senri-tanimitsu.vercel.app",    tagline: "個人プロファイル詳細版",              desc: "千里グループの谷光氏プロファイル。",                                       category: "profile_card" },
  // 経営ダッシュボード
  { id: "trepro-scorecard",   name: "トレプロ スコアカード",   url: "https://trepro-scorecard.vercel.app",   tagline: "商談・案件の100点採点",                desc: "案件のGo/NoGoを8観点100点で自動採点する社内ツール。",                    category: "scorecard", featured: true },
  { id: "harness-dashboard",  name: "Harness ダッシュボード", url: "https://harness-dashboard.vercel.app",  tagline: "全プロダクト施工管理",                 desc: "全プロダクトの進捗・コミット・差分を集約した施工管理画面。",              category: "dashboard" },
  // 経営計画
  { id: "ishikawa-pl",        name: "石川PL",                 url: "https://ishikawa-pl.vercel.app",         tagline: "PL・損益計算書ビジュアル",            desc: "石川グループのPLをビジュアル化。",                                         category: "plan_pl" },
  { id: "management-ledger",  name: "経営台帳",                url: "https://management-ledger.vercel.app",  tagline: "売上・契約・支出の統合台帳",          desc: "経営の全数値を1画面で。クライアント別契約状況も。",                       category: "plan_pl", featured: true },
  // 広告・サイト
  { id: "adhacker-site",      name: "Adhacker",                url: "https://adhacker-site.vercel.app",      tagline: "広告運用代理店サイト",                 desc: "Adhacker（広告運用代理店）のコーポレートサイト。",                       category: "corp_site" },
  { id: "gads-optimizer",     name: "Google Ads 最適化",      url: "https://gads-optimizer.vercel.app",     tagline: "広告運用最適化ダッシュボード",        desc: "Google Ads のキャンペーン最適化ツール。218KB・大型実装。",              category: "dashboard", featured: true },
  // 認証ありデモ系
  { id: "kanoa-jobs",         name: "KANOA Jobs（デモ）",      url: "https://picks-jobs.vercel.app",         tagline: "Indeed型 求人ポータル",                desc: "AIマッチング・全国求人130件・年収シミュレーター。商談中に認証通す。",   category: "job_portal", gated: true, metric: "130件求人 · 346ページ" },
  { id: "lunatech-corp",      name: "LunaTech Corp（プレ）",   url: "https://buddy-corp.vercel.app",         tagline: "LunaTech コーポレート",                desc: "6/16 ローンチ予定の LunaTech 公式サイト。商談中に認証通す。",             category: "corp_site", gated: true },
];

// ─── Lakkan ──────────────────────────────────────────
const LAKKAN: ShowcaseItem[] = [
  { id: "vigil",              name: "Vigil — 眠れない右腕",   url: "https://vigil-vert-gamma.vercel.app",   tagline: "AI成長記録 + スキルツリー",            desc: "山中の判断ロジックを内蔵したAIエージェントの進化記録・スキルカタログ・稼働状況。", category: "ai_platform", featured: true, metric: "31 スキル · 19 エージェント常駐" },
  { id: "ai-quest",           name: "AI Quest",                url: "https://ai-quest.vercel.app",           tagline: "AIリスキリング体感プロダクト",        desc: "AIを実感する体験型プロダクト。生成AIの可能性をゲーミフィケーションで提示。", category: "ai_platform" },
  { id: "lia-recruit",        name: "Lia 採用LP",              url: "https://lia-recruit.vercel.app",        tagline: "Lia株式会社 採用ランディング",        desc: "応募導線・社員の声・選考フロー。185KB・大型実装で完成度高い。",             category: "recruit_lp", featured: true },
  { id: "fukushima-recruit",  name: "福島工業 採用LP",         url: "https://fukushima-recruit.vercel.app",  tagline: "建設業 採用ランディング",              desc: "福島工業の採用LP。建設業特化の訴求設計。",                                category: "recruit_lp", featured: true },
  { id: "confy-recruit",      name: "Confy 採用LP",            url: "https://confy-recruit.vercel.app",      tagline: "Confy 採用ランディング",               desc: "Confy向け採用LP。",                                                        category: "recruit_lp" },
  { id: "brother-hearing",    name: "弟 ヒアリング",            url: "https://brother-hearing.vercel.app",    tagline: "弟向けAIハーネス要件定義",            desc: "広告代理店勤務の弟向け、AI自動化要件定義のヒアリングツール。",            category: "hearing_card" },
  { id: "sumihara-profile",   name: "住原プロフィール",         url: "https://sumihara-profile.vercel.app",   tagline: "求職者カード 実装サンプル",            desc: "求職者の経歴・志向性を可視化したプロファイルカード。",                    category: "profile_card", featured: true },
  { id: "resume-form",        name: "Resume Form",             url: "https://resume-form.vercel.app",        tagline: "履歴書・職務経歴書ジェネレータ",      desc: "ヒアリング内容から自動で履歴書・職務経歴書を生成。",                      category: "profile_card" },
  { id: "yamanaka-dashboard", name: "Lakkan Dashboard",        url: "https://yamanaka-dashboard.vercel.app", tagline: "コーポレート兼ポートフォリオ",        desc: "Lakkan法人サイト + 全プロダクト一覧（このサイト）。",                     category: "corp_site", featured: true },
  { id: "yamanaka-gantt",     name: "Gantt",                   url: "https://yamanaka-gantt.vercel.app",     tagline: "プロジェクトガント",                    desc: "全プロダクトのガントチャート。",                                           category: "plan_pl" },
];

// ─── LunaTech ────────────────────────────────────────
const LUNATECH: ShowcaseItem[] = [
  { id: "mikoto",             name: "みこと",                  url: "https://mikoto.vercel.app",             tagline: "2B AI ソリューション提案",            desc: "法人向けAIソリューション提案 + PCキッティングまで対応。",                 category: "ai_platform", featured: true },
  { id: "solaris",            name: "Solaris",                 url: "https://solaris.vercel.app",            tagline: "チャットツール",                        desc: "LunaTech社内のチャット基盤。",                                             category: "internal_tool" },
];

// ─── KANOA ───────────────────────────────────────────
const KANOA: ShowcaseItem[] = [
  { id: "kanoa-lp-generator", name: "KANOA LP Generator",      url: "https://kanoa-lp-generator.vercel.app", tagline: "採用LP自動生成エンジン",              desc: "クライアント情報を入れるだけで採用LPを自動生成。",                        category: "ai_platform", featured: true },
];

// ─── SKYLINK ─────────────────────────────────────────
const SKYLINK: ShowcaseItem[] = [
  { id: "kanoa-ai-platform",  name: "engine. by KANOA",        url: "https://kanoa-ai-platform.vercel.app",  tagline: "エージェント向け求人シェアPF",         desc: "AIマッチング・CRM・KPIダッシュボード・候補者管理を統合。",                category: "ai_platform", featured: true },
];

// ─── Solve ───────────────────────────────────────────
const SOLVE: ShowcaseItem[] = [
  { id: "solve-homepage",     name: "Solve コーポレート",       url: "https://solve-homepage.vercel.app",     tagline: "Solve 法人サイト",                     desc: "Solveのコーポレートサイト。",                                              category: "corp_site", featured: true },
];

export const COMPANIES: Company[] = [
  { id: "lakkan",   name: "楽観 (Lakkan)",        role: "代表",        tagline: "AIリスキリング・人材・売上管理", accent: "#06B6D4", items: LAKKAN },
  { id: "trepro",   name: "トレプロ (TrePro)",    role: "COO",        tagline: "TikTok 採用 → PR → 経営/数値", accent: "#F10903", items: TREPRO },
  { id: "lunatech", name: "LunaTech",             role: "COO",        tagline: "AI 5 本立て（6/16 ローンチ）", accent: "#1E3A8A", items: LUNATECH },
  { id: "kanoa",    name: "KANOA",                role: "外部相談役", tagline: "Indeed型求人 + LP生成",       accent: "#B45309", items: KANOA },
  { id: "skylink",  name: "SKYLINK",              role: "CTO",        tagline: "エンジン提供",                  accent: "#5B21B6", items: SKYLINK },
  { id: "solve",    name: "Solve",                role: "法人器",      tagline: "競合調査・実運用",              accent: "#374151", items: SOLVE },
];

export const TOTAL_ITEMS = COMPANIES.reduce((sum, c) => sum + c.items.length, 0);
export const ACTIVE_ITEMS = COMPANIES.reduce((sum, c) => sum + c.items.filter(i => !i.gated).length, 0);
export const FEATURED_ITEMS = COMPANIES.flatMap(c => c.items.filter(i => i.featured).map(i => ({ ...i, company: c.name, accent: c.accent })));

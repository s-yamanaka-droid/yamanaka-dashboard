# AI Product Audit Report — Yamanaka Dashboard / 株式会社Lakkan
> 診断日: 2026-04-25 | URL: https://yamanaka-dashboard.vercel.app
> Powered by Site Audit v1.0 | 文脈: 個人ポートフォリオ → ブランドサイト（株式会社Lakkan）への大幅リデザイン後

---

## 総合スコア: 66 / 100 — グレード C

| カテゴリ | スコア | 判定 | 前回比 |
|---|---|---|---|
| A. セキュリティ | 42/100 | ❌ | ±0 |
| B. 機能完成度 | 78/100 | ⚠️ | +6 |
| C. 法的コンプライアンス | 55/100 | ⚠️ | +25 |
| D. マネタイズ | N/A | — | （個人ポートフォリオ→ブランドサイトのため除外） |
| E. SEO | 48/100 | ❌ | +3 |
| F. UX/UIデザイン | 92/100 | ✅ | +10 |
| G. パフォーマンス | 50/100 | ⚠️ | -5 |
| H. コード品質 | 58/100 | ⚠️ | ±0 |

※ Dを除外して7カテゴリ平均で算出

---

## ページ別評価

### / (Home) — 大幅リデザイン
- 新ブランド「株式会社Lakkan」へ完全リブランディング。Hero / Story / Works / Service / Vigil(AI Brain) / About / Timeline / JOIN / Portals / Footer の構成
- title: `楽観と、計画と。| 株式会社Lakkan` ✅ description あり ✅
- フッターに **会社住所**（東京都渋谷区神宮前6-23-4）と連絡先（s-yamanaka@tre-pro.co.jp）と **© 2026 Lakkan Inc.** 著作権表示が追加 → C カテゴリ大幅改善
- JOIN セクションで採用CTA（mailto）追加 → マネタイズ/CTA動線が前回より強化
- ⚠️ `/photo.jpg` が `<link rel="preload">` されているが `public/` に存在しない → 404発生の可能性
- ⚠️ ファイル長 1,214行のモノリシック構成（前回より +900行）

### /lab
- title 継承（layout.tsx のグローバル設定のみ、ページ固有メタなし）
- Supabase activity_log 読み取り。try/catch あり
- `SB_KEY` 直書き継続（前回から未改善）

### /blog
- WordPress 連携。`NEXT_PUBLIC_WP_URL` 未設定時の graceful fallback あり
- ページ固有メタなし

### /evolution
- recharts によるグラフ表示。brain_stats 90日分
- ページ固有メタなし

### /skills
- Supabase brain_stats 直近1件 + 静的スキル一覧
- ページ固有メタなし

### 共通の課題
- `/robots.txt` `/sitemap.xml` ともに 404（前回から未対応）
- 全ページで OGP / Twitter Card / canonical / JSON-LD 未設定
- セキュリティヘッダー（CSP / X-Frame-Options 等）未設定

---

## 詳細診断

### A. セキュリティ — 42/100 ❌

| 項目 | 状態 | 詳細 |
|---|---|---|
| HTTPS / HSTS | ✅ | max-age=63072000; includeSubDomains; preload |
| X-Content-Type-Options | ❌ | 未設定（前回から変化なし） |
| X-Frame-Options | ❌ | 未設定 |
| CSP | ❌ | 未設定 |
| Referrer-Policy | ❌ | 未設定 |
| Permissions-Policy | ❌ | 未設定 |
| Supabase Key 露出 | ❌ | `sb_publishable_1iJsNvSPfMTQKVC1HtMMng__lkvOq8c` が lab/evolution/skills の3ファイルに継続ハードコード |
| npm audit | ❌→⚠️ | **moderate 2件（postcss 経由 next）が新規発生**（前回0件） |
| CORS | ⚠️ | `access-control-allow-origin: *` |
| robots.txt | ❌ | 404 |

`next.config.ts` は空のまま。前回指摘事項のセキュリティヘッダー対応は未着手。

### B. 機能完成度 — 78/100 ⚠️

| 項目 | 状態 | 詳細 |
|---|---|---|
| Home 全セクション描画 | ✅ | Hero / Works / Service / Vigil / About / Timeline / JOIN / Portals / Footer 全て200で配信 |
| About + 写真 | ⚠️ | `<link rel="preload" as="image" href="/photo.jpg">` が出力されているが public/ に photo.jpg なし → 画像読込 404 |
| JOIN セクション | ✅ | mailto CTA + 採用条件4項目で完成 |
| Timeline | ✅ | 2026.03 株式会社Lakkan始動 等の年表 |
| /lab Supabase 連携 | ✅ | activity_log 取得 |
| /evolution グラフ | ✅ | brain_stats 90日 |
| /skills | ✅ | 統計 + スキル一覧 |
| /blog | ⚠️ | WP_URL 未設定で空表示（前回から変化なし） |
| ⌘K サーチ | ✅ | CommandSearch 実装 |

新規追加コンテンツ（About / Timeline / JOIN）の動作良好。photo.jpg 不在は致命的ではないが要修正。

### C. 法的コンプライアンス — 55/100 ⚠️ （+25 改善）

| 項目 | 状態 | 詳細 |
|---|---|---|
| 著作権表示 | ✅ | `© 2026 Lakkan Inc.` フッターに明記 |
| 会社情報 | ✅ | 株式会社Lakkan / 東京都渋谷区神宮前6-23-4 / 連絡先 mail |
| コンタクト導線 | ✅ | JOIN セクション + フッターに mailto |
| プライバシーポリシー | ❌ | 未掲載 |
| 利用規約 | ❌ | 未掲載 |
| Cookie同意 | ❌ | バナーなし |
| APPI 表記 | ❌ | データ収集ポリシー未明示 |
| 特商法 | N/A | 課金なし |

ブランドサイト化に伴い社名・住所・連絡先・著作権が整い、最低限の体裁は満たした。採用ページ（JOIN）公開に伴い、応募者個人情報の取扱方針の明示が今後必須。

### D. マネタイズ — N/A

個人ポートフォリオ（前回70/100）から株式会社Lakkanブランドサイトへ転換。受注獲得というよりも「採用 / バイブコーディング / AI活用」のブランド訴求が中心。マネタイズ評価軸は本サイト性質と乖離するため除外。なお採用CTA（mailto）と Service 4項目（バイブコーディング / 採用コンサル / DR支援 等）は明確に設計されている。

### E. SEO — 48/100 ❌ （+3）

| 項目 | 状態 | 詳細 |
|---|---|---|
| meta title | ✅ | `楽観と、計画と。| 株式会社Lakkan` |
| meta description | ✅ | 詳細記述あり |
| OGP（og:*） | ❌ | 全ページ未設定 |
| Twitter Card | ❌ | 未設定 |
| sitemap.xml | ❌ | 404 |
| robots.txt | ❌ | 404 |
| 構造化データ JSON-LD | ❌ | Organization スキーマ等未実装（社名/住所揃っているのに勿体ない） |
| canonical | ❌ | 未設定 |
| ページ固有メタ | ❌ | layout.tsx のみ。lab/blog/evolution/skills 全て同じ title |
| lang 属性 | ✅ | `lang="ja"` |

社名・住所が整ったので **Organization JSON-LD** を入れれば一気に強くなる場面。前回からの改善は description の刷新のみ。

### F. UX/UIデザイン — 92/100 ✅ （+10）

| 項目 | 状態 | 詳細 |
|---|---|---|
| 視覚的一貫性 | ✅ | Frank Ruhl Libre × Space Grotesk 統一、ベージュ #F7F4EE × ブラック #0D0D0D |
| ヒーローのインパクト | ✅ | TypewriterCycle / SplitText / HeroCanvas で強い印象 |
| ページ間ナビ | ✅ | ヘッダーに Story / Works / Service / Vigil / About + Contact CTA を新設（前回⚠️→改善） |
| アクセント色運用 | ✅ | #F4541A / #1C3BCC / #0E1F5E をブロック単位で大胆に使い分け |
| Marquee / Portals | ✅ | 流れる帯 + 暗紺ポータルセクションが視覚リズムを作る |
| アニメーション | ✅ | Framer Motion で whileInView を多用、引き締まった演出 |
| レスポンシブ | ⚠️ | clamp() で文字サイズは可変だが grid 2列固定箇所あり（JOIN等）→ モバイルで要検証 |
| 写真不在 | ⚠️ | About セクションで `/photo.jpg` が読み込めず空枠の可能性 |
| アクセシビリティ | ⚠️ | aria-label 不足、装飾用 div への role 不在 |

ブランドサイトとして大幅にエディトリアル品質が向上。ヘッダーナビと採用CTAの追加は前回課題に対する明確な前進。

### G. パフォーマンス — 50/100 ⚠️ （-5）

| 項目 | 状態 | 詳細 |
|---|---|---|
| .next ビルドサイズ | ❌ | **293MB**（前回292MB → 微増） |
| Home HTML サイズ | ⚠️ | **310KB**（前回未計測、巨大）— 1,214行のクライアントコンポーネントを RSC ペイロードに乗せた結果 |
| /skills | ⚠️ | 35KB |
| /evolution | ⚠️ | 18KB |
| /lab | ✅ | 15KB |
| /blog | ✅ | 15KB |
| Vercel CDN | ✅ | x-vercel-cache: HIT / PRERENDER |
| ISR | ✅ | stale-time=300 |
| three.js / framer-motion / recharts | ⚠️ | 3大ライブラリすべて使用。bundle-analyzer 未導入 |
| `"use client"` | ❌ | Home が "use client" で巨大化、SSG 恩恵を受けにくい |
| 画像最適化 | ⚠️ | next/image 不使用、photo.jpg は素の `<img>`（しかも欠損） |

Home の HTML 出力が 310KB は重い。リファクタの余地大。

### H. コード品質 — 58/100 ⚠️

| 項目 | 状態 | 詳細 |
|---|---|---|
| TypeScript strict | ✅ | 有効 |
| any 使用 | ✅ | 0件 |
| try/catch | ⚠️ | API呼び出し箇所に限定（lab / blog / evolution） |
| テスト | ❌ | 0件 |
| DRY | ❌ | `SB_URL` / `SB_KEY` / `FRANK` / `SANS` が依然3〜4ファイルに重複。`SplitText` `CountUp` `TypewriterCycle` も Home に再定義 |
| README | ❌ | create-next-app デフォルトのまま |
| ESLint | ✅ | next/core-web-vitals 設定 |
| Prettier | ❌ | 未設定 |
| ファイル肥大 | ❌ | Home 1,214行 — コンポーネント分割推奨 |
| git commit | ⚠️ | 12コミット（前回と同じ）— 大規模リデザインを 1 commit (`67051e8`) で投入 |

前回指摘の DRY 違反 / 共通コンポーネント分離は未着手。新ブランドサイト構築でモノリシック化が進行している。

---

## 優先改善アクション TOP 10

| 優先 | カテゴリ | 項目 | 影響 | 工数 |
|---|---|---|---|---|
| 1 | A | `SB_KEY` を `NEXT_PUBLIC_SUPABASE_ANON_KEY` 環境変数化（3ファイル） | 高 | 30分 |
| 2 | A | `next.config.ts` に CSP / X-Frame-Options / Referrer-Policy 等 6種ヘッダー追加 | 高 | 1h |
| 3 | A | `npm audit fix`（postcss / next moderate 2件） | 中 | 15分 |
| 4 | B | `public/photo.jpg` を配置、または About の preload を削除 | 中 | 10分 |
| 5 | E | `app/sitemap.ts` `app/robots.ts` を Next.js 規約で実装 | 高 | 30分 |
| 6 | E | `layout.tsx` に OGP / Twitter Card + 各ページ `generateMetadata` で個別メタ | 高 | 1h |
| 7 | E | Organization スキーマ JSON-LD（社名・住所・URL・logo）を Home に埋め込み | 中 | 30分 |
| 8 | C | `/privacy` プライバシーポリシーページ追加（採用応募者向け APPI 配慮） | 高 | 1h |
| 9 | G | Home 1,214行を `Hero/Works/About/Join/Portals` 等に分割し、Server Component 化できる箇所を分離 | 中 | 3h |
| 10 | H | `lib/supabase.ts` と `lib/fonts.ts` を作り SB_*/FRANK/SANS を集約。共通アニメコンポーネントを `components/` に切り出し | 中 | 2h |

**最短で +10点 ルート（合計2時間）:** ① + ② + ③ + ⑤ + ⑦ で セキュリティ +15点, SEO +12点 → 総合 76点 (グレードB) 到達見込み。

---

## 前回（2026-04-23, 59/D）比較

| カテゴリ | 前回 | 今回 | 差分 | 主因 |
|---|---|---|---|---|
| A. セキュリティ | 42 | 42 | ±0 | 未着手。npm audit が 0→2件に悪化したが、ヘッダー欠落が支配的なため点数据え置き |
| B. 機能完成度 | 72 | 78 | +6 | About / Timeline / JOIN セクション追加、ページ間ナビ実装 |
| C. 法的コンプラ | 30 | 55 | +25 | 著作権 / 会社住所 / 連絡先がフッターに明示。法人化に伴うブランドサイトとして体裁向上 |
| D. マネタイズ | 70 | N/A | — | サイト性質変化（採用＋ブランド）で評価軸除外 |
| E. SEO | 45 | 48 | +3 | description 強化のみ。OGP / sitemap / robots は未対応 |
| F. UX/UI | 82 | 92 | +10 | エディトリアル品質向上、ヘッダーナビ実装、採用CTAで動線完成 |
| G. パフォーマンス | 55 | 50 | -5 | Home が 310KB / 1,214行に肥大、photo.jpg 欠損、ビルドサイズ微増 |
| H. コード品質 | 58 | 58 | ±0 | DRY違反継続、Home モノリシック化で構造的負債が増加 |

**総合: 59 (D) → 66 (C) ／ +7 ポイント**
ブランド再定義によるUI/コンプラ大幅改善が牽引。一方で技術的負債（セキュリティヘッダー / SEO配信ファイル / DRY違反）は前回指摘から手付かずで、改善の伸びしろがそのまま残っている。

---

*生成: 2026-04-25 | Agent: Claude Opus 4.7 | Skill: site-audit v1.0*

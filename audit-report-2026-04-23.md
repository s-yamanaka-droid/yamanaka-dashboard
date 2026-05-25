# AI Product Audit Report — Yamanaka Allen Dashboard
> 診断日: 2026-04-23 | URL: https://yamanaka-dashboard.vercel.app
> Powered by Site Audit v1.0 | 文脈: ポートフォリオ / 個人ダッシュボード

---

## 総合スコア: 59 / 100 — グレード D

| カテゴリ | スコア | 判定 |
|---|---|---|
| A. セキュリティ | 42/100 | ❌ |
| B. 機能完成度 | 72/100 | ⚠️ |
| C. 法的コンプライアンス | 30/100 | ❌ |
| D. マネタイズ | 70/100 | ⚠️ |
| E. SEO | 45/100 | ❌ |
| F. UX/UIデザイン | 82/100 | ✅ |
| G. パフォーマンス | 55/100 | ⚠️ |
| H. コード品質 | 58/100 | ⚠️ |

---

## 詳細診断

### A. セキュリティ — 42/100 ❌

**調査結果:**

| チェック項目 | 状態 | 詳細 |
|---|---|---|
| HTTPS/TLS強制 | ✅ | HSTS max-age=63072000; includeSubDomains; preload |
| X-Content-Type-Options | ❌ | ヘッダー未設定 |
| X-Frame-Options | ❌ | ヘッダー未設定 |
| X-XSS-Protection | ❌ | ヘッダー未設定 |
| Content-Security-Policy | ❌ | ヘッダー未設定 |
| Referrer-Policy | ❌ | ヘッダー未設定 |
| Permissions-Policy | ❌ | ヘッダー未設定 |
| APIキー漏洩 | ❌ | **Supabase publishable key が3ファイルにハードコード** |
| npm audit | ✅ | 0 vulnerabilities（クリーン） |
| CORS | ⚠️ | `access-control-allow-origin: *`（全オリジン許可） |
| 環境変数管理 | ❌ | `.env.local` 未使用、直接ソースに埋め込み |
| robots.txt | ❌ | ファイル未存在（404扱い） |

**重大問題:**
```
src/app/skills/page.tsx:11  → SB_KEY = "sb_publishable_1iJsNvSPfMTQKVC1HtMMng__lkvOq8c"
src/app/evolution/page.tsx:9 → SB_KEY = "sb_publishable_1iJsNvSPfMTQKVC1HtMMng__lkvOq8c"
src/app/lab/page.tsx:9       → SB_KEY = "sb_publishable_1iJsNvSPfMTQKVC1HtMMng__lkvOq8c"
```

Supabase の `sb_publishable_*` キーは anon key 相当でRLSが正しく設定されていれば低リスクだが、GitHub 公開リポジトリに push された場合は機密情報として扱われる。また next.config.ts に一切のセキュリティヘッダー設定が存在しない。

---

### B. 機能完成度 — 72/100 ⚠️

**調査結果:**

| チェック項目 | 状態 | 詳細 |
|---|---|---|
| コア機能（プロジェクト一覧表示） | ✅ | JSON データドリブン、フィルタ/ソート/ビュー切替あり |
| フィルタリング（カテゴリ別） | ✅ | 7カテゴリ対応 |
| ソート機能 | ✅ | updatedAt / createdAt / name |
| ビュー切替（list/timeline/cards） | ✅ | 3モード実装 |
| プロジェクトモーダル | ✅ | 詳細モーダル実装 |
| コマンドサーチ（⌘K） | ✅ | CommandSearch コンポーネントあり |
| Blog ページ（WordPress連携） | ⚠️ | WP_URL 未設定時は空表示（graceful fallback あり） |
| Skills ページ（Supabase連携） | ⚠️ | DB接続あるが fetchStats のみ読み取り |
| Evolution ページ（Supabase連携） | ⚠️ | brain_stats 読み取り実装済み |
| Lab ページ（GitHub + Supabase） | ⚠️ | API call あり、エラーハンドリングは try/catch で対処 |
| フォームバリデーション | ❌ | CRUD操作なし、書き込みフォームなし |
| ローディング状態 | ✅ | loading state あり |
| 404 ハンドリング | ✅ | Next.js デフォルト404ページ |
| DB接続（モック vs 実データ） | ✅ | Supabase 実データ接続 |

ポートフォリオとして見た場合、リード・オンリーの特性上CRUD不要だが、WordPress連携が機能しておらずBlogが空表示になっている点は要対処。

---

### C. 法的コンプライアンス — 30/100 ❌

**調査結果:**

| チェック項目 | 状態 | 詳細 |
|---|---|---|
| 利用規約 | ❌ | ページなし |
| プライバシーポリシー | ❌ | ページなし |
| 特定商取引法表記 | N/A | 課金機能なし |
| Cookie同意バナー | ❌ | なし（分析ツール使用状況不明） |
| 著作権表示 | ❌ | フッターなし、© 表示なし |
| コンタクト先 | ⚠️ | SNSリンクは存在するが公式連絡先フォームなし |
| 個人情報保護法（APPI）準拠 | ❌ | データ収集ポリシー不明示 |

個人ポートフォリオとして最低限の著作権表示と連絡先が必要。第三者（クライアント）への提示を想定するなら Privacy Policy は必須。

---

### D. マネタイズ — 70/100 ⚠️

**調査結果:**

| チェック項目 | 状態 | 詳細 |
|---|---|---|
| 収益モデルの明確さ | ✅ | ポートフォリオ→案件受注 モデルとして明確 |
| CTA配置 | ✅ | 各プロジェクトに ArrowUpRight リンクあり |
| 実績・成果物の可視化 | ✅ | プロジェクト数・live数・Claude Code製の統計表示 |
| 問い合わせ導線 | ⚠️ | 明示的なコンタクトCTAボタンなし |
| SNSリンク（X等） | 未確認 | フッター/ヘッダーに外部リンク可能性あり |
| 価格表示 | N/A | ポートフォリオのため不要 |
| 決済統合 | N/A | 不要 |

個人ダッシュボードとしてのマネタイズは「受注獲得」が主目的。プロジェクト一覧とスキルの訴求は十分。問い合わせCTAが不明確な点がマイナス。

---

### E. SEO — 45/100 ❌

**調査結果:**

| チェック項目 | 状態 | 詳細 |
|---|---|---|
| meta title | ✅ | `Yamanaka Allen — Product Builder` |
| meta description | ✅ | `Products & tools built by Yamanaka Allen / Trepro CEO` |
| OGP（og:title等） | ❌ | og: メタタグ未設定 |
| Twitter Card | ❌ | twitter: メタタグ未設定 |
| sitemap.xml | ❌ | 404 / ファイル未存在 |
| robots.txt | ❌ | 404 / ファイル未存在 |
| 構造化データ（JSON-LD） | ❌ | schema.org 未実装 |
| canonical URL | ❌ | 未設定 |
| 各ページ固有のメタ | ⚠️ | layout.tsx のみ、サブページ個別設定なし |
| h1 タグ | ⚠️ | ページ構造上存在するが確認要 |
| alt属性 | ⚠️ | 画像が少ないため影響限定的 |
| lang属性 | ✅ | `lang="ja"` 設定済み |

SNS シェア時にプレビューが表示されない（OGP未設定）。`sitemap.xml` / `robots.txt` の不在はGoogleクロールに影響。

---

### F. UX/UIデザイン — 82/100 ✅

**調査結果:**

| チェック項目 | 状態 | 詳細 |
|---|---|---|
| 視覚的一貫性 | ✅ | Frank Ruhl Libre × Space Grotesk × Geist Mono の統一したタイポグラフィシステム |
| カラーパレット | ✅ | #F7F4EE ベージュ地 × #0D0D0D テキスト、ライトテーマ一貫 |
| レスポンシブ | ✅ | Tailwind CSS 使用、sm: ブレークポイント対応 |
| アニメーション | ✅ | Framer Motion による SplitText / CountUp / TypewriterCycle |
| カーソルエフェクト | ✅ | CursorFollower 実装（デスクトップ向けポリッシュ） |
| スクロールプログレスバー | ✅ | ScrollProgressBar 実装 |
| ナビゲーション | ⚠️ | ページ間ナビゲーションが不明確（ヘッダーにページリンクなし） |
| CTA視認性 | ⚠️ | プロジェクトカードのリンクはあるが問い合わせCTAなし |
| アクセシビリティ | ⚠️ | aria-label / role の設定が不明 |
| ダーク/ライト | ✅ | ライトテーマ固定（設計意図通り） |
| ローディングスケルトン | ⚠️ | loading state はあるが skeleton UI なし |
| エラー状態のUI | ⚠️ | エラー時のフォールバックUIが最小限 |

全体的にエディトリアル品質の高いUIデザイン。ポートフォリオとして競合優位性は高い。ページ間のナビゲーション強化が課題。

---

### G. パフォーマンス — 55/100 ⚠️

**調査結果:**

| チェック項目 | 状態 | 詳細 |
|---|---|---|
| .next/ ビルドサイズ | ⚠️ | **292MB** — 過大（通常は50MB以下が目安） |
| バンドル最適化 | ⚠️ | Turbopack 使用（高速ビルド）だが出力サイズ要精査 |
| 画像最適化 | ⚠️ | next/image 使用不明、public/には SVG のみ |
| コード分割 | ✅ | Next.js デフォルトのルートベースコード分割 |
| CDN | ✅ | Vercel Edge Network（x-vercel-cache: HIT確認） |
| キャッシュ戦略 | ✅ | `cache-control: public, max-age=0, must-revalidate` |
| ISR | ⚠️ | `x-nextjs-stale-time: 300`（5分）設定あり |
| Three.js | ⚠️ | HeroCanvas で three.js を使用（バンドルサイズに影響大） |
| framer-motion | ⚠️ | 全ページで heavy animation library をインポート |
| recharts | ⚠️ | Evolution ページで使用（グラフ用） |
| SSR/SSG戦略 | ⚠️ | 全ページ "use client" → SSG の恩恵を受けられていない |

`292MB` の `.next/` サイズは異常に大きい。Three.js + Framer Motion + recharts の組み合わせによるバンドル肥大が主因と考えられる。`"use client"` の多用により Server Components の最適化が活かされていない。

---

### H. コード品質 — 58/100 ⚠️

**調査結果:**

| チェック項目 | 状態 | 詳細 |
|---|---|---|
| TypeScript strict mode | ✅ | `"strict": true` 設定済み |
| TypeScript any 使用率 | ✅ | `: any` 0件（21ファイル中） |
| try/catch カバレッジ | ⚠️ | src/ 全体で3件（lab/2件、blog/1件） API呼び出し箇所のみ |
| テスト | ❌ | テストファイル 0件 |
| DRY原則 | ❌ | `SB_URL` / `SB_KEY` / `FRANK` / `SANS` 定数が3〜4ファイルに重複 |
| git commit 数 | ⚠️ | 12コミット（初期段階） |
| README | ⚠️ | create-next-app デフォルト README のみ |
| リント | ✅ | ESLint (next/core-web-vitals + next/typescript) 設定済み |
| フォーマッタ | ⚠️ | Prettier 設定なし |
| ファイル構造 | ✅ | app / components / data / lib / types の明確な分離 |
| コンポーネント再利用 | ⚠️ | `CountUp`, `HR`, `SplitText` が複数ページで重複実装 |

`SB_URL`・`SB_KEY` が3ファイルに重複、共通コンポーネント（CountUp等）が各ページにコピーペーストされているDRY違反が顕著。テスト0件は個人プロジェクトとして許容範囲だが、今後の保守性に影響。

---

## 優先改善アクション TOP 10

| 優先度 | カテゴリ | 項目 | 影響度 | 工数 |
|---|---|---|---|---|
| 1 | A セキュリティ | `SB_KEY` を `NEXT_PUBLIC_SUPABASE_ANON_KEY` 環境変数に移行し、ソースから削除 | 高 | 30分 |
| 2 | A セキュリティ | `next.config.ts` にセキュリティヘッダー7種を追加（X-Frame-Options等） | 高 | 1時間 |
| 3 | E SEO | `public/` に `sitemap.xml` と `robots.txt` を追加 | 高 | 30分 |
| 4 | E SEO | layout.tsx に OGP / Twitter Card メタタグを追加 | 中 | 30分 |
| 5 | H コード品質 | `SB_URL`・`SB_KEY`・フォントCSS変数を `lib/config.ts` に集約（DRY） | 中 | 1時間 |
| 6 | H コード品質 | 共通コンポーネント（`CountUp`, `HR`, `SplitText`）を `components/` に分離 | 中 | 1時間 |
| 7 | G パフォーマンス | `.next/` サイズ292MB の調査と最適化（`@next/bundle-analyzer` 導入） | 中 | 2時間 |
| 8 | G パフォーマンス | データフェッチが不要なページの `"use client"` を削除してSSR/SSG活用 | 中 | 2時間 |
| 9 | C コンプライアンス | フッターに著作権表示（© 2026 Yamanaka Shuto）とコンタクト先を追加 | 低 | 30分 |
| 10 | B 機能完成度 | `NEXT_PUBLIC_WP_URL` を設定してBlogページを機能させる（または代替コンテンツ） | 低 | 1時間 |

---

## スコアサマリー

```
A. セキュリティ     : 42/100 ❌  ← SB_KEY露出・ヘッダー6種不在
B. 機能完成度       : 72/100 ⚠️  ← コア機能OK・Blog空表示
C. 法的コンプライアンス: 30/100 ❌  ← 著作権・PP・規約不在
D. マネタイズ       : 70/100 ⚠️  ← 受注導線OK・CTA弱め
E. SEO             : 45/100 ❌  ← OGP/sitemap/robots未整備
F. UX/UIデザイン    : 82/100 ✅  ← エディトリアル品質・アニメ充実
G. パフォーマンス    : 55/100 ⚠️  ← .next 292MB・Client Components多用
H. コード品質       : 58/100 ⚠️  ← DRY違反・テスト0件・strict OK
────────────────────────────────
総合スコア          : 59/100 — グレード D
```

**最短改善パス（2時間以内で+15点可能）:**
1. 環境変数移行（A: +10点）
2. セキュリティヘッダー追加（A: +8点）
3. sitemap.xml + robots.txt 追加（E: +8点）
4. OGP追加（E: +5点）

上記4点のみで **推定 74点（グレードB）** 到達が見込まれる。

---

*生成: 2026-04-23 | Agent: Claude Sonnet 4.6 | Skill: site-audit v1.0*

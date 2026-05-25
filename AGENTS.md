<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Lakkan エージェント運用憲法

> **強制ルール**。サイト編集タスクを開始する前に必ず読むこと。

## 起動シーケンス（毎回これを順守）

1. **`FACTS.md` を読む** — 事実・経歴・色・タイポ・数字の単一情報源
2. **このファイルを読む** — 守ること・禁止事項
3. **対象 `.tsx` を読む** — 既存コードの構造を把握
4. **`src/components/primitives/SectionShell.tsx` を読む** — 規格コンポーネント
5. 実装
6. `npx tsc --noEmit` でエラーなし確認
7. `git diff` で**捏造を含まないか自己レビュー**

## 絶対禁止事項

### 事実改変
- ❌ `FACTS.md` に書かれていない経歴・年・社名・数字を出力する
- ❌ 「親会社」「スピンアウト」「学生起業」「2014年」などの存在しない関係性
- ❌ 「`xx` を内製」「`xx` 件達成」のような未検証メトリクス
- ❌ 創作的マイルストーン（「2025 AIネイティブへ全振り」等）

### デザイン違反
- ❌ 黒背景（`#000` / `#0D0D0D` を section background に使う）
- ❌ ダークテーマのページ全体
- ❌ `FACTS.md §4` に登録されてない色
- ❌ Frank Ruhl Libre / Instrument Serif / Space Grotesk 以外のフォント
- ❌ emoji（🔥 🎉 ✨ 等）

### 構造違反
- ❌ `<section>` を直接書く（`SectionShell` を使う）
- ❌ マジックナンバー（`padding: 96px` など）
- ❌ inline color hex（`color: "#1C3BCC"` 直書き → `ACCENT.blue` を使う）

## 推奨パターン

```tsx
import { SectionShell, BigHeadline, Em, Lede } from "@/components/primitives/SectionShell";
import { ACCENT } from "@/lib/design-tokens";

export function MyNewSection() {
  return (
    <SectionShell id="my-section" tone="cream" eyebrow="Section Name" eyebrowVersion="0.1" accent="vermillion">
      <BigHeadline>
        Hook<Em accent="vermillion">.</Em>
      </BigHeadline>
      <Lede>序文をここに。</Lede>
    </SectionShell>
  );
}
```

## 自己検証チェックリスト（提出前に必ず）

- [ ] `FACTS.md` を読んだ
- [ ] 出力に `FACTS.md` 外の事実を含まない
- [ ] 黒背景セクションを追加していない
- [ ] 新規フォント・新規アクセント色を追加していない
- [ ] `SectionShell` / `BigHeadline` / `Em` / `Lede` を活用した
- [ ] `npx tsc --noEmit` がクリーン
- [ ] `git diff` で全変更が依頼に直結していると説明できる

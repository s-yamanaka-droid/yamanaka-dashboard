# Lakkan ロゴの共通仕様

通常は英字A3 `lakkan`、会社紹介・コンセプトでは縦組みの「楽観」落款付き。
常設ナビやフッターには楽観を付けない。Raccoの表現は独立して維持する。

- 素材と移植手順：[Lakkan A3 logo kit](../public/brand/lakkan-logo/README.md)
- 共通部品：`src/components/brand/LakkanLogo.tsx`
- 表示規則：`src/components/brand/LakkanLogo.module.css`
- 回帰テスト：`npm run test:brand`

この統合はロゴに限定する。既存の見出し、ポスター表現、3D、キャラクター、営業文面を一括リデザインしない。
通常表示と会社紹介を分けるテスト、透過画像の実寸検査を既存のブランドテストに追加している。

PNGの改版時は表示窓の座標を検証する。Web画像の採用を、商標調査済み・印刷入稿済み・本番公開済みとは扱わない。

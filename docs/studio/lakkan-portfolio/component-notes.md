# Component Notes

Lakkanの公開ポートフォリオを、実画面・制作区分・人の判断が一続きで伝わる構成にした。参考サイトの固有表現は複製せず、構造上の強みだけを抽出している。

| Component ID | Role | Reference | Tokens | PC / Mobile | States | Revision |
|---|---|---|---|---|---|---|
| `portfolio-hero` | 価値宣言と代表3作品を第一画面で提示 | Snøhettaの編集的導入、NOT A HOTELの明快な導線 | paper / ink / blue、12-column、実画面3枚 | PCは左右分割＋重なり、Mobileは縦積み＋下部コラージュ | hover、focus-visible、reduced-motion | v1 実画面を主役にし、抽象的なAI装飾を廃止 |
| `proof-strip` | Client / Owned / AI Conceptを混同せず件数表示 | 独自 | 1px rule、Instrument Serif numerals | PCは4列、Mobileは宣言＋2列 | static | v1 公開8件のみ集計 |
| `featured-proof` | 最重要3作品を非対称に強調 | Snøhettaの作品グリッド | forest overlay、7/5 mosaic | PCは大型1＋小型2、Mobileは1列 | hover image scale、button focus | v1 3案件の役割が重ならない選定 |
| `work-filter` | 公開作品を制作区分で絞り込み | 独自 | sticky bar、mono label、38px controls | PCは横1列、Mobileは2×2 | selected / unselected / keyboard focus | v2 MobileのAI Concept見切れを2×2化して解消 |
| `work-card` | 実画面・制作区分・説明・技術タグを一覧化 | Snøhettaの作品中心カード | 16:9.7 image、paper、1px grid | PCは2列、Mobileは1列 | hover、filtered、focus-visible | v1 公開URLを持つ作品だけ表示 |
| `work-dialog` | 同一画面内で制作内容を深掘りし公開サイトへ接続 | NOT A HOTELの段階的CTA | forest backdrop、paper panel、blue CTA | PCは画像/本文分割、Mobileは上下分割 | open / backdrop-close / close button | v1 native dialog、PC/390px実機QA済み |
| `human-process` | AI制作でも人が選択・判断・公開責任を持つことを示す | Le Laboの人と現場の見せ方 | forest、founder photo、3-step rules | PCは写真/本文分割、Mobileは写真→本文 | static、link focus | v1 人物写真を追加し、制作フローを明文化 |
| `portfolio-cta` | 相談導線とページ末尾を一体化 | Snøhettaの末尾回収 | large Mincho、ink footer | PCは横並び導線、Mobileは縦積み | hover / focus-visible | v1 CTA直後に最小フッターを配置 |

## QA基準

- 画面幅: 1440 / 1024 / 768 / 390px
- 横スクロール: 全幅で `scrollWidth === innerWidth`
- 画像: 15件読込、欠損0
- 公開作品: 8件。Client絞り込みは2件
- 詳細表示: PC幅1408px、Mobile幅374pxで正常に開閉
- 公開境界: 社内専用ログイン画面・非公開案件・準備中サイトは除外

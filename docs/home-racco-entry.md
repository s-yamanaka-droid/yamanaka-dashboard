# トップからRaccoへの入口

## 要求と範囲

本人依頼: 「トップページにもラッコのページに飛べるように配置して！」

対象は会社トップ `/`。既存の巨大タイポグラフィ、会社紹介、サービス、公開済みのRaccoページを維持し、上部ナビとヒーロー直後に直接 `/racco` へ進める入口を加える。SNS投稿・問い合わせ送信・販売開始は含めない。

新しいデザイン方向の選定ではなく、承認済みの書体・赤と紙色・既存キャラクターを使った小規模導線追加。design-approvalの新規カンプ対象外。以前の「本人用」等の制作管理語は公開コピーに用いない。

## 参照

- 現行 `src/app/page.tsx` と `src/app/poster-home.css`
- 公開先 `/racco` の見出し「同じ作業は、AIに任せたい。」
- 公開済み `public/brand-book/racco-scenes/welcoming.png`
- `src/components/primitives/SectionShell.tsx` の既存セクション契約
- Next同梱Link/Imageドキュメント: semantic link、画像サイズ予約、装飾画像の空alt。

## 完了条件

- 上部ナビと画像付き入口の両方から、クリック・キーボードで `/racco` に到達する。
- 375 / 768 / 1024 / 1440pxで横あふれなし、44px以上の操作領域、文字と画像の重なりなし。
- 型・lint・既存テスト・build・smokeを通す。
- 最新mainに統合し、本番の実画面と画像の読込みで反映を確認する。

## 検証

### 実装とローカル検証

- 上部ナビに44pxの「Racco」リンクを追加。
- ヒーロー直後に、既存の手を振るRacco画像と「Raccoの世界へ」を配置。画像・文面を含むカード全体が一つのリンク。
- 375pxでも「ギャラリー」などの短句を途中で切らず、自然に折り返す。
- `npm run check:release`: PASS。型、lint、ブランドと問い合わせの回帰テスト、公開データ境界、42ルートのbuild、smokeを含む。
- lintはエラー0、既存の対象外コンポーネントに警告3件。今回の変更範囲に警告なし。
- `git diff --check`: PASS。

### ブラウザ検証の再現

`scripts/test-home-racco-browser.py` をPython + Playwrightが利用できる環境で実行する。外部送信はせず、公開ページの読込とリンク遷移のみを試す。

```sh
python3 scripts/test-home-racco-browser.py --phase after --base-url http://127.0.0.1:3191 --output-dir /tmp/home-racco-check
python3 scripts/test-home-racco-browser.py --phase after --base-url http://127.0.0.1:3191 --output-dir /tmp/home-racco-stability --dom-only --compare-to /tmp/home-racco-check/report.json
```

375 / 768 / 1024 / 1440pxを対象に、横あふれ、44pxの操作領域、画像読込、クリック・Enterでの両経路の遷移、console/page/HTTPエラーを検証する。テスト専用ブラウザは1実行1本、180秒の期限付きで必ず閉じる。ケース間のprefetch中断は通信失敗と区別する。

公開後も同スクリプトの `--base-url` を `https://lakkan-inc.vercel.app` に変え、実配信版を検証する。ローカル合格だけを本番反映やデザイン採用の証拠にしない。

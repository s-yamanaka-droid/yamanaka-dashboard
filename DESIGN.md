# Racco contact design contract

- Primary job: Raccoから来た人がAIの使いどころなどを気軽に相談し、入力したメール下書きを自分で確認して送れる。
- DESIGN_VARIANCE: 55
- MOTION_INTENSITY: 10
- VISUAL_DENSITY: 45
- Basis: 本人の「ABC全部OK」。Cの明るいショップ風キービジュアル、Bの3択カード、Aの短いフォームを統合。
- Must keep: Racco by Lakkan、既存Zen Maru Gothic / Nunito、白とコーラル、メガネのRacco、商品/記事の文脈、未送信の明示、入力保持、コピー失敗時の手動復帰。
- Avoid: 法人ヘッダーへの突然の切替、ベージュ地、ネオンAI表現、自動送信、偽成功、相談に不要な入力欄や増える選択肢。
- Layout: Cの写真+HTMLの短い見出し → Bの仕事/グッズ/共創カード → AのRacco+入力フォーム。モバイルは同じ順序で画像と文章を分離し重なりを避ける。
- Tokens: paper #ffffff; ink #252b32; muted #616873; coral #f18b78; line #e4e7eb; soft #f6f7f9。ボタン文字は可読性のため暗色。
- Fonts: Zen Maru Gothic 400/500/700; logo Nunito 950。キャラクター以外を画像にせず実テキストで描画。
- Original vs adapted: 既存ContactFormの操作を保持して独自ブランドへadapted。画像見本からのUI実装はreconstructed。3D風の静止画像でありリアルタイム3Dではない。
- Procurement: design-sourcecraft横断検索を実行。ReUIのcheckout/contact-officeは会計/拠点案内で用途不一致。Kokonut clipboard hookは既存copy機能と重複。21stは取得失敗。承認済み構成と既存実装を優先し新規依存なし。
- Scope: /racco/contact と既存Racco遷移リンク。旧/contactのRacco sourceのみ安全に転送。一般/contactの法人向け表示は保持。
- Approval: 2026-10-10、同チャットの本人メッセージ「ABC全部OK」。A/B/C画像参照とsha256は design/DESIGN_APPROVAL.md。
- Publication: design approval and release verification are separate. No email or inquiry has been sent by this implementation.

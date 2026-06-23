# EPIC PRO フォントの置き方

1. Envato Elements で購入した EPIC PRO のフォントファイルをここに置く：
   - 推奨: `epic-pro.woff2`（軽い・最速）
   - 可:   `epic-pro.otf`（そのままでもOK）
   ファイル名は上記どちらかに**リネーム**すること（globals.css の @font-face が参照）。
2. .otf しか無い場合の woff2 変換（任意・推奨）:
   `npx ttf2woff2 epic-pro.otf > epic-pro.woff2`  もしくは fonttools。
3. 置いたら自動で見出しが EPIC PRO に切り替わる（未配置時は Anton で表示）。

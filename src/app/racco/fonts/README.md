# Racco web fonts

This route self-hosts genuine Google Fonts originals. It does not copy macOS fonts or use mock font responses.

## Sources and licenses

- Zen Maru Gothic Regular (400), Medium (500), Bold (700): [Google Fonts source](https://github.com/google/fonts/tree/main/ofl/zenmarugothic). License: `ZenMaruGothic-OFL.txt`.
- Nunito variable (weight axis 200–1000, the Racco wordmark uses CSS weight 800): [Google Fonts source](https://github.com/google/fonts/tree/main/ofl/nunito). License: `Nunito-OFL.txt`.
- Raw font URLs: `https://raw.githubusercontent.com/google/fonts/main/ofl/zenmarugothic/ZenMaruGothic-{Regular,Medium,Bold}.ttf` and `https://raw.githubusercontent.com/google/fonts/main/ofl/nunito/Nunito%5Bwght%5D.ttf`.

Both fonts remain under the SIL Open Font License 1.1. The license and copyright notices are bundled beside the files.

## Conversion and verification

FontTools 4.63.0 converted each original TTF and compressed it to WOFF2 with:

```sh
pyftsubset input.ttf --glyphs='*' --layout-features='*' --flavor=woff --output-file=output.woff
python3 -m fontTools.ttLib.woff2 compress output.woff -o output.woff2
```

All characters were retained, not just the text visible on today's page. The original TTF and WOFF files, then the WOFF and WOFF2 files, were compared by Unicode coverage and decomposed glyph outlines: every codepoint and outline matched (7,812 codepoints per Zen Maru face; 938 in Nunito). Font weights and Nunito's 200–1000 variable weight axis were also verified unchanged.

For WOFF2 compression, Brotli 1.2.0 was installed from the official PyPI index into a temporary verification-only virtual environment. No application dependencies or existing Python environment were changed, and no operating-system fonts were installed.

Total font size is 4,812,232 bytes, down from 6,495,668 bytes in WOFF (25.9% smaller, retaining the complete character sets). `next/font/local` bundles these WOFF2 files without font downloads during builds. The three Japanese faces are not preloaded; only weights used by the page are requested by the browser. The duplicate WOFF intermediates are not shipped.

| File | SHA-256 |
| --- | --- |
| ZenMaruGothic-Regular.woff2 | `5398e6b3708ea65b72156c6e53e67c8d952d519b55a478804b3c82a2131fd31e` |
| ZenMaruGothic-Medium.woff2 | `c35e14ce6abba45db9c6ff9b71f332d95ffe28fa03fccd98f2e2ecad733ad7a3` |
| ZenMaruGothic-Bold.woff2 | `ed74310ff0ca13d0e80d7ac57cc78e82d7eb24bd5c0112e530a053752df0b1d2` |
| Nunito-Variable.woff2 | `4b80d4133d57ffd7945437ee32b1d4f1ef3b2d01530c1669ff4be11fafc88ac0` |

The root layout's pre-existing Google font configuration is separate and unchanged.

# Lakkan brand film

The homepage places the original Blender sculpture behind 「楽観と、計画と。」.
Porcelain, brass and vermilion fragments separate and reconnect in an eight-second loop.
The same film appears on Services; Works uses its still image as a closing signature.

## Delivery

- Original geometry and materials created in Blender; rendered with Cycles and denoising.
- 192 frames, 24 fps, 1280 × 800, H.264 MP4, no audio, fast-start enabled.
- `public/brand/possibility.mp4`: background film.
- `public/brand/possibility-poster.jpg`: static fallback and portfolio signature.
- Working Blender scene and render script remain in the local design-experiments/possibility workspace.

## Behavior

`BrandFilm` pauses outside the viewport or in a hidden tab. Reduced-motion preferences
show a still by default. A visible play/pause control lets visitors stop the motion.
The poster remains visible while loading or when playback is unavailable.

## Design

Home, Services and Works share warm paper, deep green, Japanese sans-serif headings,
16 px body text and 14 px supporting labels. Instrument Serif is reserved for the wordmark.
The mobile hero places the sculpture below its message to preserve readability.

## Verification

TypeScript, ESLint, webpack production build, public-data check and the smoke script.
Smoke includes MP4 byte-range support and poster availability. Browser checks cover
desktop and 390 px layouts, playback controls, navigation and portfolio filtering.

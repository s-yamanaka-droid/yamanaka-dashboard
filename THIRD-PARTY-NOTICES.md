# Component references

The homepage poster is adapted from **Waving Portfolio Landing** by Kedhareswer Naidu, published at https://21st.dev/@kedhareswer/components/waving-portfolio-landing under the MIT License. The component is used with Lakkan copy and colors, Japanese interaction labels, a separate navigation layer, and an optional self-hosted Bebas Neue face inside the original animated letter reels. Copyright remains with its original author.

The animated crowd is adapted from **Skiper 39 Canvas** by Skiper UI / Gurvinder Singh, published at https://21st.dev/@reuno-ui/components/skiper39. Its free use requires attribution to Skiper UI. The implementation here changes the rendering loop, sprite count, motion behavior and accessibility handling. The locally hosted illustration sheet derives from **Open Peeps** by Pablo Stanley, https://www.openpeeps.com/, released under CC0. Attribution appears on the homepage.

The SNS tab selection and sliding-highlight interaction in BrandStudio is reconstructed with an adaptation of the interaction pattern of Smooth Tab by @dorianbaffier / kokonutUI. Source: https://kokonutui.com/r/smooth-tab.json . Our implementation uses the project's existing framer-motion, variable-height content and added Arrow/Home/End keyboard support. It is not a verbatim distribution of the full component.

MIT License

Copyright (c) 2025 kokonutUI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

# Lakkan Records (/records)

The songs are written for Lakkan and played in the browser by `src/lib/records/music`; no recorded music is used.

Each record is a picture disc of a public-domain artwork from the Art Institute of Chicago (CC0, https://www.artic.edu/open-access/public-api): George Inness, *Moonrise*; Claude Monet, *Cliff Walk at Pourville*, *Stacks of Wheat (End of Summer)* and *Water Lilies*; Katsushika Hokusai, *Under the Wave off Kanagawa*; Utagawa Hiroshige, *Hara: Mount Fuji in the Morning*. They are cropped and overlaid with grooves, sheen and a label by `scripts/records-picture-discs.py` into `public/records/discs/`.

Two instruments play from recordings, served from `public/records/samples/` (full credits in `public/records/samples/CREDITS.txt`, linked from the page as SOUND CREDITS):

- **Wurlitzer EP200** electric piano samples by Greg Sullivan (http://www.sullivang.net/), SFZ mapping by SFZ Instruments (https://github.com/sfzinstruments/GregSullivan.E-Pianos), licensed under Creative Commons Attribution 3.0 Unported (https://creativecommons.org/licenses/by/3.0/). Changes: 24 of the 42 samples (the mp and f dynamics) were converted to mono 44.1 kHz 16-bit FLAC, trimmed to the strike and faded out.
- **Virtuosity Drums** by Versilian Studios and Karoryfer Samples (https://versilian-studios.com/virtuosity-drums/, https://github.com/sfzinstruments/virtuosity_drums), dedicated to the public domain under CC0 1.0. One hit of each drum from the mid microphone, mixed to mono, shortened and faded.
- **Versilian Community Sample Library (VCSL)** by Versilian Studios (https://github.com/sgossner/VCSL), dedicated to the public domain under CC0 1.0: upright piano, vibraphone, kalimba, dan tranh zither and tenor saxophone for the lo-fi songs. A few notes of each, mixed to mono, trimmed, faded and (kalimba, dan tranh) retuned to equal temperament (`public/records/samples/<instrument>/`).

# Lakkan corporate homepage

The homepage now leads with Lakkan's name, the Japanese headline and a concrete explanation of its work. A cobalt introduction gives way to two large selected website examples, four support areas and an inquiry link. On mobile, each image precedes its caption and the support areas form a single column.

The implementation follows the cobalt proposal presented before development. The user's direct response was “そうそうその漢字でクオリティーを上げて”. The preceding presentation recommended proposal B; using B as the implementation baseline is an explicitly communicated contextual choice. It is not a fabricated quotation of a named selection. Refinements increase Japanese type sizes, improve paragraph wrapping and align service links while keeping that composition.

Colors: cobalt `#234DEB`, white `#FFFFFF`, ink `#15171B`, muted text `#61646C`, line `#D9DCE2`. The wordmark uses Arial/Helvetica with responsive container sizing. Japanese headings use the bundled Noto Sans JP at weight 900. There is one H1 and all visible company information is available without WebGL, a media player or opening a panel.

The subsequent instruction “ダメダメだな、まだまだやれるのに” prompted further craft work within that composition. The headline is heavier, the oversized wordmark is closer to it, and work titles and descriptions have more readable type sizes. Decorative project and service numbers were removed. The wordmark's letters settle into place once, with a small hover response; reduced-motion preferences disable both. The work images have a restrained hover response. A sticky navigation changes from blue to white after the introduction so visitors can reach support and inquiry links throughout the page. It remains usable without animation or IntersectionObserver.

Work images are the existing screenshots from the public Now on AIr and LunaTech sites. The captions identify Lakkan's own media and website work for a separate brand. No client logo, result metric or staff photo has been invented. Existing case-study URLs remain available but only the two curated examples are promoted on the homepage.

The mobile navigation is a disclosure with an expanded state, hidden links when closed, and Escape returning focus to its trigger. All inquiry links open the existing form; each support area's link carries its topic. The form creates a draft in the visitor's email app and the visitor sends it there. Browser testing must not treat reaching the form or making a draft as message delivery.

The inquiry page and the shared header/footer carry the same accepted blue, white and typography into the immediate navigation path. The inquiry page uses the homepage's contact heading and real form controls in place of its former decorative media hero. The form's recipient and draft workflow remain the existing implementation.

Validation uses `npm run check:release` plus actual browser checks at 360/390, 768 and 1280/1440 widths. Review both content and real screenshots against the presented PC and mobile direction; passing smoke tests alone is not aesthetic approval. Temporary testing resources are cleaned after main integration and production verification.

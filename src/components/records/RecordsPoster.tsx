"use client";

import Link from "next/link";
import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import DiscPlayer, { type PlayerApi } from "@/components/records/disc-player";
import NowPlaying from "@/components/records/now-playing";
import { LakkanLogo } from "@/components/brand/LakkanLogo";
import type { RecordDisc } from "@/lib/records/catalog";
import type { SampleSource } from "@/lib/records/music/samples";

/**
 * Lakkan Records: the crate on the record player, laid out like the home
 * page's poster — paper, red rules with dots, a tall title — and one disc per
 * line of business, each playing its own song. Nothing plays until asked.
 */

const SAMPLES: SampleSource = { base: "/records/samples/", ext: "flac" };
// the carousel's own chrome stays off: the poster draws its own
const BARE = { details: false, controls: false, frame: false, brand: "", nav: [], indexLabel: "", reviews: false, hint: "" };
const SANS = 'var(--font-sans-jp), "Noto Sans JP", sans-serif';
const POSTER = 'var(--font-poster), "Bebas Neue", Impact, sans-serif';
const CONTACT = "/contact?topic=other#inquiry";

const pad2 = (n: number) => String(n).padStart(2, "0");

export function RecordsPoster({ discs }: { discs: RecordDisc[] }) {
  return (
    <DiscPlayer
      records={discs}
      theme="poster"
      medium="vinyl"
      samples={SAMPLES}
      layout="poster"
      transport={false}
      brand="Lakkan Records"
      carousel={{ ...BARE, discSize: "clamp(260px, min(64vmin, 42vw), 600px)" }}
      serif={POSTER}
      sans={SANS}
      display={POSTER}
      overlay={(api) => <Poster api={api} discs={discs} />}
    />
  );
}

function Rule() {
  return (
    <span className="lx-rule" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

/** The record's title in the home page's poster face, each letter rising into place. */
function Title({ text }: { text: string }) {
  return (
    <span className="lx-ptitle-type" aria-hidden="true">
      {[...text.toUpperCase()].map((ch, i) => (
        <span key={i} className="lx-glyph" style={{ ["--i" as string]: i } as React.CSSProperties}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

function Arrow({ dir }: { dir: -1 | 1 }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d={dir < 0 ? "M19 12H5m6-6-6 6 6 6" : "M5 12h14m-6-6 6 6-6 6"} />
    </svg>
  );
}

function Pager({ api, n }: { api: PlayerApi; n: number }) {
  return (
    <div className="lx-pager">
      <button type="button" aria-label="前のレコード" onClick={() => api.step(-1)}>
        <Arrow dir={-1} />
      </button>
      <span aria-live="polite">
        <b>{pad2(api.index + 1)}</b> / {pad2(n)}
      </span>
      <button type="button" aria-label="次のレコード" onClick={() => api.step(1)}>
        <Arrow dir={1} />
      </button>
    </div>
  );
}

function Poster({ api, discs }: { api: PlayerApi; discs: RecordDisc[] }) {
  const d = discs[api.index];
  return (
    <div className="lx" data-pattern="poster">
      <div className="lx-scrim" aria-hidden="true" />
      <header className="lx-prow lx-prow-top">
        <Link className="lx-plogo" href="/" aria-label="Lakkan のトップへ戻る">
          <LakkanLogo size="small" tone="red" />
        </Link>
        <Rule />
        <Link className="lx-plabel lx-plink" href={CONTACT}>
          相談する <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </header>
      <section className="lx-poster" key={"p" + api.index}>
        <p className="lx-plabel lx-pno">
          {pad2(api.index + 1)} / {pad2(discs.length)}
        </p>
        <h2 className="lx-ptitle">
          <span className="sr-only">{d.title}</span>
          <Title text={d.title} />
        </h2>
        <p className="lx-pkicker">{d.kicker}</p>
        <p className="lx-plead">
          {d.lead.map((phrase, k) => (
            <span key={k}>{phrase}</span>
          ))}
        </p>
        <dl className="lx-credits lx-pcredits">
          {d.credits?.map((c) => (
            <div key={c.label}>
              <dt>{c.label}</dt>
              <dd>{Array.isArray(c.value) ? c.value.join(" / ") : c.value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <NowPlaying {...api.transport} className="lx-tp lx-ptp" />
      <Pager api={api} n={discs.length} />
      <footer className="lx-prow lx-prow-bottom">
        <span className="lx-plabel">採用支援・AI研修・プロダクト開発</span>
        <Rule />
        {/* the Wurlitzer recordings ask for credit (CC BY 3.0) */}
        <a className="lx-plabel lx-plink" href="/records/samples/CREDITS.txt">
          SOUND CREDITS
        </a>
      </footer>
    </div>
  );
}

import rakkan from "@/data/records/songs/rakkan.json"
import goodPeople from "@/data/records/songs/good-people.json"
import levelUp from "@/data/records/songs/level-up.json"
import nextMorning from "@/data/records/songs/next-morning.json"
import sixTools from "@/data/records/songs/six-tools.json"
import directLine from "@/data/records/songs/direct-line.json"
import discsJson from "@/data/records/discs.json"
import { loadLakkanDiscs, loadSongs, pressRecord } from "./content"
import type { DiscRecord } from "./types"

/**
 * Lakkan Records: one disc per line of business, each with its own written
 * song, printed in the site's poster inks. A new song is a JSON file in
 * src/data/records/songs, added to the list below and named by a disc.
 */
export type RecordDisc = DiscRecord & { kicker: string; lead: string[] }

/** The site's paper, ink and red (globals.css), for the record labels. */
export const INKS = { paper: "#F4F0E8", ink: "#17221F", red: "#B4382B" }

const songs = loadSongs({
  rakkan,
  "good-people": goodPeople,
  "level-up": levelUp,
  "next-morning": nextMorning,
  "six-tools": sixTools,
  "direct-line": directLine,
})

/**
 * Each record is a picture disc of a public-domain artwork from the Art
 * Institute of Chicago (CC0), pressed by scripts/records-picture-discs.py into
 * public/records/discs/<id>.webp; the page lays the approved wordmark over it.
 */
const ART: Record<string, { title: string; artist: string }> = {
  lakkan: { title: "Moonrise", artist: "George Inness" },
  recruit: { title: "Cliff Walk at Pourville", artist: "Claude Monet" },
  "ai-quest": { title: "Under the Wave off Kanagawa", artist: "Katsushika Hokusai" },
  product: { title: "Hara: Mount Fuji in the Morning", artist: "Utagawa Hiroshige" },
  method: { title: "Stacks of Wheat (End of Summer)", artist: "Claude Monet" },
  contact: { title: "Water Lilies", artist: "Claude Monet" },
}

export const recordDiscs: RecordDisc[] = loadLakkanDiscs(discsJson, songs).map((d, i) => {
  const art = ART[d.id]
  if (!art) throw new Error(`src/lib/records/catalog.ts: ディスク "${d.id}" の絵がありません（ART に足して scripts/records-picture-discs.py で作る）`)
  const disc = pressRecord(d, i, { colors: [INKS.paper, INKS.red, INKS.ink], ink: INKS.ink, face: "glyph", mark: "", hideTitle: true })
  return { ...disc, src: `/records/discs/${d.id}.webp`, credits: [...disc.credits, { label: "Art", value: `${art.title} — ${art.artist}` }] }
})

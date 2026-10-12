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

export const recordDiscs: RecordDisc[] = loadLakkanDiscs(discsJson, songs).map((d, i) =>
  pressRecord(d, i, {
    colors: i % 2 ? [INKS.paper, INKS.ink, INKS.red] : [INKS.paper, INKS.red, INKS.ink],
    ink: INKS.ink,
    face: "glyph",
  }),
)

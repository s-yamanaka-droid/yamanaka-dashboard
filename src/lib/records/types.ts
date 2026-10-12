import type { DiscCascadeItem } from "@/components/ui/disc-cascade-carousel"
import type { TrackSpec } from "./music/compose"

/** A disc in the crate: what the carousel shows, plus the song it plays. */
export type DiscRecord = DiscCascadeItem & {
  /** The song to write and play. Records with `audio` may leave it out. */
  track?: TrackSpec
  /** An audio file to play instead of the generated song. */
  audio?: string
  /** Colour of the light behind the disc while it plays. */
  glow: string
  /** The page's colours while this disc is chosen, for stages that follow the record. */
  stage?: { bg: string; ink: string; accent: string }
}

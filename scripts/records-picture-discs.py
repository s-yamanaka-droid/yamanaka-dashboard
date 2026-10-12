#!/usr/bin/env python3
"""
Presses the six picture discs for /records: a public-domain artwork printed
across the whole record, fine grooves and a soft sheen over it, and a paper
label in the middle with the record's name, number and artwork. The approved
Lakkan wordmark is not baked in: the page lays the original PNG over the label. Run from the project root:

    python3 scripts/records-picture-discs.py [folder of downloaded <disc id>.jpg]

Writes public/records/discs/<disc id>.webp (1000 px square; the page's CSS
cuts the spindle hole and the round edge). Artworks come from the Art
Institute of Chicago's open-access images (public domain, CC0), fetched at
1200 px wide. Needs Pillow, numpy and curl; the label text uses Helvetica Neue
(macOS). The outputs are committed, so this only runs again to change a disc.
"""
import io, math, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

# disc id: (AIC artwork id, IIIF image id, title on the label, artist, focus x, focus y)
ART = {
    "lakkan": (64754, "4425984b-e241-6413-1404-cdac0fb06518", "Moonrise", "George Inness, 1891", 0.47, 0.61),
    "recruit": (14620, "b0effb1c-ff23-bbaa-f809-9fd94e31c1a0", "Cliff Walk at Pourville", "Claude Monet, 1882", 0.56, 0.5),
    "ai-quest": (24645, "b3974542-b9b4-7568-fc4b-966738f61d78", "Under the Wave off Kanagawa", "Katsushika Hokusai, 1830/33", 0.42, 0.5),
    "product": (13219, "beeebdf4-31f0-0163-36f2-930ca37393fd", "Hara: Mount Fuji in the Morning", "Utagawa Hiroshige, 1833/34", 0.52, 0.5),
    "method": (64818, "a38e2828-ec6f-ece1-a30f-70243449197b", "Stacks of Wheat (End of Summer)", "Claude Monet, 1890/91", 0.5, 0.55),
    "contact": (16568, "3c27b499-af56-f0d5-93b5-a7f2f1ad5813", "Water Lilies", "Claude Monet, 1906", 0.5, 0.5),
}
ORDER = ["lakkan", "recruit", "ai-quest", "product", "method", "contact"]
N = 1000
INK = (23, 34, 31)
RED = (180, 56, 43)
PAPER = (255, 255, 255)
FONT = "/System/Library/Fonts/HelveticaNeue.ttc"


def fetch(disc, image_id, cache):
    """The artwork, from a folder of earlier downloads (<disc id>.jpg) if given, else from the museum."""
    if cache and os.path.exists(os.path.join(cache, disc + ".jpg")):
        return Image.open(os.path.join(cache, disc + ".jpg")).convert("RGB")
    url = f"https://www.artic.edu/iiif/2/{image_id}/full/1200,/0/default.jpg"
    raw = subprocess.run(["curl", "-sfL", "--retry", "4", "--retry-all-errors", url], capture_output=True, check=True).stdout
    return Image.open(io.BytesIO(raw)).convert("RGB")


def square(im, fx, fy):
    side = min(im.size)
    cx, cy = fx * im.width, fy * im.height
    left = int(min(max(cx - side / 2, 0), im.width - side))
    top = int(min(max(cy - side / 2, 0), im.height - side))
    return im.crop((left, top, left + side, top + side)).resize((N, N), Image.LANCZOS)


def grooves(seed):
    """Darkening (0..1) per pixel: fine rings that vary like a real cut, gaps between songs, a darker lead-in."""
    y, x = np.mgrid[0:N, 0:N].astype(np.float32)
    r = np.hypot(x - N / 2, y - N / 2) / (N / 2)
    rng = np.random.default_rng(seed)
    rings = 0.5 + 0.5 * np.sin(r * 2 * math.pi * 150 + rng.random() * 6)
    wobble = 0.5 + 0.5 * np.sin(r * 2 * math.pi * 11 + rng.random() * 6)
    dark = 0.045 * rings + 0.012 * wobble
    for gap in (0.52 + seed % 3 * 0.02, 0.66, 0.8 + seed % 2 * 0.02):
        dark += 0.07 * np.exp(-((r - gap) / 0.004) ** 2)
    dark += 0.22 * np.clip((r - 0.975) / 0.025, 0, 1)
    dark *= (r > 0.355)
    return dark


def sheen():
    """Two soft wedges of light across the grooves, as a lamp catches a turning record."""
    y, x = np.mgrid[0:N, 0:N].astype(np.float32)
    a = np.arctan2(y - N / 2, x - N / 2)
    r = np.hypot(x - N / 2, y - N / 2) / (N / 2)
    light = np.exp(-((np.cos(2 * (a + 0.7)) - 1) / 0.18) ** 2)
    return 0.06 * light * np.clip((r - 0.36) / 0.1, 0, 1) * np.clip((0.99 - r) / 0.05, 0, 1)


# Where the page lays the approved wordmark over each record (RecordImprint in
# RecordsPoster.tsx, in a 200-unit square over the disc): the company record has
# it across the top of the label, every record has a small one at the bottom.
# The label's own print keeps clear of those two places.
TITLES = {"lakkan": None, "recruit": "RECRUIT", "ai-quest": "AI WORK", "product": "PRODUCT", "method": "METHOD", "contact": "CONTACT"}


def label(disc, no):
    _, _, title, artist, _, _ = ART[disc]
    size = round(N * 0.34)
    at = lambda y200: (y200 * N / 200 - (N - size) / 2) / size  # page units to a fraction of the label
    lab = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(lab)
    d.ellipse((0, 0, size - 1, size - 1), fill=PAPER + (255,))
    d.ellipse((size * 0.04, size * 0.04, size * 0.96, size * 0.96), outline=RED + (255,), width=3)
    heading = ImageFont.truetype(FONT, round(size * 0.1), index=4)
    small = ImageFont.truetype(FONT, round(size * 0.04), index=10)
    tiny = ImageFont.truetype(FONT, round(size * 0.034), index=0)
    if TITLES[disc]:
        d.text((size / 2, size * at(79.5)), TITLES[disc], font=heading, fill=INK, anchor="mm")
    d.text((size / 2, size * at(89)), f"No.{no:02d}  ·  SIDE A  ·  33⅓ RPM", font=small, fill=RED, anchor="mm")
    d.text((size / 2, size * at(109)), title.upper(), font=small, fill=INK, anchor="mm")
    d.text((size / 2, size * at(113.5)), artist, font=tiny, fill=INK, anchor="mm")
    return lab


def press(disc, no, cache=None):
    _, image_id, _, _, fx, fy = ART[disc]
    art = np.asarray(square(fetch(disc, image_id, cache), fx, fy)).astype(np.float32) / 255
    dark = grooves(no)[..., None]
    light = sheen()[..., None]
    out = art * (1 - dark) + light
    disc_img = Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8)).convert("RGBA")
    lab = label(disc, no)
    # the label's own shadow on the vinyl, so it reads as paper laid on the record
    shadow = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).ellipse((N / 2 - lab.width / 2 - 4, N / 2 - lab.height / 2 - 2, N / 2 + lab.width / 2 + 4, N / 2 + lab.height / 2 + 6), fill=(0, 0, 0, 70))
    disc_img.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(6)))
    disc_img.alpha_composite(lab, (round((N - lab.width) / 2), round((N - lab.height) / 2)))
    return disc_img.convert("RGB")


def main():
    out = os.path.join("public", "records", "discs")
    os.makedirs(out, exist_ok=True)
    for no, disc in enumerate(ORDER, 1):
        path = os.path.join(out, disc + ".webp")
        press(disc, no, sys.argv[1] if len(sys.argv) > 1 else None).save(path, "WEBP", quality=84, method=6)
        print(path, os.path.getsize(path) // 1024, "KB")


if __name__ == "__main__":
    sys.exit(main())

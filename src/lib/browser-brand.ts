export const brandShareImage = {
  url: "/brand/browser/lakkan-racco-share-v1.png",
  width: 1200,
  height: 630,
  alt: "Lakkanの確定ロゴと、太縁メガネのRacco",
};

export const browserIcons = (brand: "lakkan" | "racco") => ({
  icon: [{ url: `/brand/browser/${brand}-icon-v1.png`, type: "image/png", sizes: "256x256" }],
  shortcut: `/brand/browser/${brand}-icon-v1.png`,
  apple: [{ url: `/brand/browser/${brand}-apple-v1.png`, sizes: "180x180", type: "image/png" }],
});

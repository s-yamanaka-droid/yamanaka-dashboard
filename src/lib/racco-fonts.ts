import localFont from "next/font/local";

export const raccoRounded = localFont({
  src: [
    { path: "../app/racco/fonts/ZenMaruGothic-Regular.woff2", weight: "400", style: "normal" },
    { path: "../app/racco/fonts/ZenMaruGothic-Medium.woff2", weight: "500", style: "normal" },
    { path: "../app/racco/fonts/ZenMaruGothic-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-racco-rounded",
  display: "swap",
  preload: false,
});

export const raccoLogo = localFont({
  src: "../app/racco/fonts/Nunito-Variable.woff2",
  variable: "--font-racco-logo",
  weight: "200 1000",
  style: "normal",
  display: "swap",
});

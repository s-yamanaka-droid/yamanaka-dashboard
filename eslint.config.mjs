import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["scripts/**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  // Vendored as published (Disc Cascade Carousel, used by /records). Its frame loop
  // reads refs during render on purpose (the first pose) and it takes plain <img>
  // labels from any host, so these two rules don't fit it. Keep the file verbatim.
  {
    files: ["src/components/ui/disc-cascade-carousel.tsx"],
    rules: { "react-hooks/refs": "off", "@next/next/no-img-element": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

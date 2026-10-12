import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Lakkanの確定ロゴと、太縁メガネのRacco";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const png = await readFile(join(process.cwd(), "public/brand/browser/lakkan-racco-share-v1.png"));
  return new Response(new Uint8Array(png), { headers: { "Content-Type": contentType } });
}

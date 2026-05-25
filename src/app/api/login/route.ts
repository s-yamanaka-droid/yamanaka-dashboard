import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "products_auth";
const ONE_MONTH = 60 * 60 * 24 * 30;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const submitted = (body as { password?: string }).password || "";
  const expected = process.env.PRODUCTS_PASSWORD;
  if (!expected) {
    return NextResponse.json({ ok: false, error: "PRODUCTS_PASSWORD not configured" }, { status: 500 });
  }
  if (submitted === expected) {
    const store = await cookies();
    store.set(COOKIE_NAME, expected, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: ONE_MONTH,
      path: "/",
    });
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false, error: "invalid password" }, { status: 401 });
}

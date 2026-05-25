import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "products_auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // /products 配下のみガード
  if (!pathname.startsWith("/products")) {
    return NextResponse.next();
  }
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  const password = process.env.PRODUCTS_PASSWORD;
  if (password && cookie === password) {
    return NextResponse.next();
  }
  // 認証失敗 → /login へリダイレクト
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/products/:path*"],
};

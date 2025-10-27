import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // 🚫 Skip static files, assets, API, favicon, halaman login, dll
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/" ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/assets")
  ) {
    return NextResponse.next();
  }

  // 🔐 Lindungi hanya route /dashboard/*
  if (pathname.startsWith("/dashboard")) {
    const accessToken = req.cookies.get("access_token")?.value;

    // ⚠️ Kalau tidak ada token → redirect ke login
    if (!accessToken) {
      console.warn("⚠️ Tidak ada access_token, redirect ke login");
      return NextResponse.redirect(new URL("/", req.url));
    }

    try {
      // ✅ Verifikasi JWT
      const secret = new TextEncoder().encode(
        process.env.NEXT_PUBLIC_JWT_SECRET
      );
      await jwtVerify(accessToken, secret);

      // Token valid → lanjut
      return NextResponse.next();
    } catch (err) {
      console.warn("❌ Token invalid atau expired:", err.message);

      // Token invalid → redirect ke login
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Default: lanjut ke halaman lain tanpa proteksi
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // hanya proteksi halaman dashboard
};

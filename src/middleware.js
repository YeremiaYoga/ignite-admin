import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // skip static assets & api routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/" ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/assets")
  ) {
    return NextResponse.next();
  }

  // hanya lindungi halaman dashboard
  if (pathname.startsWith("/dashboard")) {
    const accessToken = req.cookies.get("access_token")?.value;
    const refreshToken = req.cookies.get("refresh_token")?.value;

    // kalau tidak ada token → redirect ke login
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    try {
      // verifikasi access token
      const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);
      await jwtVerify(accessToken, secret);
      return NextResponse.next(); // valid → lanjut
    } catch (err) {
      console.warn("⚠️ Access token invalid/expired, mencoba refresh...");

      // kalau access token invalid tapi masih ada refresh token
      if (refreshToken) {
        const refreshUrl = `${process.env.NEXT_PUBLIC_API_URL}/users/refresh`;

        try {
          const res = await fetch(refreshUrl, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          });

          // kalau refresh sukses → lanjut
          if (res.ok) {
            console.log("✅ Access token diperbarui otomatis");
            return NextResponse.next();
          } else {
            console.warn("❌ Refresh gagal, redirect ke login");
            return NextResponse.redirect(new URL("/", req.url));
          }
        } catch (refreshErr) {
          console.error("❌ Refresh error:", refreshErr.message);
          return NextResponse.redirect(new URL("/", req.url));
        }
      }

      // kalau tidak ada refresh token → redirect login
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

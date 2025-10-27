// /app/api/auth/refresh/route.js
export async function POST(req) {
  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/users/refresh`;

  try {
    // Ambil cookie dari request user
    const cookieHeader = req.headers.get("cookie") || "";

    // Teruskan ke backend
    const res = await fetch(backendUrl, {
      method: "POST",
      headers: {
        cookie: cookieHeader,
      },
      credentials: "include",
    });

    const data = await res.json();

          console.log(data);
    // Teruskan Set-Cookie hasil backend agar browser dapat access_token baru
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
        ...(res.headers.get("set-cookie")
          ? { "Set-Cookie": res.headers.get("set-cookie") }
          : {}),
      },
    });
  } catch (err) {
    console.error("🔥 Proxy refresh error:", err.message);
    return new Response(
      JSON.stringify({ error: "Failed to contact backend refresh" }),
      { status: 500 }
    );
  }
}

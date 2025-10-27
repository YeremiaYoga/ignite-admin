"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${BASE_URL}/users/jwt-login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include", 
        }
      );

      const data = await res.json();
      console.log(res);

      if (!res.ok) throw new Error(data.error || "Login failed");


      router.push("/dashboard");
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 w-[340px] p-8 rounded-xl shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-white">
          Sign in to the System
        </h1>

        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-400">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-blue-500"
            placeholder="user@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-400">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-blue-500"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-3 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition disabled:opacity-60"
        >
          {loading ? "Processing..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

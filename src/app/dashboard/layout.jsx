"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      router.replace("/");
      return;
    }

    console.log(token);
    // (async () => {
    //   try {
    //     const res = await fetch(
    //       `${process.env.NEXT_PUBLIC_API_URL}/users/verify`,
    //       {
    //         headers: { Authorization: `Bearer ${token}` },
    //       }
    //     );

    //     if (!res.ok) {
    //       console.warn("⚠️ Token invalid/expired, logout otomatis");
    //       localStorage.removeItem("admin_token");
    //       router.replace("/");
    //     }
    //   } catch (err) {
    //     console.error("❌ Error verifikasi token:", err);
    //     router.replace("/");
    //   }
    // })();
  }, [router]);

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 md:ml-64 transition-all duration-200">
        {children}
      </main>
    </div>
  );
}

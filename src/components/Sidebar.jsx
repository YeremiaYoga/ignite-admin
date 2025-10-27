"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Hammer,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  UserCircle2,
} from "lucide-react";

export default function Sidebar() {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleToggleSubmenu = (menu) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  const logout = async () => {
    try {
       localStorage.removeItem("access_token");
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      router.push("/");
    }
  };

  const menuItems = [
    { label: "Home", icon: Home, href: "/dashboard" },
    {
      label: "Builder",
      icon: Hammer,
      children: [
        { label: "Character", href: "/dashboard/builder/character" },
        { label: "Race", href: "/dashboard/builder/race" },
        { label: "Subrace", href: "/dashboard/builder/subrace" },
        { label: "Background", href: "/dashboard/builder/subrace" },
        { label: "Feat", href: "/dashboard/builder/feat" },
        { label: "Spell", href: "/dashboard/builder/spell" },
        { label: "Incumbency", href: "/dashboard/builder/incumbency" },
      ],
    },
    { label: "Setting", icon: Settings, href: "/dashboard/setting" },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 border-r border-gray-800 flex flex-col">
      <div className="h-20 flex flex-col items-center justify-center border-b border-gray-700 select-none">
        <h1 className="text-2xl font-extrabold tracking-widest text-white">
          IGNITE
        </h1>
        <span className="text-xs text-blue-400 tracking-[0.2em] uppercase">
          firefly
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.children &&
              item.children.some((sub) => pathname === sub.href));
          const isOpen = openSubmenu === item.label;

          return (
            <div key={item.label}>
              {item.children ? (
                <button
                  onClick={() => handleToggleSubmenu(item.label)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )}

              {item.children && isOpen && (
                <div className="ml-9 mt-1 space-y-1 border-l border-gray-700 pl-3">
                  {item.children.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      className={`block px-2 py-1.5 rounded-md text-sm transition ${
                        pathname === sub.href
                          ? "bg-gray-800 text-white"
                          : "text-gray-400 hover:text-white hover:bg-gray-800/70"
                      }`}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-gray-800 p-4 text-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center">
            <UserCircle2 className="w-6 h-6 text-gray-300" />
          </div>
          <div>
            <p className="text-gray-100 font-semibold">John Doe</p>
            <p className="text-gray-500 text-xs">Admin</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="p-2 rounded-md hover:bg-gray-800 text-gray-400 hover:text-red-400 transition"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}

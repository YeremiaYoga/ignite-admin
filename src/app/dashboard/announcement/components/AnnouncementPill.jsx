// components/AnnouncementPill.jsx
"use client";

import { useEffect, useState } from "react";
import * as Lucide from "lucide-react";
import Image from "next/image";

const BASE_URL =
  (typeof process !== "undefined" && (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")) ||
  "";

export default function AnnouncementPill({
  position,
  className = "",
  endpoint,                // optional override API base
  iconPxOverride,          // preview-only: override icon px
  imagePxOverride,         // preview-only: override image px
}) {
  const [item, setItem] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const urlBase = (endpoint || `${BASE_URL}/announcements`).replace(/\/$/, "");
        const res = await fetch(`${urlBase}?position=${encodeURIComponent(position)}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`fetch ${res.status}`);
        const data = await res.json();
        const row = Array.isArray(data) ? data[0] : data;
        if (mounted) setItem(row || null);
      } catch (e) {
        console.error("announcement fetch error:", e);
        if (mounted) setItem(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [position, endpoint]);

  if (!item) return null;

  const Icon = (item.icon && Lucide[item.icon]) || Lucide.Megaphone;

  // Use preview overrides when provided; otherwise use DB values
  const iconSize = Number(iconPxOverride ?? item.icon_size ?? 20);
  const imgSize = Number(imagePxOverride ?? item.image_size ?? 24);

  return (
    <div
      className={`flex items-center gap-2 border border-sky-700 bg-sky-600/15 text-sky-300 rounded-full px-3 py-1 max-w-[260px] ${className}`}
      title={item.description || item.name}
    >
      {item.icon ? <Icon className="shrink-0" size={iconSize} /> : null}
      {item.image ? (
        <Image
          src={item.image}
          alt="Announcement"
          width={imgSize}
          height={imgSize}
          className="rounded-full object-cover shrink-0"
        />
      ) : null}
      <span className="truncate">{item.name}</span>
    </div>
  );
}

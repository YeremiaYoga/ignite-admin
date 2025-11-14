// components/AnnouncementPill.jsx
"use client";

import { useEffect, useState } from "react";
import * as Lucide from "lucide-react";
import Image from "next/image";

const BASE_URL =
  (typeof process !== "undefined" &&
    (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")) ||
  "";

export default function AnnouncementPill({
  position,
  className = "",
  endpoint,
  iconPxOverride,
  imagePxOverride,
  variant = "pill", // "pill" | "icon"
  refreshKey = 0,
}) {
  const [item, setItem] = useState(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const urlBase = (endpoint || `${BASE_URL}/announcements`).replace(
          /\/$/,
          ""
        );

        const res = await fetch(
          `${urlBase}?position=${encodeURIComponent(position)}`,
          {
            cache: "no-store",
          }
        );
        if (!res.ok) throw new Error(`fetch ${res.status}`);

        const data = await res.json();
        const row = Array.isArray(data) ? data[0] : data;
        console.log(data);
        if (mounted) setItem(row || null);
      } catch (e) {
        console.error("announcement fetch error:", e);
        if (mounted) setItem(null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [position, endpoint, refreshKey]);

  if (!item) return null;

  const Icon = (item.icon && Lucide[item.icon]) || Lucide.Megaphone;

  const iconSize = Number(iconPxOverride ?? item.icon_size ?? 20);
  const imgSize = Number(imagePxOverride ?? item.image_size ?? 24);
  const iconColor = item.icon_color || "#38bdf8";
  console.log(item);
  const titleText = `${item.name || ""}${
    item.description ? " - " + item.description : ""
  }`;

  // === VARIANT ICON (navbar mobile) ===
  if (variant === "icon") {
    const hasImage = !!item.image;

    return (
      <button
        type="button"
        title={titleText}
        className={`w-8 h-8 rounded-full border bg-sky-900/60 flex items-center justify-center overflow-hidden ${className}`}
        style={{ borderColor: iconColor }}
        aria-label={item.name || "Announcement"}
      >
        {hasImage ? (
          <Image
            src={item.image}
            alt={item.name || "Announcement"}
            width={imgSize}
            height={imgSize}
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon size={iconSize} style={{ color: iconColor }} />
        )}
      </button>
    );
  }

  // === VARIANT PILL (desktop / default) ===
  return (
    <div
      className={`flex items-center gap-2 border rounded-full px-3 py-1 max-w-[260px] bg-sky-600/15 text-sky-300 ${className}`}
      style={{ borderColor: iconColor }}
      title={item.description || item.name}
    >
      {item.icon ? (
        <Icon
          className="shrink-0"
          size={iconSize}
          style={{ color: iconColor }}
        />
      ) : null}

      {item.image ? (
        <Image
          src={item.image}
          alt={item.name || "Announcement"}
          width={imgSize}
          height={imgSize}
          className="rounded-full object-cover shrink-0"
        />
      ) : null}

      <span className="truncate" style={{ color: iconColor }}>{item.name}</span>
    </div>
  );
}

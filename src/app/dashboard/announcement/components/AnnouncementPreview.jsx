// components/AnnouncementPreview.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, UserCircle, Monitor, Smartphone } from "lucide-react";
import AnnouncementPill from "./AnnouncementPill";

export default function AnnouncementPreview() {
  const [isMobile, setIsMobile] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const previewSizes = isMobile
    ? { iconPx: 16, imagePx: 20 }
    : { iconPx: 20, imagePx: 24 };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* MODE TOGGLE */}
      <div className="flex gap-3 items-center">
        <button
          onClick={() => setIsMobile(false)}
          className={`px-3 py-1.5 rounded-md border inline-flex items-center gap-2 ${
            !isMobile
              ? "bg-sky-900/40 border-sky-700"
              : "bg-gray-800 border-gray-700"
          }`}
        >
          <Monitor className="w-4 h-4" />
          Desktop
        </button>

        <button
          onClick={() => setIsMobile(true)}
          className={`px-3 py-1.5 rounded-md border inline-flex items-center gap-2 ${
            isMobile
              ? "bg-sky-900/40 border-sky-700"
              : "bg-gray-800 border-gray-700"
          }`}
        >
          <Smartphone className="w-4 h-4" />
          Mobile
        </button>

        <button
          onClick={() => setRefreshKey((n) => n + 1)}
          className="px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-700 text-sm"
        >
          Reload
        </button>
      </div>

      {/* PREVIEW */}
      <div
        className={`border border-gray-800 bg-gray-900 rounded-lg shadow-lg overflow-hidden ${
          isMobile ? "max-w-[500px] w-full scale-95" : "w-full"
        }`}
      >
        {/* NAVBAR = GRID 3 KOLOM */}
        <div className="px-4 py-2 border-b border-gray-800 bg-gray-800
                        grid grid-cols-3 items-center">
          
          {/* === LEFT SECTION === */}
          <div className="flex items-center gap-2">
            {isMobile ? (
              <>
                <Menu className="w-6 h-6 text-gray-300" />
                <AnnouncementPill
                  position="left"
                  variant="icon"
                  refreshKey={refreshKey}
                  iconPxOverride={previewSizes.iconPx}
                  imagePxOverride={previewSizes.imagePx}
                />
              </>
            ) : (
              <>
                <Link href="/" className="flex items-center">
                  <Image
                    src="/assets/project_ignite_logo2.webp"
                    alt="Ignite Logo"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="h-10 w-auto object-contain"
                  />
                </Link>

                <AnnouncementPill
                  position="left"
                  variant="pill"
                  refreshKey={refreshKey}
                  iconPxOverride={previewSizes.iconPx}
                  imagePxOverride={previewSizes.imagePx}
                />
              </>
            )}
          </div>

          {/* === CENTER SECTION (LOGO MOBILE) === */}
          <div className="flex justify-center">
            {isMobile && (
              <Link href="/" className="flex items-center">
                <Image
                  src="/assets/project_ignite_logo2.webp"
                  alt="Ignite Logo"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="h-10 w-auto object-contain"
                />
              </Link>
            )}
          </div>

          {/* === RIGHT SECTION === */}
          <div className="flex justify-end items-center gap-3">
            <AnnouncementPill
              position="right"
              variant={isMobile ? "icon" : "pill"}
              refreshKey={refreshKey}
              iconPxOverride={previewSizes.iconPx}
              imagePxOverride={previewSizes.imagePx}
            />

            <UserCircle className="w-7 h-7 text-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

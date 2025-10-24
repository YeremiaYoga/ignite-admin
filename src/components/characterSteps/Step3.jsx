"use client";

import InputField from "@/components/InputField";
import MultipleInput from "@/components/MultipleInput.jsx";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Upload } from "lucide-react";
import {
  nationalityOptions,
  countryOptions,
} from "../../data/characterOptions";

export default function Step3({ data, allData, onChange, mode }) {
  useEffect(() => {
    if (data.main_theme_ogg && typeof data.main_theme_ogg === "string") {
      const mainUrl = data.main_theme_ogg.startsWith("http")
        ? data.main_theme_ogg
        : `${process.env.NEXT_PUBLIC_API_URL}${data.main_theme_ogg}`;
      onChange("main_theme_ogg", mainUrl);
    }

    if (data.combat_theme_ogg && typeof data.combat_theme_ogg === "string") {
      const combatUrl = data.combat_theme_ogg.startsWith("http")
        ? data.combat_theme_ogg
        : `${process.env.NEXT_PUBLIC_API_URL}${data.combat_theme_ogg}`;
      onChange("combat_theme_ogg", combatUrl);
    }

    console.log(data.main_theme_ogg, data.combat_theme_ogg);
  }, [data.main_theme_ogg, data.combat_theme_ogg]);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-900 text-gray-100 rounded-xl shadow-lg space-y-6">
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">Appearance</label>
            <InputField
              type="toggleIcon"
              value={data.appearance_visibility}
              onChange={(v) => onChange("appearance_visibility", v)}
            />
          </div>
          <InputField
            label=""
            type="textarea"
            value={data.appearance || ""}
            onChange={(val) => onChange("appearance", val)}
            placeholder="Write apperance here..."
            rows={15}
          />
        </div>

        <div className="space-y-3 col-span-2">
          <div>
            <label className="block text-sm font-medium mb-1">Main Theme</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.main_theme || ""}
                onChange={(e) => onChange("main_theme", e.target.value)}
                className="flex-1 h-10 px-3 rounded-lg bg-gray-800 border border-gray-700 
                 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="Enter Main Theme (www.youtube.com link)"
              />

              <input
                type="file"
                accept=".ogg"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    onChange("main_theme_ogg", file);
                  }
                }}
                className="hidden"
                id="mainThemeUpload"
              />

              <label
                htmlFor="mainThemeUpload"
                className="flex items-center justify-center w-10 h-10 rounded-lg 
                 bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                <Upload className="w-5 h-5 text-white" />
              </label>
            </div>

            <div className="flex justify-end items-center gap-2 mt-2">
              <p className="text-xs text-gray-400">
                {data.main_theme_ogg ? data.main_theme_ogg.name : "\u00A0"}
              </p>
              <p className="text-xs text-gray-400">(OGG File Only)</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Combat Theme
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.combat_theme || ""}
                onChange={(e) => onChange("combat_theme", e.target.value)}
                className="flex-1 h-10 px-3 rounded-lg bg-gray-800 border border-gray-700 
                 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="Enter Combat Theme (www.youtube.com link)"
              />

              <input
                type="file"
                accept=".ogg"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    onChange("combat_theme_ogg", file);
                  }
                }}
                className="hidden"
                id="combatThemeUpload"
              />

              <label
                htmlFor="combatThemeUpload"
                className="flex items-center justify-center w-10 h-10 rounded-lg 
                 bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                <Upload className="w-5 h-5 text-white" />
              </label>
            </div>

            <div className="flex justify-end items-center gap-2 mt-2">
              <p className="text-xs text-gray-400">
                {data.combat_theme_ogg ? data.combat_theme_ogg.name : "\u00A0"}
              </p>
              <p className="text-xs text-gray-400">(OGG File Only)</p>
            </div>
          </div>

          <InputField
            label="Nationality"
            type={mode ? "select" : "text"}
            placeholder={mode ? "Select Nationality" : "Country"}
            value={data.nationality || ""}
            onChange={(val) => onChange("nationality", val)}
            options={mode ? nationalityOptions : undefined}
          />

          <div>
            <label className="block text-sm font-medium mb-1">
              Main Resident
            </label>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label=""
                type="text"
                placeholder="Resident"
                value={data.main_resident?.resident || ""}
                onChange={(val) =>
                  onChange("main_resident", {
                    ...data.main_resident,
                    resident: val,
                  })
                }
              />

              <InputField
                label=""
                type={mode ? "select" : "text"}
                placeholder={mode ? "Select Country" : "Country"}
                value={data.main_resident?.country || ""}
                onChange={(val) =>
                  onChange("main_resident", {
                    ...data.main_resident,
                    country: val,
                  })
                }
                options={mode ? countryOptions : undefined}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-9 gap-4">
        <div className="col-span-3">
          <MultipleInput
            labels="Notable details (Appearance)"
            label="details of thou appearance (Exp : A very tall woman)"
            btnLabel="Add Details"
            items={data.notable_details || [""]}
            onChange={(items) => onChange("notable_details", items)}
          />
        </div>
        <div className="col-span-2">
          <MultipleInput
            labels="Current Occupations"
            label="Occupation"
            items={data.current_occupation || [""]}
            onChange={(items) => onChange("current_occupation", items)}
          />
        </div>
        <div className="col-span-2">
          <MultipleInput
            labels="Previous Occupations"
            label="Occupation"
            items={data.previous_occupation || [""]}
            onChange={(items) => onChange("previous_occupation", items)}
          />
        </div>
        <div className="col-span-2">
          <MultipleInput
            labels="Other Resident"
            label="Resident"
            items={data.other_resident || [""]}
            onChange={(items) => onChange("other_resident", items)}
          />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        <div className="mt-1 col-span-3">
          <div className="flex items-center justify-between w-[92%]">
            <label className="text-sm font-medium">Hobbies</label>
            <InputField
              type="toggleIcon"
              value={data.hobbies_visibility}
              onChange={(v) => onChange("hobbies_visibility", v)}
            />
          </div>
          <MultipleInput
            labels=""
            label="Hobbies"
            items={data.hobbies || [""]}
            onChange={(items) => onChange("hobbies", items)}
          />
        </div>
        <div className="col-span-2">
          <label className="text-sm font-medium">Signature Object</label>

          <MultipleInput
            labels=""
            label="Object"
            items={data.signature_object || [""]}
            onChange={(items) => onChange("signature_object", items)}
          />
        </div>
        <div className="col-span-2">
          <label className="text-sm font-medium">
            Signature Weapon/Spellcasting Focus
          </label>
          <MultipleInput
            labels=""
            label="Weapon"
            items={data.signature_weapon || [""]}
            onChange={(items) => onChange("signature_weapon", items)}
          />
        </div>
      </div>
    </div>
  );
}

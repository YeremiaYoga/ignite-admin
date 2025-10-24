"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

import InputField from "@/components/InputField";
import Cookies from "js-cookie";
import { Eye, EyeOff, Clipboard } from "lucide-react";
import { countryOptions, alignmentOptions } from "../../data/characterOptions";

export default function Step1({ data = {}, onChange }) {
  const [artPreview, setArtPreview] = useState(null);
  const [tokenPreview, setTokenPreview] = useState(null);
  const [raceOptions, setRaceOptions] = useState([]);
  const [backgroundOptions, setBackgroundOptions] = useState([]);
  const [subraceOptions, setSubraceOptions] = useState([]);
  const [noSubrace, setNoSubrace] = useState(false);

  const [talesMode, setTalesMode] = useState(false);
  const [privateId, setPrivateId] = useState("");
  const [publicId, setPublicId] = useState("");

  console.log(data);

  useEffect(() => {
    const mode = Cookies.get("ignite-tales-mode");
    setTalesMode(mode === "true");
  }, []);

  useEffect(() => {
    if (!artPreview && data.art_image) {
      setArtPreview(data.art_image);
    }
    if (!tokenPreview && data.token_image) {
      setTokenPreview(data.token_image);
    }

    if (data.art_image && !data.art) onChange("art", data.art_image);
    if (data.token_image && !data.token_art)
      onChange("token_art", data.token_image);

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
  }, [
    data.art_image,
    data.token_image,
    data.main_theme_ogg,
    data.combat_theme_ogg,
  ]);

  useEffect(() => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    const randomString = (len) => {
      let s = "";
      for (let i = 0; i < len; i++) {
        s += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return s;
    };

    const privateId = randomString(22);
    const publicId = randomString(18);

    setPrivateId(privateId);
    setPublicId(publicId);

    onChange("private_id", privateId);
    onChange("public_id", publicId);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const resRaces = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/races`
        );
        if (!resRaces.ok) throw new Error("Failed to fetch races");
        const races = await resRaces.json();

        setRaceOptions(
          races.map((r) => ({
            label: r.name,
            value: r.id,
            id: r.id,
            // image: r.image || r.main_image || "/assets/races/default.webp",
            description: r.description,
          }))
        );

        const resBackgrounds = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/backgrounds`
        );
        if (!resBackgrounds.ok)
          throw new Error(
            `Failed to fetch backgrounds: ${resBackgrounds.status}`
          );

        const backgrounds = await resBackgrounds.json();

        setBackgroundOptions(
          backgrounds.map((b) => ({
            label: b.name,
            value: b.id,
            id: b.id,
            // image: b.image || "/assets/backgrounds/default.webp",
            description: b.description || "",
          }))
        );
      } catch (err) {
        console.error("Fetch data error:", err);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!data.race_id) {
      setSubraceOptions([]);
      setNoSubrace(false);
      return;
    }

    const fetchSubraces = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/subraces/race/${data.race_id}`
        );
        if (!res.ok) throw new Error("Failed to fetch subraces");

        const subs = await res.json();
        if (subs.length === 0) {
          setNoSubrace(true);
          setSubraceOptions([]);
        } else {
          setNoSubrace(false);
          setSubraceOptions(
            subs.map((s) => ({
              label: s.name,
              value: s.id,
              id: s.id,
              description: s.description || "",
            }))
          );
        }
      } catch (err) {
        console.error("Fetch subraces error:", err);
        setNoSubrace(true);
        setSubraceOptions([]);
      }
    };

    fetchSubraces();
  }, [data.race_id]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicId);
    alert("ID copied to clipboard!");
  };

  const handleFile = (file, type) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "art") {
        setArtPreview(reader.result);
        onChange("art", file);
      }
      if (type === "token") {
        setTokenPreview(reader.result);
        onChange("token_art", file);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-900 text-gray-100 rounded-xl shadow-lg space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="space-y-4 col-span-2">
          <InputField
            label="Nickname"
            value={data.name}
            onChange={(val) => onChange("name", val)}
            placeholder="Please input your character’s nickname"
          />
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">Fullname</label>
              <InputField
                type="toggleIcon"
                value={data.full_name_visibility}
                onChange={(v) => onChange("full_name_visibility", v)}
              />
            </div>
            <InputField
              label=""
              value={data.full_name}
              onChange={(val) => onChange("full_name", val)}
              placeholder="Please input your character’s full name"
            />
          </div>

          <div>
            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium">Art :</span>
              <div className="flex items-center gap-3 ml-auto">
                <span className="text-gray-300 text-sm truncate max-w-[200px]">
                  {data.art ? data.art.name : "No file chosen"}
                </span>
                <label className="cursor-pointer px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
                  Upload
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(e) => handleFile(e.target.files[0], "art")}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <span className="text-xs text-gray-400 ml-auto block text-right">
              (JPG/WEBP/etc, max 5MB)
            </span>
          </div>
          <div>
            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium">Token :</span>
              <div className="flex items-center gap-3 ml-auto">
                <span className="text-gray-300 text-sm truncate max-w-[200px]">
                  {data.token_art ? data.token_art.name : "No file chosen"}
                </span>

                <label className="cursor-pointer px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
                  Upload
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(e) => handleFile(e.target.files[0], "token")}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <span className="text-xs text-gray-400 ml-auto block text-right">
              (JPG/WEBP/etc, max 5MB)
            </span>
          </div>
        </div>
        <div className="mt-[14px]">
          <div className=" mb-2 text-sm font-medium text-gray-200">
            <div className="flex items-center justify-between gap-2">
              <span className=" ">Public Id : {data.public_id}</span>
              <button onClick={copyToClipboard}>
                <Clipboard className="w-4 h-4 text-gray-400 hover:text-gray-200" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className=" ">Private Id : {data.private_id}</span>
            </div>
          </div>

          <div className="flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800 w-[230px] h-[230px] overflow-hidden">
            {artPreview ? (
              <img
                src={artPreview}
                alt="Preview"
                width={250}
                height={250}
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <span className="text-gray-500 text-sm">[ Art Preview ]</span>
            )}
          </div>
          <div className="text-center mt-2">Art</div>
        </div>

        <div className="mt-15">
          <div className="flex items-center justify-end mb-2 text-sm font-medium text-gray-200">
            <InputField
              type="toggleIcon"
              value={data.wiki_visibility}
              toggleLabel="Wiki Visibility"
              onChange={(v) => {
                if (!data.wiki_visibility && v === true) {
                  const confirmOpen = window.confirm(
                    "Are you certain you wish to make this your character public?"
                  );
                  if (!confirmOpen) return;
                }

                onChange("wiki_visibility", v);
              }}
            />
          </div>

          <div className="flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800 w-[230px] h-[230px] overflow-hidden">
            {tokenPreview ? (
              <img
                src={tokenPreview}
                alt="Preview"
                width={250}
                height={250}
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <span className="text-gray-500 text-sm">[ Token Preview ]</span>
            )}
          </div>
          <div className="text-center mt-2">Token</div>
        </div>
      </div>
      <hr className="border-gray-700" />

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <InputField
            label="Race"
            type="selectSearch"
            value={data.race_name}
            onChange={(val) => {
              const selected = raceOptions.find(
                (r) => r.id === val || r.value === val
              );
              onChange("race_id", selected?.id || "");
              onChange("race_name", selected?.label || "");
              onChange("subrace_id", "");
              onChange("subrace_name", "");
            }}
            placeholder={raceOptions.length ? "Select Race" : "Loading..."}
            options={raceOptions}
          />

          <div>
            <InputField
              label="Sub Race"
              type="selectSearch"
              value={data.subrace_name}
              onChange={(val) => {
                const selected = subraceOptions.find(
                  (s) => s.id === val || s.value === val
                );
                onChange("subrace_id", selected?.id || "");
                onChange("subrace_name", selected?.label || "");
              }}
              placeholder={
                !data.race_id
                  ? "Select race first"
                  : noSubrace
                  ? "No subrace available"
                  : subraceOptions.length
                  ? "Select Subrace"
                  : "Loading..."
              }
              options={subraceOptions}
              disabled={!data.race_id || noSubrace}
            />
            {data.race_id && noSubrace && (
              <p className="text-xs text-gray-400 italic mt-1">
                ⚠️ This race does not have any subrace.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <InputField
            label="Alignment"
            type="select"
            value={data.alignment}
            onChange={(val) => onChange("alignment", val)}
            placeholder="Please Choose Your Alignment"
            options={alignmentOptions}
          />

          <InputField
            label="Character Type"
            type="selectButton"
            value={data.character_type}
            onChange={(val) => onChange("character_type", val)}
            options={["Player", "NPC"]}
          />
        </div>
      </div>

      <hr className="border-gray-700" />

      <div className="grid grid-cols-5 gap-6">
        <div className="space-y-4 col-span-2">
          <InputField
            label="Status"
            type="selectButton"
            value={data.status}
            onChange={(val) => onChange("status", val)}
            options={["Alive", "Unknown", "Dead"]}
          />

          <div>
            <label className="block text-sm font-medium mb-1">Birth Year</label>
            <div className="flex gap-2 items-end">
              <input
                type="number"
                value={data.birth_year || ""}
                onChange={(e) => onChange("birth_year", e.target.value)}
                className="flex-1 h-12 px-3 rounded-lg bg-gray-800 border border-gray-700 
            focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />

              {talesMode ? (
                <select
                  value={data.birth_year_type || ""}
                  onChange={(e) => onChange("birth_year_type", e.target.value)}
                  className="w-24 h-12 px-3 rounded-lg bg-gray-800 border border-gray-700 
              focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                >
                  <option value="">Select</option>
                  <option value="AC">AC (After Calamity)</option>
                  <option value="CE">CE (Calamity Era)</option>
                  <option value="AV">AV (After Vallarian)</option>
                  <option value="AL">AL (After Liberation)</option>
                  <option value="AF">AF (After Lament of the Fallen) </option>
                  <option value="BC">BC (Before Chronicles)</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={data.birth_year_type || ""}
                  onChange={(e) => onChange("birth_year_type", e.target.value)}
                  placeholder="Type"
                  className="w-24 h-12 px-3 rounded-lg bg-gray-800 border border-gray-700 
              focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              )}
            </div>
          </div>

          {(data.status === "Dead" || data.status === "Unknown") && (
            <div>
              <label className="block text-sm font-medium mb-1">
                {data.status === "Unknown"
                  ? "Presume Death Year"
                  : "Death Year"}
              </label>
              <div className="flex gap-2 items-end">
                <input
                  type="number"
                  value={data.death_year || ""}
                  onChange={(e) => onChange("death_year", e.target.value)}
                  className="flex-1 h-12 px-3 rounded-lg bg-gray-800 border border-gray-700 
          focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
                {talesMode ? (
                  <select
                    value={data.death_year_type || ""}
                    onChange={(e) =>
                      onChange("death_year_type", e.target.value)
                    }
                    className="w-24 h-12 px-3 rounded-lg bg-gray-800 border border-gray-700 
            focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  >
                    <option value="">Select</option>
                    <option value="AC">AC (After Calamity)</option>
                    <option value="CE">CE (Calamity Era)</option>
                    <option value="AV">AV (After Vallarian)</option>
                    <option value="AL">AL (After Liberation)</option>
                    <option value="AF">AF (After Lament of the Fallen)</option>
                    <option value="BC">BC (Before Chronicles)</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={data.death_year_type || ""}
                    onChange={(e) =>
                      onChange("death_year_type", e.target.value)
                    }
                    placeholder="Type"
                    className="w-24 h-12 px-3 rounded-lg bg-gray-800 border border-gray-700 
            focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                )}
              </div>
            </div>
          )}

          <div className="flex  gap-4">
            <InputField
              label="Birth Place"
              value={data.birth_place}
              onChange={(val) => onChange("birth_place", val)}
              placeholder=""
            />
            {talesMode ? (
              <InputField
                label="Birth Country"
                type="select"
                value={data.birth_country}
                onChange={(val) => onChange("birth_country", val)}
                placeholder="Select Country"
                options={countryOptions}
              />
            ) : (
              <InputField
                label="Birth Country"
                value={data.birth_country}
                onChange={(val) => onChange("birth_country", val)}
                placeholder=""
              />
            )}
          </div>
        </div>

        <div className="space-y-4 col-span-3">
          <div className="grid grid-cols-2 gap-4 items-start">
            <InputField
              label="Gender"
              type="select"
              value={data.gender}
              onChange={(val) => onChange("gender", val)}
              placeholder="Select Gender"
              options={["Male", "Female", "Nonbinary", "Undefined"]}
            />

            <div>
              <label className="block text-sm font-medium mb-1">Height</label>
              <div className="flex gap-2 items-end">
                {data.height_unit === "imperial" ? (
                  <div className="flex gap-2 flex-1">
                    <input
                      type="number"
                      placeholder="Feet"
                      value={data.height?.feet || ""}
                      min={0}
                      onChange={(e) =>
                        onChange("height", {
                          ...data.height,
                          feet: e.target.value,
                        })
                      }
                      className="w-1/2 h-12 px-3 rounded-lg bg-gray-800 border border-gray-700 
          focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Inch"
                      value={data.height?.inch || ""}
                      min={0}
                      max={11}
                      onChange={(e) =>
                        onChange("height", {
                          ...data.height,
                          inch: e.target.value,
                        })
                      }
                      className="w-1/2 h-12 px-3 rounded-lg bg-gray-800 border border-gray-700 
          focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                ) : (
                  <input
                    type="number"
                    placeholder="Cm"
                    value={data.height?.centimeter || ""}
                    onChange={(e) =>
                      onChange("height", {
                        ...data.height,
                        centimeter: e.target.value,
                      })
                    }
                    className="flex-1 h-12 px-3 rounded-lg bg-gray-800 border border-gray-700 
        focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                )}

                <select
                  value={data.height_unit || ""}
                  onChange={(e) => {
                    const newUnit = e.target.value;

                    onChange("height_unit", newUnit);

                    const newHeight = { feet: "", inch: "", centimeter: "" };
                    onChange("height", newHeight);
                  }}
                  className="w-20 h-12 px-3 rounded-lg bg-gray-800 border border-gray-700 
      focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                >
                  <option value="metric">Cm</option>
                  <option value="imperial">Ft/In</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-start">
            <InputField
              label="Pronoun"
              type="select"
              value={data.pronoun}
              onChange={(val) => onChange("pronoun", val)}
              placeholder="Select Pronoun"
              options={[
                "He/Him",
                "She/Her",
                "They/Them",
                "It/Its",
                "No Pronouns",
              ]}
            />

            <div>
              <label className="block text-sm font-medium mb-1">Weight</label>
              <div className="flex gap-2 items-end">
                <input
                  type="number"
                  placeholder={data.weight_unit === "imperial" ? "Lb" : "Kg"}
                  value={
                    data.weight_unit === "imperial"
                      ? data.weight?.pounds ?? ""
                      : data.weight?.kilogram ?? ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    const newWeight =
                      data.weight_unit === "imperial"
                        ? { ...(data.weight || {}), pounds: val }
                        : { ...(data.weight || {}), kilogram: val };
                    onChange("weight", newWeight);
                  }}
                  className="flex-1 h-12 px-3 rounded-lg bg-gray-800 border border-gray-700 
        focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />

                <select
                  value={data.weight_unit || ""}
                  onChange={(e) => {
                    const unit = e.target.value;

                    const newWeight =
                      unit === "imperial"
                        ? { pounds: data.weight?.pounds ?? "", kilogram: "" }
                        : { pounds: "", kilogram: data.weight?.kilogram ?? "" };

                    onChange("weight_unit", unit);
                    onChange("weight", newWeight);
                  }}
                  className="w-20 h-12 px-3 rounded-lg bg-gray-800 border border-gray-700 
        focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                >
                  <option value="imperial">Lb</option>
                  <option value="metric">Kg</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Skin Colour"
              type="text"
              value={data.skin_colour}
              onChange={(val) => onChange("skin_colour", val)}
            />
            <InputField
              label="Hair"
              type="text"
              value={data.hair}
              onChange={(val) => onChange("hair", val)}
            />
          </div>

          {data.character_type === "Player" && (
            <InputField
              label="Background"
              type="selectSearch"
              value={data.backgrounds}
              onChange={(val) => onChange("backgrounds", val)}
              placeholder={
                backgroundOptions.length ? "Select Background" : "Loading..."
              }
              options={backgroundOptions}
            />
          )}
        </div>
      </div>
    </div>
  );
}

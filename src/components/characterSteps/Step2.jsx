"use client";
import { useState } from "react";
import InputField from "@/components/InputField";
import MultipleInput from "@/components/MultipleInput.jsx";
import { Eye, EyeOff } from "lucide-react";
import {
  allTraitsOptions,
  economicalOptions,
  socialClassOptions,
} from "../../data/characterOptions";
import RichTextEditor from "@/components/RichTextEditor";
export default function Step2({ data, allData, onChange }) {
  const step2 = data || {};

  const allTraitsWithImages = allTraitsOptions.map((trait) => ({
    value: trait.toLowerCase(),
    label: trait,
    image: `/assets/personality_icon/${trait.toLowerCase()}.webp`,
  }));

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-900 text-gray-100 rounded-xl shadow-lg space-y-6">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-9 flex items-center">
          <p className="text-lg font-semibold">
            {allData?.step1?.name || "Unknown"}'s Profile
          </p>
        </div>

        {allData?.step1?.character_type === "NPC" && (
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">
              Personality Traits
            </label>
            <div className="grid grid-cols-2 gap-2">
              <InputField
                type="selectImage"
                value={step2.personality_traits?.[0] || ""}
                onChange={(val) => {
                  const updated = [...(step2.personality_traits || [])];
                  updated[0] = val;
                  onChange("personality_traits", updated);
                }}
                options={allTraitsWithImages.filter(
                  (t) => t.value !== step2.personality_traits?.[1]
                )}
                placeholder="Select Trait"
              />

              <InputField
                type="selectImage"
                value={step2.personality_traits?.[1] || ""}
                onChange={(val) => {
                  const updated = [...(step2.personality_traits || [])];
                  updated[1] = val;
                  onChange("personality_traits", updated);
                }}
                options={allTraitsWithImages.filter(
                  (t) => t.value !== step2.personality_traits?.[0]
                )}
                placeholder="Select Trait"
              />
            </div>
          </div>
        )}

        <div className="col-span-9">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">Backstory</label>
            <InputField
         
              type="toggleIcon"
              value={step2.backstory_visibility}
              onChange={(v) => onChange("backstory_visibility", v)}
            />
  
          </div>
          <RichTextEditor
            value={step2.backstory || ""}
            onChange={(html) => onChange("backstory", html)}
            placeholder="backstory"
            rows={22}
          />
        </div>

        <div className="col-span-3 space-y-4">
          {allData?.step1?.character_type === "NPC" && (
            <InputField
              label="Voice Style"
              value={step2.voice_style || ""}
              onChange={(val) => onChange("voice_style", val)}
              placeholder="Enter voice style"
              rows={4}
            />
          )}
          <InputField
            label="Main Personality"
            value={step2.main_personality || ""}
            onChange={(val) => onChange("main_personality", val)}
            placeholder="Enter main personality"
          />
          <InputField
            label="Previous Economical Standing"
            type="select"
            value={data.previous_economical_standing}
            onChange={(val) => onChange("previous_economical_standing", val)}
            placeholder="Select Economical Standing"
            options={economicalOptions}
          />
          <InputField
            label="Current Economical Standing"
            type="select"
            value={data.current_last_economical_standing}
            onChange={(val) =>
              onChange("current_last_economical_standing", val)
            }
            placeholder="Select Economical Standing"
            options={economicalOptions}
          />
          <InputField
            label="Previous Social Classes"
            type="select"
            value={data.previous_social_classes}
            onChange={(val) => onChange("previous_social_classes", val)}
            placeholder="Select Sosial Classes"
            options={socialClassOptions}
          />
          <InputField
            label="Current Social Classes"
            type="select"
            value={data.current_social_classes}
            onChange={(val) => onChange("current_social_classes", val)}
            placeholder="Select Sosial Classes"
            options={socialClassOptions}
          />
        </div>

        <hr className="col-span-12 border-t border-gray-700 my-2" />

        <div className="col-span-12 grid grid-cols-12 gap-4 items-start">
          <div className="col-span-3">
            <MultipleInput
              labels="Wayfarer (Path)"
              label="Path"
              items={step2.wayfarer || [""]}
              onChange={(vals) => onChange("wayfarer", vals)}
              selectOptions={[
                { label: "Test1", value: "Test1" },
                { label: "Test2", value: "Test2" },
                { label: "Test3", value: "Test3" },
              ]}
            />
          </div>

          <div className="col-span-5">
            <MultipleInput
              labels="Titles"
              label="Title"
              type="object"
              fields={["name", "from"]}
              items={
                step2.titles && step2.titles.length
                  ? step2.titles
                  : [{ name: "", from: "" }]
              }
              onChange={(vals) => onChange("titles", vals)}
            />
          </div>

          <div className="col-span-4">
            <MultipleInput
              labels="Detailed Personality"
              label="Detail"
              items={
                step2.detailed_personality && step2.detailed_personality.length
                  ? step2.detailed_personality
                  : [""]
              }
              onChange={(vals) => onChange("detailed_personality", vals)}
            />
          </div>
        </div>

        <hr className="col-span-12 border-t border-gray-700 my-2" />

        <div className="col-span-6">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">Fear / Weakness</label>
            <InputField
         
              type="toggleIcon"
              value={data.fear_weakness_visibility}
              onChange={(v) => onChange("fear_weakness_visibility", v)}
            />
           
          </div>
          <MultipleInput
            labels=""
            label="Fear or Weakness"
            type="object"
            fields={["fear/weak", "from"]}
            items={
              step2.fear_weakness && step2.fear_weakness.length
                ? step2.fear_weakness
                : [{ fear_weak: "", from: "" }]
            }
            onChange={(vals) => onChange("fear_weakness", vals)}
          />
        </div>

        <div className="col-span-6">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">Motivation</label>
            <InputField
             
              type="toggleIcon"
              value={data.motivation_visibility}
              onChange={(v) => onChange("motivation_visibility", v)}
            />
          
          </div>
          <MultipleInput
            labels=""
            label="Motivation Item"
            type="object"
            fields={["motivation", "from", "how"]}
            items={
              step2.motivation && step2.motivation.length
                ? step2.motivation
                : [{ motivation: "", from: "", how: "" }]
            }
            onChange={(vals) => onChange("motivation", vals)}
          />
        </div>
      </div>
    </div>
  );
}

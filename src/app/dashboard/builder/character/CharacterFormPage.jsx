"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Step1 from "@/components/characterSteps/Step1";
import Step2 from "@/components/characterSteps/Step2";
import Step3 from "@/components/characterSteps/Step3";
import Step4 from "@/components/characterSteps/Step4";
import Step5 from "@/components/characterSteps/Step5";

export default function CharacterFormPage({ mode = "create" }) {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const searchParams = useSearchParams();
  const initialStep = parseInt(searchParams.get("step") || "0", 10);

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(mode === "edit");

  const steps = [
    { title: "Step 1", component: Step1 },
    { title: "Step 2", component: Step2 },
    { title: "Step 3", component: Step3 },
    { title: "Step 4", component: Step4 },
    { title: "Step 5", component: Step5 },
  ];

  useEffect(() => {
    if (mode !== "edit" || !id) {
      setFormData(getDefaultForm());
      return;
    }

    const fetchCharacter = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/characters/${id}`,
          {
            credentials: "include",
          }
        );
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load character");
        setFormData({
          ...getDefaultForm(),
          ...json,
          height: json.height || { feet: 0, inch: 0, centimeter: 0 },
          weight: json.weight || { pounds: 0, kilogram: 0 },
          size: json.size || { general: "Medium", vtt_size: "med" },
          main_resident: json.main_resident || { resident: "", country: "" },
        });
      } catch (err) {
        console.error("❌ Error fetching character:", err);
        alert("Failed to load character data.");
        router.push("/dashboard/builder/character");
      } finally {
        setLoading(false);
      }
    };
    fetchCharacter();
  }, [mode, id]);

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const goToStep = (step) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
      const basePath =
        mode === "edit"
          ? `/dashboard/builder/character/edit/${id}`
          : `/dashboard/builder/character/create`;
      router.push(`${basePath}?step=${step}`, { scroll: false });
    }
  };

  const nextStep = () => goToStep(currentStep + 1);
  const prevStep = () => goToStep(currentStep - 1);

  // 💾 Save or Update
  const handleSubmit = async () => {
    try {
      if (!formData) return;
      setSaving(true);

      const form = new FormData();
      form.append("data", JSON.stringify(formData));
      ["art", "token_art", "main_theme_ogg", "combat_theme_ogg"].forEach(
        (f) => {
          if (formData[f] instanceof File) form.append(f, formData[f]);
        }
      );

      const url =
        mode === "edit"
          ? `${process.env.NEXT_PUBLIC_API_URL}/characters/${id}`
          : `${process.env.NEXT_PUBLIC_API_URL}/characters/save`;

      const res = await fetch(url, {
        method: mode === "edit" ? "PUT" : "POST",
        body: form,
        credentials: "include",
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Save failed");

      alert(`✅ Character ${mode === "edit" ? "updated" : "saved"}!`);
      router.replace("/dashboard/builder/character");
    } catch (err) {
      console.error("❌ Save error:", err);
      alert("❌ Failed to save character.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading character data...
      </div>
    );

  const CurrentComponent = steps[currentStep].component;

  return (
    <main className="mx-auto px-4 py-8 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.push("/dashboard/builder/character")}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded shadow text-sm"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold text-center flex-1">
          {mode === "edit" ? "Edit Character" : "Create Character"}
        </h1>

        <div className="w-[80px]" />
      </div>

      {/* STEP INDICATOR */}
      <div className="flex justify-center mb-4 gap-2">
        {steps.map((_, idx) => (
          <div
            key={idx}
            onClick={() => goToStep(idx)}
            className={`cursor-pointer w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${
              idx === currentStep
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {idx + 1}
          </div>
        ))}
      </div>

      {/* NAVIGATION BUTTONS */}
      <div className="flex justify-between mb-4">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`px-4 py-2 rounded shadow ${
            currentStep === 0
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Previous
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className={`px-4 py-2 rounded shadow ${
              saving
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {saving ? "Saving..." : "Save"}
          </button>

          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded shadow"
            >
              Finish
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded shadow"
            >
              Next
            </button>
          )}
        </div>
      </div>

      {/* STEP CONTENT */}
      <div className="p-6 rounded-lg shadow bg-[#0b1230] border border-slate-700">
        <CurrentComponent
          data={formData}
          allData={formData}
          onChange={handleChange}
        />
      </div>
    </main>
  );
}

// default form factory
function getDefaultForm() {
  return {
    name: "",
    full_name: "",
    full_name_visibility: false,
    art: "",
    token_art: "",
    private_id: "",
    race_id: "",
    subrace_id: "",
    background_id: "",
    public_id: "",
    character_type: "",
    alignment: "",
    status: "",
    birth_year: "",
    birth_year_type: "",
    death_year: "",
    death_year_type: "",
    birth_place: "",
    birth_country: "",
    gender: "",
    pronoun: "",
    height: { feet: 0, inch: 0, centimeter: 0 },
    weight: { pounds: 0, kilogram: 0 },
    skin_colour: "",
    hair: "",
    wiki_visibility: false,
    weight_unit: "imperial",
    height_unit: "imperial",

    backstory_visibility: false,
    backstory: "",
    voice_style: "",
    wayfarer: "",
    personality_traits: [],
    main_personality: "",
    detailed_personality: [],
    titles: [],
    fear_weakness_visibility: false,
    fear_weakness: [],
    motivation_visibility: false,
    motivation: [],
    previous_economical_standing: "",
    current_last_economical_standing: "",
    previous_social_classes: "",
    current_social_classes: "",
    appearance_visibility: false,
    appearance: "",
    main_theme: "",
    main_theme_ogg: "",
    combat_theme: "",
    combat_theme_ogg: "",
    nationality: "",
    main_resident: { resident: "", country: "" },
    notable_details: [],
    current_occupation: [],
    previous_occupation: [],
    other_resident: [],
    hobbies_visibility: false,
    hobbies: [],
    signature_object: [],
    signature_weapon: [],
    notable_accomplishments: [],
    connection_towards_events: [],
    notable_quotes: "",
    quotes_from_others: [],
    family: [],
    allies: [],
    friends: [],
    enemies: [],
    subordinates: [],
    affiliations: [],
    special_relationship: [],
    combat_value: 0,
    vision: "",
    disposition: "",
    damage_type: "",
    str: 0,
    dex: 0,
    con: 0,
    int: 0,
    wis: 0,
    cha: 0,
    size: { general: "Medium", vtt_size: "med" },
    creature_type: "Humanoid",
    personality_combat_style: "",
    skill_prof: [],
    incumbency_id: "",
  };
}

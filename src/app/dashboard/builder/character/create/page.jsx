"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Step1 from "@/components/characterSteps/Step1";
import Step2 from "@/components/characterSteps/Step2";
import Step3 from "@/components/characterSteps/Step3";
import Step4 from "@/components/characterSteps/Step4";
import Step5 from "@/components/characterSteps/Step5";

export default function CreateCharacterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStep = parseInt(searchParams.get("step") || "0", 10);
  const [currentStep, setCurrentStep] = useState(initialStep);

  const [formData, setFormData] = useState({
    step1: {
      name: "",
      fullname: "",
      fullname_visibility: false,
      art: "",
      token_art: "",
      uuid: "",
      race: "",
      subrace: "",
      background: "",
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
    },
    step2: {
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
    },
    step3: {
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
    },
    step4: {
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
    },
    step5: {
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
    },
  });

  const steps = [
    { title: "Step 1", component: Step1, key: "step1" },
    { title: "Step 2", component: Step2, key: "step2" },
    { title: "Step 3", component: Step3, key: "step3" },
    { title: "Step 4", component: Step4, key: "step4" },
    { title: "Step 5", component: Step5, key: "step5" },
  ];

  const handleChange = (stepKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [stepKey]: { ...prev[stepKey], [field]: value },
    }));
  };

  const goToStep = (step) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
      router.push(`/dashboard/builder/character/create?step=${step}`, {
        scroll: false,
      });
    }
  };

  const nextStep = () => goToStep(currentStep + 1);
  const prevStep = () => goToStep(currentStep - 1);

  const handleSubmit = async () => {
    try {
      const merged = {
        ...formData.step1,
        ...formData.step2,
        ...formData.step3,
        ...formData.step4,
        ...formData.step5,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/characters/save`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(merged),
        }
      );

      if (!res.ok) throw new Error("Save failed");
      alert("✅ Character saved!");
      router.replace("/dashboard/builder/character");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save character.");
    }
  };

  const CurrentComponent = steps[currentStep].component;
  const stepKey = steps[currentStep].key;
  const stepData = formData[stepKey];

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
          Create Character
        </h1>

        <div className="w-[80px]" />
      </div>

      <div className="flex justify-center mb-4 gap-2">
        {steps.map((s, idx) => (
          <div
            key={s.key}
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

      {/* Step content */}
      <div className="p-6 rounded-lg shadow bg-[#0b1230] border border-slate-700">
        <CurrentComponent
          data={stepData}
          allData={formData}
          onChange={(field, value) => handleChange(stepKey, field, value)}
        />
      </div>
    </main>
  );
}

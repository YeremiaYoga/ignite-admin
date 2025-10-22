"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Step1 from "@/components/characterSteps/Step1";
import Step2 from "@/components/characterSteps/Step2";
import Step3 from "@/components/characterSteps/Step3";
import Step4 from "@/components/characterSteps/Step4";
import Step5 from "@/components/characterSteps/Step5";

export default function EditCharacterPage() {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const initialStep = parseInt(searchParams.get("step") || "0", 10);

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState(null);

  const steps = [
    { title: "Step 1", component: Step1, key: "step1" },
    { title: "Step 2", component: Step2, key: "step2" },
    { title: "Step 3", component: Step3, key: "step3" },
    { title: "Step 4", component: Step4, key: "step4" },
    { title: "Step 5", component: Step5, key: "step5" },
  ];

  /** 🧭 Fetch character data by ID */
  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/characters/${id}`, {
          credentials: "include",
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load character");

        // 🟢 Pastikan struktur sama seperti formData create
        setFormData({
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
  }, [id]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const goToStep = (step) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
      router.push(`/dashboard/builder/character/edit/${id}?step=${step}`, {
        scroll: false,
      });
    }
  };

  const nextStep = () => goToStep(currentStep + 1);
  const prevStep = () => goToStep(currentStep - 1);

  /** 💾 Handle Update Submit */
  const handleSubmit = async () => {
    try {
      if (!formData) return;
      setSaving(true);

      const form = new FormData();
      form.append("data", JSON.stringify(formData));
      if (formData.art) form.append("art", formData.art);
      if (formData.token_art) form.append("token_art", formData.token_art);
      if (formData.main_theme_ogg) form.append("main_theme_ogg", formData.main_theme_ogg);
      if (formData.combat_theme_ogg) form.append("combat_theme_ogg", formData.combat_theme_ogg);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/characters/${id}`, {
        method: "PUT",
        body: form,
        credentials: "include",
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Update failed");

      alert("✅ Character updated!");
      router.replace("/dashboard/builder/character");
    } catch (err) {
      console.error("❌ Update error:", err);
      alert("❌ Failed to update character.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading character data...
      </div>
    );
  }

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
          Edit Character
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
          <button
            // onClick={handleSubmit}
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
              // onClick={handleSubmit}
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

"use client";
import { useEffect, useState } from "react";
import InputField from "@/components/InputField";
import RichTextAdvanced from "@/components/RichTextAdvanced";

export default function SpeciesForm({ data, onClose }) {
  const [form, setForm] = useState({
    name: "",
    img: null,
    main_img: null,
    source: null,
    version: "1",
    group_type_name: "",
    group_type_id: "",
    short_description: "",
    description: "",
    public: false,
  });

  const [sources, setSources] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Update form kalau props data berubah (fix edit mode)
  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || "",
        img: null,
        main_img: null,
        source: data.source || null,
        version: data.version || "1",
        group_type_name: data.group_type_name || "",
        group_type_id: data.group_type_id || "",
        short_description: data.short_description || "",
        description: data.description || "",
        public: data.public ?? false,
      });
    } else {
      // reset kalau tambah baru
      setForm({
        name: "",
        img: null,
        main_img: null,
        source: null,
        version: "1",
        group_type_name: "",
        group_type_id: "",
        short_description: "",
        description: "",
        public: false,
      });
    }
  }, [data]);

  // 🔁 Fetch Source & Group Type
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [srcRes, grpRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/dnd-source`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/species-group-type`),
        ]);
        const [srcData, grpData] = await Promise.all([
          srcRes.ok ? srcRes.json() : [],
          grpRes.ok ? grpRes.json() : [],
        ]);
        setSources(srcData || []);
        setGroups(grpData || []);
      } catch (err) {
        console.error("❌ Failed to load selectors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleFileChange = (key, file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, [key]: file, [`${key}_preview`]: preview }));
  };

  const handleSave = async () => {
    try {
      const method = data ? "PUT" : "POST";
      const url = data
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/species/${data.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/species`;

      const token = localStorage.getItem("admin_token");

      const formData = new FormData();
      formData.append("data", JSON.stringify(form));
      if (form.img) formData.append("img", form.img);
      if (form.main_img) formData.append("main_img", form.main_img);

      const res = await fetch(url, {
        method,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (res.ok) {
        alert("✅ Saved successfully");
        onClose();
      } else {
        const msg = await res.text();
        alert(`❌ Failed: ${msg}`);
      }
    } catch (err) {
      console.error("💥 Save error:", err);
      alert("❌ Error saving data");
    }
  };

  if (loading)
    return <div className="p-6 text-gray-400 text-center">Loading form data...</div>;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 space-y-6">
      {/* ✅ Name */}
      <InputField
        label="Name"
        value={form.name}
        onChange={(v) => handleChange("name", v)}
        placeholder="Enter species name"
      />

      {/* ✅ Image Upload with Preview */}
      <div className="grid grid-cols-2 gap-4">
        {/* Image */}
        <div>
          <label className="block text-sm mb-1 text-gray-300">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange("img", e.target.files[0])}
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-3 
                       file:rounded-md file:border-0 file:text-sm file:font-semibold 
                       file:bg-emerald-700 file:text-white hover:file:bg-emerald-600"
          />
          {(form.img_preview || data?.img) && (
            <img
              src={form.img_preview || data?.img}
              alt="preview"
              className="mt-2 w-32 h-32 object-cover rounded border border-gray-700"
            />
          )}
        </div>

        {/* Main Image */}
        <div>
          <label className="block text-sm mb-1 text-gray-300">Main Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange("main_img", e.target.files[0])}
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-3 
                       file:rounded-md file:border-0 file:text-sm file:font-semibold 
                       file:bg-emerald-700 file:text-white hover:file:bg-emerald-600"
          />
          {(form.main_img_preview || data?.main_img) && (
            <img
              src={form.main_img_preview || data?.main_img}
              alt="preview"
              className="mt-2 w-32 h-32 object-cover rounded border border-gray-700"
            />
          )}
        </div>
      </div>

      {/* ✅ Source & Group Type */}
      <div className="grid grid-cols-2 gap-4">
        {/* Source */}
        <div>
          <label className="block text-sm mb-1 text-gray-300">Source</label>
          <select
            value={form.source || ""}
            onChange={(e) => handleChange("source", e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-200 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Select Source</option>
            {sources.map((src) => (
              <option key={src.id} value={src.name}>
                {src.name}
              </option>
            ))}
          </select>
        </div>

        {/* Group Type */}
        <div>
          <label className="block text-sm mb-1 text-gray-300">Group Type</label>
          <select
            value={form.group_type_id || ""}
            onChange={(e) => {
              const selected = groups.find((g) => g.id.toString() === e.target.value);
              handleChange("group_type_name", selected?.name || "");
              handleChange("group_type_id", selected?.id || "");
            }}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-200 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Select Group</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ✅ Public Switch */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-300">Public</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={form.public}
            onChange={(e) => handleChange("public", e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-emerald-600 transition-colors"></div>
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition-transform"></div>
        </label>
      </div>

      {/* ✅ RichText Fields */}
      <div>
        <label className="block text-sm mb-1">Short Description</label>
        <RichTextAdvanced
          value={form.short_description}
          onChange={(v) => handleChange("short_description", v)}
          placeholder="Write short description..."
          rows={6}
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Description</label>
        <RichTextAdvanced
          value={form.description}
          onChange={(v) => handleChange("description", v)}
          placeholder="Write full description..."
          rows={12}
        />
      </div>

      {/* ✅ Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
        <button
          onClick={onClose}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded text-white"
        >
          Save
        </button>
      </div>
    </div>
  );
}

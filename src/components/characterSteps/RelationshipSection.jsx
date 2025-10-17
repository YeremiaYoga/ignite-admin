"use client";

import InputField from "@/components/InputField";
import { Upload, X } from "lucide-react";

export const STATUS_OPTIONS = {
  general: [
    { value: "Alive", label: "Alive" },
    { value: "Dead", label: "Dead" },
    { value: "Unknown", label: "Unknown" },
  ],
  affiliation: [
    { value: "Active", label: "Active" },
    { value: "Unknown", label: "Unknown" },
    { value: "Inactive", label: "Inactive" },
  ],
};

export default function RelationshipSection({
  title,
  keyName,
  data,
  onChange,
  relationshipOptions = [],
}) {
  const members =
    data[keyName] && data[keyName].length > 0 ? data[keyName] : [{}];

  const handleUpdate = (index, key, val) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [key]: val };
    onChange(keyName, updated);
  };

  const handleRemove = (index) => {
    const updated = [...members];
    updated.splice(index, 1);
    onChange(keyName, updated);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 capitalize">
        {title.replace(/_/g, " ")}
      </h3>

      {members.map((member, index) => (
        <div
          key={index}
          className="mb-4 space-y-2 p-3 border border-gray-700 rounded-lg relative"
        >
          <button
            type="button"
            className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-md"
            onClick={() => handleRemove(index)}
          >
            <X size={14} />
          </button>

          <div className="grid grid-cols-10 gap-2">
            <div className="col-span-5">
              <InputField
                placeholder="Name"
                value={member.name || ""}
                onChange={(val) => handleUpdate(index, "name", val)}
              />
            </div>
            <div className="col-span-2">
              <InputField
                type="select"
                placeholder="Select Status"
                value={member.status || ""}
                options={
                  keyName === "affiliations"
                    ? STATUS_OPTIONS.affiliation
                    : STATUS_OPTIONS.general
                }
                onChange={(val) => handleUpdate(index, "status", val)}
              />
            </div>
            <div className="col-span-3">
              <InputField
                type={keyName === "special_relationship" ? "text" : "select"}
                placeholder="Relationship"
                value={member.relationship || ""}
                options={
                  keyName === "special_relationship"
                    ? []
                    : relationshipOptions.map((opt) =>
                        typeof opt === "string"
                          ? { value: opt, label: opt }
                          : opt
                      )
                }
                onChange={(val) => handleUpdate(index, "relationship", val)}
              />
            </div>
          </div>

          <div className="grid grid-cols-16 gap-2">
            <div className="col-span-4 flex items-center gap-4">
              <InputField
                label=""
                placeholder="ID Link"
                value={member.id_link || ""}
                onChange={(val) => handleUpdate(index, "id_link", val)}
              />
              <button
                type="button"
                className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
                onClick={() => console.log("Upload for:", member.id_link)}
              >
                <Upload size={18} />
              </button>
            </div>

            <div className="col-span-12">
              <InputField
                type="text"
                placeholder="Write notes here..."
                value={member.notes || ""}
                onChange={(val) => handleUpdate(index, "notes", val)}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="mt-2 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
        onClick={() =>
          onChange(keyName, [
            ...members,
            { name: "", status: "", relationship: "", id_link: "", notes: "" },
          ])
        }
      >
        Add {title.replace(/_/g, " ")}
      </button>
    </div>
  );
}

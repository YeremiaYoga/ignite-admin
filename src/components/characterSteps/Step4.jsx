"use client";
import InputField from "@/components/InputField";
import RelationshipSection from "./RelationshipSection.jsx";
import MultipleInput from "@/components/MultipleInput.jsx";
import { Upload, X } from "lucide-react";
import {
  familyOptions,
  alliesOptions,
  friendsOptions,
  enemiesOptions,
  subordinatesOptions,
  affiliationsOptions,
} from "../../data/characterOptions";
export default function Step4({ data, allData, onChange }) {

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-900 text-gray-100 rounded-xl shadow-lg space-y-6">
      <div className="grid grid-cols-10 gap-6">
        <div className="space-y-2 col-span-6">
          <MultipleInput
            labels="Notable Accomplishments"
            label="Notable"
            items={data.notable_accomplishments || [""]}
            onChange={(items) => onChange("notable_accomplishments", items)}
          />

          <div className="mt-3 space-y-2">
            <label className="block text-sm font-medium">
              Connection Towards Events
            </label>

            {(data.connection_towards_events && data.connection_towards_events.length > 0
              ? data.connection_towards_events
              : [
                  {
                    name: "",
                    id_event: "",
                    connection: "",
                    connection_notes: "",
                  },
                ]
            ).map((conn, idx) => (
              <div
                key={idx}
                className="relative border border-gray-700 rounded-lg p-3 mb-3 space-y-2"
              >
                <button
                  type="button"
                  onClick={() => {
                    const updated = (data.connection_towards_events || []).filter(
                      (_, i) => i !== idx
                    );
                    onChange("connection_towards_events", updated);
                  }}
                  className="absolute -top-3 -right-3 p-1 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md"
                >
                  <X size={16} strokeWidth={2} />
                </button>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <InputField
                      label=""
                      value={conn.name || ""}
                      onChange={(val) => {
                        const updated = [...(data.connection_towards_events || [])];
                        updated[idx] = { ...conn, name: val };
                        onChange("connection_towards_events", updated);
                      }}
                      placeholder="Enter Event Name"
                    />
                  </div>
                  <div className="col-span-1">
                    <InputField
                      label=""
                      value={conn.id_event || ""}
                      onChange={(val) => {
                        const updated = [...(data.connection_towards_events || [])];
                        updated[idx] = { ...conn, id_event: val };
                        onChange("connection_towards_events", updated);
                      }}
                      placeholder="Enter ID Event"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <InputField
                      type="select"
                      label=""
                      value={conn.connection || ""}
                      onChange={(val) => {
                        const updated = [...(data.connection_towards_events || [])];
                        updated[idx] = { ...conn, connection: val };
                        onChange("connection_towards_events", updated);
                      }}
                      options={[
                        "Direct/Fully Involved",
                        "Indirect/Partial Involvement",
                        "Witness/Observer",
                        "Affected/Impacted",
                        "Supporter/Enabler",
                        "Opposer/Saboteur",
                        "Unaware/Ignorant",
                        "Peripheral/Background",
                        "Catalyst/Domino Creator",
                        "Beneficiary/Exploiter",
                      ]}
                    />
                  </div>
                  <div className="col-span-2">
                    <InputField
                      label=""
                      value={conn.connection_notes || ""}
                      onChange={(val) => {
                        const updated = [...(data.connection_towards_events || [])];
                        updated[idx] = { ...conn, connection_notes: val };
                        onChange("connection_towards_events", updated);
                      }}
                      placeholder="Enter Notes"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="mt-2 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
              onClick={() =>
                onChange("connection_towards_events", [
                  ...(data.connection_towards_events && data.connection_towards_events.length > 0
                    ? data.connection_towards_events
                    : []),
                  {
                    name: "",
                    id_event: "",
                    connection: "",
                    connection_notes: "",
                  },
                ])
              }
            >
              + Add Connection
            </button>
          </div>
        </div>

        <div className="space-y-2 col-span-4">
          <InputField
            label="Notable Quotes"
            value={data.notable_quotes || ""}
            onChange={(val) => onChange("notable_quotes", val)}
            placeholder="Enter Notable Quotes"
            hint="test info"
          />

          <div className="mt-3 space-y-2">
            <MultipleInput
              labels="Quotes From Others"
              label="Quote"
              type="object"
              fields={["quote", "author"]}
              items={
                data.quotes_from_others && data.quotes_from_others.length
                  ? data.quotes_from_others
                  : [{ quote: "", author: "" }]
              }
              onChange={(vals) => onChange("quotes_from_others", vals)}
              columns={1}
            />
          </div>
        </div>
      </div>

      <RelationshipSection
        title="Family"
        keyName="family"
        data={data}
        onChange={onChange}
        relationshipOptions={familyOptions}
      />

      <RelationshipSection
        title="Allies"
        keyName="allies"
        data={data}
        onChange={onChange}
        relationshipOptions={alliesOptions}
      />
      <RelationshipSection
        title="Friends"
        keyName="friends"
        data={data}
        onChange={onChange}
        relationshipOptions={friendsOptions}
      />
      <RelationshipSection
        title="Enemies"
        keyName="enemies"
        data={data}
        onChange={onChange}
        relationshipOptions={enemiesOptions}
      />
      <RelationshipSection
        title="Subordinates"
        keyName="subordinates"
        data={data}
        onChange={onChange}
        relationshipOptions={subordinatesOptions}
      />
      <RelationshipSection
        title="Affiliations"
        keyName="affiliations"
        data={data}
        onChange={onChange}
        relationshipOptions={affiliationsOptions}
      />

      <RelationshipSection
        title="Special Relationship"
        keyName="special_relationship"
        data={data}
        onChange={onChange}
      />
    </div>
  );
}

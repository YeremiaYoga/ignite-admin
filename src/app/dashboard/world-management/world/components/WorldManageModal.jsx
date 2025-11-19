"use client";

import { useEffect, useState } from "react";
import InputField from "@/components/InputField";

const API_BASE =
  (typeof process !== "undefined" &&
    (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")) ||
  "";

function getAuthHeaders() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function WorldManageModal({ world, onClose, onSaved }) {
  const [form, setForm] = useState({
    creators: world.creators || [],
    links_enabled: world.links_enabled ?? false,
    links: world.links || [],

    discord_enabled: world.discord_enabled ?? false,
    discord_link: world.discord_link || "",
    discord_pass_mode: world.discord_pass_mode ?? false,
    discord_pass: world.discord_pass || "",

    ages: world.ages || { world_age: 0, list: [] },
  });

  const [saving, setSaving] = useState(false);

  // 🔹 users untuk select creator
  const [users, setUsers] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // 🔹 ages options dari DB
  const [agesOptions, setAgesOptions] = useState([]);
  const [loadingAges, setLoadingAges] = useState(false);

  // ====== LOAD USERS ======
  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      try {
        setLoadingUsers(true);
        const res = await fetch(`${API_BASE}/admin/users`, {
          headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error("Failed to load users");

        const json = await res.json();
        // backend return { success: true, users: [...] }
        const list = Array.isArray(json.users) ? json.users : [];

        if (cancelled) return;

        setUsers(list);
        setUserOptions(
          list.map((u) => ({
            value: u.id,
            label:
              u.display_name ||
              u.name ||
              u.username ||
              u.email ||
              `User ${u.id}`,
          }))
        );
      } catch (err) {
        console.error("❌ load users error:", err);
      } finally {
        if (!cancelled) setLoadingUsers(false);
      }
    }

    loadUsers();
    return () => {
      cancelled = true;
    };
  }, []);

  // ====== LOAD AGES ======
  useEffect(() => {
    let cancelled = false;

    async function loadAges() {
      try {
        setLoadingAges(true);
        const res = await fetch(`${API_BASE}/admin/ages`, {
          headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error("Failed to load ages");
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data || [];

        if (cancelled) return;
        setAgesOptions(
          list.map((age) => ({
            value: age.id,
            label: age.name || age.code || age.id,
          }))
        );
      } catch (err) {
        console.error("❌ load ages error:", err);
      } finally {
        if (!cancelled) setLoadingAges(false);
      }
    }

    loadAges();
    return () => {
      cancelled = true;
    };
  }, []);

  const update = (path, value) => {
    setForm((prev) => ({ ...prev, [path]: value }));
  };

  // ====== CREATORS LOGIC ======
  const addCreator = () => {
    update("creators", [
      ...form.creators,
      {
        user_id: "",
        name: "",
        email: "",
        role: [],
        link: [],
      },
    ]);
  };

  const removeCreator = (index) => {
    update(
      "creators",
      form.creators.filter((_, i) => i !== index)
    );
  };

  const updateCreatorField = (i, field, value) => {
    const next = [...form.creators];
    next[i][field] = value;
    update("creators", next);
  };

  // pilih user → autofill user_id, name, email
  const handleSelectCreatorUser = (index, userId) => {
    const user = users.find((u) => u.id === userId);
    const next = [...form.creators];

    next[index].user_id = userId;
    if (user) {
      next[index].name =
        user.display_name || user.name || next[index].name || "";
      next[index].email = user.email || next[index].email || "";
    }

    update("creators", next);
  };

  const addCreatorRole = (i) => {
    const next = [...form.creators];
    next[i].role = Array.isArray(next[i].role) ? next[i].role : [];
    next[i].role.push("");
    update("creators", next);
  };

  const removeCreatorRole = (i, ri) => {
    const next = [...form.creators];
    next[i].role = (next[i].role || []).filter((_, idx) => idx !== ri);
    update("creators", next);
  };

  const addCreatorLink = (i) => {
    const next = [...form.creators];
    next[i].link = Array.isArray(next[i].link) ? next[i].link : [];
    next[i].link.push("");
    update("creators", next);
  };

  const removeCreatorLink = (i, li) => {
    const next = [...form.creators];
    next[i].link = (next[i].link || []).filter((_, idx) => idx !== li);
    update("creators", next);
  };

  // ====== PUBLIC LINKS ======
  const addPublicLink = () => {
    update("links", [...form.links, { name: "", link: "" }]);
  };

  const removePublicLink = (i) => {
    update(
      "links",
      form.links.filter((_, idx) => idx !== i)
    );
  };

  // ====== AGES ======
  const handleWorldAgeChange = (val) => {
    const num = Number(val);
    update("ages", {
      ...form.ages,
      world_age: Number.isFinite(num) ? num : 0,
    });
  };

  const handleAgesListChange = (vals) => {
    update("ages", {
      ...form.ages,
      list: vals,
    });
  };

  // ====== SAVE ======
  const saveManage = async () => {
    try {
      setSaving(true);

      const payload = {
        creators: form.creators,
        links_enabled: form.links_enabled,
        links: form.links,
        discord_enabled: form.discord_enabled,
        discord_link: form.discord_link,
        discord_pass_mode: form.discord_pass_mode,
        discord_pass: form.discord_pass,
        ages: form.ages,
      };

      const res = await fetch(`${API_BASE}/admin/worlds/${world.id}/manage`, {
        method: "PATCH",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed");

      await res.json();

      alert("✅ World manage data saved");
      onSaved?.();
      onClose();
    } catch (err) {
      console.error("❌ save manage error:", err);
      alert("❌ Failed to save manage data");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg bg-slate-900 border border-slate-700 shadow-xl p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-lg font-semibold text-gray-100">
              Manage World
            </h2>
            <p className="text-xs text-gray-400">
              Configure creators, links, Discord, and ages for{" "}
              <span className="font-semibold text-gray-200">{world.name}</span>.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            className="text-gray-400 hover:text-gray-200 text-xl"
          >
            ✕
          </button>
        </div>

        {/* ========== CREATORS ========== */}
        <section>
          <h3 className="text-sm text-gray-300 font-medium mb-2">Creators</h3>

          {form.creators.map((c, i) => (
            <div
              key={i}
              className="border border-slate-700 rounded-lg p-4 space-y-3 bg-slate-800/40"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">Creator #{i + 1}</span>
                <button
                  type="button"
                  onClick={() => removeCreator(i)}
                  className="px-2 py-1 bg-red-600/20 text-red-300 text-xs border border-red-600/40 rounded"
                >
                  Remove
                </button>
              </div>

              <InputField
                label={
                  <span className="flex items-center gap-2 text-xs text-gray-300">
                    Select User
                    {loadingUsers && (
                      <span className="text-[10px] text-gray-400">
                        (loading...)
                      </span>
                    )}
                  </span>
                }
                type="selectSearch"
                value={c.user_id || ""}
                onChange={(val) => handleSelectCreatorUser(i, val)}
                options={userOptions}
                placeholder="Search & select user..."
              />

              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="Name"
                  value={c.name}
                  onChange={(val) => updateCreatorField(i, "name", val)}
                  placeholder="Creator name"
                />
                <InputField
                  label="Email"
                  type="email"
                  value={c.email}
                  onChange={(val) => updateCreatorField(i, "email", val)}
                  placeholder="Creator email"
                />
              </div>

              {/* Roles */}
              <div>
                <p className="text-xs text-gray-400 mb-1">Roles</p>
                <div className="space-y-2">
                  {(c.role || []).map((r, ri) => (
                    <div key={ri} className="flex gap-2">
                      <InputField
                        label={null}
                        value={r}
                        onChange={(val) => {
                          const next = [...(c.role || [])];
                          next[ri] = val;
                          updateCreatorField(i, "role", next);
                        }}
                        placeholder="Role (e.g. Dungeon Master, Writer)"
                      />
                      <button
                        type="button"
                        onClick={() => removeCreatorRole(i, ri)}
                        className="px-2 py-1 bg-red-600/20 text-red-300 text-xs border border-red-600/40 rounded h-[38px] mt-[2px]"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addCreatorRole(i)}
                    className="px-3 py-1 bg-blue-600/20 text-blue-300 border border-blue-600/40 rounded text-xs"
                  >
                    + Add Role
                  </button>
                </div>
              </div>

              {/* Links */}
              <div>
                <p className="text-xs text-gray-400 mb-1">Links</p>
                <div className="space-y-2">
                  {(c.link || []).map((l, li) => (
                    <div key={li} className="flex gap-2">
                      <InputField
                        label={null}
                        value={l}
                        onChange={(val) => {
                          const next = [...(c.link || [])];
                          next[li] = val;
                          updateCreatorField(i, "link", next);
                        }}
                        placeholder="https://..."
                      />
                      <button
                        type="button"
                        onClick={() => removeCreatorLink(i, li)}
                        className="px-2 py-1 bg-red-600/20 text-red-300 text-xs border border-red-600/40 rounded h-[38px] mt-[2px]"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addCreatorLink(i)}
                    className="px-3 py-1 bg-green-600/20 text-green-300 border border-green-600/40 rounded text-xs"
                  >
                    + Add Link
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addCreator}
            className="px-3 py-1 bg-purple-600/20 text-purple-300 border border-purple-600/40 rounded text-xs mt-2"
          >
            + Add Creator
          </button>
        </section>

        {/* ========== PUBLIC LINKS ========== */}
        {/* <section>
          <h3 className="text-sm text-gray-300 font-medium mb-2">
            Public Links
          </h3>

          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input
              type="checkbox"
              checked={form.links_enabled}
              onChange={(e) => update("links_enabled", e.target.checked)}
            />
            Enable public links
          </label>

          {form.links_enabled && (
            <div className="mt-2 space-y-2">
              {form.links.map((lnk, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 border border-slate-700 bg-slate-800/40 px-3 py-2 rounded"
                >
                  <div className="flex-1">
                    <InputField
                      label={null}
                      value={lnk.name}
                      onChange={(val) => {
                        const next = [...form.links];
                        next[i].name = val;
                        update("links", next);
                      }}
                      placeholder="Name (YouTube, Twitch, ...)"
                    />
                  </div>
                  <div className="flex-[2]">
                    <InputField
                      label={null}
                      value={lnk.link}
                      onChange={(val) => {
                        const next = [...form.links];
                        next[i].link = val;
                        update("links", next);
                      }}
                      placeholder="https://..."
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removePublicLink(i)}
                    className="px-2 py-1 bg-red-600/20 text-red-300 text-xs border border-red-600/40 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addPublicLink}
                className="px-3 py-1 bg-blue-600/20 text-blue-300 border border-blue-600/40 rounded text-xs"
              >
                + Add Link
              </button>
            </div>
          )}
        </section> */}

        {/* ========== DISCORD ========== */}
        {/* <section>
          <h3 className="text-sm text-gray-300 font-medium mb-2">Discord</h3>

          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input
              type="checkbox"
              checked={form.discord_enabled}
              onChange={(e) => update("discord_enabled", e.target.checked)}
            />
            Enable Discord link
          </label>

          {form.discord_enabled && (
            <div className="mt-3 space-y-2">
              <InputField
                label="Discord Link"
                value={form.discord_link}
                onChange={(val) => update("discord_link", val)}
                placeholder="https://discord.gg/..."
              />

              <label className="flex items-center gap-2 text-xs text-gray-300 mt-2">
                <input
                  type="checkbox"
                  checked={form.discord_pass_mode}
                  onChange={(e) =>
                    update("discord_pass_mode", e.target.checked)
                  }
                />
                Enable password mode
              </label>

              {form.discord_pass_mode && (
                <InputField
                  label="Discord Password"
                  value={form.discord_pass}
                  onChange={(val) => update("discord_pass", val)}
                  placeholder="Secret keyword..."
                />
              )}
            </div>
          )}
        </section> */}

        {/* ========== AGES ========== */}
        {/* <section>
          <h3 className="text-sm text-gray-300 font-medium mb-2">World Ages</h3>

          <InputField
            label="World Age (numeric)"
            type="number"
            value={form.ages.world_age ?? 0}
            onChange={handleWorldAgeChange}
            placeholder="World age (e.g. 31625)"
          />

          <div className="mt-3">
            <InputField
              label={
                <span className="flex items-center gap-1 text-xs text-gray-300">
                  Age Entries
                  {loadingAges && (
                    <span className="text-[10px] text-gray-400">
                      (loading...)
                    </span>
                  )}
                </span>
              }
              type="multiSelectSearch"
              value={form.ages.list || []}
              onChange={handleAgesListChange}
              options={agesOptions}
              placeholder="Search & select ages..."
            />
          </div>
        </section> */}

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-1.5 text-sm rounded border border-slate-600 text-gray-300 hover:bg-slate-700 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={saveManage}
            disabled={saving}
            className="px-4 py-1.5 text-sm rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

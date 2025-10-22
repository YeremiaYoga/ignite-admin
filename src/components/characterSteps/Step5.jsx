"use client";
import InputField from "@/components/InputField";
import {
  attributesOptions,
  combatValueOptions,
  sizeOptions,
  creatureTypeOptions,
  personalityCombatStyleOptions,
} from "../../data/characterOptions";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";

export default function Step5({ data, allData, onChange }) {
  const router = useRouter();
  const step5 = data || {};
  const [allIncumbency, setAllIncumbency] = useState([]);
  const damageTypes = [
    "Acid",
    "Cold",
    "Fire",
    "Force",
    "Lightning",
    "Necrotic",
    "Physic",
    "Physical",
    "Poison",
    "Radiant",
    "Thunder",
  ];

  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedAbility, setSelectedAbility] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [remainingSkillPoints, setRemainingSkillPoints] = useState(null);
  const flagByDisposition = (disp) => {
    const d = String(disp || "").toLowerCase();
    if (d === "friendly") return "good";
    if (d === "hostile") return "evil";
    if (d === "neutral") return "neutral";
    if (d === "unknown") return "unknown";
    return null;
  };

  useEffect(() => {
    if (!selectedStyle) setRemainingSkillPoints(null);
  }, [selectedStyle, step5.combat_value, step5.disposition]);

  const filteredIncumbency = useMemo(() => {
    const flag = flagByDisposition(step5.disposition);
    if (!flag) return allIncumbency;
    return allIncumbency.filter((it) => it?.[`alignment_${flag}`] === true);
  }, [allIncumbency, step5.disposition]);

  useEffect(() => {
    if (!selectedStyle) return;
    const stillValid = filteredIncumbency.some(
      (x) => x.name === selectedStyle.name
    );
    if (!stillValid) {
      setSelectedStyle(null);
      onChange("incumbency_id", null);
    }
  }, [filteredIncumbency]);

  const handleSelectStyle = (name) => {
    const found = filteredIncumbency.find((x) => x.name === name);
    setSelectedStyle(found || null);
    onChange("incumbency_id", found || null);
  };

  const getAbilityImg = (ab) => ab?.image || "";

  const getAbilityName = (ab) =>
    ab?.title || ab?.name || ab?.label || "Ability";

  const getAbilityDesc = (ab) =>
    (ab?.description || ab?.desc || ab?.text || "")
      .toString()
      .replace(/\n+/g, " ")
      .trim()
      .slice(0, 220);

  const fetchAllIncumbency = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/incumbency`,
        {
          cache: "no-store",
        }
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setAllIncumbency(Array.isArray(data) ? data : []);
      if ((data?.length ?? 0) > 0) setSelected((prev) => prev ?? data[0]);
    } catch (err) {
      console.error("Failed to fetch incumbency:", err);
    }
  }, []);

  useEffect(() => {
    fetchAllIncumbency();
  }, [fetchAllIncumbency]);

  console.log(allIncumbency);

  const damageTypesWithImages = damageTypes.map((type) => ({
    value: type.toLowerCase(),
    label: type,
    image: `/assets/damageType_icon/${type.toLowerCase()}.webp`,
  }));

  const baseValuesFor = (combatValue) => {
    const val = parseInt(combatValue, 10) || 0;
    const data = combatValueOptions.find((r) => r.value == val);
    return data?.baseValues || [];
  };

  const [assignedValues, setAssignedValues] = useState({
    str: 0,
    dex: 0,
    con: 0,
    int: 0,
    wis: 0,
    cha: 0,
  });

  const baseValues = baseValuesFor(step5.combat_value);

  const usedValues = Object.values(assignedValues).filter(Boolean);

  let availableValues = [...baseValues];

  usedValues.forEach((val) => {
    const idx = availableValues.indexOf(val);
    if (idx !== -1) {
      availableValues.splice(idx, 1);
    }
  });

  const maxSkillPoints = Number(step5.combat_value) || 0;

  const calcModifier = (val) => {
    if (!val || isNaN(val)) return 0;
    const mod = Math.floor((val - 10) / 2);

    return mod > 0 ? `+${mod}` : mod;
  };

  const cycle = ["empty", "filled", "half", "center"];

  const skillIcons = {
    empty: <div className="w-4 h-4 rounded-full border border-gray-400"></div>,
    filled: <div className="w-4 h-4 rounded-full bg-gray-400"></div>,
    half: (
      <div className="w-4 h-4 rounded-full border border-gray-400 overflow-hidden">
        <div className="w-1/2 h-full bg-gray-400"></div>
      </div>
    ),
    center: (
      <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
      </div>
    ),
  };

  const getSkillState = (skillName) => {
    const skill = step5.skill_prof?.find((s) => s.name === skillName);
    if (!skill) return "empty";
    switch (skill.value) {
      case 0:
        return "empty";
      case 0.5:
        return "half";
      case 1:
        return "filled";
      case 2:
        return "center";
      default:
        return "empty";
    }
  };

  const handleSkillClick = (skillName) => {
    const currentState = getSkillState(skillName);

    const usedPointsExcludingThis = (step5.skill_prof || []).reduce(
      (acc, s) => {
        if (s.name === skillName) return acc;
        const state = (() => {
          switch (s.value) {
            case 0:
              return "empty";
            case 0.5:
              return "half";
            case 1:
              return "filled";
            case 2:
              return "center";
            default:
              return "empty";
          }
        })();
        return acc + (skillCost[state] || 0);
      },
      0
    );

    const effectiveMaxSP =
      remainingSkillPoints !== null ? remainingSkillPoints : maxSkillPoints;

    const remainingPoints = effectiveMaxSP - usedPointsExcludingThis;

    if (remainingPoints <= 0) {
      return;
    }

    let cycle;
    if (remainingPoints >= 9) cycle = ["empty", "half", "filled", "center"];
    else if (remainingPoints >= 3) cycle = ["empty", "half", "filled"];
    else cycle = ["empty", "half"];

    const currentIndex = cycle.indexOf(currentState);
    const nextIndex = (currentIndex + 1) % cycle.length;
    const nextState = cycle[nextIndex];

    const nextValue = { empty: 0, half: 0.5, filled: 1, center: 2 }[nextState];

    let newSkillProf;
    const existingIndex = step5.skill_prof.findIndex(
      (s) => s.name === skillName
    );
    if (existingIndex !== -1) {
      newSkillProf = [...step5.skill_prof];
      newSkillProf[existingIndex].value = nextValue;
    } else {
      newSkillProf = [
        ...(step5.skill_prof || []),
        { name: skillName, value: nextValue },
      ];
    }

    const newUsedPoints = newSkillProf.reduce((acc, s) => {
      const state = (() => {
        switch (s.value) {
          case 0:
            return "empty";
          case 0.5:
            return "half";
          case 1:
            return "filled";
          case 2:
            return "center";
          default:
            return "empty";
        }
      })();
      return acc + (skillCost[state] || 0);
    }, 0);

    onChange("skill_prof", newSkillProf);
    onChange("usedSkillPoints", newUsedPoints);
  };

  const calcPB = (combatValue) => {
    const val = Number(combatValue) || 0;
    if (val >= 0 && val <= 9) return "+2";
    if (val >= 10 && val <= 17) return "+3";
    if (val >= 18 && val <= 25) return "+4";
    if (val >= 26 && val <= 33) return "+5";
    if (val >= 34 && val <= 40) return "+6";
    return "+0";
  };

  const getPB = (combatValue) => {
    const val = Number(combatValue) || 0;
    if (val >= 0 && val <= 9) return 2;
    if (val >= 10 && val <= 17) return 3;
    if (val >= 18 && val <= 25) return 4;
    if (val >= 26 && val <= 33) return 5;
    if (val >= 34 && val <= 40) return 6;
    return 0;
  };

  const calcSkillValue = (abilityKey, skill) => {
    const abilityValue = assignedValues.hasOwnProperty(abilityKey)
      ? assignedValues[abilityKey]
      : step5[abilityKey];

    const abilityMod = calcModifier(abilityValue);

    const pb = getPB(step5.combat_value);
    const profState = getSkillState(skill);
    let profValue = 0;

    switch (profState) {
      case "filled":
        profValue = 1;
        break;
      case "half":
        profValue = 0.5;
        break;
      case "center":
        profValue = 2;
        break;
      default:
        profValue = 0;
    }

    const total = Number(abilityMod) + pb * profValue;

    return total >= 0 ? `+${total}` : `${total}`;
  };

  const skillCost = {
    empty: 0,
    half: 1,
    filled: 3,
    center: 9,
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-900 text-gray-100 space-y-8 rounded-xl shadow-xl">
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-xl p-4 flex flex-col items-center shadow-md">
          <label className="text-sm font-semibold mb-2">Combat Value</label>
          <InputField
            type="number"
            value={step5.combat_value !== undefined ? step5.combat_value : ""}
            onChange={(val) => {
              const numberVal = Number(val);
              if (numberVal >= 0 && numberVal <= 40) {
                onChange("combat_value", numberVal);

                setSelectedStyle(null);
                onChange("incumbency_id", null);
                onChange("skill_prof", []);
                onChange("usedSkillPoints", 0);

                onChange("str", 0);
                onChange("dex", 0);
                onChange("con", 0);
                onChange("int", 0);
                onChange("wis", 0);
                onChange("cha", 0);

                setAssignedValues({
                  str: 0,
                  dex: 0,
                  con: 0,
                  int: 0,
                  wis: 0,
                  cha: 0,
                });
              }
            }}
            placeholder="0"
          />

          <p className="text-xs text-gray-400 mt-2">
            {step5.combat_value !== undefined && step5.combat_value !== null
              ? combatValueOptions.find(
                  (r) => r.value === Number(step5.combat_value)
                )?.label
              : "(Statement Base Upon Value)"}
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 shadow-md relative">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              Combat Style
              <div
                className="relative group cursor-pointer"
                onClick={() => router.push("/incumbency")}
              >
                <Info size={14} className="text-gray-400 hover:text-teal-400" />
                <div className="absolute left-5 top-1/2 -translate-y-1/2 hidden group-hover:block bg-gray-900 text-gray-100 text-xs rounded-md px-2 py-1 shadow-xl z-20 w-[260px]">
                  The combat style that your character use for combat or
                  roleplaying situation which is overhaul to be simple for
                  Non-Playable Character. May them be bad or good. Click here to
                  see all of the selection.
                </div>
              </div>
            </label>
          </div>

          {!step5.disposition ? (
            <div className="text-gray-500 italic text-sm">
              Disposition have not been selected yet
            </div>
          ) : (
            <InputField
              type="selectSearch"
              placeholder="Search Combat Style..."
              label=""
              value={selectedStyle?.name || ""}
              onChange={(val) => {
                const found = filteredIncumbency.find((x) => x.name === val);
                console.log(found);
                setSelectedStyle(found || null);
                onChange("incumbency_id", found.id || null);

                onChange("skill_prof", []);
                onChange("usedSkillPoints", 0);

                if (found) {
                  const SP = Number(step5.combat_value) || 0;
                  const CV = Number(found.cv_percent_cost || 0) / 100;
                  const FC = Number(found.cv_flat_cost || 0);
                  const sisa = Math.floor(SP - SP * CV - FC);
                  setRemainingSkillPoints(sisa);
                }
              }}
              options={filteredIncumbency
                .filter((it) => {
                  const combatVal = Number(step5.combat_value) || 0;
                  const minOk = Number(it.cv_minimum || 0) <= combatVal;

                  const costPercent = Number(it.cv_percent_cost || 0) / 100;
                  const costFlat = Number(it.cv_flat_cost || 0);
                  const result = combatVal - combatVal * costPercent - costFlat;

                  const enoughSP = result >= 0;
                  return minOk && enoughSP;
                })
                .map((it) => ({
                  label: `${it.name} (Min CV: ${it.cv_minimum ?? 0})`,
                  value: it.name,
                  image: it.image || "/assets/default_style.webp",
                }))}
            />
          )}

          {selectedStyle?.abilities?.length > 0 && (
            <div className="mt-4">
              <div className="text-xs text-gray-400 mb-1">Abilities</div>
              <div className="grid grid-cols-6 gap-2">
                {selectedStyle.abilities.map((ab, idx) => {
                  const src = getAbilityImg(ab);
                  const name = getAbilityName(ab);
                  const desc = getAbilityDesc(ab);
                  const isActive = selectedAbility === idx;

                  return (
                    <div
                      key={idx}
                      id={`ability-${ab.id || idx}`} // ✅ id ditambahkan di sini
                      data-id={ab.id || idx} // ✅ untuk selector data
                      className={[
                        "relative aspect-square w-full",
                        "rounded-md border border-gray-700 bg-gray-900",
                        "overflow-visible cursor-pointer",
                        isActive ? "ring-2 ring-teal-400" : "",
                      ].join(" ")}
                      role="button"
                      tabIndex={0}
                      aria-label={name}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAbility(isActive ? null : idx);
                      }}
                    >
                      <div className="absolute inset-0 rounded-md overflow-hidden">
                        {src ? (
                          <img
                            src={src}
                            alt={name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500">
                            no img
                          </div>
                        )}
                      </div>

                      {isActive && (
                        <div
                          className={[
                            "absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30",
                            "w-60 rounded-md border border-teal-700 bg-slate-900 text-gray-100",
                            "text-xs p-3 shadow-xl font-medium leading-tight",
                            "transition-all duration-150 ease-out opacity-100 translate-y-0",
                          ].join(" ")}
                          role="tooltip"
                        >
                          <div className="font-bold text-teal-300">{name}</div>

                          {desc && (
                            <div
                              className="mt-1 leading-snug text-gray-200"
                              dangerouslySetInnerHTML={{ __html: desc }}
                            />
                          )}
                          {ab.type && ab.cost && (
                            <div className="mt-1 text-[11px] text-gray-300">
                              {ab.type} - <span className="italic">Cost:</span>{" "}
                              {ab.cost}
                              {ab.type_ability?.length > 0 && (
                                <>
                                  {" "}
                                  • <span className="italic">Type:</span>{" "}
                                  {ab.type_ability.join(", ")}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-xl p-4 flex flex-col items-center shadow-md">
          {step5.combat_value !== undefined && step5.combat_value !== null ? (
            <>
              <p className="text-lg ">Ability Score</p>
              <div className="flex gap-3 font-bold text-lg">
                {baseValues.map((val, idx) => (
                  <span key={idx}>{val}</span>
                ))}
              </div>
              <p className="text-lg my-2">(PB: {calcPB(step5.combat_value)})</p>

              <p className="text-xs text-gray-400 mb-2">
                (Value Base On Combat Value)
              </p>
            </>
          ) : (
            <p className="text-xs text-gray-500 italic">
              (Value Base On Combat Value)
            </p>
          )}
        </div>

        <div className="bg-gray-800 rounded-xl p-4 flex flex-col items-center shadow-md">
          {step5.combat_value !== undefined && step5.combat_value !== null ? (
            <>
              <p className="text-xs text-gray-400 mb-1">Skill Points Left</p>
              <div className="text-3xl font-bold">
                {(() => {
                  const used = step5.usedSkillPoints || 0;
                  const baseSP = Number(step5.combat_value) || 0;
                  const effectiveSP =
                    remainingSkillPoints !== null
                      ? remainingSkillPoints
                      : baseSP;

                  const remaining = Math.max(0, effectiveSP - used);
                  return `${remaining}/${baseSP}`;
                })()}
              </div>
              <hr className="w-full border-t border-gray-400 my-2" />
              <div className="grid grid-cols-3 mt-2 gap-1">
                <div className="flex flex-col items-center text-[9px] text-center">
                  {skillIcons.filled}
                  <span className="mt-1">Proficient</span>
                  <span>(Cost: 3)</span>
                </div>
                <div className="flex flex-col items-center text-[9px] text-center">
                  {skillIcons.half}
                  <span className="mt-1">Half Proficient</span>
                  <span>(Cost: 1)</span>
                </div>
                <div className="flex flex-col items-center text-[9px] text-center">
                  {skillIcons.center}
                  <span className="mt-1">Expertise</span>
                  <span>(Cost: 9)</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs text-gray-500 italic">
              (No Combat Value Selected)
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4">
        {attributesOptions.map((attr) => (
          <div
            key={attr.key}
            className="bg-gray-800 rounded-lg shadow-md flex flex-col items-center"
          >
            <div
              className="relative w-40 h-40 bg-center bg-no-repeat bg-contain"
              style={{
                backgroundImage: `url(/assets/abilityScore_icon/${attr.key}_ability_score.webp)`,
              }}
            >
              <div className="absolute inset-x-0 top-1/3 text-center text-lg font-bold text-white mt-2 ml-1">
                {calcModifier(assignedValues[attr.key] ?? step5[attr.key])}
              </div>

              <div className="absolute inset-x-0 bottom-1/4 flex justify-center ml-1 -mb-1.5">
                <select
                  value={assignedValues[attr.key] || ""}
                  onChange={(e) => {
                    const newVal = parseInt(e.target.value, 10);
                    setAssignedValues((prev) => ({
                      ...prev,
                      [attr.key]: newVal,
                    }));
                    onChange(attr.key, newVal);
                  }}
                  className="text-[12px] text-center text-white rounded-sm appearance-none cursor-pointer"
                >
                  <option value="" disabled hidden>
                    -
                  </option>

                  {assignedValues[attr.key] && (
                    <option
                      value={assignedValues[attr.key]}
                      className="bg-gray-800 text-white"
                    >
                      {assignedValues[attr.key]}
                    </option>
                  )}

                  {availableValues.map((val, idx) => (
                    <option
                      key={`${val}-${idx}`}
                      value={val}
                      className="bg-gray-800 text-white"
                    >
                      {val}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {attr.skills.map((skill) => {
              const current = getSkillState(skill);
              const nextIndex = (cycle.indexOf(current) + 1) % cycle.length;
              const next = cycle[nextIndex];

              return (
                <li
                  key={`${attr.key}-${skill}`}
                  className="flex justify-between items-center gap-2 px-2 py-1 rounded w-full cursor-pointer hover:bg-gray-700"
                  onClick={() => handleSkillClick(skill)}
                >
                  <div className="flex items-center gap-2">
                    {skillIcons[current]}
                    <span className="text-sm">{skill}</span>
                  </div>

                  <span className="text-sm font-semibold">
                    {calcSkillValue(attr.key, skill)}
                  </span>
                </li>
              );
            })}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-xl p-4 shadow-md">
          <InputField
            type="selectImage"
            label="Damage Type"
            value={step5.damage_type || ""}
            onChange={(val) => onChange("damage_type", val)}
            options={damageTypesWithImages}
            placeholder="Select Damage"
          />
        </div>

        <div className="bg-gray-800 rounded-xl p-4  shadow-md">
          <InputField
            label="Vision"
            type="select"
            value={step5.vision || ""}
            onChange={(val) => onChange("vision", val)}
            options={[
              "Normal Vision",
              "Darkvision-60",
              "Darkvision-120",
              "Darkvision-300",
            ]}
            placeholder="Select Vision"
          />
        </div>

        <div className="bg-gray-800 rounded-xl p-4 shadow-md">
          <InputField
            label="Disposition"
            type="select"
            value={step5.disposition || ""}
            onChange={(val) => {
              onChange("disposition", val);

              setSelectedStyle(null);
              onChange("incumbency_id", null);
            }}
            options={["Friendly", "Neutral", "Hostile", "Unknown"]}
            placeholder="Select Disposition"
          />
        </div>
      </div>
      <div className="grid grid-cols-10 gap-6">
        <div className="bg-gray-800 rounded-xl p-4  shadow-md col-span-3">
          <InputField
            label="Size"
            type="select"
            value={step5.size?.vtt_size || "med"}
            onChange={(val) =>
              onChange("size", {
                general:
                  sizeOptions.find((s) => s.vtt === val)?.label || "Medium",
                vtt_size: val,
              })
            }
            options={sizeOptions.map((s) => ({ label: s.label, value: s.vtt }))}
            placeholder="Select Type"
          />
        </div>

        <div className="bg-gray-800 rounded-xl p-4  shadow-md col-span-2">
          <InputField
            label="Creature Type"
            type="select"
            value={step5.creature_type || "Humanoid"}
            onChange={(val) => onChange("creature_type", val)}
            options={creatureTypeOptions}
            placeholder="Select Type"
          />
        </div>

        <div className="bg-gray-800 rounded-xl p-4  shadow-md col-span-5">
          <InputField
            label="Personality Combat Style"
            type="select"
            value={step5.personality_combat_style || ""}
            onChange={(val) => onChange("personality_combat_style", val)}
            options={personalityCombatStyleOptions}
            placeholder="Select Personality Combat Style"
          />
        </div>
      </div>
    </div>
  );
}

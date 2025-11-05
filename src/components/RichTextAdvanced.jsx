"use client";
import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Table,
  Type,
} from "lucide-react";

export default function RichTextAdvanced({
  value = "",
  onChange,
  placeholder = "Write something...",
  rows = 14,
}) {
  const ref = useRef(null);
  const [heading, setHeading] = useState("p");
  const [isFocused, setIsFocused] = useState(false); // ✅ isolate per-editor focus
  const [active, setActive] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
    justifyFull: false,
    unorderedList: false,
    orderedList: false,
  });

  // ✅ Sinkronisasi data dari DB
  useEffect(() => {
    if (ref.current && typeof value === "string") {
      if (ref.current.innerHTML !== value) {
        ref.current.innerHTML = value || "";
      }
    }
  }, [value]);

  

  const exec = (cmd, val = null) => {
    if (!isFocused) return; // ⛔ hanya jalan kalau editor ini aktif
    document.execCommand(cmd, false, val);
    if (ref.current) onChange?.(ref.current.innerHTML);
    updateActiveStates();
  };

  const insertTable = () => {
    if (!isFocused) return; // ⛔ tidak bisa insert di editor lain
    const rowInput = prompt("Number of rows:", 3);
    if (rowInput === null) return;
    const colInput = prompt("Number of columns:", 3);
    if (colInput === null) return;

    const rows = parseInt(rowInput);
    const cols = parseInt(colInput);
    if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) return;

    const withHeader = confirm("Include header row?");
    let html = `
    <table style="
      border-collapse: collapse;
      width: 100%;
      text-align: left;
      margin: 0.75rem 0;
      font-size: 0.9rem;
      color: #e5e7eb;
    ">
  `;

    if (withHeader) {
      html += "<thead><tr>";
      for (let j = 0; j < cols; j++) {
        html += `
        <th style="
          border: 1px solid #4b5563;
          background-color: #374151;
          color: #f9fafb;
          padding: 6px 8px;
          font-weight: 600;
        ">
          Header
        </th>
      `;
      }
      html += "</tr></thead>";
    }

    html += "<tbody>";
    for (let i = 0; i < rows; i++) {
      html += "<tr>";
      for (let j = 0; j < cols; j++) {
        html += `
        <td style="
          border: 1px solid #4b5563;
          padding: 6px 8px;
          min-width: 80px;
          background-color: #1f2937;
        ">
          ...
        </td>
      `;
      }
      html += "</tr>";
    }
    html += "</tbody></table><br/>";

    document.execCommand("insertHTML", false, html.trim());
    onChange?.(ref.current?.innerHTML);
  };

  const updateActiveStates = () => {
    if (!isFocused) return; // ✅ cuma update toolbar milik editor fokus
    setActive({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strikeThrough: document.queryCommandState("strikeThrough"),
      justifyLeft: document.queryCommandState("justifyLeft"),
      justifyCenter: document.queryCommandState("justifyCenter"),
      justifyRight: document.queryCommandState("justifyRight"),
      justifyFull: document.queryCommandState("justifyFull"),
      unorderedList: document.queryCommandState("insertUnorderedList"),
      orderedList: document.queryCommandState("insertOrderedList"),
    });
  };

const handleHeadingChange = (e) => {
  const tag = e.target.value;
  setHeading(tag);

  if (!isFocused) ref.current?.focus(); // pastikan fokus dulu
  // ✅ execCommand butuh format "<h1>" bukan "h1"
  document.execCommand("formatBlock", false, `<${tag}>`);

  if (ref.current) onChange?.(ref.current.innerHTML);
  updateActiveStates();
};


  useEffect(() => {
    const listener = () => updateActiveStates();
    document.addEventListener("selectionchange", listener);
    document.execCommand("defaultParagraphSeparator", false, "p");
    return () => document.removeEventListener("selectionchange", listener);
  }, []);

  const handleInput = () => {
    if (ref.current) onChange?.(ref.current.innerHTML);
  };

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 text-gray-100">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-2 border-b border-gray-700">
        <div className="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded">
          <Type size={14} />
          <select
            value={heading}
            onChange={handleHeadingChange}
            className="bg-gray-800 text-gray-100 text-sm rounded px-1 py-0.5 outline-none appearance-none"
            title="Heading Style"
          >
            <option value="p">Normal</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="h5">Heading 5</option>
            <option value="h6">Heading 6</option>
          </select>
        </div>

        {/* Text style */}
        <ToolbarButton icon={<Bold size={16} />} title="Bold" active={active.bold} onClick={() => exec("bold")} />
        <ToolbarButton icon={<Italic size={16} />} title="Italic" active={active.italic} onClick={() => exec("italic")} />
        <ToolbarButton icon={<Underline size={16} />} title="Underline" active={active.underline} onClick={() => exec("underline")} />
        <ToolbarButton icon={<Strikethrough size={16} />} title="Strikethrough" active={active.strikeThrough} onClick={() => exec("strikeThrough")} />

        {/* Alignment */}
        <ToolbarButton icon={<AlignLeft size={16} />} title="Align Left" active={active.justifyLeft} onClick={() => exec("justifyLeft")} />
        <ToolbarButton icon={<AlignCenter size={16} />} title="Align Center" active={active.justifyCenter} onClick={() => exec("justifyCenter")} />
        <ToolbarButton icon={<AlignRight size={16} />} title="Align Right" active={active.justifyRight} onClick={() => exec("justifyRight")} />
        <ToolbarButton icon={<AlignJustify size={16} />} title="Justify" active={active.justifyFull} onClick={() => exec("justifyFull")} />

        {/* Lists */}
        <ToolbarButton icon={<List size={16} />} title="Bullet List" active={active.unorderedList} onClick={() => exec("insertUnorderedList")} />
        <ToolbarButton icon={<ListOrdered size={16} />} title="Numbered List" active={active.orderedList} onClick={() => exec("insertOrderedList")} />

        {/* Table */}
        <ToolbarButton icon={<Table size={16} />} title="Insert Table" onClick={insertTable} />
      </div>

      {/* Editable area */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => setIsFocused(true)}   // ✅ per editor
        onBlur={() => setIsFocused(false)}   // ✅ per editor
        onInput={handleInput}
        className="p-3 outline-none text-gray-100 leading-relaxed"
        style={{
          minHeight: rows * 20,
          lineHeight: "1.6",
        }}
        data-placeholder={placeholder}
      />

      {/* 💡 Scoped global CSS khusus untuk area editor */}
      <style jsx global>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }

        [contenteditable] {
          font-family: inherit;
          font-size: 1rem;
          line-height: 1.6;
          color: #f3f4f6;
        }

        [contenteditable] h1 {
          font-size: 1.875rem;
          font-weight: 700;
          margin: 0.75rem 0;
        }

        [contenteditable] h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0.6rem 0;
        }

        [contenteditable] h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.5rem 0;
        }

        [contenteditable] h4 {
          font-size: 1.125rem;
          font-weight: 500;
          margin: 0.4rem 0;
        }

        [contenteditable] h5 {
          font-size: 1rem;
          font-weight: 500;
          margin: 0.3rem 0;
        }

        [contenteditable] h6 {
          font-size: 0.875rem;
          font-weight: 500;
          margin: 0.3rem 0;
        }

        [contenteditable] p {
          margin: 0.4rem 0;
        }

        [contenteditable] ul {
          list-style-type: disc;
          margin: 0.5rem 0 0.5rem 1.5rem;
          padding-left: 1rem;
        }

        [contenteditable] ol {
          list-style-type: decimal;
          margin: 0.5rem 0 0.5rem 1.5rem;
          padding-left: 1rem;
        }

        [contenteditable] li {
          margin: 0.2rem 0;
        }

        [contenteditable] table {
          border-collapse: collapse;
          border: 1px solid gray;
          margin-top: 4px;
        }

        [contenteditable] td {
          border: 1px solid gray;
          padding: 6px;
        }
      `}</style>
    </div>
  );
}

function ToolbarButton({ icon, title, onClick, active }) {
  return (
    <button
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      className={`p-2 rounded transition-colors ${
        active
          ? "bg-blue-600 shadow-md shadow-blue-400"
          : "bg-gray-700 hover:bg-gray-600"
      }`}
    >
      {icon}
    </button>
  );
}

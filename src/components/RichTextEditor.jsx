"use client";
import { useEffect, useRef, useState } from "react";

export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write here...",
  rows = 12,
}) {
  const ref = useRef(null);

  const [active, setActive] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
  });

  useEffect(() => {
    if (ref.current && value !== ref.current.innerHTML) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  // sinkronkan state aktif saat ada selection di teks
  const updateActiveStates = () => {
    setActive({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strikeThrough: document.queryCommandState("strikeThrough"),
    });
  };

  // saat user klik tombol kita toggle state internal supaya langsung aktif walau kosong
  const exec = (cmd) => {
    document.execCommand(cmd, false, null);
    if (ref.current) onChange?.(ref.current.innerHTML);
    // toggle state internal manual
    setActive((prev) => ({
      ...prev,
      [cmd === "strikeThrough" ? "strikeThrough" : cmd]: !prev[
        cmd === "strikeThrough" ? "strikeThrough" : cmd
      ],
    }));
  };

  const handleInput = () => {
    if (ref.current) onChange?.(ref.current.innerHTML);
    updateActiveStates();
  };

  useEffect(() => {
    const listener = () => updateActiveStates();
    document.addEventListener("selectionchange", listener);
    return () => document.removeEventListener("selectionchange", listener);
  }, []);

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800">
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-700">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("bold")}
          className={`px-2 py-1 text-sm rounded ${
            active.bold
              ? "bg-blue-600 shadow-md shadow-blue-400"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
          title="Bold"
        >
          <span className="font-bold">B</span>
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("italic")}
          className={`px-2 py-1 text-sm rounded italic ${
            active.italic
              ? "bg-blue-600 shadow-md shadow-blue-400"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
          title="Italic"
        >
          I
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("underline")}
          className={`px-2 py-1 text-sm rounded underline ${
            active.underline
              ? "bg-blue-600 shadow-md shadow-blue-400"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
          title="Underline"
        >
          U
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("strikeThrough")}
          className={`px-2 py-1 text-sm rounded line-through ${
            active.strikeThrough
              ? "bg-blue-600 shadow-md shadow-blue-400"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
          title="Strikethrough"
        >
          S
        </button>
      </div>

      <div
        ref={ref}
        contentEditable
        onInput={handleInput}
        className="p-3 outline-none text-sm text-gray-100 min-h-[2.5rem] whitespace-pre-wrap"
        style={{ minHeight: rows * 20 }}
        data-placeholder={placeholder}
      />
      <style jsx>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";

interface EditableFieldProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "button" | "div";
}

export default function EditableField({
  value,
  onSave,
  className = "",
  as: Tag = "span",
}: EditableFieldProps) {
  const [isDev, setIsDev] = useState(false);
  const elementRef = useRef<any>(null);

  useEffect(() => {
    setIsDev(process.env.NODE_ENV === "development");
  }, []);

  // Sync internal text with value prop
  useEffect(() => {
    if (elementRef.current && elementRef.current.innerText !== value) {
      elementRef.current.innerText = value;
    }
  }, [value]);

  const handleBlur = () => {
    if (!isDev || !elementRef.current) return;
    const newValue = elementRef.current.innerText.trim();
    if (newValue !== value) {
      onSave(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" && Tag !== "p" && Tag !== "div") {
      e.preventDefault();
      elementRef.current?.blur();
    }
  };

  if (!isDev) {
    return <Tag className={className}>{value}</Tag>;
  }

  return (
    <Tag
      ref={elementRef}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`${className} outline-none border border-dashed border-transparent hover:border-[#8B5E3C]/40 hover:bg-[#8B5E3C]/5 focus:border-[#8B5E3C] focus:bg-[#8B5E3C]/10 rounded px-1 transition-all duration-200 cursor-text`}
      title="點選以直接編輯"
    >
      {value}
    </Tag>
  );
}

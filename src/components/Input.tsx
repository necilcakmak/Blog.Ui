import React, { useState, useEffect } from "react";
import { InputProps } from "@/types/input";

export default function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
  pattern,
  errorMessage = "",
  className = "",
}: InputProps) {
  const [touched, setTouched] = useState(false);
  const [localError, setLocalError] = useState("");

  // Local validation
  const validate = () => {
    if (!required && !value) return "";
    if (pattern && !pattern.test(value)) return "Invalid format";
    return "";
  };

  // Eğer prop değişirse güncelle
  useEffect(() => {
    setLocalError(errorMessage);
  }, [errorMessage]);

  const handleBlur = () => {
    setTouched(true);
    const msg = validate();
    if (!errorMessage) setLocalError(msg); // API mesajı yoksa local validation
  };

  const handleChange = (val: string) => {
    onChange(val);
    // Kullanıcı input değiştirince API validation mesajını temizle
    if (localError === errorMessage) {
      setLocalError("");
    }
  };

  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      <label className="mb-1 font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        className={`px-4 py-2 border rounded text-black placeholder-gray-400
  focus:outline-none focus:ring-2 focus:ring-blue-400
  ${localError ? "border-red-500" : "border-gray-300"}`}
      />
      {localError && (
        <span className="text-red-500 text-sm mt-1 whitespace-pre-line">
          {localError}
        </span>
      )}
    </div>
  );
}

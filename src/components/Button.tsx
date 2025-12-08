import React from "react";
import { ButtonProps } from "@/types/button";

const variantClasses = {
  primary: "bg-blue-500 text-white hover:bg-blue-600",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

const sizeClasses = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  type = "button", // default button
  disabled = false, // default false
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`rounded ${variantClasses[variant]} ${sizeClasses[size]} 
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:brightness-110"} 
        ${className}`}
    >
      {children}
    </button>
  );
}

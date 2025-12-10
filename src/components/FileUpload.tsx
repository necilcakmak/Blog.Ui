"use client";

import { TrashIcon } from "@heroicons/react/24/solid";
import { fileToBase64 } from "@/lib/fileExtension";
import { useRef, useState } from "react";

export default function FileUpload({
  label = "Ana Resim Seç",
  value,
  onChange,
  errorMessage = "",
  className = "",
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = async (file: File) => {
    const base64 = await fileToBase64(file);
    setPreview(base64);
    setFileName(file.name);
    onChange(base64);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = () => {
    setPreview(null);
    setFileName(null);
    onChange(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      {label && (
        <label className="mb-1 font-medium text-gray-700">{label}</label>
      )}

      <div className="flex items-center gap-4">
        {/* Custom Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
        >
          {label}
        </button>

        {/* Preview + Delete */}
        {preview && (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded border cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            />
            <TrashIcon
              className="w-6 h-6 text-red-600 hover:text-red-800 cursor-pointer absolute -top-2 -right-2 bg-white rounded-full shadow-md p-1"
              onClick={handleDelete}
            />
          </div>
        )}
      </div>

      {/* Seçilen dosya adı */}
      {fileName && (
        <span className="text-gray-700 text-sm mt-1">{fileName}</span>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
        className="hidden"
      />

      {/* Error */}
      {errorMessage && (
        <span className="text-red-500 text-sm mt-1 whitespace-pre-line">
          {errorMessage}
        </span>
      )}

      {/* Modal for large preview */}
      {isModalOpen && preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setIsModalOpen(false)}
        >
          <img
            src={preview}
            alt="Large Preview"
            className="max-h-[90%] max-w-[90%] rounded shadow-lg"
          />
        </div>
      )}
    </div>
  );
}

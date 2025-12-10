"use client";

import { useEffect, useState } from "react";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import { createCategory, getParentCategories } from "@/api/apiMethods";
import toast from "react-hot-toast";
import { CategoryAddDto, ParentCategoryDto } from "@/api/types/category";
import { DataResult } from "@/api/types/apiResponse";

export default function NewCategoryPage() {
  const router = useRouter();

  const [parentCategories, setParentCategories] = useState<ParentCategoryDto[]>(
    []
  );

  // Form state
  const [form, setForm] = useState<CategoryAddDto>({
    name: "",
    tagName: "",
    parentCategoryId: "",
  });

  // Validation errors
  const [errors, setErrors] = useState<
    Partial<Record<keyof CategoryAddDto, string>>
  >({});

  const handleChange = (key: keyof CategoryAddDto, value: string | null) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  // Parent kategorileri çek
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getParentCategories();
      if (res.success) {
        const categories = (res as DataResult<ParentCategoryDto[]>).data;
        setParentCategories(categories || []);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload: CategoryAddDto = {
      ...form,
      parentCategoryId: form.parentCategoryId || "",
      tagName: form.tagName || null,
    };

    const result = await createCategory(payload);
    debugger;
    if (result.success) {
      toast.success("Kategori başarıyla eklendi!");
      router.push("/admin/categories");
      return;
    }

    // API validation errors
    if (result.validationErrors) {
      const newErrors: Partial<Record<keyof CategoryAddDto, string>> = {};
      Object.entries(result.validationErrors).forEach(([key, messages]) => {
        newErrors[key as keyof CategoryAddDto] = messages.join(", ");
      });
      setErrors(newErrors);
    }

    toast.error(result.message || "Bir hata oluştu");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">Yeni Kategori Ekle</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Kategori Adı"
          value={form.name}
          onChange={(v) => handleChange("name", v)}
          required
          errorMessage={errors.name}
        />

        <Input
          label="Tag Name (Opsiyonel)"
          value={form.tagName || ""}
          onChange={(v) => handleChange("tagName", v || null)}
          errorMessage={errors.tagName}
        />

        {/* Parent Kategori */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Üst Kategori</label>
          <select
            value={form.parentCategoryId}
            onChange={(e) => handleChange("parentCategoryId", e.target.value)}
            className={`px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400 ${
              errors.parentCategoryId ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Seçiniz</option>
            {parentCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.parentCategoryId && (
            <span className="text-red-500 text-sm mt-1">
              {errors.parentCategoryId}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Kaydet
        </button>
      </form>
    </div>
  );
}

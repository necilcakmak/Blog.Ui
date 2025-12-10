"use client";

import { use, useEffect, useState } from "react";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  getCategory,
  getParentCategories,
  updateCategory,
} from "@/api/apiMethods";
import {
  CategoryDto,
  CategoryUpdateDto,
  ParentCategoryDto,
} from "@/api/types/category";
import { DataResult } from "@/api/types/apiResponse";

export default function EditCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const categoryId = slug;
  const router = useRouter();

  const [parentCategories, setParentCategories] = useState<ParentCategoryDto[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<CategoryUpdateDto>({
    id: categoryId,
    name: "",
    tagName: "",
    parentCategoryId: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CategoryUpdateDto, string>>
  >({});

  const handleChange = (key: keyof CategoryUpdateDto, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  // CategoryDto → CategoryUpdateDto dönüşümü
  const mapToUpdateDto = (c: CategoryDto): CategoryUpdateDto => ({
    id: c.id,
    name: c.name || "",
    tagName: c.tagName || "",
    parentCategoryId: c.parentCategoryId || "",
  });

  // İlk yüklemede kategori ve parent kategorileri getir
  useEffect(() => {
    const loadData = async () => {
      const [catRes, parentRes] = await Promise.all([
        await getCategory(categoryId),
        await getParentCategories(),
      ]);

      if (catRes.success) {
        const category = (catRes as DataResult<CategoryDto>).data;
        setForm(mapToUpdateDto(category));
      }

      if (parentRes.success) {
        setParentCategories(
          (parentRes as DataResult<ParentCategoryDto[]>).data || []
        );
      }

      setLoading(false);
    };

    loadData();
  }, [categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = await updateCategory(form);

    if (result.success) {
      toast.success("Kategori başarıyla güncellendi!");
      router.push("/admin/categories");
      return;
    }

    if (result.validationErrors) {
      const newErrors: Partial<Record<keyof CategoryUpdateDto, string>> = {};
      Object.entries(result.validationErrors).forEach(([key, messages]) => {
        newErrors[key as keyof CategoryUpdateDto] = messages.join(", ");
      });
      setErrors(newErrors);
    }

    toast.error(result.message || "Bir hata oluştu");
  };

  if (loading) return <div className="p-6">Yükleniyor...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">Kategori Düzenle</h1>

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
          onChange={(v) => handleChange("tagName", v)}
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
            {parentCategories
              .filter((c) => c.id !== categoryId) // kendisini parent olarak seçmesin
              .map((c) => (
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
          Güncelle
        </button>
      </form>
    </div>
  );
}

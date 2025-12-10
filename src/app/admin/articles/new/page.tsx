"use client";

import { useEffect, useState } from "react";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import { createArticle, getCategories } from "@/api/apiMethods";
import toast from "react-hot-toast";
import { ArticleAddDto } from "@/api/types/article";
import { CategoryDto } from "@/api/types/category";
import { DataResult } from "@/api/types/apiResponse";
import { fileToBase64 } from "@/lib/fileExtension";
import FileUpload from "@/components/FileUpload";

export default function NewArticlePage() {
  const router = useRouter();

  const [categories, setCategories] = useState<CategoryDto[]>([]);

  // Form state
  const [form, setForm] = useState<ArticleAddDto>({
    title: "",
    content: "",
    thumbnailBase64: "",
    publishedDate: new Date(),
    categoryId: "",
    slug: "",
    keywords: "",
  });

  // Validation errors
  const [errors, setErrors] = useState<
    Partial<Record<keyof ArticleAddDto, string>>
  >({});

  const handleChange = (key: keyof ArticleAddDto, value: string | null) => {
    setForm((prev) => ({ ...prev, [key]: value as any }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  // kategorileri çek
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategories();
      if (res.success) {
        const categories = (res as DataResult<CategoryDto[]>).data;
        setCategories(categories || []);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload: ArticleAddDto = {
      ...form,
      publishedDate: new Date(form.publishedDate),
    };

    const result = await createArticle(payload);

    if (result.success) {
      toast.success("Makale başarıyla eklendi!");
      router.push("/admin/articles");
      return;
    }
    debugger;
    // API validation errors
    if (result.validationErrors) {
      const newErrors: Partial<Record<keyof ArticleAddDto, string>> = {};

      Object.entries(result.validationErrors).forEach(([key, messages]) => {
        newErrors[key as keyof ArticleAddDto] = messages.join(", ");
      });

      setErrors(newErrors);
    }

    toast.error(result.message || "Bir hata oluştu");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">Yeni Makale Ekle</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Başlık"
          value={form.title}
          onChange={(v) => handleChange("title", v)}
          required
          errorMessage={errors.title}
        />

        <Input
          label="Slug"
          value={form.slug}
          onChange={(v) => handleChange("slug", v)}
          required
          errorMessage={errors.slug}
        />

        <Input
          label="Keywords"
          value={form.keywords}
          onChange={(v) => handleChange("keywords", v)}
          errorMessage={errors.keywords}
        />

        <FileUpload
          label="Thumbnail"
          value={form.thumbnailBase64}
          onChange={(v) => handleChange("thumbnailBase64", v)}
          errorMessage={errors.thumbnailBase64}
        />

        {/* Yayın Tarihi */}
        <Input
          label="Yayın Tarihi"
          type="date"
          value={form.publishedDate.toString().substring(0, 10)}
          onChange={(v) => handleChange("publishedDate", v)}
          required
          errorMessage={errors.publishedDate}
        />

        {/* Kategori seçimi */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Kategori</label>
          <select
            value={form.categoryId}
            onChange={(e) => handleChange("categoryId", e.target.value)}
            className={`px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400 ${
              errors.categoryId ? "border-red-500" : "border-gray-300"
            }`}
            required
          >
            <option value="">Seçiniz</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {errors.categoryId && (
            <span className="text-red-500 text-sm mt-1">
              {errors.categoryId}
            </span>
          )}
        </div>

        {/* İçerik - textarea */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">İçerik</label>
          <textarea
            value={form.content}
            onChange={(e) => handleChange("content", e.target.value)}
            placeholder="Makale içeriği buraya yazılır..."
            rows={8}
            className={`px-4 py-2 border rounded text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              errors.content ? "border-red-500" : "border-gray-300"
            }`}
          ></textarea>

          {errors.content && (
            <span className="text-red-500 text-sm mt-1">{errors.content}</span>
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

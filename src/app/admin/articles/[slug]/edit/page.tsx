"use client";

import { use, useEffect, useState } from "react";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { getArticle, updateArticle, getCategories } from "@/api/apiMethods";

import { ArticleDto, ArticleUpdateDto } from "@/api/types/article";
import { CategoryDto } from "@/api/types/category";
import { DataResult } from "@/api/types/apiResponse";

export default function EditArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const articleId = slug;

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<ArticleUpdateDto>({
    id: articleId,
    title: "",
    content: "",
    thumbnail: "",
    categoryId: "",
    slug: "",
    keywords: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ArticleUpdateDto, string>>
  >({});

  const handleChange = (key: keyof ArticleUpdateDto, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  // **ArticleDto → ArticleUpdateDto dönüşümü**
  const mapToUpdateDto = (a: ArticleDto): ArticleUpdateDto => ({
    id: a.id,
    title: a.title || "",
    content: a.content || "",
    thumbnail: a.thumbnail || "",
    categoryId: a.categoryId,
    slug: a.slug || "",
    keywords: a.keywords || "",
  });

  // İlk yüklemede makale ve kategorileri getir
  useEffect(() => {
    const loadData = async () => {
      const [articleRes, catRes] = await Promise.all([
        await getArticle(articleId),
        await getCategories(),
      ]);

      if (articleRes.success) {
        const article = (articleRes as DataResult<ArticleDto>).data;

        setForm(mapToUpdateDto(article));
      }

      if (catRes.success) {
        setCategories((catRes as DataResult<CategoryDto[]>).data || []);
      }
      setLoading(false);
    };

    loadData();
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = await updateArticle(form);

    if (result.success) {
      toast.success("Makale başarıyla güncellendi!");
      router.push("/admin/articles");
      return;
    }

    if (result.validationErrors) {
      const newErrors: Partial<Record<keyof ArticleUpdateDto, string>> = {};

      Object.entries(result.validationErrors).forEach(([key, messages]) => {
        newErrors[key as keyof ArticleUpdateDto] = messages.join(", ");
      });

      setErrors(newErrors);
    }

    toast.error(result.message || "Bir hata oluştu");
  };

  if (loading) return <div className="p-6">Yükleniyor...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">Makale Düzenle</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Başlık"
          value={form.title || ""}
          onChange={(v) => handleChange("title", v)}
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

        <Input
          label="Thumbnail URL"
          value={form.thumbnail || ""}
          onChange={(v) => handleChange("thumbnail", v)}
          errorMessage={errors.thumbnail}
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

        {/* İçerik */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">İçerik</label>
          <textarea
            value={form.content || ""}
            onChange={(e) => handleChange("content", e.target.value)}
            rows={8}
            className={`px-4 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-400 ${
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
          Güncelle
        </button>
      </form>
    </div>
  );
}

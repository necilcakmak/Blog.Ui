"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getArticle } from "@/api/apiMethods";
import { ArticleDto } from "@/api/types/article";
import { toast } from "react-hot-toast";
import { DataResult } from "@/api/types/apiResponse";
import { CommentDto } from "@/api/types/comment";

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug;
  const BASE_IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL + "articles/";

  const [article, setArticle] = useState<ArticleDto | null>(null);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateStr: string | Date) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const fetchArticle = async () => {
    if (!slug) return;
    setLoading(true);

    const result = await getArticle(slug.toString());
    if (result.success) {
      const article = (result as DataResult<ArticleDto>).data;
      setArticle(article);
    } else {
      toast.error(result.message || "Makale bulunamadı");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  if (loading) return <p className="p-6">Yükleniyor...</p>;
  if (!article) return <p className="p-6">Makale bulunamadı.</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 lg:grid lg:grid-cols-6 lg:gap-6">
      {/* Sol kategori paneli */}
      <aside className="lg:col-span-1 hidden lg:block">
        <div className="sticky top-24 p-4 bg-white rounded shadow-md">
          <h3 className="font-bold mb-4 text-lg">Kategoriler</h3>
          <ul className="space-y-2 text-sm">
            {article.category && (
              <li className="hover:text-blue-600">
                {article.category.parentCategoryDto?.name} /{" "}
                {article.category.name}
              </li>
            )}
          </ul>
        </div>
      </aside>

      {/* İçerik */}
      <main className="lg:col-span-4">
        {article.thumbnail && (
          <img
            src={BASE_IMAGE_URL + article.thumbnail}
            alt={article.title || "Makale görseli"}
            className="w-full h-64 object-cover rounded mb-6"
          />
        )}

        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        <div className="mb-6 text-gray-500 text-sm">
          {formatDate(article.publishedDate)}
        </div>

        <div className="prose max-w-full mb-8">
          <div dangerouslySetInnerHTML={{ __html: article.content || "" }} />
        </div>

        {/* Yorumlar */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Yorumlar</h3>
          {article.comments.length === 0 && (
            <p className="text-gray-500">Henüz yorum yok.</p>
          )}
          <ul className="space-y-4">
            {article.comments.map((c: CommentDto) => (
              <li key={c.id} className="border p-4 rounded shadow-sm">
                <div className="flex items-center mb-2">
                  {c.user?.imageSrc ? (
                    <img
                      src={c.user.imageSrc}
                      alt={c.user?.firstName}
                      className="w-10 h-10 rounded-full mr-2 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-2 flex items-center justify-center text-gray-500">
                      {c.user?.firstName?.[0] || "?"}
                    </div>
                  )}
                  <span className="font-semibold">
                    {c.user?.firstName} {c.user?.lastName}
                  </span>
                </div>
                <p>{c.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* Sağ yazar paneli */}
      <aside className="lg:col-span-1 hidden lg:block">
        <div className="sticky top-24 p-4 bg-white rounded shadow-md flex flex-col items-center">
          {article.user.imageName ? (
            <img
              src={
                "https://localhost:44322/images/articles/" +
                article.user.imageName
              }
              alt={`${article.user.firstName} ${article.user.lastName}`}
              className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-gray-300"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
              <span className="text-gray-500 text-xl">
                {article.user.firstName?.[0]}
              </span>
            </div>
          )}

          <h2 className="text-xl font-bold mb-2 text-center">
            {article.user.firstName} {article.user.lastName}
          </h2>

          {article.user.firstName && (
            <p className="text-gray-600 text-sm mb-2 text-center">
              {article.user.firstName}
            </p>
          )}

          <p className="text-gray-500 text-sm">Yaş: {article.user.age}</p>
          <p className="text-gray-500 text-sm">Rol: {article.user.roleName}</p>
          <p className="text-gray-500 text-sm break-words">
            {article.user.email}
          </p>
        </div>
      </aside>
    </div>
  );
}

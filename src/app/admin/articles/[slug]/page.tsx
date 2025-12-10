"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { getArticle, deleteComment } from "@/api/apiMethods";
import { ArticleDto } from "@/api/types/article";
import { DataResult } from "@/api/types/apiResponse";
import { CommentDto } from "@/api/types/comment";
import { UserDto } from "@/api/types/user";
import { useModal } from "@/context/ModalContext"; // global modal hook
import DataTable from "@/components/DataTable";

export default function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const articleId = slug;

  const [article, setArticle] = useState<ArticleDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingCommentIds, setDeletingCommentIds] = useState<string[]>([]);
  const router = useRouter();
  const { openModal } = useModal(); // ✅ global modal açma fonksiyonu
  const BASE_IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL + "articles/";
debugger
  useEffect(() => {
    const fetchArticle = async () => {
      const res = await getArticle(articleId);
      if (res.success) {
        setArticle((res as DataResult<ArticleDto>).data);
      }
      setLoading(false);
    };

    fetchArticle();
  }, [articleId]);

  const handleDeleteComment = (comment: CommentDto) => {
    openModal({
      title: "Yorumu Sil",
      message: `Bu yorumu silmek istediğine emin misin?`,
      confirmText: "Sil",
      cancelText: "Vazgeç",
      onConfirm: async () => {
        setDeletingCommentIds((prev) => [...prev, comment.id]);
        const res = await deleteComment(comment.id);

        if (res.success) {
          toast.success("Yorum silindi");
          setArticle((prev) =>
            prev
              ? {
                  ...prev,
                  comments: prev.comments.filter((c) => c.id !== comment.id),
                }
              : prev
          );
        } else {
          toast.error(res.message || "Yorum silinemedi");
        }

        setDeletingCommentIds((prev) => prev.filter((id) => id !== comment.id));
      },
    });
  };

  if (loading) return <div className="p-6">Yükleniyor...</div>;
  if (!article) return <div className="p-6">Makale bulunamadı</div>;

  const author: UserDto = article.user;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded space-y-6">
      {/* Başlık */}
      <h1 className="text-3xl font-bold">{article.title}</h1>

      {/* Metadata */}
      <div className="flex flex-col md:flex-row justify-between text-gray-600 text-sm mb-4">
        <div>
          Kategori: <span className="font-medium">{article.category.name}</span>
        </div>
        <div>
          Yayın Tarihi:{" "}
          <span className="font-medium">
            {new Date(article.publishedDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Yazar Bilgisi */}
      <div className="flex items-center gap-4 bg-gray-100 p-4 rounded">
        {author.imageSrc && (
          <img
            src={author.imageSrc}
            alt={author.userName || `${author.firstName} ${author.lastName}`}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
        <div>
          <div className="font-medium">
            {author.firstName} {author.lastName} ({author.userName})
          </div>
          <div className="text-gray-600 text-sm">
            Email: {author.email || "-"} | Rol: {author.roleName}
          </div>
        </div>
      </div>

      {/* Thumbnail */}
      {article.thumbnail && (
        <img
          src={BASE_IMAGE_URL + article.thumbnail}
          alt={article.title || ""}
          className="w-full h-64 object-cover rounded"
        />
      )}

      {/* İçerik */}
      <div className="prose max-w-full">{article.content}</div>
      <DataTable<CommentDto>
        data={article.comments}
        searchKeys={["text"]}
        columns={[
          {
            key: "user",
            label: "Kullanıcı",
            sortable: true,
            render: (c) =>
              c.user
                ? `${c.user.firstName || ""} ${c.user.lastName || ""} (${
                    c.user.userName
                  })`
                : "Anonim",
          },
          { key: "text", label: "Yorum", sortable: true },

          { key: "actions", label: "İşlemler" },
        ]}
        pageSize={5}
        loading={loading}
        onDelete={handleDeleteComment}
      />

      <button
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => router.back()}
      >
        Geri
      </button>
    </div>
  );
}

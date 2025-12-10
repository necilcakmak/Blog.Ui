"use client";

import { deleteArticle, getArticles } from "@/api/apiMethods";
import { DataResult } from "@/api/types/apiResponse";
import { ArticleDto } from "@/api/types/article";
import DataTable from "@/components/DataTable";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useModal } from "@/context/ModalContext"; // global modal hook
import Link from "next/link";

export default function ArticlesPage() {
  const router = useRouter();
  const [articleList, setArticleList] = useState<ArticleDto[]>([]);
  const [loading, setLoading] = useState(true);

  const { openModal } = useModal(); // ✅ global modal açma fonksiyonu

  const fetchArticles = async () => {
    setLoading(true);
    const result = await getArticles();
    if (result.success) {
      const articles = (result as DataResult<ArticleDto[]>).data;
      setArticleList(articles || []);
      toast.success(result.message);
    } else {
      toast.error(result.message || "Bir hata oluştu");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = (article: ArticleDto) => {
    openModal({
      title: "Makale Sil",
      message: `"${article.title}" adlı makaleyi silmek istiyor musunuz?`,
      confirmText: "Sil",
      cancelText: "Vazgeç",
      onConfirm: async () => {
        const result = await deleteArticle(article.id);
        if (result.success) {
          toast.success(result.message || "Silme işlemi başarılı");
          setArticleList((prev) => prev.filter((c) => c.id !== article.id));
        } else {
          toast.error(result.message || "Silme işlemi başarısız oldu.");
        }
      },
    });
  };

  return (
    <div>
      <DataTable
        data={articleList}
        title="Makaleler"
        actions={
          <Link
            href="/admin/articles/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-400 transition"
          >
            Yeni Ekle
          </Link>
        }
        searchKeys={["title", "keywords", "slug"]}
        columns={[
          { key: "id", label: "ID", sortable: true },
          { key: "title", label: "Başlık", sortable: true },
          { key: "slug", label: "Slug" },
          { key: "keywords", label: "Keywords" },
          { key: "viewsCount", label: "Görüntülenme" },
          { key: "actions", label: "İşlemler" },
        ]}
        pageSize={5}
        loading={loading}
        onEdit={(article: ArticleDto) =>
          router.push(`/admin/articles/${article.id}/edit`)
        }
        onView={(article: ArticleDto) =>
          router.push(`/admin/articles/${article.id}`)
        }
        onDelete={handleDelete}
      />
    </div>
  );
}

"use client";

import { deleteArticle, getArticles } from "@/api/apiMethods";
import { DataResult } from "@/api/types/apiResponse";
import { ArticleDto } from "@/api/types/article";
import DataTable from "@/components/DataTable";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useModal } from "@/context/ModalContext"; // global modal hook

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
      title: "Kategori Sil",
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
      <h1 className="text-2xl font-bold mb-4">Makaleler tet</h1>

      <DataTable
        data={articleList}
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
          router.push(`/admin/articles/edit/${article.id}`)
        }
        onView={(article: ArticleDto) =>
          router.push(`/admin/articles/${article.id}`)
        }
        onDelete={handleDelete}
      />
    </div>
  );
}

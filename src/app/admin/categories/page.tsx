"use client";

import { getCategories, deleteCategory } from "@/api/apiMethods";
import { DataResult } from "@/api/types/apiResponse";
import { CategoryDto } from "@/api/types/category";
import DataTable from "@/components/DataTable";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useModal } from "@/context/ModalContext"; // global modal hook
import Link from "next/link";

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const { openModal } = useModal(); // ✅ global modal açma fonksiyonu

  const loadCategories = async () => {
    setLoading(true);
    const result = await getCategories();
    if (result.success) {
      setCategories((result as DataResult<CategoryDto[]>).data || []);
      toast.success(result.message);
    } else {
      toast.error(result.message || "Bir hata oluştu");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = (category: CategoryDto) => {
    openModal({
      title: "Kategori Sil",
      message: `"${category.name}" adlı kategoriyi silmek istiyor musunuz?`,
      confirmText: "Sil",
      cancelText: "Vazgeç",
      onConfirm: async () => {
        const result = await deleteCategory(category.id);
        if (result.success) {
          toast.success(result.message || "Silme işlemi başarılı");
          setCategories((prev) => prev.filter((c) => c.id !== category.id));
        } else {
          toast.error(result.message || "Silme işlemi başarısız oldu.");
        }
      },
    });
  };

  return (
    <div>
      <DataTable
        data={categories}
        title="Kategoriler"
        actions={
          <Link
            href="/admin/categories/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-400 transition"
          >
            Yeni Ekle
          </Link>
        }
        searchKeys={["name", "tagName"]}
        columns={[
          { key: "id", label: "ID" },
          { key: "name", label: "Kategori Adı", sortable: true },
          { key: "tagName", label: "Tag Adı", sortable: true },
          { key: "actions", label: "İşlemler" },
        ]}
        pageSize={5}
        loading={loading}
        onEdit={(category: CategoryDto) =>
          router.push(`/admin/categories/${category.id}`)
        }
        onDelete={handleDelete}
      />
    </div>
  );
}

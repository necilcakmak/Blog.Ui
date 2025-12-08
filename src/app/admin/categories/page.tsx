"use client";

import { getCategories, deleteCategory } from "@/api/apiMethods";
import { DataResult } from "@/api/types/apiResponse";
import { CategoryDto } from "@/api/types/category";
import DataTable from "@/components/DataTable";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useModal } from "@/context/ModalContext"; // global modal hook

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
      <h1 className="text-2xl font-bold mb-4">Kategoriler</h1>
      <DataTable
        data={categories}
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
          router.push(`/admin/categories/edit/${category.id}`)
        }
        onView={(category: CategoryDto) =>
          router.push(`/admin/categories/${category.id}`)
        }
        onDelete={handleDelete}
      />
    </div>
  );
}

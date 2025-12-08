"use client";

import { getUsers, deleteUser } from "@/api/apiMethods";
import { DataResult } from "@/api/types/apiResponse";
import { UserDto } from "@/api/types/user";
import DataTable from "@/components/DataTable";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useModal } from "@/context/ModalContext"; // global modal hook

export default function UsersPage() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { openModal } = useModal(); // ✅ global modal açma fonksiyonu

  const loadUsers = async () => {
    setLoading(true);
    const result = await getUsers();
    if (result.success) {
      setUsers((result as DataResult<UserDto[]>).data || []);
      toast.success(result.message)
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = (item: UserDto) => {
    openModal({
      title: "Kategori Sil",
      message: `"${item.firstName}" adlı kullanıcıyı silmek istiyor musunuz?`,
      confirmText: "Sil",
      cancelText: "Vazgeç",
      onConfirm: async () => {
        const result = await deleteUser(item.id);
        if (result.success) {
          toast.success(result.message || "Silme işlemi başarılı");
          setUsers((prev) => prev.filter((c) => c.id !== item.id));
        } else {
          toast.error(result.message || "Silme işlemi başarısız oldu.");
        }
      },
    });
  };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Kullanıcılar</h1>
      <DataTable
        data={users}
        searchKeys={["firstName", "lastName", "email", "userName"]}
        columns={[
          { key: "id", label: "ID" },
          { key: "firstName", label: "Ad", sortable: true },
          { key: "lastName", label: "Soyad", sortable: true },
          { key: "userName", label: "Kullanıcı Adı" },
          { key: "email", label: "Email", sortable: true },
          { key: "actions", label: "İşlemler" },
        ]}
        pageSize={5}
        loading={loading}
        onEdit={(item) => router.push(`/admin/users/edit/${item.id}`)}
        onView={(item) => router.push(`/admin/users/${item.id}`)}
        onDelete={handleDelete}
      />
    </div>
  );
}

"use client"; // Client component, çünkü useState ve useEffect kullanıyoruz

import { getArticles, getCategories, getUsers } from "@/api/apiMethods";
import { DataResult } from "@/api/types/apiResponse";
import { ArticleDto } from "@/api/types/article";
import { CategoryDto } from "@/api/types/category";
import { UserDto } from "@/api/types/user";
import { useEffect, useState } from "react";

export default function AdminHome() {
  const [articleList, setArticleList] = useState<ArticleDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [users, setUsers] = useState<UserDto[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stats = [
    { label: "Kullanıcılar", value: users.length },
    { label: "Makaleler", value: articleList.length },
    { label: "Kategoriler", value: categories.length },
  ];
  const fetchArticles = async () => {
    setLoading(true);
    const result = await getArticles(); // API çağrısı
    if (result.success) {
      const articles = (result as DataResult<ArticleDto[]>).data;
      setArticleList(articles || []);
    } else {
      setError(result.message || "Bir hata oluştu");
    }
    setLoading(false);
  };
  const fetchCategories = async () => {
    setLoading(true);
    const result = await getCategories(); // API çağrısı
    if (result.success) {
      const categories = (result as DataResult<CategoryDto[]>).data;
      setCategories(categories || []);
    } else {
      setError(result.message || "Bir hata oluştu");
    }
    setLoading(false);
  };
  const fetchUsers = async () => {
    setLoading(true);
    const result = await getUsers(); // API çağrısı
    if (result.success) {
      const users = (result as DataResult<UserDto[]>).data;
      setUsers(users || []);
    } else {
      setError(result.message || "Bir hata oluştu");
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchArticles();
    fetchCategories();
    fetchUsers();
  }, []);

  return (
    <div>
      {/* Dashboard istatistikleri */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white shadow rounded p-6 flex flex-col items-center justify-center"
          >
            <span className="text-2xl font-semibold">{stat.value}</span>
            <span className="text-gray-900 font-medium">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

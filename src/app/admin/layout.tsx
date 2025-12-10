"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const role = "Admin"; // Sabit rol
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Dropdown dışına tıklayınca kapatma
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    document.cookie =
      "authToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;";
    router.push("/site/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col fixed top-0 left-0 h-full">
        <Link
          href="/admin"
          className="p-6 text-2xl font-bold hover:text-gray-300 transition"
        >
          Admin
        </Link>
        <nav className="flex flex-col gap-2 p-4">
          <Link
            href="/admin/categories"
            className="hover:bg-gray-700 p-2 rounded transition"
          >
            Kategoriler
          </Link>
          <Link
            href="/admin/articles"
            className="hover:bg-gray-700 p-2 rounded transition"
          >
            Makaleler
          </Link>
          <Link
            href="/admin/users"
            className="hover:bg-gray-700 p-2 rounded transition"
          >
            Kullanıcılar
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Üst menü */}
        <header className="h-16 bg-gray-800 flex items-center justify-between px-6 shadow-md">
          {/* Sol kısım: Site link */}
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-white font-semibold px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              Site Anasayfa
            </Link>
          </div>

          {/* Sağ kısım: Profil dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>{role}</span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50 overflow-hidden">
                <Link
                  href="/admin/profile"
                  className="block px-4 py-2 hover:bg-gray-100 transition"
                >
                  Profilim
                </Link>
                <Link
                  href="/admin/settings"
                  className="block px-4 py-2 hover:bg-gray-100 transition"
                >
                  Ayarlar
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 transition"
                >
                  Çıkış
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Ana içerik */}
        <main className="flex-1 bg-gray-100 p-6">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

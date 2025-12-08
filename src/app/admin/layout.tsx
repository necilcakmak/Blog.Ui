"use client"; // 🚨
import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const pathSegments = pathname?.split("/").filter(Boolean) || [];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <Link
          href="/admin"
          className="p-6 text-2xl font-bold hover:text-gray-300"
        >
          Admin Panel
        </Link>

        <nav className="flex flex-col gap-2 p-4">
          <Link
            href="/admin/categories"
            className="hover:bg-gray-700 p-2 rounded"
          >
            Kategoriler
          </Link>
          <Link
            href="/admin/articles"
            className="hover:bg-gray-700 p-2 rounded"
          >
            Makaleler
          </Link>
          <Link href="/admin/users" className="hover:bg-gray-700 p-2 rounded">
            Kullanıcılar
          </Link>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white shadow flex items-center px-6">
          <nav className="flex items-center space-x-2 text-gray-700 text-sm">
            <Link href="/admin" className="hover:underline">
              Admin
            </Link>
            {pathSegments.slice(1).map((segment, idx) => (
              <span key={idx} className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="capitalize">{segment.replace(/-/g, " ")}</span>
              </span>
            ))}
          </nav>
        </header>
        <main className="flex-1 bg-gray-100 p-6">{children}</main>
      </div>
    </div>
  );
}

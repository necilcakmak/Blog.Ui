"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="tr">
      <body className="bg-black text-white flex items-center justify-center min-h-screen">
        <div className="text-center px-4">
          <h1 className="text-9xl font-extrabold mb-6">404</h1>
          <h2 className="text-3xl font-semibold mb-4">Sayfa Bulunamadı</h2>
          <p className="text-gray-300 max-w-md mx-auto mb-8">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </body>
    </html>
  );
}

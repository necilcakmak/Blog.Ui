"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AuthStatus() {
  const [isLogged, setIsLogged] = useState(false);

  function getCookie(name: string) {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="));

    return match ? decodeURIComponent(match.split("=")[1]) : null;
  }

  useEffect(() => {
    const token = getCookie("authToken");
    setIsLogged(!!token);
  }, []);

  const handleLogout = () => {
    document.cookie =
      "authToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;";

    window.location.reload();
  };

  return (
    <div className="flex items-center space-x-4 text-sm font-medium">
      {!isLogged ? (
        <>
          <Link href="/site/login" className="hover:text-blue-600">
            Giriş Yap
          </Link>
          <Link href="/site/register" className="hover:text-blue-600">
            Kayıt Ol
          </Link>
        </>
      ) : (
        <button
          onClick={handleLogout}
          className="text-red-600 hover:text-red-800"
        >
          Çıkış Yap
        </button>
      )}
    </div>
  );
}

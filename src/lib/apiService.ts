// src/api/api.ts
import { Result, DataResult } from "@/api/types/apiResponse";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchWrapper<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<DataResult<T> | Result> {
  try {
    const token = localStorage.getItem("accessToken");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}/${endpoint}`, {
      ...options,
      headers,
    });

    const data: DataResult<T> | Result = await res.json().catch(() => ({}));

    // ✅ Global UnAuthorizedRequest kontrolü
    if (!data.success && data.message === "UnAuthorizedRequest") {
      // Mevcut sayfayı kaydet (login sonrası yönlendirme için)
      localStorage.setItem("redirectAfterLogin", window.location.pathname);

      // Login sayfasına yönlendir
      window.location.href = "/login";

      // Boş bir result dön (fetch tamamlanıyor)
      return { success: false, message: "Redirecting to login..." };
    }

    return data;
  } catch (err: any) {
    console.error("Network error:", err);
    return { success: false, message: "Network error" };
  }
}

// API helper fonksiyonlar
export const getData = <T>(endpoint: string) => fetchWrapper<T>(endpoint);
export const postData = <T>(endpoint: string, payload: any) =>
  fetchWrapper<T>(endpoint, { method: "POST", body: JSON.stringify(payload) });
export const putData = <T>(endpoint: string, payload: any) =>
  fetchWrapper<T>(endpoint, { method: "PUT", body: JSON.stringify(payload) });
export const deleteData = <T>(endpoint: string) =>
  fetchWrapper<T>(endpoint, { method: "DELETE" });

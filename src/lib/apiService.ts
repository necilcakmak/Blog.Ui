// src/api/api.ts
import { Result, DataResult } from "@/api/types/apiResponse";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchWrapper<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<DataResult<T> | Result> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    const res = await fetch(`${API_URL}/${endpoint}`, {
      ...options,
      headers,
      credentials: "include", // ✅ Cookie gönderilsin
    });

    const data: DataResult<T> | Result = await res.json().catch(() => ({}));

    if (!data.success && data.message === "UnAuthorizedRequest") {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      window.location.href = "/site/login";
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
  fetchWrapper<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const putData = <T>(endpoint: string, payload: any) =>
  fetchWrapper<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteData = <T>(endpoint: string) =>
  fetchWrapper<T>(endpoint, {
    method: "DELETE",
  });

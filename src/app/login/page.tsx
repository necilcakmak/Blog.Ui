"use client";

import React, { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { DataResult, Result } from "@/api/types/apiResponse";
import { login } from "@/api/apiMethods";
import { LoginDto } from "@/api/types/auth";
import { AccessToken } from "@/api/types/user";
import { useRouter } from "next/navigation"; // ✅
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  // Her input için error mesajları
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const payload: LoginDto = { email, password };

    const loginResponse: DataResult<AccessToken> | Result = await login(
      payload
    );
    if (loginResponse.success) {
      const tokenData = (loginResponse as DataResult<AccessToken>).data;
      if (tokenData.token) {
        localStorage.setItem("accessToken", tokenData.token);

        if (tokenData.user) {
          localStorage.setItem("user", JSON.stringify(tokenData.user));
        }
        const redirectPath =
          localStorage.getItem("redirectAfterLogin") || "/admin";
        localStorage.removeItem("redirectAfterLogin");

        router.push(redirectPath);

        toast.success(loginResponse.message);
      }
    } else {
      if (loginResponse.validationErrors) {
        const newErrors: typeof errors = {};
        Object.entries(loginResponse.validationErrors).forEach(
          ([key, messages]) => {
            newErrors[key as keyof typeof errors] = messages.join(", ");
          }
        );
        setErrors(newErrors);
      }
    }
    toast.error(loginResponse.message || "Silme işlemi başarısız oldu.");

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white rounded shadow space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-black">Login</h1>
        <Input
          label="Email"
          value={email}
          onChange={setEmail}
          type="email"
          required
          pattern={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
          errorMessage={errors.email}
        />
        <Input
          label="Password"
          value={password}
          onChange={setPassword}
          type="password"
          required
          errorMessage={errors.password}
        />

        <Button type="submit" disabled={loading}>
          {"Login"}
        </Button>
        {message && (
          <p className="text-center text-red-500 mt-2 font-medium">{message}</p>
        )}
      </form>
    </div>
  );
}

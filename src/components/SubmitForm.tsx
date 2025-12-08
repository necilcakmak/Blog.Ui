"use client";
import React, { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { postData } from "@/lib/apiService";

export default function SubmitForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await postData("https://localhost:44322/api/submit", {
        email,
      });
      setMessage("Success! Data sent to API.");
      console.log("API response:", data);
    } catch (err) {
      setMessage("Error sending data to API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow space-y-4"
    >
      <Input
        label="Email"
        value={email}
        onChange={setEmail}
        type="email"
        required
        pattern={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
        errorMessage="Please enter a valid email"
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Submit"}
      </Button>
      {message && <p className="text-center mt-2 text-gray-700">{message}</p>}
    </form>
  );
}

 "use client";

import { apiFetch } from "@/utils/fetcher";
import React from "react";

export default function page() {
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = Object.fromEntries(new FormData(form).entries()) as Record<
      string,
      FormDataEntryValue
    >;
    console.log("Form data:", formData);
    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      alert("Registration successful!");
      form.reset();
    } catch {
      alert("Registration failed.");
    }
  }

  return null;
}

"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import apiClient from "@/services/api-client";
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const { data } = await apiClient.post("/auth/forgot-password", { email });
      const token = data?.data?.resetToken;
      if (token) {
        setMessage(
          `Reset token generated: ${token}. Use it on the reset password page.`,
        );
      } else {
        setMessage(
          data?.message || "If the email exists, a reset link will be sent.",
        );
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
      {" "}
      <Card>
        {" "}
        <h1 className="text-3xl font-bold text-[rgb(var(--text-primary))] mb-2">
          Forgot Password
        </h1>{" "}
        <p className="text-[rgb(var(--text-muted))] mb-6">
          Enter your account email to receive reset instructions.
        </p>{" "}
        <form onSubmit={handleSubmit} className="space-y-4">
          {" "}
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            leftIcon={<Mail className="h-4 w-4" />}
            required
          />{" "}
          {message && (
            <p className="text-sm text-[rgb(var(--text-muted))]">{message}</p>
          )}{" "}
          <Button type="submit" isLoading={loading}>
            Request Reset
          </Button>{" "}
        </form>{" "}
        <div className="mt-6 text-sm text-[rgb(var(--text-muted))]">
          {" "}
          Remembered your password?{" "}
          <Link
            href="/login"
            className="text-[rgb(var(--accent))] hover:underline"
          >
            Back to login
          </Link>{" "}
        </div>{" "}
      </Card>{" "}
    </div>
  );
}


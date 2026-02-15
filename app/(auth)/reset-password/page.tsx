"use client";
import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import apiClient from "@/services/api-client";
function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const payload = token.trim()
        ? { token: token.trim(), newPassword }
        : { password: currentPassword, newPassword };
      const { data } = await apiClient.post("/auth/reset-password", payload);
      setMessage(data?.message || "Password updated successfully.");
      setNewPassword("");
      setCurrentPassword("");
    } catch (error: unknown) {
      const messageFromApi =
        typeof error === "object" &&
        error &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } })
          .response?.data?.message === "string"
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Failed to reset password.";
      setMessage(messageFromApi || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
      {" "}
      <Card>
        {" "}
        <h1 className="text-3xl font-black text-[rgb(var(--text-primary))] mb-2">
          Reset Password
        </h1>{" "}
        <p className="text-[rgb(var(--text-muted))] mb-6">
          {" "}
          Use token-based reset or authenticated password change.{" "}
        </p>{" "}
        <form onSubmit={handleSubmit} className="space-y-4">
          {" "}
          <Input
            label="Reset Token (optional)"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste reset token"
          />{" "}
          {!token.trim() && (
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              required
            />
          )}{" "}
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            required
          />{" "}
          {message && (
            <p className="text-sm text-[rgb(var(--text-muted))]">{message}</p>
          )}{" "}
          <Button type="submit" isLoading={loading}>
            Update Password
          </Button>{" "}
        </form>{" "}
        <div className="mt-6 text-sm text-[rgb(var(--text-muted))]">
          {" "}
          Need a token?{" "}
          <Link
            href="/forgot-password"
            className="text-[rgb(var(--accent))] hover:underline"
          >
            Go to forgot password
          </Link>{" "}
        </div>{" "}
      </Card>{" "}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
          <Card>
            <p className="text-sm text-[rgb(var(--text-muted))]">Loading...</p>
          </Card>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}

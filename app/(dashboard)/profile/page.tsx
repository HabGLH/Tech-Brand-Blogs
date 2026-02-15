"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Save, KeyRound, UserCircle2 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import apiClient from "@/services/api-client";
export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [location, setLocation] = useState(user?.location || "");
  const [website, setWebsite] = useState(user?.website || "");
  const [twitter, setTwitter] = useState(user?.twitter || "");
  const [linkedin, setLinkedin] = useState(user?.linkedin || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    try {
      const response = await apiClient.put("/users/me", {
        name,
        email,
        bio,
        location,
        website,
        twitter,
        linkedin,
        avatarUrl,
      });
      const updatedUser = response.data?.data?.user;
      if (updatedUser) {
        setUser(updatedUser);
      }
      setMessage("Profile updated successfully.");
    } catch (error: unknown) {
      const messageFromApi =
        typeof error === "object" &&
        error &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } })
          .response?.data?.message === "string"
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Failed to update profile.";
      setMessage(messageFromApi || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {" "}
      <div>
        {" "}
        <h1 className="text-3xl font-bold text-[rgb(var(--text-primary))]">
          Profile Settings
        </h1>{" "}
        <p className="text-[rgb(var(--text-muted))]">
          Manage public bio, social links, and account details.
        </p>{" "}
      </div>{" "}
      <Card>
        {" "}
        <div className="flex items-center gap-4 mb-6">
          {" "}
          <div className="h-16 w-16 rounded-2xl bg-[rgb(var(--primary))] text-[rgb(var(--on-primary))] flex items-center justify-center text-2xl font-bold">
            {" "}
            {name?.[0]?.toUpperCase() || (
              <UserCircle2 className="h-8 w-8" />
            )}{" "}
          </div>{" "}
          <div>
            {" "}
            <p className="font-bold text-[rgb(var(--text-primary))]">
              {name || "Your Name"}
            </p>{" "}
            <p className="text-xs text-[rgb(var(--text-muted))]">
              {email || "your@email.com"}
            </p>{" "}
            <Link
              href={`/users/${user?._id}`}
              className="text-xs text-[rgb(var(--accent))] hover:underline"
            >
              {" "}
              View public profile{" "}
            </Link>{" "}
          </div>{" "}
        </div>{" "}
        <form onSubmit={handleSubmit} className="space-y-5">
          {" "}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {" "}
            <Input
              label="Full Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your full name"
            />{" "}
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />{" "}
          </div>{" "}
          <Input
            label="Avatar URL"
            value={avatarUrl}
            onChange={(event) => setAvatarUrl(event.target.value)}
            placeholder="https://..."
          />{" "}
          <div>
            {" "}
            <label className="block text-sm font-semibold text-[rgb(var(--text-primary)/0.86)] mb-2">
              Bio
            </label>{" "}
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              rows={4}
              maxLength={500}
              className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 py-3 text-sm outline-none focus:border-[rgb(var(--accent))] focus:ring-4 focus:ring-[rgb(var(--accent-soft)/0.25)] "
              placeholder="Tell people about yourself..."
            />{" "}
          </div>{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {" "}
            <Input
              label="Location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="City, Country"
            />{" "}
            <Input
              label="Website"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              placeholder="https://your-site.com"
            />{" "}
            <Input
              label="Twitter URL"
              value={twitter}
              onChange={(event) => setTwitter(event.target.value)}
              placeholder="https://x.com/username"
            />{" "}
            <Input
              label="LinkedIn URL"
              value={linkedin}
              onChange={(event) => setLinkedin(event.target.value)}
              placeholder="https://linkedin.com/in/username"
            />{" "}
          </div>{" "}
          {message && (
            <p className="text-sm text-[rgb(var(--text-muted))]">{message}</p>
          )}{" "}
          <Button
            type="submit"
            isLoading={isSaving}
            leftIcon={<Save className="h-4 w-4" />}
          >
            {" "}
            Save Changes{" "}
          </Button>{" "}
        </form>{" "}
      </Card>{" "}
      <Card title="Password & Recovery">
        {" "}
        <div className="flex flex-col sm:flex-row gap-3">
          {" "}
          <Link href="/forgot-password">
            {" "}
            <Button
              variant="outline"
              leftIcon={<KeyRound className="h-4 w-4" />}
            >
              {" "}
              Forgot Password{" "}
            </Button>{" "}
          </Link>{" "}
          <Link href="/reset-password">
            {" "}
            <Button
              variant="outline"
              leftIcon={<KeyRound className="h-4 w-4" />}
            >
              {" "}
              Reset Password{" "}
            </Button>{" "}
          </Link>{" "}
        </div>{" "}
      </Card>{" "}
    </div>
  );
}


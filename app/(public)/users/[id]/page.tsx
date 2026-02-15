"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Globe, Linkedin, Twitter, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import Card from "@/components/ui/Card";
import apiClient from "@/services/api-client";
import { User } from "@/types";

export default function PublicUserProfilePage() {
  const params = useParams<{ id: string }>();
  const userId = params?.id;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get(`/users/public/${userId}`);
        setUser(data?.data?.user || null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-[rgb(var(--text-muted))]">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-[rgb(var(--text-muted))]">
        Profile not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Card>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-2xl bg-[rgb(var(--primary))] text-[rgb(var(--on-primary))] flex items-center justify-center text-2xl font-black">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-3xl font-black text-[rgb(var(--text-primary))]">
                {user.name}
              </h1>
              <p className="text-sm font-semibold text-[rgb(var(--text-muted))] capitalize">
                {user.role}
              </p>
              <p className="mt-2 text-[rgb(var(--text-muted))] max-w-xl">
                {user.bio || "No bio added yet."}
              </p>
            </div>
          </div>

          <div className="text-xs text-[rgb(var(--text-muted))] inline-flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            Joined{" "}
            {user.createdAt
              ? format(new Date(user.createdAt), "MMM d, yyyy")
              : "-"}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {user.location && (
            <div className="inline-flex items-center gap-2 text-[rgb(var(--text-muted))]">
              <MapPin className="h-4 w-4" /> {user.location}
            </div>
          )}
          {user.website && (
            <Link
              href={user.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[rgb(var(--accent))] hover:underline"
            >
              <Globe className="h-4 w-4" /> Website
            </Link>
          )}
          {user.twitter && (
            <Link
              href={user.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[rgb(var(--accent))] hover:underline"
            >
              <Twitter className="h-4 w-4" /> Twitter
            </Link>
          )}
          {user.linkedin && (
            <Link
              href={user.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[rgb(var(--accent))] hover:underline"
            >
              <Linkedin className="h-4 w-4" /> LinkedIn
            </Link>
          )}
        </div>
      </Card>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { metadataService } from "@/services/metadata-service";
import { postService } from "@/services/post-service";
import apiClient from "@/services/api-client";
import { Category, Post, PostPayload, Tag } from "@/types";
import PostForm from "@/components/features/PostForm";
import { Loader2 } from "lucide-react";

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [postRes, catRes, tagRes] = await Promise.all([
          apiClient.get(`/posts/${id}`),
          metadataService.getCategories(),
          metadataService.getTags(),
        ]);
        setPost(postRes.data?.data?.post || null);
        setCategories(catRes.data.categories || []);
        setTags(tagRes.data.tags || []);
      } catch (err) {
        console.error("Initialization failed", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id]);

  const handleSubmit = async (data: PostPayload) => {
    setSubmitting(true);
    try {
      await postService.update(id as string, data);
      router.push("/admin/posts");
    } catch {
      alert("Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[rgb(var(--accent))]" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center font-bold text-[rgb(var(--secondary))]">
        Post not found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-[rgb(var(--text-primary))] mb-2">
          Edit Story
        </h1>
        <p className="text-[rgb(var(--text-muted))] font-medium text-lg">
          Refine your work and update your readers.
        </p>
      </div>

      <PostForm
        initialData={post}
        categories={categories}
        tags={tags}
        onSubmit={handleSubmit}
        isLoading={submitting}
      />
    </div>
  );
}

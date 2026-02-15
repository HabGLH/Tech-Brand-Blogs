"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { metadataService } from "@/services/metadata-service";
import apiClient from "@/services/api-client";
import { Category, Post, PostPayload, Tag } from "@/types";
import PostForm from "@/components/features/PostForm";

export default function EditMyPostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const postId = params?.id;
  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!postId) return;
    const load = async () => {
      setLoading(true);
      try {
        const [postResponse, categoriesResponse, tagsResponse] =
          await Promise.all([
            apiClient.get(`/posts/${postId}`),
            metadataService.getCategories(),
            metadataService.getTags(),
          ]);
        setPost(postResponse.data?.data?.post || null);
        setCategories(categoriesResponse.data.categories || []);
        setTags(tagsResponse.data.tags || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [postId]);

  const handleSubmit = async (data: PostPayload) => {
    if (!postId) return;
    setSubmitting(true);
    try {
      await apiClient.put(`/posts/${postId}`, data);
      router.push("/my-posts");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[rgb(var(--accent))]" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center font-semibold text-[rgb(var(--secondary))]">
        Post not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-10">
        <h1 className="mb-2 text-4xl font-bold text-[rgb(var(--text-primary))]">
          Edit Post
        </h1>
        <p className="text-lg font-medium text-[rgb(var(--text-muted))]">
          Update your content and publish state.
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


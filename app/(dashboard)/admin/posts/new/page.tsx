"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { metadataService } from "@/services/metadata-service";
import { postService } from "@/services/post-service";
import { Category, PostPayload, Tag } from "@/types";
import PostForm from "@/components/features/PostForm";
export default function CreatePostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [categoryRes, tagRes] = await Promise.all([
          metadataService.getCategories(),
          metadataService.getTags(),
        ]);
        setCategories(categoryRes.data.categories || []);
        setTags(tagRes.data.tags || []);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchMetadata();
  }, []);
  const handleSubmit = async (data: PostPayload) => {
    setIsLoading(true);
    try {
      const response = await postService.create(data);
      if (response.status === "success") {
        router.push("/admin/posts");
      }
    } catch {
      alert("Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="max-w-5xl mx-auto">
      {" "}
      <div className="mb-10">
        {" "}
        <h1 className="text-4xl font-bold text-[rgb(var(--text-primary))] mb-2">
          Create New Story
        </h1>{" "}
        <p className="text-[rgb(var(--text-muted))] font-medium text-lg">
          Bring your ideas to life with our rich editor.
        </p>{" "}
      </div>{" "}
      <PostForm
        categories={categories}
        tags={tags}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />{" "}
    </div>
  );
}


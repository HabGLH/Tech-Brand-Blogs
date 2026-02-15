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
      } catch {
        setCategories([]);
        setTags([]);
      }
    };
    fetchMetadata();
  }, []);
  const handleSubmit = async (data: PostPayload) => {
    setIsLoading(true);
    try {
      const response = await postService.create(data);
      if (response.status === "success") {
        router.push("/my-posts");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="mx-auto max-w-5xl">
      {" "}
      <div className="mb-10">
        {" "}
        <h1 className="mb-2 text-4xl font-black text-[rgb(var(--text-primary))]">
          Create Post
        </h1>{" "}
        <p className="text-lg font-medium text-[rgb(var(--text-muted))]">
          Write and publish your story.
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

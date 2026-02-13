"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { metadataService } from "@/services/metadata-service";
import { postService } from "@/services/post-service";
import { Category } from "@/types";
import PostForm from "@/components/features/PostForm";

export default function CreatePostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await metadataService.getCategories();
        setCategories(res.data.categories);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCats();
  }, []);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await postService.create(data);
      if (response.status === "success") {
        router.push("/admin/posts");
      }
    } catch (err) {
      alert("Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Create New Story</h1>
        <p className="text-gray-500 font-medium text-lg">Bring your ideas to life with our rich editor.</p>
      </div>

      <PostForm 
        categories={categories} 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
      />
    </div>
  );
}

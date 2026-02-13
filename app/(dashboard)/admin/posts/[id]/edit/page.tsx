"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { metadataService } from "@/services/metadata-service";
import { postService } from "@/services/post-service";
import { Category, Post } from "@/types";
import PostForm from "@/components/features/PostForm";
import { Loader2 } from "lucide-react";

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [postRes, catRes] = await Promise.all([
          postService.getAll({ _id: id }), // Or getById if it exists
          metadataService.getCategories(),
        ]);
        
        // Since getAll returns paginated, find the post
        const p = postRes.data.posts.find(p => p._id === id);
        if (p) {
          setPost(p);
        }
        setCategories(catRes.data.categories);
      } catch (err) {
        console.error("Initialization failed", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id]);

  const handleSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      await postService.update(id as string, data);
      router.push("/admin/posts");
    } catch (err) {
      alert("Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!post) {
    return <div className="text-center font-bold text-red-500">Post not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Edit Story</h1>
        <p className="text-gray-500 font-medium text-lg">Refine your work and update your readers.</p>
      </div>

      <PostForm 
        initialData={post}
        categories={categories} 
        onSubmit={handleSubmit} 
        isLoading={submitting} 
      />
    </div>
  );
}

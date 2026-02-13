"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, X, Image as ImageIcon, Sparkles } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Post, Category } from "@/types";

const postFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  imageUrl: z.string().url("Please enter a valid image URL").optional().or(z.literal("")),
  categoryId: z.string().min(1, "Please select a category"),
  status: z.enum(["draft", "published"]),
});

type PostFormFields = z.infer<typeof postFormSchema>;

interface PostFormProps {
  initialData?: Post;
  categories: Category[];
  onSubmit: (data: PostFormFields) => Promise<void>;
  isLoading?: boolean;
}

const PostForm: React.FC<PostFormProps> = ({ initialData, categories, onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormFields>({
    resolver: zodResolver(postFormSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      content: initialData.content,
      imageUrl: initialData.imageUrl || "",
      categoryId: typeof initialData.categoryId === "object" ? initialData.categoryId._id : initialData.categoryId,
      status: initialData.status,
    } : {
      status: "draft",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card padding="lg">
            <div className="space-y-6">
              <Input
                label="Post Title"
                placeholder="Enter a catchy title..."
                {...register("title")}
                error={errors.title?.message}
                className="text-lg font-bold"
              />

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Content
                </label>
                <textarea
                  {...register("content")}
                  rows={15}
                  className={`
                    w-full px-4 py-3 bg-white dark:bg-gray-900 border rounded-xl shadow-sm outline-none transition-all
                    ${errors.content ? "border-red-500 focus:ring-red-100" : "border-gray-200 dark:border-gray-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"}
                    dark:text-white placeholder:text-gray-400
                  `}
                  placeholder="Tell your story..."
                />
                {errors.content && <p className="text-xs font-medium text-red-500">{errors.content.message}</p>}
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <Card title="Publishing Settings">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Category</label>
                <select
                  {...register("categoryId")}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:border-blue-500 font-medium text-sm"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-xs font-medium text-red-500">{errors.categoryId.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Visibility</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className={`
                    flex flex-col items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all
                    ${register("status").name === "status" ? "border-blue-600 bg-blue-50/50" : "border-gray-100"}
                  `}>
                    <input type="radio" {...register("status")} value="draft" className="hidden" />
                    <span className="text-xs font-bold uppercase tracking-wider">Draft</span>
                  </label>
                  <label className={`
                    flex flex-col items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all
                  `}>
                    <input type="radio" {...register("status")} value="published" className="hidden" />
                    <span className="text-xs font-bold uppercase tracking-wider">Public</span>
                  </label>
                </div>
              </div>

              <Input
                label="Featured Image URL"
                placeholder="https://..."
                {...register("imageUrl")}
                error={errors.imageUrl?.message}
                leftIcon={<ImageIcon className="w-4 h-4" />}
              />
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 space-y-3">
              <Button type="submit" className="w-full py-3" isLoading={isLoading} leftIcon={<Save className="w-4 h-4" />}>
                {initialData ? "Update Changes" : "Publish Story"}
              </Button>
              <Button type="button" variant="ghost" className="w-full text-gray-400">
                Cancel
              </Button>
            </div>
          </Card>

          <Card padding="sm" className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">Writing Tip</span>
            </div>
            <p className="text-sm font-medium opacity-90 leading-relaxed">
              Great titles are concise and evoke curiosity. Aim for 40-60 characters for maximum impact.
            </p>
          </Card>
        </div>
      </div>
    </form>
  );
};

export default PostForm;

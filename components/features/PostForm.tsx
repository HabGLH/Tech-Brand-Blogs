"use client";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Image as ImageIcon, Sparkles } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Post, Category, Tag } from "@/types";
const postFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  imageUrl: z
    .string()
    .url("Please enter a valid image URL")
    .optional()
    .or(z.literal("")),
  categoryId: z.string().min(1, "Please select a category"),
  tagIds: z.array(z.string()).default([]),
  status: z.enum(["draft", "published"]),
});
type PostFormFields = z.input<typeof postFormSchema>;
interface PostFormProps {
  initialData?: Post;
  categories: Category[];
  tags?: Tag[];
  onSubmit: (data: PostFormFields) => Promise<void>;
  isLoading?: boolean;
}
const PostForm: React.FC<PostFormProps> = ({
  initialData,
  categories,
  tags = [],
  onSubmit,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PostFormFields>({
    resolver: zodResolver(postFormSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          content: initialData.content,
          imageUrl: initialData.imageUrl || "",
          categoryId:
            typeof initialData.categoryId === "object"
              ? initialData.categoryId._id
              : initialData.categoryId,
          tagIds: (initialData.tagIds || []).map((tag) =>
            typeof tag === "object" ? tag._id : tag,
          ),
          status: initialData.status,
        }
      : { status: "published", tagIds: [] },
  });
  const selectedStatus = useWatch({ control, name: "status" });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {" "}
        {/* Main Content */}{" "}
        <div className="lg:col-span-2 space-y-6">
          {" "}
          <Card padding="lg">
            {" "}
            <div className="space-y-6">
              {" "}
              <Input
                label="Post Title"
                placeholder="Enter a catchy title..."
                {...register("title")}
                error={errors.title?.message}
                className="text-lg font-bold"
              />{" "}
              <div className="space-y-2">
                {" "}
                <label className="block text-sm font-semibold text-[rgb(var(--text-primary)/0.86)] ">
                  {" "}
                  Content{" "}
                </label>{" "}
                <textarea
                  {...register("content")}
                  rows={15}
                  className={` w-full px-4 py-3 bg-[rgb(var(--surface))] border rounded-xl shadow-sm outline-none transition-all ${errors.content ? "border-[rgb(var(--secondary))] focus:ring-[rgb(var(--secondary-soft)/0.25)]" : "border-[rgb(var(--border))] focus:border-[rgb(var(--accent))] focus:ring-4 focus:ring-[rgb(var(--accent-soft)/0.35)]"} placeholder:text-[rgb(var(--text-muted)/0.8)] `}
                  placeholder="Tell your story..."
                />{" "}
                {errors.content && (
                  <p className="text-xs font-medium text-[rgb(var(--secondary))]">
                    {errors.content.message}
                  </p>
                )}{" "}
              </div>{" "}
            </div>{" "}
          </Card>{" "}
        </div>{" "}
        {/* Sidebar Settings */}{" "}
        <div className="space-y-6">
          {" "}
          <Card title="Publishing Settings">
            {" "}
            <div className="space-y-6">
              {" "}
              <div className="space-y-2">
                {" "}
                <label className="block text-sm font-semibold text-[rgb(var(--text-primary)/0.86)] ">
                  Category
                </label>{" "}
                <select
                  {...register("categoryId")}
                  className="w-full px-4 py-2.5 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl outline-none focus:border-[rgb(var(--accent))] font-medium text-sm"
                >
                  {" "}
                  <option value="">Select a category</option>{" "}
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}{" "}
                </select>{" "}
                {errors.categoryId && (
                  <p className="text-xs font-medium text-[rgb(var(--secondary))]">
                    {errors.categoryId.message}
                  </p>
                )}{" "}
              </div>{" "}
              <div className="space-y-2">
                {" "}
                <label className="block text-sm font-semibold text-[rgb(var(--text-primary)/0.86)] ">
                  Visibility
                </label>{" "}
                <div className="grid grid-cols-2 gap-2">
                  {" "}
                  <label
                    className={` flex flex-col items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${selectedStatus === "draft" ? "border-[rgb(var(--accent))] bg-[rgb(var(--accent-soft)/0.18)]" : "border-[rgb(var(--border))]"} `}
                  >
                    {" "}
                    <input
                      type="radio"
                      {...register("status")}
                      value="draft"
                      className="hidden"
                    />{" "}
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Draft
                    </span>{" "}
                  </label>{" "}
                  <label
                    className={` flex flex-col items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${selectedStatus === "published" ? "border-[rgb(var(--accent))] bg-[rgb(var(--accent-soft)/0.18)]" : "border-[rgb(var(--border))]"} `}
                  >
                    {" "}
                    <input
                      type="radio"
                      {...register("status")}
                      value="published"
                      className="hidden"
                    />{" "}
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Public
                    </span>{" "}
                  </label>{" "}
                </div>{" "}
              </div>{" "}
              <div className="space-y-2">
                {" "}
                <label className="block text-sm font-semibold text-[rgb(var(--text-primary)/0.86)] ">
                  Tags
                </label>{" "}
                <div className="max-h-36 space-y-2 overflow-y-auto rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-elevated))] p-3 ">
                  {" "}
                  {tags.length ? (
                    tags.map((tag) => (
                      <label
                        key={tag._id}
                        className="flex items-center gap-2 text-sm font-medium text-[rgb(var(--text-primary)/0.86)] "
                      >
                        {" "}
                        <input
                          type="checkbox"
                          value={tag._id}
                          {...register("tagIds")}
                          className="h-4 w-4 rounded border-[rgb(var(--border))]"
                        />{" "}
                        <span>{tag.name}</span>{" "}
                      </label>
                    ))
                  ) : (
                    <p className="text-xs text-[rgb(var(--text-muted))]">
                      No tags available.
                    </p>
                  )}{" "}
                </div>{" "}
                {errors.tagIds && (
                  <p className="text-xs font-medium text-[rgb(var(--secondary))]">
                    {errors.tagIds.message}
                  </p>
                )}{" "}
              </div>{" "}
              <Input
                label="Featured Image URL"
                placeholder="https://..."
                {...register("imageUrl")}
                error={errors.imageUrl?.message}
                leftIcon={<ImageIcon className="w-4 h-4" />}
              />{" "}
            </div>{" "}
            <div className="mt-8 pt-8 border-t border-[rgb(var(--border))] space-y-3">
              {" "}
              <Button
                type="submit"
                className="w-full py-3"
                isLoading={isLoading}
                leftIcon={<Save className="w-4 h-4" />}
              >
                {" "}
                {initialData ? "Update Changes" : "Publish Story"}{" "}
              </Button>{" "}
              <Button
                type="button"
                variant="ghost"
                className="w-full text-[rgb(var(--text-muted)/0.8)]"
              >
                {" "}
                Cancel{" "}
              </Button>{" "}
            </div>{" "}
          </Card>{" "}
          <Card
            padding="sm"
            className="bg-gradient-to-br from-[rgb(var(--accent))] to-[rgb(var(--secondary))] text-[rgb(var(--on-primary))] border-none"
          >
            {" "}
            <div className="flex items-center gap-2 mb-2">
              {" "}
              <Sparkles className="w-4 h-4" />{" "}
              <span className="text-xs font-bold uppercase tracking-wide">
                Writing Tip
              </span>{" "}
            </div>{" "}
            <p className="text-sm font-medium opacity-90 leading-relaxed">
              {" "}
              Great titles are concise and evoke curiosity. Aim for 40-60
              characters for maximum impact.{" "}
            </p>{" "}
          </Card>{" "}
        </div>{" "}
      </div>{" "}
    </form>
  );
};
export default PostForm;

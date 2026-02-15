"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { postService } from "@/services/post-service";
import { metadataService } from "@/services/metadata-service";
import { Category, Post, Tag } from "@/types";
import PostCard from "@/components/features/PostCard";
import PostSkeleton from "@/components/features/PostSkeleton";
import Badge from "@/components/ui/Badge";
export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [activeTag, setActiveTag] = useState<string>("");
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [postRes, categoryRes, tagRes] = await Promise.all([
          postService.getAll({ status: "published", limit: 100 }),
          metadataService.getCategories(),
          metadataService.getTags(),
        ]);
        setPosts(postRes.data.posts || []);
        setCategories(categoryRes.data.categories || []);
        setTags(tagRes.data.tags || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const normalizedSearch = search.trim().toLowerCase();
      const plainContent = post.content.replace(/<[^>]*>/g, "").toLowerCase();
      const matchesSearch =
        !normalizedSearch ||
        post.title.toLowerCase().includes(normalizedSearch) ||
        plainContent.includes(normalizedSearch);
      const postCategoryId =
        typeof post.categoryId === "object"
          ? post.categoryId._id
          : post.categoryId;
      const matchesCategory =
        !activeCategory || postCategoryId === activeCategory;
      const postTagIds = (post.tagIds || []).map((tag) =>
        typeof tag === "object" ? tag._id : tag,
      );
      const matchesTag = !activeTag || postTagIds.includes(activeTag);
      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [posts, search, activeCategory, activeTag]);
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {" "}
      <section className="py-12">
        {" "}
        <h1 className="mb-2 text-4xl font-black text-[rgb(var(--text-primary))]">
          Posts
        </h1>{" "}
        <p className="text-[rgb(var(--text-muted))]">
          {" "}
          Discover published articles from the community.{" "}
        </p>{" "}
      </section>{" "}
      <section className="mb-10 flex flex-col gap-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 md:flex-row md:items-center md:justify-between">
        {" "}
        <div className="w-full space-y-3">
          {" "}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {" "}
            <Badge
              variant={!activeCategory ? "primary" : "secondary"}
              className="cursor-pointer whitespace-nowrap px-4 py-2"
              onClick={() => setActiveCategory("")}
            >
              {" "}
              All Categories{" "}
            </Badge>{" "}
            {categories.map((category) => (
              <Badge
                key={category._id}
                variant={
                  activeCategory === category._id ? "primary" : "secondary"
                }
                className="cursor-pointer whitespace-nowrap px-4 py-2"
                onClick={() => setActiveCategory(category._id)}
              >
                {" "}
                {category.name}{" "}
              </Badge>
            ))}{" "}
          </div>{" "}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {" "}
            <Badge
              variant={!activeTag ? "primary" : "secondary"}
              className="cursor-pointer whitespace-nowrap px-4 py-2"
              onClick={() => setActiveTag("")}
            >
              {" "}
              All Tags{" "}
            </Badge>{" "}
            {tags.map((tag) => (
              <Badge
                key={tag._id}
                variant={activeTag === tag._id ? "primary" : "secondary"}
                className="cursor-pointer whitespace-nowrap px-4 py-2"
                onClick={() => setActiveTag(tag._id)}
              >
                {" "}
                #{tag.name}{" "}
              </Badge>
            ))}{" "}
          </div>{" "}
        </div>{" "}
        <div className="relative w-full md:w-80">
          {" "}
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--text-muted)/0.8)]" />{" "}
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search posts..."
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-elevated))] py-2.5 pl-9 pr-4 text-sm outline-none transition-colors focus:border-[rgb(var(--accent))] "
          />{" "}
        </div>{" "}
      </section>{" "}
      {loading ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {" "}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <PostSkeleton key={item} />
          ))}{" "}
        </div>
      ) : filteredPosts.length ? (
        <div className="grid grid-cols-1 gap-8 pb-16 md:grid-cols-2 lg:grid-cols-3">
          {" "}
          {filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}{" "}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[rgb(var(--border))] py-20 text-center text-[rgb(var(--text-muted))]">
          {" "}
          No posts found for this filter.{" "}
        </div>
      )}{" "}
    </div>
  );
}

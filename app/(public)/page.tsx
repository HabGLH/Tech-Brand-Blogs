"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { postService } from "@/services/post-service";
import { metadataService } from "@/services/metadata-service";
import { Post, Category, SiteSettingsData, Tag } from "@/types";
import PostCard from "@/components/features/PostCard";
import PostSkeleton from "@/components/features/PostSkeleton";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Search, ArrowRight, Zap } from "lucide-react";
import { siteSettingsService } from "@/services/site-settings-service";
import { defaultSiteSettings } from "@/lib/site-settings";
export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [siteSettings, setSiteSettings] =
    useState<SiteSettingsData>(defaultSiteSettings);
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const [postRes, catRes, tagRes, settingsRes] = await Promise.allSettled(
          [
            postService.getAll({ status: "published" }),
            metadataService.getCategories(),
            metadataService.getTags(),
            siteSettingsService.getSettings(),
          ],
        );
        if (postRes.status === "fulfilled") {
          setPosts(postRes.value.data.posts || []);
        } else {
          console.error("Failed to load posts", postRes.reason);
        }
        if (catRes.status === "fulfilled") {
          setCategories(catRes.value.data.categories || []);
        } else {
          console.error("Failed to load categories", catRes.reason);
        }
        if (tagRes.status === "fulfilled") {
          setTags(tagRes.value.data.tags || []);
        } else {
          console.error("Failed to load tags", tagRes.reason);
        }
        if (settingsRes.status === "fulfilled") {
          setSiteSettings(settingsRes.value.data.settings);
        } else {
          console.error("Failed to load site settings", settingsRes.reason);
        }
      } catch (err) {
        console.error("Home initialization failed", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);
  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return posts.filter((post) => {
      const categoryId =
        typeof post.categoryId === "object"
          ? post.categoryId._id
          : post.categoryId;
      const categoryMatch = !activeCategory || categoryId === activeCategory;
      if (!categoryMatch) return false;
      const postTagIds = (post.tagIds || []).map((tag) =>
        typeof tag === "object" ? tag._id : tag,
      );
      const tagMatch = !activeTag || postTagIds.includes(activeTag);
      if (!tagMatch) return false;
      if (!query) return true;
      const plainContent = post.content.replace(/<[^>]*>/g, "").toLowerCase();
      return (
        post.title.toLowerCase().includes(query) || plainContent.includes(query)
      );
    });
  }, [posts, activeCategory, activeTag, searchQuery]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {" "}
      {/* Hero Section */}{" "}
      <section className="py-14 md:py-20 relative overflow-hidden">
        {" "}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[420px] bg-[rgb(var(--accent-soft)/0.1)] blur-[120px] rounded-full -z-10" />{" "}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {" "}
          <div className="lg:col-span-8">
            {" "}
            <Badge
              variant="info"
              className="mb-6 px-4 py-1.5 uppercase tracking-wide text-[10px] font-bold"
            >
              {" "}
              {siteSettings.home.badge}{" "}
            </Badge>{" "}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[rgb(var(--text-primary))] mb-6 tracking-tight leading-[1.05]">
              {" "}
              {siteSettings.home.title}{" "}
            </h1>{" "}
            <p className="text-lg md:text-xl text-[rgb(var(--text-muted))] max-w-3xl mb-8 leading-relaxed font-medium">
              {" "}
              {siteSettings.home.subtitle}{" "}
            </p>{" "}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {" "}
              <Link href={siteSettings.home.primaryCtaHref}>
                {" "}
                <Button
                  size="lg"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  {" "}
                  {siteSettings.home.primaryCtaLabel}{" "}
                </Button>{" "}
              </Link>{" "}
              <Link href={siteSettings.home.secondaryCtaHref}>
                {" "}
                <Button size="lg" variant="outline">
                  {" "}
                  {siteSettings.home.secondaryCtaLabel}{" "}
                </Button>{" "}
              </Link>{" "}
            </div>{" "}
          </div>{" "}
          <div className="lg:col-span-4">
            {" "}
            <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))]/80 backdrop-blur p-6">
              {" "}
              <p className="text-[11px] font-bold uppercase tracking-wide text-[rgb(var(--text-muted)/0.8)] mb-4">
                Today
              </p>{" "}
              <div className="space-y-3">
                {" "}
                <div className="flex items-center justify-between text-sm">
                  {" "}
                  <span className="text-[rgb(var(--text-muted))]">
                    Published posts
                  </span>{" "}
                  <span className="font-bold text-[rgb(var(--text-primary))]">
                    {posts.length}
                  </span>{" "}
                </div>{" "}
                <div className="flex items-center justify-between text-sm">
                  {" "}
                  <span className="text-[rgb(var(--text-muted))]">
                    Categories
                  </span>{" "}
                  <span className="font-bold text-[rgb(var(--text-primary))]">
                    {categories.length}
                  </span>{" "}
                </div>{" "}
                <div className="flex items-center justify-between text-sm">
                  {" "}
                  <span className="text-[rgb(var(--text-muted))]">
                    Tags
                  </span>{" "}
                  <span className="font-bold text-[rgb(var(--text-primary))]">
                    {tags.length}
                  </span>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* Featured / Filters */}{" "}
      <section className="py-12 border-y border-[rgb(var(--border))] flex flex-col md:flex-row items-center justify-between gap-8">
        {" "}
        <div className="w-full space-y-3">
          {" "}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {" "}
            <Badge
              variant={!activeCategory ? "primary" : "secondary"}
              className="cursor-pointer py-2 px-4 text-sm whitespace-nowrap"
              onClick={() => setActiveCategory(null)}
            >
              {" "}
              All Categories{" "}
            </Badge>{" "}
            {categories.map((cat) => (
              <Badge
                key={cat._id}
                variant={activeCategory === cat._id ? "primary" : "secondary"}
                className="cursor-pointer py-2 px-4 text-sm whitespace-nowrap transition-transform active:scale-95"
                onClick={() => setActiveCategory(cat._id)}
              >
                {" "}
                {cat.name}{" "}
              </Badge>
            ))}{" "}
          </div>{" "}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {" "}
            <Badge
              variant={!activeTag ? "primary" : "secondary"}
              className="cursor-pointer py-2 px-4 text-sm whitespace-nowrap"
              onClick={() => setActiveTag(null)}
            >
              {" "}
              All Tags{" "}
            </Badge>{" "}
            {tags.map((tag) => (
              <Badge
                key={tag._id}
                variant={activeTag === tag._id ? "primary" : "secondary"}
                className="cursor-pointer py-2 px-4 text-sm whitespace-nowrap transition-transform active:scale-95"
                onClick={() => setActiveTag(tag._id)}
              >
                {" "}
                #{tag.name}{" "}
              </Badge>
            ))}{" "}
          </div>{" "}
        </div>{" "}
        <div className="relative w-full md:w-80 group">
          {" "}
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--text-muted)/0.8)] group-focus-within:text-[rgb(var(--accent))] transition-colors" />{" "}
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search stories..."
            className="w-full pl-11 pr-4 py-3 bg-[rgb(var(--surface-elevated))] border border-[rgb(var(--border))] rounded-full outline-none focus:ring-4 focus:ring-[rgb(var(--accent-soft)/0.35)] focus:border-[rgb(var(--accent))] transition-all text-sm font-medium"
          />{" "}
        </div>{" "}
      </section>{" "}
      {/* Grid */}{" "}
      <section className="py-16">
        {" "}
        <div className="flex items-center gap-2 mb-10">
          {" "}
          <Zap className="w-5 h-5 text-[rgb(var(--accent))] fill-[rgb(var(--accent))]" />{" "}
          <h2 className="text-2xl font-bold text-[rgb(var(--text-primary))]">
            Latest Stories
          </h2>{" "}
        </div>{" "}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {" "}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <PostSkeleton key={i} />
            ))}{" "}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {" "}
            {filteredPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}{" "}
          </div>
        ) : (
          <div className="text-center py-20 bg-[rgb(var(--surface-elevated))] rounded-3xl border border-dashed border-[rgb(var(--border))] ">
            {" "}
            <h3 className="text-xl font-bold text-[rgb(var(--text-primary))] mb-2">
              No stories found
            </h3>{" "}
            <p className="text-[rgb(var(--text-muted))]">
              Try adjusting your filters or check back later.
            </p>{" "}
          </div>
        )}{" "}
        {!loading && filteredPosts.length > 0 && (
          <div className="flex justify-center pt-8">
            {" "}
            <Link href="/posts">
              {" "}
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-12 group"
              >
                {" "}
                Browse More{" "}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />{" "}
              </Button>{" "}
            </Link>{" "}
          </div>
        )}{" "}
      </section>{" "}
    </div>
  );
}

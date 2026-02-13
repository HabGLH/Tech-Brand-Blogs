"use client";

import React, { useEffect, useState } from "react";
import { postService } from "@/services/post-service";
import { metadataService } from "@/services/metadata-service";
import { Post, Category } from "@/types";
import PostCard from "@/components/features/PostCard";
import PostSkeleton from "@/components/features/PostSkeleton";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Search, SlidersHorizontal, ArrowRight, Zap } from "lucide-react";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const [postRes, catRes] = await Promise.all([
          postService.getAll({ status: "published" }),
          metadataService.getCategories(),
        ]);
        setPosts(postRes.data.posts);
        setCategories(catRes.data.categories);
      } catch (err) {
        console.error("Home initialization failed", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full -z-10" />
        <Badge variant="info" className="mb-6 px-4 py-1.5 uppercase tracking-widest text-[10px] font-black">
          New Stories Every Day
        </Badge>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-8 tracking-tight leading-[1.1]">
          Where ideas find <br /> <span className="text-blue-600">their voice.</span>
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          Join a million readers exploring the world through the eyes of independent writers. 
          Fresh perspectives on tech, lifestyle, and business.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
            Start Reading
          </Button>
          <Button size="lg" variant="outline">
            Become a Writer
          </Button>
        </div>
      </section>

      {/* Featured / Filters */}
      <section className="py-12 border-y border-gray-100 dark:border-gray-900 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto">
          <Badge
            variant={!activeCategory ? "primary" : "secondary"}
            className="cursor-pointer py-2 px-4 text-sm whitespace-nowrap"
            onClick={() => setActiveCategory(null)}
          >
            All Topics
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat._id}
              variant={activeCategory === cat._id ? "primary" : "secondary"}
              className="cursor-pointer py-2 px-4 text-sm whitespace-nowrap transition-transform active:scale-95"
              onClick={() => setActiveCategory(cat._id)}
            >
              {cat.name}
            </Badge>
          ))}
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Search stories..."
            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-full outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium"
          />
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="flex items-center gap-2 mb-10">
          <Zap className="w-5 h-5 text-blue-600 fill-blue-600" />
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Latest Stories</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No stories found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or check back later.</p>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="flex justify-center pt-8">
            <Button variant="outline" size="lg" className="rounded-full px-12 group">
              Browse More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

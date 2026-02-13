"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { 
  PlusCircle, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Eye, 
  Clock,
  CheckCircle2,
  FileEdit
} from "lucide-react";
import { postService } from "@/services/post-service";
import { Post } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function PostManagement() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await postService.getAll();
      setPosts(response.data.posts);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await postService.delete(id);
        setPosts(posts.filter(p => p._id !== id));
      } catch (err) {
        alert("Deletion failed");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-1">My Stories</h1>
          <p className="text-gray-500 font-medium">Manage and monitor your published content.</p>
        </div>
        <Link href="/admin/posts/new">
          <Button leftIcon={<PlusCircle className="w-5 h-5" />}>Create New Story</Button>
        </Link>
      </div>

      <Card padding="none">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by title..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl outline-none text-sm placeholder:text-gray-400 focus:border-blue-500"
            />
          </div>
          <Button variant="outline" size="sm" leftIcon={<Filter className="w-4 h-4" />}>
            More Filters
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 uppercase text-[10px] font-black tracking-widest border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Engagement</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-10">
                      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <tr key={post._id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{post.title}</span>
                        <span className="text-xs text-gray-400 capitalize">
                          {typeof post.categoryId === "object" ? post.categoryId.name : "Uncategorized"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {post.status === "published" ? (
                        <Badge variant="success" className="gap-1.5 py-1 px-3">
                          <CheckCircle2 className="w-3 h-3" /> Published
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="gap-1.5 py-1 px-3">
                          <FileEdit className="w-3 h-3" /> Draft
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                        <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> 1.2k</span>
                        <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> {post.likesCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        {format(new Date(post.createdAt), "MMM d, HH:mm")}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/posts/${post._id}/edit`}>
                          <Button variant="ghost" size="sm" className="p-2"><Edit3 className="w-4 h-4" /></Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                          onClick={() => handleDelete(post._id, post.title)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <p className="text-gray-400 font-bold">You haven't written any stories yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

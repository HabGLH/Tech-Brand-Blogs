"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  PlusCircle,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Clock,
  CheckCircle2,
  FileEdit,
} from "lucide-react";
import { postService } from "@/services/post-service";
import { Post } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useAuthStore } from "@/store/auth-store";
export default function PostManagement() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
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
        setPosts(posts.filter((p) => p._id !== id));
      } catch {
        alert("Deletion failed");
      }
    }
  };
  return (
    <div className="space-y-8">
      {" "}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {" "}
        <div>
          {" "}
          <h1 className="text-3xl font-black text-[rgb(var(--text-primary))] mb-1">
            My Stories
          </h1>{" "}
          <p className="text-[rgb(var(--text-muted))] font-medium">
            Manage and monitor your published content.
          </p>{" "}
        </div>{" "}
        <Link href="/admin/posts/new">
          {" "}
          <Button leftIcon={<PlusCircle className="w-5 h-5" />}>
            Create New Story
          </Button>{" "}
        </Link>{" "}
      </div>{" "}
      <Card padding="none">
        {" "}
        <div className="p-4 border-b border-[rgb(var(--border))] flex flex-col sm:flex-row items-center justify-between gap-4">
          {" "}
          <div className="relative w-full sm:w-80">
            {" "}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--text-muted)/0.8)]" />{" "}
            <input
              type="text"
              placeholder="Filter by title..."
              className="w-full pl-10 pr-4 py-2 bg-[rgb(var(--surface-elevated))] border border-[rgb(var(--border))] rounded-xl outline-none text-sm placeholder:text-[rgb(var(--text-muted)/0.8)] focus:border-[rgb(var(--accent))]"
            />{" "}
          </div>{" "}
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Filter className="w-4 h-4" />}
          >
            {" "}
            More Filters{" "}
          </Button>{" "}
        </div>{" "}
        <div className="overflow-x-auto">
          {" "}
          <table className="w-full text-left border-collapse">
            {" "}
            <thead>
              {" "}
              <tr className="bg-[rgb(var(--surface-elevated))]/50 text-[rgb(var(--text-muted))] uppercase text-[10px] font-black tracking-widest border-b border-[rgb(var(--border))]">
                {" "}
                <th className="px-6 py-4">Title</th>{" "}
                <th className="px-6 py-4">Status</th>{" "}
                <th className="px-6 py-4">Engagement</th>{" "}
                <th className="px-6 py-4">Date</th>{" "}
                <th className="px-6 py-4 text-right">Actions</th>{" "}
              </tr>{" "}
            </thead>{" "}
            <tbody className="divide-y divide-[rgb(var(--border))]">
              {" "}
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    {" "}
                    <td colSpan={5} className="px-6 py-10">
                      {" "}
                      <div className="h-4 bg-[rgb(var(--surface-elevated))] rounded w-full" />{" "}
                    </td>{" "}
                  </tr>
                ))
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <tr
                    key={post._id}
                    className="group hover:bg-[rgb(var(--surface-elevated))]/50 transition-colors"
                  >
                    {" "}
                    <td className="px-6 py-5">
                      {" "}
                      <div className="flex flex-col">
                        {" "}
                        <span className="text-sm font-bold text-[rgb(var(--text-primary))] line-clamp-1">
                          {post.title}
                        </span>{" "}
                        <span className="text-xs text-[rgb(var(--text-muted)/0.8)] capitalize">
                          {" "}
                          {typeof post.categoryId === "object"
                            ? post.categoryId.name
                            : "Uncategorized"}{" "}
                        </span>{" "}
                      </div>{" "}
                    </td>{" "}
                    <td className="px-6 py-5">
                      {" "}
                      {post.status === "published" ? (
                        <Badge variant="success" className="gap-1.5 py-1 px-3">
                          {" "}
                          <CheckCircle2 className="w-3 h-3" /> Published{" "}
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="gap-1.5 py-1 px-3">
                          {" "}
                          <FileEdit className="w-3 h-3" /> Draft{" "}
                        </Badge>
                      )}{" "}
                    </td>{" "}
                    <td className="px-6 py-5">
                      {" "}
                      <div className="flex items-center gap-4 text-xs font-bold text-[rgb(var(--text-muted)/0.8)]">
                        {" "}
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> 1.2k
                        </span>{" "}
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />{" "}
                          {post.likesCount}
                        </span>{" "}
                      </div>{" "}
                    </td>{" "}
                    <td className="px-6 py-5">
                      {" "}
                      <div className="flex items-center gap-1.5 text-xs font-medium text-[rgb(var(--text-muted))]">
                        {" "}
                        <Clock className="w-3.5 h-3.5" />{" "}
                        {format(new Date(post.createdAt), "MMM d, HH:mm")}{" "}
                      </div>{" "}
                    </td>{" "}
                    <td className="px-6 py-5 text-right">
                      {" "}
                      <div className="flex items-center justify-end gap-2">
                        {" "}
                        {(typeof post.authorId === "object"
                          ? post.authorId._id
                          : post.authorId) === user?._id ? (
                          <Link href={`/admin/posts/${post._id}/edit`}>
                            {" "}
                            <Button variant="ghost" size="sm" className="p-2">
                              <Edit3 className="w-4 h-4" />
                            </Button>{" "}
                          </Link>
                        ) : (
                          <span className="text-xs text-[rgb(var(--text-muted)/0.8)] font-semibold px-2">
                            No edit
                          </span>
                        )}{" "}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 text-[rgb(var(--secondary))] hover:bg-[rgb(var(--secondary-soft)/0.25)]"
                          onClick={() => handleDelete(post._id, post.title)}
                        >
                          {" "}
                          <Trash2 className="w-4 h-4" />{" "}
                        </Button>{" "}
                      </div>{" "}
                    </td>{" "}
                  </tr>
                ))
              ) : (
                <tr>
                  {" "}
                  <td colSpan={5} className="px-6 py-20 text-center">
                    {" "}
                    <p className="text-[rgb(var(--text-muted)/0.8)] font-bold">
                      You haven&apos;t written any stories yet.
                    </p>{" "}
                  </td>{" "}
                </tr>
              )}{" "}
            </tbody>{" "}
          </table>{" "}
        </div>{" "}
      </Card>{" "}
    </div>
  );
}

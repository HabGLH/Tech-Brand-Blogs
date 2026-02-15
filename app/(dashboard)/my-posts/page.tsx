"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Edit3, PlusCircle, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import apiClient from "@/services/api-client";
import { Post } from "@/types";
export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/users/me/posts");
      setPosts(response.data?.data?.posts || []);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadPosts();
  }, []);
  const handleDelete = async (postId: string) => {
    const confirmed = confirm("Delete this post?");
    if (!confirmed) return;
    await apiClient.delete(`/posts/${postId}`);
    setPosts((prev) => prev.filter((post) => post._id !== postId));
  };
  return (
    <div className="space-y-8">
      {" "}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        {" "}
        <div>
          {" "}
          <h1 className="text-3xl font-bold text-[rgb(var(--text-primary))]">
            My Posts
          </h1>{" "}
          <p className="text-[rgb(var(--text-muted))]">
            Create, edit, and manage your own posts.
          </p>{" "}
        </div>{" "}
        <Link href="/create-post">
          {" "}
          <Button leftIcon={<PlusCircle className="h-4 w-4" />}>
            Create Post
          </Button>{" "}
        </Link>{" "}
      </div>{" "}
      <Card padding="none">
        {" "}
        <div className="overflow-x-auto">
          {" "}
          <table className="w-full min-w-[620px] border-collapse text-left">
            {" "}
            <thead>
              {" "}
              <tr className="border-b border-[rgb(var(--border))] bg-[rgb(var(--surface-elevated))] text-[11px] font-bold uppercase tracking-wide text-[rgb(var(--text-muted))] ">
                {" "}
                <th className="px-5 py-4">Title</th>{" "}
                <th className="px-5 py-4">Status</th>{" "}
                <th className="px-5 py-4">Date</th>{" "}
                <th className="px-5 py-4 text-right">Actions</th>{" "}
              </tr>{" "}
            </thead>{" "}
            <tbody>
              {" "}
              {loading ? (
                <tr>
                  {" "}
                  <td
                    colSpan={4}
                    className="px-5 py-10 text-center text-[rgb(var(--text-muted))]"
                  >
                    {" "}
                    Loading posts...{" "}
                  </td>{" "}
                </tr>
              ) : posts.length ? (
                posts.map((post) => (
                  <tr
                    key={post._id}
                    className="border-b border-[rgb(var(--border))]"
                  >
                    {" "}
                    <td className="px-5 py-4 font-semibold text-[rgb(var(--text-primary))]">
                      {" "}
                      {post.title}{" "}
                    </td>{" "}
                    <td className="px-5 py-4">
                      {" "}
                      <Badge
                        variant={
                          post.status === "published" ? "success" : "warning"
                        }
                      >
                        {" "}
                        {post.status}{" "}
                      </Badge>{" "}
                    </td>{" "}
                    <td className="px-5 py-4 text-sm text-[rgb(var(--text-muted))]">
                      {" "}
                      {format(new Date(post.createdAt), "MMM d, yyyy")}{" "}
                    </td>{" "}
                    <td className="px-5 py-4 text-right">
                      {" "}
                      <div className="flex justify-end gap-2">
                        {" "}
                        <Link href={`/my-posts/${post._id}/edit`}>
                          {" "}
                          <Button variant="ghost" size="sm">
                            {" "}
                            <Edit3 className="h-4 w-4" />{" "}
                          </Button>{" "}
                        </Link>{" "}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[rgb(var(--secondary))] hover:bg-[rgb(var(--secondary-soft)/0.25)]"
                          onClick={() => handleDelete(post._id)}
                        >
                          {" "}
                          <Trash2 className="h-4 w-4" />{" "}
                        </Button>{" "}
                      </div>{" "}
                    </td>{" "}
                  </tr>
                ))
              ) : (
                <tr>
                  {" "}
                  <td
                    colSpan={4}
                    className="px-5 py-10 text-center text-[rgb(var(--text-muted))]"
                  >
                    {" "}
                    You have no posts yet.{" "}
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


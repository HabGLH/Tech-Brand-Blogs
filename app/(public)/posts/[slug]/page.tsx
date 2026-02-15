"use client";

import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Heart, MessageSquare, Send } from "lucide-react";
import { Post } from "@/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import apiClient from "@/services/api-client";
import { postService } from "@/services/post-service";
import { useAuthStore } from "@/store/auth-store";

interface CommentItem {
  _id: string;
  content: string;
  userId?: string;
  createdAt: string;
}

const sanitizePostHtml = (html: string) => {
  return html
    .replace(
      /<(script|style|iframe|object|embed|link|meta)[^>]*>[\s\S]*?<\/\1>/gi,
      "",
    )
    .replace(/<(script|style|iframe|object|embed|link|meta)[^>]*\/?>/gi, "")
    .replace(/\son\w+=(['"]).*?\1/gi, "")
    .replace(/\son\w+=([^\s>]+)/gi, "")
    .replace(/\s(href|src)=(['"])\s*javascript:[\s\S]*?\2/gi, ' $1="#"');
};

export default function PostDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const { isAuthenticated } = useAuthStore();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const sanitizedContent = useMemo(() => {
    if (!post) return "";
    return sanitizePostHtml(post.content);
  }, [post]);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      setLoading(true);
      setErrorMessage("");
      try {
        const postRes = await postService.getBySlug(slug);
        const currentPost = postRes.data.post;
        setPost(currentPost);
        setHasLiked(Boolean(currentPost.likedByViewer));

        const commentsRes = await apiClient.get(
          `/posts/${currentPost._id}/comments`,
        );
        setComments(commentsRes.data?.data?.comments || []);
      } catch (error: unknown) {
        const message =
          typeof error === "object" &&
          error &&
          "response" in error &&
          typeof (error as { response?: { data?: { message?: string } } })
            .response?.data?.message === "string"
            ? (error as { response?: { data?: { message?: string } } }).response
                ?.data?.message
            : "Failed to load post.";
        setErrorMessage(message ?? "Failed to load post.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const handleLikeToggle = async () => {
    if (!post || !isAuthenticated || isLiking) return;
    setIsLiking(true);
    try {
      if (hasLiked) {
        await apiClient.delete(`/posts/${post._id}/likes`);
        setHasLiked(false);
        setPost({ ...post, likesCount: Math.max(0, post.likesCount - 1) });
      } else {
        await apiClient.post(`/posts/${post._id}/likes`);
        setHasLiked(true);
        setPost({ ...post, likesCount: post.likesCount + 1 });
      }
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } })
          .response?.data?.message === "string"
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "";
      const normalizedMessage = (message ?? "").toLowerCase();
      if (normalizedMessage.includes("already liked")) {
        setHasLiked(true);
      } else if (normalizedMessage.includes("have not liked")) {
        setHasLiked(false);
      }
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !post ||
      !isAuthenticated ||
      !commentInput.trim() ||
      isSubmittingComment
    )
      return;

    setIsSubmittingComment(true);
    try {
      const response = await apiClient.post(`/posts/${post._id}/comments`, {
        content: commentInput.trim(),
      });
      const newComment = response.data?.data?.comment;
      if (newComment) {
        setComments((prev) => [newComment, ...prev]);
        setPost({ ...post, commentsCount: post.commentsCount + 1 });
        setCommentInput("");
      }
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-12 w-3/4 animate-pulse rounded-xl bg-[rgb(var(--surface-elevated))] " />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-[rgb(var(--secondary))] sm:px-6 lg:px-8">
        {errorMessage || "Post not found."}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <article className="mb-10 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6   sm:p-8">
        <p className="mb-3 text-xs font-black uppercase tracking-widest text-[rgb(var(--accent))]">
          {post.status}
        </p>
        <h1 className="mb-4 text-4xl font-black text-[rgb(var(--text-primary))]">
          {post.title}
        </h1>
        <p className="mb-8 text-sm font-semibold text-[rgb(var(--text-muted))]">
          Published {format(new Date(post.createdAt), "MMMM d, yyyy")}
        </p>

        <div
          className="prose max-w-none text-[rgb(var(--text-primary)/0.86)] dark:prose-invert "
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        <div className="mt-8 flex items-center gap-4 border-t border-[rgb(var(--border))] pt-6 ">
          <Button
            variant={hasLiked ? "primary" : "outline"}
            size="sm"
            disabled={!isAuthenticated}
            onClick={handleLikeToggle}
            leftIcon={<Heart className="h-4 w-4" />}
            isLoading={isLiking}
          >
            {post.likesCount}
          </Button>
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-[rgb(var(--text-muted))]">
            <MessageSquare className="h-4 w-4" />
            {post.commentsCount} comments
          </div>
        </div>
      </article>

      <Card title="Comments">
        <form onSubmit={handleCommentSubmit} className="mb-6 flex gap-3">
          <input
            type="text"
            value={commentInput}
            onChange={(event) => setCommentInput(event.target.value)}
            placeholder={
              isAuthenticated
                ? "Write a comment..."
                : "Login to leave a comment..."
            }
            disabled={!isAuthenticated}
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-elevated))] px-4 py-3 text-sm outline-none transition-colors focus:border-[rgb(var(--accent))]  "
          />
          <Button
            type="submit"
            disabled={!isAuthenticated || !commentInput.trim()}
            isLoading={isSubmittingComment}
            rightIcon={<Send className="h-4 w-4" />}
          >
            Post
          </Button>
        </form>

        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="rounded-xl border border-[rgb(var(--border))] p-4 "
            >
              <p className="mb-2 text-sm leading-relaxed text-[rgb(var(--text-primary)/0.92)] ">
                {comment.content}
              </p>
              <p className="text-xs font-semibold text-[rgb(var(--text-muted)/0.8)]">
                {format(new Date(comment.createdAt), "MMM d, yyyy h:mm a")}
              </p>
            </div>
          ))}
          {!comments.length && (
            <p className="text-sm text-[rgb(var(--text-muted))]">
              No comments yet. Be the first to comment.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

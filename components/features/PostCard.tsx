"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Clock,
  MessageSquare,
  Heart,
  ArrowUpRight,
  UserCircle2,
} from "lucide-react";
import { Post } from "@/types";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { postService } from "@/services/post-service";
import { useAuthStore } from "@/store/auth-store";
interface PostCardProps {
  post: Post;
}
const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [liked, setLiked] = useState(Boolean(post.likedByViewer));
  const [likesCount, setLikesCount] = useState(post.likesCount ?? 0);
  const [isLiking, setIsLiking] = useState(false);
  const categoryName =
    typeof post.categoryId === "object"
      ? post.categoryId.name
      : "Uncategorized";
  const authorName =
    typeof post.authorId === "object" ? post.authorId.name : "Unknown author";
  const handleLike = async () => {
    if (isLiking) return;
    if (!isAuthenticated) {
      router.push(`/login?from=/posts/${post.slug}`);
      return;
    }
    setIsLiking(true);
    try {
      if (liked) {
        await postService.unlike(post._id);
        setLiked(false);
        setLikesCount((prev) => Math.max(0, prev - 1));
      } else {
        await postService.like(post._id);
        setLiked(true);
        setLikesCount((prev) => prev + 1);
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
        setLiked(true);
      } else if (normalizedMessage.includes("have not liked")) {
        setLiked(false);
      }
    } finally {
      setIsLiking(false);
    }
  };
  return (
    <Card
      padding="none"
      hover
      className="flex flex-col h-full overflow-hidden group"
    >
      {" "}
      <Link href={`/posts/${post.slug}`} className="block">
        {" "}
        <div className="aspect-[16/10] relative overflow-hidden bg-[rgb(var(--surface-elevated))] ">
          {" "}
          {post.imageUrl ? (
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              {" "}
              <span className="text-[rgb(var(--text-muted)/0.7)] font-bold text-4xl">
                B
              </span>{" "}
            </div>
          )}{" "}
          <div className="absolute top-4 left-4">
            {" "}
            <Badge
              variant="primary"
              className="backdrop-blur-md bg-[rgb(var(--surface))]/70"
            >
              {" "}
              {categoryName}{" "}
            </Badge>{" "}
          </div>{" "}
        </div>{" "}
      </Link>{" "}
      <div className="p-6 flex-1 flex flex-col">
        {" "}
        <div className="flex items-center gap-3 mb-2 text-xs font-semibold text-[rgb(var(--text-muted))] uppercase tracking-widest">
          {" "}
          <span className="flex items-center gap-1.5">
            {" "}
            <Clock className="w-3.5 h-3.5" />{" "}
            {format(new Date(post.createdAt), "MMM d, yyyy")}{" "}
          </span>{" "}
        </div>{" "}
        <Link
          href={
            typeof post.authorId === "object"
              ? `/users/${post.authorId._id}`
              : "#"
          }
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[rgb(var(--text-muted))] hover:text-[rgb(var(--accent))] transition-colors"
        >
          {" "}
          <UserCircle2 className="w-4 h-4" /> {authorName}{" "}
        </Link>{" "}
        <Link href={`/posts/${post.slug}`} className="block">
          {" "}
          <h3 className="text-xl font-black text-[rgb(var(--text-primary))] mb-2 line-clamp-2 group-hover:text-[rgb(var(--accent))] transition-colors leading-snug">
            {" "}
            {post.title}{" "}
          </h3>{" "}
        </Link>{" "}
        <p className="text-[rgb(var(--text-muted))] text-sm line-clamp-3 mb-6 leading-relaxed flex-1">
          {" "}
          {post.content.replace(/<[^>]*>/g, "")}{" "}
        </p>{" "}
        <div className="pt-4 border-t border-[rgb(var(--border))] flex items-center justify-between mt-auto">
          {" "}
          <div className="flex items-center gap-2">
            {" "}
            <Button
              type="button"
              variant={liked ? "primary" : "ghost"}
              size="sm"
              className={liked ? "" : "text-[rgb(var(--text-muted))]"}
              leftIcon={
                <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
              }
              isLoading={isLiking}
              onClick={handleLike}
            >
              {" "}
              {likesCount}{" "}
            </Button>{" "}
            <span className="flex items-center gap-1 text-xs font-bold text-[rgb(var(--text-muted)/0.8)]">
              {" "}
              <MessageSquare className="w-4 h-4" /> {post.commentsCount}{" "}
            </span>{" "}
          </div>{" "}
          <Link
            href={`/posts/${post.slug}`}
            className="text-[rgb(var(--accent))] opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0"
            aria-label={`Read ${post.title}`}
          >
            {" "}
            <ArrowUpRight className="w-5 h-5" />{" "}
          </Link>{" "}
        </div>{" "}
      </div>{" "}
    </Card>
  );
};
export default PostCard;

import Link from "next/link";
import React from "react";
import { Post, User } from "@/types";

export default function PostCard({ post }: { post?: Post }) {
  const excerpt = post?.content?.substring(0, 140) ?? "No excerpt.";
  const authorName =
    post && typeof post.authorId === "object"
      ? (post.authorId as User).name
      : "Unknown";

  return (
    <article className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          {post?.title ?? "Untitled"}
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {excerpt}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {authorName} •{" "}
            {post?.createdAt
              ? new Date(post.createdAt).toLocaleDateString()
              : ""}
          </div>

          <Link
            href={post?.slug ? `/posts/${post.slug}` : "/posts"}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            Read
          </Link>
        </div>
      </div>
    </article>
  );
}

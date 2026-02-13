import React from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Clock, MessageSquare, Heart, ArrowUpRight } from "lucide-react";
import { Post } from "@/types";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Link href={`/p/${post.slug}`} className="block group">
      <Card padding="none" hover className="flex flex-col h-full overflow-hidden">
        <div className="aspect-[16/10] relative overflow-hidden bg-gray-100 dark:bg-gray-800">
          {post.imageUrl ? (
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-300 dark:text-gray-700 font-bold text-4xl">B</span>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <Badge variant="primary" className="backdrop-blur-md bg-white/70 dark:bg-black/50">
              {typeof post.categoryId === "object" ? post.categoryId.name : "Uncategorized"}
            </Badge>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {format(new Date(post.createdAt), "MMM d, yyyy")}
            </span>
          </div>

          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
            {post.title}
          </h3>

          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-6 leading-relaxed flex-1">
            {post.content.replace(/<[^>]*>/g, "")}
          </p>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between mt-auto">
            <div className="flex items-center gap-4 text-gray-400">
              <span className="flex items-center gap-1 text-xs font-bold">
                <Heart className="w-4 h-4" />
                {post.likesCount}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold">
                <MessageSquare className="w-4 h-4" />
                {post.commentsCount}
              </span>
            </div>
            <div className="text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default PostCard;

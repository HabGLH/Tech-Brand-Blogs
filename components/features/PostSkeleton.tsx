import React from "react";

const PostSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse overflow-hidden">
      <div className="aspect-[16/9] bg-gray-200 dark:bg-gray-800" />
      <div className="p-6 space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-full" />
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
        </div>
        <div className="space-y-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
        </div>
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-20" />
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-24" />
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;

import React from "react";
const PostSkeleton = () => {
  return (
    <div className="bg-[rgb(var(--surface))] rounded-2xl border border-[rgb(var(--border))] animate-pulse overflow-hidden">
      {" "}
      <div className="aspect-[16/9] bg-[rgb(var(--surface-elevated)/0.9)] " />{" "}
      <div className="p-6 space-y-4">
        {" "}
        <div className="h-4 bg-[rgb(var(--surface-elevated)/0.9)] rounded w-1/4" />{" "}
        <div className="space-y-2">
          {" "}
          <div className="h-6 bg-[rgb(var(--surface-elevated)/0.9)] rounded w-full" />{" "}
          <div className="h-6 bg-[rgb(var(--surface-elevated)/0.9)] rounded w-3/4" />{" "}
        </div>{" "}
        <div className="space-y-1">
          {" "}
          <div className="h-4 bg-[rgb(var(--surface-elevated)/0.9)] rounded w-full" />{" "}
          <div className="h-4 bg-[rgb(var(--surface-elevated)/0.9)] rounded w-2/3" />{" "}
        </div>{" "}
        <div className="pt-4 border-t border-[rgb(var(--border))] flex justify-between">
          {" "}
          <div className="h-8 bg-[rgb(var(--surface-elevated)/0.9)] rounded w-20" />{" "}
          <div className="h-8 bg-[rgb(var(--surface-elevated)/0.9)] rounded w-24" />{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default PostSkeleton;

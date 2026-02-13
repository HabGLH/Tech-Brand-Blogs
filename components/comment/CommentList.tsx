import React from "react";
import CommentItem from "./CommentItem";

export default function CommentList({
  comments,
}: {
  comments?: Array<{ id?: string; body?: string; author?: string }>;
}) {
  return (
    <div className="space-y-4">
      {(comments ?? []).map((c) => (
        <CommentItem key={c.id} comment={c} />
      ))}
      {comments?.length === 0 && (
        <div className="text-sm text-muted-foreground">No comments yet.</div>
      )}
    </div>
  );
}

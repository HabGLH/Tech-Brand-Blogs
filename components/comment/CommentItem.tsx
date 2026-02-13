import React from "react";

export default function CommentItem({
  comment,
}: {
  comment?: { id?: string; body?: string; author?: string };
}) {
  return (
    <div className="p-3 border rounded">
      <div className="text-sm font-medium">
        {comment?.author ?? "Anonymous"}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{comment?.body}</div>
    </div>
  );
}

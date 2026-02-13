import React from "react";

export default function PostActions({
  onEdit,
  onDelete,
}: {
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="flex gap-2">
      <button onClick={onEdit} className="px-3 py-1 bg-yellow-500 rounded">
        Edit
      </button>
      <button
        onClick={onDelete}
        className="px-3 py-1 bg-red-500 text-white rounded"
      >
        Delete
      </button>
    </div>
  );
}

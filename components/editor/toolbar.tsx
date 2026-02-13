import React from "react";

export default function EditorToolbar({
  onAction,
}: {
  onAction?: (action: string) => void;
}) {
  return (
    <div className="flex gap-2 mb-2">
      <button
        type="button"
        onClick={() => onAction?.("bold")}
        className="px-2 py-1 border rounded"
      >
        B
      </button>
      <button
        type="button"
        onClick={() => onAction?.("italic")}
        className="px-2 py-1 border rounded"
      >
        I
      </button>
      <button
        type="button"
        onClick={() => onAction?.("h1")}
        className="px-2 py-1 border rounded"
      >
        H1
      </button>
    </div>
  );
}

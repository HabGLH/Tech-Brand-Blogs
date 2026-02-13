import React from "react";

export default function CommentForm({
  onSubmit,
}: {
  onSubmit?: (body: string) => void;
}) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const body = (form.elements.namedItem("body") as HTMLTextAreaElement).value;
    onSubmit?.(body);
    form.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea name="body" required className="w-full p-2 border rounded" />
      <div>
        <button
          type="submit"
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Post comment
        </button>
      </div>
    </form>
  );
}

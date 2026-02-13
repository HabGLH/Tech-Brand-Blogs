import React from "react";

export default function RichTextEditor({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (v: string) => void;
}) {
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange?.(e.target.value);
  }

  return (
    <div>
      <textarea
        defaultValue={value}
        onChange={handleChange}
        className="w-full min-h-[200px] p-2 border rounded"
      />
    </div>
  );
}

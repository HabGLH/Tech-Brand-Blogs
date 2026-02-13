import React from "react";

export default function PostContent({ html }: { html?: string }) {
  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html ?? "" }}
    />
  );
}

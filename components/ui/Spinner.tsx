import React from "react";

export default function Spinner({ size = 24 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="animate-spin border-4 border-t-transparent rounded-full border-gray-300"
    />
  );
}

import Link from "next/link";
import React from "react";

export default function Sidebar() {
  return (
    <aside className="w-64 p-4 border-r hidden md:block">
      <nav className="space-y-2">
        <Link href="/">Home</Link>
        <Link href="/posts">Posts</Link>
        <Link href="/(admin)/dashboard">Admin</Link>
      </nav>
    </aside>
  );
}

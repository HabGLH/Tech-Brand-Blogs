import Link from "next/link";
import React from "react";
//header component the design mobile first, and also reposive for desctop and labtop
//in mobile |--dopawn menu--|--logo--|--search--|--person icon--|
//in labtop |--logo--|--search--|--nav links--|--person icon--|
//in desktop |--logo--|--search--|--nav links--|--person icon--|--dark mode toggle--|
//the nav links are home, blog, create post
export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          BlogApp
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-600 hover:text-gray-800">
            Home
          </Link>
          <Link href="/posts" className="text-gray-600 hover:text-gray-800">
            Blog
          </Link>
          <Link
            href="/posts/create"
            className="text-gray-600 hover:text-gray-800"
          >
            Create Post
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search..."
            className="hidden md:block px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Link href="/profile" className="text-gray-600 hover:text-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}

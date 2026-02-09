
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { hash } from "bcryptjs";

// Load environment variables before importing models
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import User from "../models/User.ts";
import Category from "../models/Category.ts";
import Tag from "../models/Tag.ts";
import Post from "../models/Post.ts";
import Comment from "../models/Comment.ts";
import Like from "../models/Like.ts";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected to MongoDB via Mongoose");

    // Clean up existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Tag.deleteMany({}),
      Post.deleteMany({}),
      Comment.deleteMany({}),
      Like.deleteMany({}),
    ]);
    console.log("Cleared existing data");

    // 1. Create 10 Users
    const users = [];
    const passwordHash = await hash("password123", 10);

    for (let i = 1; i <= 10; i++) {
      users.push({
        name: `User${i}`,
        email: `user${i}@user.test`,
        passwordHash: passwordHash,
        role: i === 1 ? "admin" : "user", // Make User1 admin
        isBlocked: false,
      });
    }
    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users`);

    // 2. Create 5 Categories
    const categories = [];
    for (let i = 1; i <= 5; i++) {
        categories.push({
            name: `Category ${i}`,
            slug: `category-${i}`,
        })
    }
    const createdCategories = await Category.insertMany(categories);
    console.log(`Created ${createdCategories.length} categories`);

    // 3. Create 10 Tags
    const tags = [];
    for (let i = 1; i <= 10; i++) {
      tags.push({
        name: `Tag ${i}`,
        slug: `tag-${i}`,
      });
    }
    const createdTags = await Tag.insertMany(tags);
    console.log(`Created ${createdTags.length} tags`);

    // 4. Create 10 Posts
    const posts = [];
    for (let i = 1; i <= 10; i++) {
      const author = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const category = createdCategories[Math.floor(Math.random() * createdCategories.length)];
      
      // Select random tags (1 to 3 tags per post)
      const numTags = Math.floor(Math.random() * 3) + 1;
      const postTags = [];
      const shuffledTags = [...createdTags].sort(() => 0.5 - Math.random());
      for(let j=0; j<numTags; j++) {
          postTags.push(shuffledTags[j]._id);
      }

      posts.push({
        title: `Post Title ${i}`,
        slug: `post-title-${i}`,
        content: `This is the content for post ${i}. It creates some dummy content to fill up the space.`,
        authorId: author._id,
        categoryId: category._id,
        tagIds: postTags,
        status: "published",
        likesCount: 0, // Will update later
        commentsCount: 0, // Will update later
      });
    }
    const createdPosts = await Post.insertMany(posts);
    console.log(`Created ${createdPosts.length} posts`);

    // 5. Add Likes and Comments
    let totalLikes = 0;
    let totalComments = 0;

    for (const post of createdPosts) {
      // Add random likes (0 to 10 likes per post)
      const numLikes = Math.floor(Math.random() * 11);
      const shuffledUsers = [...createdUsers].sort(() => 0.5 - Math.random());
      
      for (let j = 0; j < numLikes; j++) {
        const user = shuffledUsers[j];
        await Like.create({
          postId: post._id,
          userId: user._id,
        });
      }
      totalLikes += numLikes;
      post.likesCount = numLikes;

      // Add random comments (0 to 5 comments per post)
      const numComments = Math.floor(Math.random() * 6);
      for (let k = 0; k < numComments; k++) {
         const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
         await Comment.create({
             postId: post._id,
             userId: user._id,
             content: `This is a comment ${k+1} on post ${post.title} by ${user.name}.`,
         });
      }
      totalComments += numComments;
      post.commentsCount = numComments;
      await post.save();
    }
    console.log(`Created ${totalLikes} likes and ${totalComments} comments globally`);

    console.log("Seeding completed successfully");
    process.exit(0);

  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();

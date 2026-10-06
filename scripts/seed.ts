
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { hash } from "bcryptjs";

// Load environment variables before importing models
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import User from "../models/User";
import Category from "../models/Category";
import Tag from "../models/Tag";
import Post from "../models/Post";
import Comment from "../models/Comment";
import Like from "../models/Like";

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

    const userSeed = [
      { name: "Ava Thompson", email: "ava.thompson@blog.test" },
      { name: "Mason Rivera", email: "mason.rivera@blog.test" },
      { name: "Liam Chen", email: "liam.chen@blog.test" },
      { name: "Sophia Patel", email: "sophia.patel@blog.test" },
      { name: "Noah Johnson", email: "noah.johnson@blog.test" },
      { name: "Emma Garcia", email: "emma.garcia@blog.test" },
      { name: "Oliver Brown", email: "oliver.brown@blog.test" },
      { name: "Isabella Lee", email: "isabella.lee@blog.test" },
      { name: "Ethan Walker", email: "ethan.walker@blog.test" },
      { name: "Mia Davis", email: "mia.davis@blog.test" },
    ];

    for (let i = 0; i < userSeed.length; i++) {
      users.push({
        name: userSeed[i].name,
        email: userSeed[i].email,
        passwordHash: passwordHash,
        role: i === 0 ? "admin" : "user", // Make first user admin
        isBlocked: false,
      });
    }
    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users`);

    // 2. Create 5 Categories
    const categories = [
      { name: "Product", slug: "product" },
      { name: "Engineering", slug: "engineering" },
      { name: "Design", slug: "design" },
      { name: "Startups", slug: "startups" },
      { name: "Culture", slug: "culture" },
    ];
    const createdCategories = await Category.insertMany(categories);
    console.log(`Created ${createdCategories.length} categories`);

    // 3. Create 10 Tags
    const tags = [
      { name: "Next.js", slug: "nextjs" },
      { name: "React", slug: "react" },
      { name: "UX", slug: "ux" },
      { name: "API", slug: "api" },
      { name: "Performance", slug: "performance" },
      { name: "Accessibility", slug: "accessibility" },
      { name: "Testing", slug: "testing" },
      { name: "Growth", slug: "growth" },
      { name: "Data", slug: "data" },
      { name: "Leadership", slug: "leadership" },
    ];
    const createdTags = await Tag.insertMany(tags);
    console.log(`Created ${createdTags.length} tags`);

    // 4. Create 20 Posts
    const postSeed = [
      {
        title: "From Idea to MVP in 6 Weeks",
        slug: "from-idea-to-mvp-in-6-weeks",
        content:
          "We shipped a lean MVP by cutting scope to one core workflow, defining a success metric, and running weekly customer interviews. Here is what we shipped, what we skipped, and why it worked.",
        imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
        status: "published",
      },
      {
        title: "Design Tokens That Actually Scale",
        slug: "design-tokens-that-actually-scale",
        content:
          "Tokens only help if they map to real decisions. We standardized spacing, type, and color with a small, composable set and documented the rules that keep the system from drifting.",
        imageUrl: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a",
        status: "published",
      },
      {
        title: "API Pagination Done Right",
        slug: "api-pagination-done-right",
        content:
          "Offset pagination breaks at scale. We migrated to cursor-based pagination, added stable sorting, and improved client DX with a simple, consistent response shape.",
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
        status: "published",
      },
      {
        title: "Improving Core Web Vitals on a Blog",
        slug: "improving-core-web-vitals-on-a-blog",
        content:
          "Largest Contentful Paint was our biggest issue. We optimized images, reduced render blocking CSS, and shipped progressive hydration to cut LCP by 40%.",
        imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
        status: "published",
      },
      {
        title: "The Practical Guide to Content Audits",
        slug: "the-practical-guide-to-content-audits",
        content:
          "We audited 120 posts by traffic, freshness, and conversion, then created a rewrite plan. The result was a 22% lift in organic signups.",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
        status: "published",
      },
      {
        title: "A11y Checklist for Product Teams",
        slug: "a11y-checklist-for-product-teams",
        content:
          "Accessibility works best when it is baked into design reviews. We standardized focus styles, keyboard navigation, and color contrast checks.",
        imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
        status: "published",
      },
      {
        title: "The Real Cost of Rewrites",
        slug: "the-real-cost-of-rewrites",
        content:
          "We mapped every dependency before we touched code. The rewrite was smaller than expected, but the integration cost was the real story.",
        imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
        status: "published",
      },
      {
        title: "How We Structured Our Design Reviews",
        slug: "how-we-structured-our-design-reviews",
        content:
          "Short, focused weekly reviews led to better outcomes than long monthly sessions. We added decision logs and a simple rubric.",
        imageUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984",
        status: "published",
      },
      {
        title: "Measuring Activation Without Vanity Metrics",
        slug: "measuring-activation-without-vanity-metrics",
        content:
          "Activation should be a user success moment, not a click. We defined activation as completing a real workflow, then instrumented the product to match.",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
        status: "published",
      },
      {
        title: "What We Learned from 100 Support Tickets",
        slug: "what-we-learned-from-100-support-tickets",
        content:
          "Support tickets are product signals. We categorized 100 tickets and found three UX issues we could fix in a day.",
        imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
        status: "published",
      },
      {
        title: "Designing for Trust in Fintech",
        slug: "designing-for-trust-in-fintech",
        content:
          "Trust is built with clarity. We improved error messaging, reconciliation states, and status transparency to reduce user anxiety.",
        imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85",
        status: "published",
      },
      {
        title: "Scaling Tagging Without Chaos",
        slug: "scaling-tagging-without-chaos",
        content:
          "Tag sprawl hurts discovery. We introduced tag governance, synonyms, and a seasonal review to keep taxonomy clean.",
        imageUrl: "https://images.unsplash.com/photo-1487014679447-9f8336841d58",
        status: "published",
      },
      {
        title: "How We Cut Build Times in Half",
        slug: "how-we-cut-build-times-in-half",
        content:
          "We reduced build times by removing unused dependencies, caching lint results, and splitting critical paths in CI.",
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
        status: "published",
      },
      {
        title: "Crafting Better Empty States",
        slug: "crafting-better-empty-states",
        content:
          "Empty states are a product opportunity. We added helpful guidance, smart defaults, and sample content to improve first-run success.",
        imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
        status: "published",
      },
      {
        title: "Why We Switched to a Unified Editor",
        slug: "why-we-switched-to-a-unified-editor",
        content:
          "Maintaining three editors was slow. A unified editor improved consistency, reduced bugs, and cut onboarding time.",
        imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
        status: "published",
      },
      {
        title: "Making a Case for Product Analytics",
        slug: "making-a-case-for-product-analytics",
        content:
          "We built a lightweight event taxonomy, rolled it out in two weeks, and finally had reliable data for roadmap decisions.",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
        status: "published",
      },
      {
        title: "The Minimum Viable Design System",
        slug: "the-minimum-viable-design-system",
        content:
          "We focused on the 15% of components that covered 80% of UI. The system stayed small but powerful.",
        imageUrl: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a",
        status: "published",
      },
      {
        title: "Shipping Faster with Weekly Releases",
        slug: "shipping-faster-with-weekly-releases",
        content:
          "Weekly releases forced better scoping and reduced integration risk. We shipped smaller changes with higher confidence.",
        imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
        status: "published",
      },
      {
        title: "A Framework for Better Roadmaps",
        slug: "a-framework-for-better-roadmaps",
        content:
          "Roadmaps should be built around outcomes, not features. We tied each bet to a metric and updated monthly.",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
        status: "published",
      },
      {
        title: "What Good Post-Mortems Look Like",
        slug: "what-good-post-mortems-look-like",
        content:
          "Blameless post-mortems work when they result in specific, tracked action items. We share our template and examples.",
        imageUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984",
        status: "published",
      },
    ];

    const posts = [];
    for (let i = 0; i < postSeed.length; i++) {
      const author = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const category =
        createdCategories[Math.floor(Math.random() * createdCategories.length)];

      // Select random tags (1 to 3 tags per post)
      const numTags = Math.floor(Math.random() * 3) + 1;
      const postTags = [];
      const shuffledTags = [...createdTags].sort(() => 0.5 - Math.random());
      for (let j = 0; j < numTags; j++) {
        postTags.push(shuffledTags[j]._id);
      }

      posts.push({
        title: postSeed[i].title,
        slug: postSeed[i].slug,
        content: postSeed[i].content,
        imageUrl: postSeed[i].imageUrl,
        authorId: author._id,
        categoryId: category._id,
        tagIds: postTags,
        status: postSeed[i].status,
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
      // Add random likes (2 to min(createdUsers.length, 8) likes per post)
      const maxLikes = Math.min(createdUsers.length, 8);
      const minLikes = Math.min(2, maxLikes);
      const numLikes = Math.floor(Math.random() * (maxLikes - minLikes + 1)) + minLikes;
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

      // Add random comments (1 to 6 comments per post)
      const numComments = Math.floor(Math.random() * 6) + 1;
      const commentSeed = [
        "Great breakdown. The concrete steps were helpful.",
        "This matches our experience. Good callout on tradeoffs.",
        "I tried a similar approach and saw a big improvement.",
        "Clear and practical. Thanks for sharing the details.",
        "The section on measurement is especially useful.",
        "Nice write-up. The examples make it easy to apply.",
        "We are debating this right now, so the timing is perfect.",
        "I would love a follow-up with more data.",
      ];
      for (let k = 0; k < numComments; k++) {
        const user =
          createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const content =
          commentSeed[Math.floor(Math.random() * commentSeed.length)];
        await Comment.create({
          postId: post._id,
          userId: user._id,
          content: content,
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

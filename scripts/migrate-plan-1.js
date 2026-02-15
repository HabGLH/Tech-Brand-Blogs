/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require("mongoose");

const slugify = (text) =>
  String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function ensureUniqueSlug(posts, baseSlug, postId) {
  if (!baseSlug) return "";
  let slug = baseSlug;
  let i = 2;
  while (true) {
    const existing = await posts.findOne({
      slug,
      _id: { $ne: postId },
    });
    if (!existing) return slug;
    slug = `${baseSlug}-${i}`;
    i += 1;
  }
}

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is required");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected");

  const db = mongoose.connection;
  const users = db.collection("users");
  const refreshTokens = db.collection("refreshtokens");
  const posts = db.collection("posts");

  // Users: password -> passwordHash
  const userResult = await users.updateMany(
    { password: { $exists: true }, passwordHash: { $exists: false } },
    [{ $set: { passwordHash: "$password" } }, { $unset: "password" }],
  );
  console.log("Users migrated:", userResult.modifiedCount);

  // Refresh tokens: token -> tokenHash
  const tokenResult = await refreshTokens.updateMany(
    { token: { $exists: true }, tokenHash: { $exists: false } },
    [{ $set: { tokenHash: "$token" } }, { $unset: "token" }],
  );
  console.log("Refresh tokens migrated:", tokenResult.modifiedCount);

  // Posts: tags -> tagIds, ensure slug
  const cursor = posts.find(
    {},
    { projection: { title: 1, slug: 1, tags: 1, tagIds: 1 } },
  );
  let updatedPosts = 0;
  for await (const post of cursor) {
    const updates = {};
    const unsets = {};

    const hasSlug =
      typeof post.slug === "string" && post.slug.trim().length > 0;
    if (!hasSlug) {
      const baseSlug = slugify(post.title);
      if (baseSlug) {
        const uniqueSlug = await ensureUniqueSlug(posts, baseSlug, post._id);
        updates.slug = uniqueSlug;
      }
    }

    if (!Array.isArray(post.tagIds) && Array.isArray(post.tags)) {
      updates.tagIds = post.tags;
      unsets.tags = "";
    }

    if (Object.keys(updates).length || Object.keys(unsets).length) {
      const updateDoc = {};
      if (Object.keys(updates).length) updateDoc.$set = updates;
      if (Object.keys(unsets).length) updateDoc.$unset = unsets;
      await posts.updateOne({ _id: post._id }, updateDoc);
      updatedPosts += 1;
    }
  }
  console.log("Posts migrated:", updatedPosts);

  await mongoose.disconnect();
  console.log("Done");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

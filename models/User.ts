import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isBlocked: { type: Boolean, default: false },
    bio: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    website: { type: String, trim: true, default: "" },
    twitter: { type: String, trim: true, default: "" },
    linkedin: { type: String, trim: true, default: "" },
    avatarUrl: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

const User = mongoose.models?.User || mongoose.model("User", userSchema);
export default User;

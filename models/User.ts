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
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isBlocked: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    images: { type: [String], default: [] },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;

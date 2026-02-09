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
  },
  { timestamps: true },
);

const User = mongoose.models?.User || mongoose.model("User", userSchema);
export default User;

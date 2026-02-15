import mongoose from "mongoose";

const navLinkSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "main" },
    home: {
      badge: { type: String, required: true, default: "New Stories Every Day" },
      title: { type: String, required: true, default: "Where ideas find their voice." },
      subtitle: {
        type: String,
        required: true,
        default:
          "Join a million readers exploring the world through the eyes of independent writers.",
      },
      primaryCtaLabel: { type: String, required: true, default: "Start Reading" },
      primaryCtaHref: { type: String, required: true, default: "/posts" },
      secondaryCtaLabel: { type: String, required: true, default: "Become a Writer" },
      secondaryCtaHref: { type: String, required: true, default: "/create-post" },
    },
    footer: {
      brandName: { type: String, required: true, default: "Blogly" },
      description: {
        type: String,
        required: true,
        default:
          "Express your thoughts, share your stories, and connect with a community that matters. Built for writers by writers.",
      },
      companyLinks: {
        type: [navLinkSchema],
        default: [
          { label: "About Us", href: "/about" },
          { label: "Contact", href: "/contact" },
          { label: "Help Center", href: "/help" },
          { label: "Status", href: "/status" },
        ],
      },
      supportLinks: {
        type: [navLinkSchema],
        default: [
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
          { label: "Help", href: "/help" },
          { label: "Contact", href: "/contact" },
        ],
      },
      legalLinks: {
        type: [navLinkSchema],
        default: [
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
        ],
      },
      copyrightText: {
        type: String,
        required: true,
        default: "© 2026 Blogly. All rights reserved.",
      },
    },
  },
  { timestamps: true },
);

const SiteSettings =
  mongoose.models?.SiteSettings || mongoose.model("SiteSettings", siteSettingsSchema);

export default SiteSettings;

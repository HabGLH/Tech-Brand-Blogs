import { SiteSettingsData, SiteSettingsLink } from "@/types";

const isValidHref = (href: string): boolean =>
  href.startsWith("/") || href.startsWith("http://") || href.startsWith("https://");

const normalizeLinks = (links: unknown, fallback: SiteSettingsLink[]): SiteSettingsLink[] => {
  if (!Array.isArray(links)) return fallback;
  const mapped = links
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const label = typeof record.label === "string" ? record.label.trim() : "";
      const href = typeof record.href === "string" ? record.href.trim() : "";
      if (!label || !href || !isValidHref(href)) return null;
      return { label, href };
    })
    .filter((item): item is SiteSettingsLink => Boolean(item));
  return mapped.length ? mapped : fallback;
};

export const defaultSiteSettings: SiteSettingsData = {
  home: {
    badge: "New Stories Every Day",
    title: "Where ideas find their voice.",
    subtitle:
      "Join a million readers exploring the world through the eyes of independent writers. Fresh perspectives on tech, lifestyle, and business.",
    primaryCtaLabel: "Start Reading",
    primaryCtaHref: "/posts",
    secondaryCtaLabel: "Become a Writer",
    secondaryCtaHref: "/create-post",
  },
  footer: {
    brandName: "Blogly",
    description:
      "Express your thoughts, share your stories, and connect with a community that matters. Built for writers by writers.",
    companyLinks: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Help Center", href: "/help" },
      { label: "Status", href: "/status" },
    ],
    supportLinks: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Help", href: "/help" },
      { label: "Contact", href: "/contact" },
    ],
    legalLinks: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
    copyrightText: "© 2026 Blogly. All rights reserved.",
  },
};

const validateLinks = (name: string, links: SiteSettingsLink[]): string | null => {
  for (const link of links) {
    if (!link.label.trim()) {
      return `${name}: label is required`;
    }
    if (!isValidHref(link.href.trim())) {
      return `${name}: href must start with / or http(s)://`;
    }
  }
  return null;
};

export const validateSiteSettings = (settings: SiteSettingsData): string | null => {
  const home = settings.home;
  if (!home.title.trim()) return "Home title is required";
  if (!home.subtitle.trim()) return "Home subtitle is required";
  if (!isValidHref(home.primaryCtaHref)) return "Primary CTA href is invalid";
  if (!isValidHref(home.secondaryCtaHref)) return "Secondary CTA href is invalid";

  const companyError = validateLinks("Company links", settings.footer.companyLinks);
  if (companyError) return companyError;
  const supportError = validateLinks("Support links", settings.footer.supportLinks);
  if (supportError) return supportError;
  const legalError = validateLinks("Legal links", settings.footer.legalLinks);
  if (legalError) return legalError;

  return null;
};

export const normalizeSiteSettings = (input: unknown): SiteSettingsData => {
  if (!input || typeof input !== "object") return defaultSiteSettings;
  const record = input as Record<string, unknown>;
  const home = (record.home as Record<string, unknown> | undefined) ?? {};
  const footer = (record.footer as Record<string, unknown> | undefined) ?? {};

  return {
    home: {
      badge:
        typeof home.badge === "string" && home.badge.trim()
          ? home.badge.trim()
          : defaultSiteSettings.home.badge,
      title:
        typeof home.title === "string" && home.title.trim()
          ? home.title.trim()
          : defaultSiteSettings.home.title,
      subtitle:
        typeof home.subtitle === "string" && home.subtitle.trim()
          ? home.subtitle.trim()
          : defaultSiteSettings.home.subtitle,
      primaryCtaLabel:
        typeof home.primaryCtaLabel === "string" && home.primaryCtaLabel.trim()
          ? home.primaryCtaLabel.trim()
          : defaultSiteSettings.home.primaryCtaLabel,
      primaryCtaHref:
        typeof home.primaryCtaHref === "string" && home.primaryCtaHref.trim()
          ? home.primaryCtaHref.trim()
          : defaultSiteSettings.home.primaryCtaHref,
      secondaryCtaLabel:
        typeof home.secondaryCtaLabel === "string" && home.secondaryCtaLabel.trim()
          ? home.secondaryCtaLabel.trim()
          : defaultSiteSettings.home.secondaryCtaLabel,
      secondaryCtaHref:
        typeof home.secondaryCtaHref === "string" && home.secondaryCtaHref.trim()
          ? home.secondaryCtaHref.trim()
          : defaultSiteSettings.home.secondaryCtaHref,
    },
    footer: {
      brandName:
        typeof footer.brandName === "string" && footer.brandName.trim()
          ? footer.brandName.trim()
          : defaultSiteSettings.footer.brandName,
      description:
        typeof footer.description === "string" && footer.description.trim()
          ? footer.description.trim()
          : defaultSiteSettings.footer.description,
      companyLinks: normalizeLinks(footer.companyLinks, defaultSiteSettings.footer.companyLinks),
      supportLinks: normalizeLinks(footer.supportLinks, defaultSiteSettings.footer.supportLinks),
      legalLinks: normalizeLinks(footer.legalLinks, defaultSiteSettings.footer.legalLinks),
      copyrightText:
        typeof footer.copyrightText === "string" && footer.copyrightText.trim()
          ? footer.copyrightText.trim()
          : defaultSiteSettings.footer.copyrightText,
    },
  };
};

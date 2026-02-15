"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  LifeBuoy,
  Scale,
  ShieldCheck,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { SiteSettingsData, SiteSettingsLink } from "@/types";
import { defaultSiteSettings } from "@/lib/site-settings";
import { siteSettingsService } from "@/services/site-settings-service";
type LinkGroup = {
  title: string;
  icon: React.ReactNode;
  links: SiteSettingsLink[];
};
const externalResources: SiteSettingsLink[] = [
  { label: "Next.js Documentation", href: "https://nextjs.org/docs" },
  { label: "MongoDB Docs", href: "https://www.mongodb.com/docs/" },
  { label: "Tailwind CSS Docs", href: "https://tailwindcss.com/docs" },
];
const isExternalLink = (href: string) =>
  href.startsWith("http://") || href.startsWith("https://");
export default function LinksPage() {
  const [settings, setSettings] =
    useState<SiteSettingsData>(defaultSiteSettings);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await siteSettingsService.getSettings();
        setSettings(response.data.settings);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
  const groups = useMemo<LinkGroup[]>(
    () => [
      {
        title: "Company",
        icon: <BookOpen className="h-4 w-4 text-[rgb(var(--accent))]" />,
        links: settings.footer.companyLinks,
      },
      {
        title: "Support",
        icon: <LifeBuoy className="h-4 w-4 text-[rgb(var(--accent))]" />,
        links: settings.footer.supportLinks,
      },
      {
        title: "Legal",
        icon: <Scale className="h-4 w-4 text-[rgb(var(--accent))]" />,
        links: settings.footer.legalLinks,
      },
    ],
    [settings],
  );
  const renderLink = (item: SiteSettingsLink) => {
    const className =
      "group flex items-center justify-between rounded-xl border border-[rgb(var(--border))] px-4 py-3 font-semibold text-[rgb(var(--text-primary)/0.86)] transition-colors hover:border-[rgb(var(--accent))] hover:text-[rgb(var(--accent))] ";
    if (isExternalLink(item.href)) {
      return (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {" "}
          <span>{item.label}</span>{" "}
          <ArrowUpRight className="h-4 w-4 opacity-60 group-hover:opacity-100" />{" "}
        </a>
      );
    }
    return (
      <Link href={item.href} className={className}>
        {" "}
        <span>{item.label}</span>{" "}
        <ArrowUpRight className="h-4 w-4 opacity-60 group-hover:opacity-100" />{" "}
      </Link>
    );
  };
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      {" "}
      <div className="mb-10">
        {" "}
        <Badge
          variant="info"
          className="mb-4 uppercase tracking-wide text-[10px] font-bold"
        >
          {" "}
          Quick Navigation{" "}
        </Badge>{" "}
        <h1 className="mb-2 text-4xl font-bold text-[rgb(var(--text-primary))]">
          Links
        </h1>{" "}
        <p className="text-[rgb(var(--text-muted))]">
          {" "}
          Fast access to key pages, support resources, and legal
          information.{" "}
        </p>{" "}
      </div>{" "}
      {loading ? (
        <Card>
          {" "}
          <p className="text-[rgb(var(--text-muted))]">Loading links...</p>{" "}
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {" "}
          {groups.map((group) => (
            <Card key={group.title}>
              {" "}
              <div className="mb-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[rgb(var(--text-muted))]">
                {" "}
                {group.icon} {group.title}{" "}
              </div>{" "}
              <ul className="space-y-3">
                {" "}
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.label}-${link.href}`}>
                    {renderLink(link)}
                  </li>
                ))}{" "}
              </ul>{" "}
            </Card>
          ))}{" "}
          <Card className="md:col-span-2">
            {" "}
            <div className="mb-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[rgb(var(--text-muted))]">
              {" "}
              <ShieldCheck className="h-4 w-4 text-[rgb(var(--accent))]" />{" "}
              Developer Resources{" "}
            </div>{" "}
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {" "}
              {externalResources.map((link) => (
                <li key={link.href}>{renderLink(link)}</li>
              ))}{" "}
            </ul>{" "}
          </Card>{" "}
        </div>
      )}{" "}
    </div>
  );
}


"use client";
import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { SiteSettingsData, SiteSettingsLink } from "@/types";
import { adminService } from "@/services/admin-service";
import { defaultSiteSettings } from "@/lib/site-settings";
const linksToText = (links: SiteSettingsLink[]) =>
  links.map((link) => `${link.label}|${link.href}`).join("\n");
const textToLinks = (
  value: string,
  fallback: SiteSettingsLink[],
): SiteSettingsLink[] => {
  const parsed = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [labelPart, hrefPart] = line.split("|");
      const label = (labelPart ?? "").trim();
      const href = (hrefPart ?? "").trim();
      if (!label || !href) return null;
      return { label, href };
    })
    .filter((item): item is SiteSettingsLink => Boolean(item));
  return parsed.length ? parsed : fallback;
};
export default function AdminSettingsPage() {
  const [settings, setSettings] =
    useState<SiteSettingsData>(defaultSiteSettings);
  const [companyLinksText, setCompanyLinksText] = useState(
    linksToText(defaultSiteSettings.footer.companyLinks),
  );
  const [supportLinksText, setSupportLinksText] = useState(
    linksToText(defaultSiteSettings.footer.supportLinks),
  );
  const [legalLinksText, setLegalLinksText] = useState(
    linksToText(defaultSiteSettings.footer.legalLinks),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await adminService.getSettings();
      const nextSettings = response.data.settings;
      setSettings(nextSettings);
      setCompanyLinksText(linksToText(nextSettings.footer.companyLinks));
      setSupportLinksText(linksToText(nextSettings.footer.supportLinks));
      setLegalLinksText(linksToText(nextSettings.footer.legalLinks));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadSettings();
  }, []);
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: SiteSettingsData = {
        home: settings.home,
        footer: {
          ...settings.footer,
          companyLinks: textToLinks(
            companyLinksText,
            defaultSiteSettings.footer.companyLinks,
          ),
          supportLinks: textToLinks(
            supportLinksText,
            defaultSiteSettings.footer.supportLinks,
          ),
          legalLinks: textToLinks(
            legalLinksText,
            defaultSiteSettings.footer.legalLinks,
          ),
        },
      };
      const response = await adminService.updateSettings(payload);
      const nextSettings = response.data.settings;
      setSettings(nextSettings);
      setCompanyLinksText(linksToText(nextSettings.footer.companyLinks));
      setSupportLinksText(linksToText(nextSettings.footer.supportLinks));
      setLegalLinksText(linksToText(nextSettings.footer.legalLinks));
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return (
      <div className="space-y-8">
        {" "}
        <h1 className="text-3xl font-bold text-[rgb(var(--text-primary))]">
          Site Settings
        </h1>{" "}
        <Card>
          {" "}
          <p className="text-[rgb(var(--text-muted))]">
            Loading settings...
          </p>{" "}
        </Card>{" "}
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {" "}
      <div>
        {" "}
        <h1 className="text-3xl font-bold text-[rgb(var(--text-primary))]">
          Site Settings
        </h1>{" "}
        <p className="text-[rgb(var(--text-muted))]">
          Manage Home and Footer content from one place.
        </p>{" "}
      </div>{" "}
      <Card title="Home Content">
        {" "}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {" "}
          <Input
            label="Badge"
            value={settings.home.badge}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                home: { ...prev.home, badge: e.target.value },
              }))
            }
          />{" "}
          <Input
            label="Title"
            value={settings.home.title}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                home: { ...prev.home, title: e.target.value },
              }))
            }
          />{" "}
          <div className="md:col-span-2">
            {" "}
            <label className="block text-sm font-semibold text-[rgb(var(--text-primary)/0.86)] mb-2">
              Subtitle
            </label>{" "}
            <textarea
              value={settings.home.subtitle}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  home: { ...prev.home, subtitle: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 py-3 text-sm outline-none focus:border-[rgb(var(--accent))] focus:ring-4 focus:ring-[rgb(var(--accent-soft)/0.25)] "
              rows={4}
            />{" "}
          </div>{" "}
          <Input
            label="Primary CTA Label"
            value={settings.home.primaryCtaLabel}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                home: { ...prev.home, primaryCtaLabel: e.target.value },
              }))
            }
          />{" "}
          <Input
            label="Primary CTA Href"
            value={settings.home.primaryCtaHref}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                home: { ...prev.home, primaryCtaHref: e.target.value },
              }))
            }
          />{" "}
          <Input
            label="Secondary CTA Label"
            value={settings.home.secondaryCtaLabel}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                home: { ...prev.home, secondaryCtaLabel: e.target.value },
              }))
            }
          />{" "}
          <Input
            label="Secondary CTA Href"
            value={settings.home.secondaryCtaHref}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                home: { ...prev.home, secondaryCtaHref: e.target.value },
              }))
            }
          />{" "}
        </div>{" "}
      </Card>{" "}
      <Card title="Footer Content">
        {" "}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {" "}
          <Input
            label="Brand Name"
            value={settings.footer.brandName}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                footer: { ...prev.footer, brandName: e.target.value },
              }))
            }
          />{" "}
          <Input
            label="Copyright Text"
            value={settings.footer.copyrightText}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                footer: { ...prev.footer, copyrightText: e.target.value },
              }))
            }
          />{" "}
          <div className="md:col-span-2">
            {" "}
            <label className="block text-sm font-semibold text-[rgb(var(--text-primary)/0.86)] mb-2">
              Description
            </label>{" "}
            <textarea
              value={settings.footer.description}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  footer: { ...prev.footer, description: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 py-3 text-sm outline-none focus:border-[rgb(var(--accent))] focus:ring-4 focus:ring-[rgb(var(--accent-soft)/0.25)] "
              rows={4}
            />{" "}
          </div>{" "}
          <div>
            {" "}
            <label className="block text-sm font-semibold text-[rgb(var(--text-primary)/0.86)] mb-2">
              Company Links
            </label>{" "}
            <textarea
              value={companyLinksText}
              onChange={(e) => setCompanyLinksText(e.target.value)}
              className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 py-3 text-sm outline-none focus:border-[rgb(var(--accent))] focus:ring-4 focus:ring-[rgb(var(--accent-soft)/0.25)] "
              rows={6}
            />{" "}
            <p className="mt-1 text-xs text-[rgb(var(--text-muted))]">
              One per line: Label|/path
            </p>{" "}
          </div>{" "}
          <div>
            {" "}
            <label className="block text-sm font-semibold text-[rgb(var(--text-primary)/0.86)] mb-2">
              Support Links
            </label>{" "}
            <textarea
              value={supportLinksText}
              onChange={(e) => setSupportLinksText(e.target.value)}
              className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 py-3 text-sm outline-none focus:border-[rgb(var(--accent))] focus:ring-4 focus:ring-[rgb(var(--accent-soft)/0.25)] "
              rows={6}
            />{" "}
            <p className="mt-1 text-xs text-[rgb(var(--text-muted))]">
              One per line: Label|/path
            </p>{" "}
          </div>{" "}
          <div className="md:col-span-2">
            {" "}
            <label className="block text-sm font-semibold text-[rgb(var(--text-primary)/0.86)] mb-2">
              Legal Links
            </label>{" "}
            <textarea
              value={legalLinksText}
              onChange={(e) => setLegalLinksText(e.target.value)}
              className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 py-3 text-sm outline-none focus:border-[rgb(var(--accent))] focus:ring-4 focus:ring-[rgb(var(--accent-soft)/0.25)] "
              rows={4}
            />{" "}
            <p className="mt-1 text-xs text-[rgb(var(--text-muted))]">
              One per line: Label|/path
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </Card>{" "}
      <div className="flex justify-end">
        {" "}
        <Button
          onClick={handleSave}
          isLoading={saving}
          leftIcon={<Save className="h-4 w-4" />}
        >
          {" "}
          Save Settings{" "}
        </Button>{" "}
      </div>{" "}
    </div>
  );
}


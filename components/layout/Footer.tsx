"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Compass, ShieldCheck, Sparkles } from "lucide-react";
import { SiteSettingsData, SiteSettingsLink } from "@/types";
import { defaultSiteSettings } from "@/lib/site-settings";
import { siteSettingsService } from "@/services/site-settings-service";

const Footer = () => {
  const [settings, setSettings] =
    useState<SiteSettingsData>(defaultSiteSettings);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await siteSettingsService.getSettings();
        setSettings(response.data.settings);
      } catch {
        setSettings(defaultSiteSettings);
      }
    };
    loadSettings();
  }, []);

  const renderFooterLink = (link: SiteSettingsLink, className: string) => {
    const isExternal =
      link.href.startsWith("http://") || link.href.startsWith("https://");
    if (isExternal) {
      return (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {link.label}
        </a>
      );
    }
    return (
      <Link href={link.href} className={className}>
        {link.label}
      </Link>
    );
  };

  return (
    <footer className="relative overflow-hidden border-t border-[rgb(var(--border))] bg-[rgb(var(--surface))] pt-16 pb-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[rgb(var(--accent-soft)/0.3)] to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative mb-10 rounded-3xl border border-[rgb(var(--accent-soft)/0.45)] bg-[rgb(var(--accent-soft)/0.18)] p-6 md:flex md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-[rgb(var(--accent))] mb-2">
              Community First Publishing
            </p>
            <h3 className="text-2xl font-black text-[rgb(var(--text-primary))]">
              Read, write, and grow with quality stories.
            </h3>
          </div>
          <Link
            href="/posts"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[rgb(var(--primary))] px-4 py-2 text-sm font-bold text-[rgb(var(--on-primary))] hover:bg-[rgb(var(--primary-strong))] md:mt-0"
          >
            Explore Posts <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[rgb(var(--primary))] rounded-lg flex items-center justify-center text-[rgb(var(--on-primary))] font-bold">
                B
              </div>
              <span className="text-xl font-bold text-[rgb(var(--text-primary))]">
                {settings.footer.brandName}
              </span>
            </Link>
            <p className="text-[rgb(var(--text-muted))] max-w-sm mb-6 leading-relaxed">
              {settings.footer.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-xs font-semibold text-[rgb(var(--text-muted))]">
                <Compass className="h-4 w-4 text-[rgb(var(--accent))]" />{" "}
                Curated Discovery
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-xs font-semibold text-[rgb(var(--text-muted))]">
                <ShieldCheck className="h-4 w-4 text-[rgb(var(--accent))]" />{" "}
                Trusted Publishing
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-[rgb(var(--border))] px-3 py-2 text-xs font-semibold text-[rgb(var(--text-muted))]">
                <Sparkles className="h-4 w-4 text-[rgb(var(--accent))]" />{" "}
                Weekly Highlights
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[rgb(var(--text-primary))] mb-6">
              Company
            </h4>
            <ul className="space-y-4">
              {settings.footer.companyLinks.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <span className="group inline-flex items-center gap-1.5">
                    {renderFooterLink(
                      link,
                      "text-[rgb(var(--text-muted))] hover:text-[rgb(var(--secondary))] transition-colors",
                    )}
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[rgb(var(--text-primary))] mb-6">
              Support
            </h4>
            <ul className="space-y-4">
              {settings.footer.supportLinks.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <span className="group inline-flex items-center gap-1.5">
                    {renderFooterLink(
                      link,
                      "text-[rgb(var(--text-muted))] hover:text-[rgb(var(--secondary))] transition-colors",
                    )}
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[rgb(var(--border))] flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[rgb(var(--text-muted))]">
          <p>{settings.footer.copyrightText}</p>
          <div className="flex gap-6">
            {settings.footer.legalLinks.map((link) => (
              <span key={`${link.label}-${link.href}`}>
                {renderFooterLink(link, "hover:text-[rgb(var(--secondary))]")}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

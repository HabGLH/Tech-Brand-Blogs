"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  FileText,
  FolderTree,
  MessageSquare,
  RefreshCw,
  Shield,
  ThumbsUp,
  Users,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { adminService, type AdminOverviewData } from "@/services/admin-service";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
export default function AdminOverview() {
  const [overview, setOverview] = useState<AdminOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getOverview();
      setOverview(response.data);
    } catch {
      setError("Failed to load dashboard data. Please retry.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadOverview();
  }, []);
  const metrics = overview?.metrics;
  const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-US").format(value);
  const postDistribution = useMemo(() => {
    if (!metrics) {
      return { publishedPercent: 0, draftPercent: 0 };
    }
    const total = metrics.totalPosts || 1;
    return {
      publishedPercent: Math.round((metrics.publishedPosts / total) * 100),
      draftPercent: Math.round((metrics.draftPosts / total) * 100),
    };
  }, [metrics]);
  const stats = metrics
    ? [
        {
          label: "Total Posts",
          value: formatNumber(metrics.totalPosts),
          meta: `${metrics.publishRate}% published`,
          icon: FileText,
          color: "text-[rgb(var(--accent))]",
          bg: "bg-[rgb(var(--accent-soft)/0.18)] ",
        },
        {
          label: "Total Users",
          value: formatNumber(metrics.totalUsers),
          meta: `${formatNumber(metrics.activeUsers)} active`,
          icon: Users,
          color: "text-[rgb(var(--accent))]",
          bg: "bg-[rgb(var(--accent-soft)/0.18)]",
        },
        {
          label: "Total Reactions",
          value: formatNumber(metrics.totalLikes),
          meta: `${formatNumber(metrics.totalComments)} comments`,
          icon: ThumbsUp,
          color: "text-[rgb(var(--primary-strong))]",
          bg: "bg-[rgb(var(--primary)/0.2)]",
        },
        {
          label: "Taxonomy",
          value: `${formatNumber(metrics.totalCategories)} / ${formatNumber(metrics.totalTags)}`,
          meta: "categories / tags",
          icon: FolderTree,
          color: "text-[rgb(var(--secondary))]",
          bg: "bg-[rgb(var(--secondary-soft)/0.2)]",
        },
      ]
    : [];
  if (loading) {
    return (
      <div className="space-y-6">
        {" "}
        <div>
          {" "}
          <h1 className="mb-2 text-3xl font-bold text-[rgb(var(--text-primary))] sm:text-4xl">
            Dashboard
          </h1>{" "}
          <p className="text-[rgb(var(--text-muted))] font-medium">
            Loading live admin metrics...
          </p>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {" "}
          {[1, 2, 3, 4].map((id) => (
            <Card key={id} className="animate-pulse">
              {" "}
              <div className="h-28 rounded-xl bg-[rgb(var(--surface-elevated))] " />{" "}
            </Card>
          ))}{" "}
        </div>{" "}
      </div>
    );
  }
  if (error || !overview) {
    return (
      <Card className="p-10 text-center">
        {" "}
        <h1 className="text-2xl font-bold text-[rgb(var(--text-primary))] mb-2">
          Dashboard unavailable
        </h1>{" "}
        <p className="text-[rgb(var(--text-muted))] mb-5">
          {error ?? "Could not load admin overview."}
        </p>{" "}
        <Button
          onClick={loadOverview}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          {" "}
          Retry{" "}
        </Button>{" "}
      </Card>
    );
  }
  return (
    <div className="space-y-10">
      {" "}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        {" "}
        <div>
          {" "}
          <h1 className="mb-2 text-3xl font-bold text-[rgb(var(--text-primary))] sm:text-4xl">
            Dashboard
          </h1>{" "}
          <p className="text-[rgb(var(--text-muted))] font-medium">
            Live operational insights from your platform.
          </p>{" "}
        </div>{" "}
        <Button
          variant="outline"
          leftIcon={<RefreshCw className="w-4 h-4" />}
          onClick={loadOverview}
        >
          {" "}
          Refresh Data{" "}
        </Button>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {" "}
        {stats.map((stat) => (
          <Card key={stat.label} className="group relative overflow-hidden">
            {" "}
            <div className="flex items-center justify-between mb-4">
              {" "}
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                {" "}
                <stat.icon className="w-6 h-6" />{" "}
              </div>{" "}
              <Badge variant="secondary">Live</Badge>{" "}
            </div>{" "}
            <div>
              {" "}
              <p className="text-sm font-bold text-[rgb(var(--text-muted)/0.8)] uppercase tracking-wide mb-1">
                {stat.label}
              </p>{" "}
              <h3 className="text-3xl font-bold text-[rgb(var(--text-primary))]">
                {stat.value}
              </h3>{" "}
              <p className="text-xs text-[rgb(var(--text-muted))] mt-2 font-semibold">
                {stat.meta}
              </p>{" "}
            </div>{" "}
          </Card>
        ))}{" "}
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {" "}
        <Card className="lg:col-span-2" title="Content Pipeline">
          {" "}
          <div className="space-y-6">
            {" "}
            <div>
              {" "}
              <div className="flex items-center justify-between mb-2">
                {" "}
                <p className="text-xs font-bold uppercase tracking-wide text-[rgb(var(--text-muted)/0.8)]">
                  Published
                </p>{" "}
                <p className="text-sm font-bold text-[rgb(var(--text-primary)/0.86)] ">
                  {" "}
                  {overview.metrics.publishedPosts} (
                  {postDistribution.publishedPercent}%){" "}
                </p>{" "}
              </div>{" "}
              <div className="h-3 rounded-full bg-[rgb(var(--surface-elevated))] ">
                {" "}
                <div
                  className="h-3 rounded-full bg-[rgb(var(--accent-soft)/0.35)] transition-all"
                  style={{ width: `${postDistribution.publishedPercent}%` }}
                />{" "}
              </div>{" "}
            </div>{" "}
            <div>
              {" "}
              <div className="flex items-center justify-between mb-2">
                {" "}
                <p className="text-xs font-bold uppercase tracking-wide text-[rgb(var(--text-muted)/0.8)]">
                  Draft
                </p>{" "}
                <p className="text-sm font-bold text-[rgb(var(--text-primary)/0.86)] ">
                  {" "}
                  {overview.metrics.draftPosts} ({postDistribution.draftPercent}
                  %){" "}
                </p>{" "}
              </div>{" "}
              <div className="h-3 rounded-full bg-[rgb(var(--surface-elevated))] ">
                {" "}
                <div
                  className="h-3 rounded-full bg-[rgb(var(--primary)/0.55)] transition-all"
                  style={{ width: `${postDistribution.draftPercent}%` }}
                />{" "}
              </div>{" "}
            </div>{" "}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {" "}
              <div className="rounded-xl bg-[rgb(var(--surface-elevated))] p-4">
                {" "}
                <p className="text-[11px] uppercase tracking-wide text-[rgb(var(--text-muted)/0.8)] font-bold mb-1">
                  Active Users
                </p>{" "}
                <p className="text-2xl font-bold text-[rgb(var(--text-primary))]">
                  {overview.metrics.activeUsers}
                </p>{" "}
              </div>{" "}
              <div className="rounded-xl bg-[rgb(var(--surface-elevated))] p-4">
                {" "}
                <p className="text-[11px] uppercase tracking-wide text-[rgb(var(--text-muted)/0.8)] font-bold mb-1">
                  Blocked Users
                </p>{" "}
                <p className="text-2xl font-bold text-[rgb(var(--text-primary))]">
                  {overview.metrics.blockedUsers}
                </p>{" "}
              </div>{" "}
              <div className="rounded-xl bg-[rgb(var(--surface-elevated))] p-4">
                {" "}
                <p className="text-[11px] uppercase tracking-wide text-[rgb(var(--text-muted)/0.8)] font-bold mb-1">
                  Comments
                </p>{" "}
                <p className="text-2xl font-bold text-[rgb(var(--text-primary))]">
                  {overview.metrics.totalComments}
                </p>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </Card>{" "}
        <Card title="Latest Users">
          {" "}
          <div className="space-y-4">
            {" "}
            {overview.recentUsers.length ? (
              overview.recentUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[rgb(var(--surface-elevated))] transition-colors"
                >
                  {" "}
                  <div className="min-w-0">
                    {" "}
                    <h4 className="font-bold text-[rgb(var(--text-primary))] text-sm mb-0.5 truncate">
                      {" "}
                      {user.name}{" "}
                    </h4>{" "}
                    <p className="text-xs text-[rgb(var(--text-muted)/0.8)] truncate">
                      {" "}
                      {user.email} •{" "}
                      {format(new Date(user.createdAt), "MMM d, yyyy")}{" "}
                    </p>{" "}
                  </div>{" "}
                  <Badge
                    variant={
                      user.isBlocked
                        ? "danger"
                        : user.role === "admin"
                          ? "primary"
                          : "success"
                    }
                  >
                    {" "}
                    {user.isBlocked ? "Blocked" : user.role}{" "}
                  </Badge>{" "}
                </div>
              ))
            ) : (
              <p className="text-sm text-[rgb(var(--text-muted))]">
                No users found.
              </p>
            )}{" "}
          </div>{" "}
        </Card>{" "}
      </div>{" "}
      <Card title="Recent Drafts">
        {" "}
        <div className="space-y-3">
          {" "}
          {overview.recentDrafts.length ? (
            overview.recentDrafts.map((draft) => (
              <div
                key={draft._id}
                className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-[rgb(var(--border))] p-4"
              >
                {" "}
                <div>
                  {" "}
                  <h4 className="font-bold text-[rgb(var(--text-primary))] text-sm">
                    {draft.title}
                  </h4>{" "}
                  <p className="text-xs text-[rgb(var(--text-muted)/0.8)]">
                    {" "}
                    Updated{" "}
                    {formatDistanceToNow(new Date(draft.updatedAt), {
                      addSuffix: true,
                    })}{" "}
                  </p>{" "}
                </div>{" "}
                <div className="flex items-center gap-2 text-xs text-[rgb(var(--text-muted))]">
                  {" "}
                  <span className="inline-flex items-center gap-1">
                    {" "}
                    <Activity className="w-3.5 h-3.5" /> {draft.likesCount}{" "}
                  </span>{" "}
                  <span className="inline-flex items-center gap-1">
                    {" "}
                    <MessageSquare className="w-3.5 h-3.5" />{" "}
                    {draft.commentsCount}{" "}
                  </span>{" "}
                  <Badge variant="warning">Draft</Badge>{" "}
                </div>{" "}
              </div>
            ))
          ) : (
            <p className="text-sm text-[rgb(var(--text-muted))]">
              No drafts available.
            </p>
          )}{" "}
        </div>{" "}
      </Card>{" "}
      <div className="rounded-xl border border-[rgb(var(--accent-soft)/0.6)] bg-[rgb(var(--accent-soft)/0.18)] p-4 text-[rgb(var(--accent))] text-sm font-semibold   ">
        {" "}
        <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide">
          {" "}
          <Shield className="h-4 w-4" /> Admin Snapshot{" "}
        </div>{" "}
        Live status: {overview.metrics.totalPosts} total posts,{" "}
        {overview.metrics.totalUsers} users, {overview.metrics.totalCategories}{" "}
        categories, and {overview.metrics.totalTags} tags.{" "}
      </div>{" "}
    </div>
  );
} // Re-using layouts is handled by Next.js directory structure


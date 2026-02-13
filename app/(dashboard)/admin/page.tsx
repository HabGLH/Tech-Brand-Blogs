"use client";

import React from "react";
import { BarChart, Users, FileText, Zap, ArrowUpRight, ArrowDownRight, ChevronRight } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function AdminOverview() {
  const stats = [
    { label: "Total Views", value: "1.2M", change: "+12.5%", positive: true, icon: BarChart, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/10" },
    { label: "Active Users", value: "54.2k", change: "+8.2%", positive: true, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/10" },
    { label: "Draft Posts", value: "12", change: "-2", positive: false, icon: FileText, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/10" },
    { label: "Daily New", value: "320", change: "+4.1%", positive: true, icon: Zap, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/10" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-gray-500 font-medium">Welcome back! Here's what's happening today.</p>
        </div>
        <Button variant="primary">Generate Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="group relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-black ${stat.positive ? "text-emerald-500" : "text-red-500"}`}>
                {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2" title="Recent Performance">
          <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl">
            <p className="text-gray-300 font-bold uppercase tracking-widest">Chart Placeholder</p>
          </div>
        </Card>

        <Card title="Latest Drafts">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between group p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-0.5">Title of the draft...</h4>
                  <p className="text-xs text-gray-400">Edited 2 hours ago</p>
                </div>
                <Badge variant="secondary">Draft</Badge>
              </div>
            ))}
            <Button variant="ghost" className="w-full mt-4 group">
              View All <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Re-using layouts is handled by Next.js directory structure

"use client";
import React, { useEffect, useState } from "react";
import { Ban, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import apiClient from "@/services/api-client";
import { User } from "@/types";
export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionUserId, setActionUserId] = useState<string | null>(null);
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/admin/users");
      setUsers(response.data?.data?.users || []);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadUsers();
  }, []);
  const toggleBlock = async (user: User) => {
    setActionUserId(user._id);
    try {
      const endpoint = user.isBlocked
        ? `/admin/users/${user._id}/unblock`
        : `/admin/users/${user._id}/block`;
      await apiClient.put(endpoint);
      setUsers((prev) =>
        prev.map((entry) =>
          entry._id === user._id
            ? { ...entry, isBlocked: !entry.isBlocked }
            : entry,
        ),
      );
    } finally {
      setActionUserId(null);
    }
  };
  return (
    <div className="space-y-8">
      {" "}
      <div>
        {" "}
        <h1 className="text-3xl font-bold text-[rgb(var(--text-primary))]">
          User Management
        </h1>{" "}
        <p className="text-[rgb(var(--text-muted))]">
          Admin tools for blocking and unblocking users.
        </p>{" "}
      </div>{" "}
      <Card padding="none">
        {" "}
        <div className="overflow-x-auto">
          {" "}
          <table className="w-full min-w-[920px] border-collapse text-left">
            {" "}
            <thead>
              {" "}
              <tr className="border-b border-[rgb(var(--border))] bg-[rgb(var(--surface-elevated))] text-[11px] font-bold uppercase tracking-wide text-[rgb(var(--text-muted))] ">
                {" "}
                <th className="px-5 py-4">Name</th>{" "}
                <th className="px-5 py-4">Email</th>{" "}
                <th className="px-5 py-4">Role</th>{" "}
                <th className="px-5 py-4">Joined</th>{" "}
                <th className="px-5 py-4">Status</th>{" "}
                <th className="px-5 py-4 text-right">Action</th>{" "}
              </tr>{" "}
            </thead>{" "}
            <tbody>
              {" "}
              {loading ? (
                <tr>
                  {" "}
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-[rgb(var(--text-muted))]"
                  >
                    {" "}
                    Loading users...{" "}
                  </td>{" "}
                </tr>
              ) : users.length ? (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-[rgb(var(--border))]"
                  >
                    {" "}
                    <td className="px-5 py-4 font-semibold text-[rgb(var(--text-primary))]">
                      {" "}
                      {user.name}{" "}
                    </td>{" "}
                    <td className="px-5 py-4 text-sm text-[rgb(var(--text-muted))]">
                      {" "}
                      {user.email}{" "}
                    </td>{" "}
                    <td className="px-5 py-4">
                      {" "}
                      <Badge
                        variant={
                          user.role === "admin" ? "primary" : "secondary"
                        }
                      >
                        {" "}
                        {user.role}{" "}
                      </Badge>{" "}
                    </td>{" "}
                    <td className="px-5 py-4 text-sm text-[rgb(var(--text-muted))]">
                      {" "}
                      {format(new Date(user.createdAt), "MMM d, yyyy")}{" "}
                    </td>{" "}
                    <td className="px-5 py-4">
                      {" "}
                      <Badge variant={user.isBlocked ? "danger" : "success"}>
                        {" "}
                        {user.isBlocked ? "Blocked" : "Active"}{" "}
                      </Badge>{" "}
                    </td>{" "}
                    <td className="px-5 py-4 text-right">
                      {" "}
                      <Button
                        variant={user.isBlocked ? "secondary" : "danger"}
                        size="sm"
                        onClick={() => toggleBlock(user)}
                        isLoading={actionUserId === user._id}
                        leftIcon={
                          user.isBlocked ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Ban className="h-4 w-4" />
                          )
                        }
                      >
                        {" "}
                        {user.isBlocked ? "Unblock" : "Block"}{" "}
                      </Button>{" "}
                    </td>{" "}
                  </tr>
                ))
              ) : (
                <tr>
                  {" "}
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-[rgb(var(--text-muted))]"
                  >
                    {" "}
                    No users found.{" "}
                  </td>{" "}
                </tr>
              )}{" "}
            </tbody>{" "}
          </table>{" "}
        </div>{" "}
      </Card>{" "}
    </div>
  );
}


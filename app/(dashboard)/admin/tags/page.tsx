"use client";
import React, { useEffect, useState } from "react";
import { Pencil, PlusCircle, Save, Trash2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Tag } from "@/types";
import { adminService } from "@/services/admin-service";
export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const loadTags = async () => {
    setLoading(true);
    try {
      const response = await adminService.getTags();
      setTags(response.data.tags || []);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadTags();
  }, []);
  const handleCreate = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const response = await adminService.createTag({
        name: name.trim(),
        slug: slug.trim() || undefined,
      });
      setTags((prev) => [response.data.tag, ...prev]);
      setName("");
      setSlug("");
    } finally {
      setSaving(false);
    }
  };
  const startEdit = (tag: Tag) => {
    setEditId(tag._id);
    setEditName(tag.name);
    setEditSlug(tag.slug);
  };
  const handleUpdate = async () => {
    if (!editId || !editName.trim()) return;
    setSaving(true);
    try {
      const response = await adminService.updateTag(editId, {
        name: editName.trim(),
        slug: editSlug.trim() || undefined,
      });
      setTags((prev) =>
        prev.map((entry) => (entry._id === editId ? response.data.tag : entry)),
      );
      setEditId(null);
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (tag: Tag) => {
    const shouldDelete = confirm(`Delete tag "${tag.name}"?`);
    if (!shouldDelete) return;
    setSaving(true);
    try {
      await adminService.deleteTag(tag._id);
      setTags((prev) => prev.filter((entry) => entry._id !== tag._id));
      if (editId === tag._id) {
        setEditId(null);
      }
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="space-y-8">
      {" "}
      <div>
        {" "}
        <h1 className="text-3xl font-black text-[rgb(var(--text-primary))]">
          Manage Tags
        </h1>{" "}
        <p className="text-[rgb(var(--text-muted))]">
          Create and update post tags.
        </p>{" "}
      </div>{" "}
      <Card title="Create Tag">
        {" "}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {" "}
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="React"
          />{" "}
          <Input
            label="Slug (optional)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="react"
          />{" "}
          <div className="flex items-end">
            {" "}
            <Button
              type="button"
              className="w-full"
              isLoading={saving}
              onClick={handleCreate}
              leftIcon={<PlusCircle className="h-4 w-4" />}
            >
              {" "}
              Add{" "}
            </Button>{" "}
          </div>{" "}
        </div>{" "}
      </Card>{" "}
      <Card title="Existing Tags" padding="none">
        {" "}
        <div className="overflow-x-auto">
          {" "}
          <table className="w-full border-collapse text-left">
            {" "}
            <thead>
              {" "}
              <tr className="border-b border-[rgb(var(--border))] bg-[rgb(var(--surface-elevated))] text-[11px] font-black uppercase tracking-widest text-[rgb(var(--text-muted))] ">
                {" "}
                <th className="px-5 py-4">Name</th>{" "}
                <th className="px-5 py-4">Slug</th>{" "}
                <th className="px-5 py-4 text-right">Action</th>{" "}
              </tr>{" "}
            </thead>{" "}
            <tbody>
              {" "}
              {loading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-5 py-10 text-center text-[rgb(var(--text-muted))]"
                  >
                    Loading...
                  </td>
                </tr>
              ) : (
                tags.map((tag) => (
                  <tr
                    key={tag._id}
                    className="border-b border-[rgb(var(--border))]"
                  >
                    {" "}
                    <td className="px-5 py-4">
                      {" "}
                      {editId === tag._id ? (
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                      ) : (
                        <span className="font-semibold text-[rgb(var(--text-primary))]">
                          {tag.name}
                        </span>
                      )}{" "}
                    </td>{" "}
                    <td className="px-5 py-4">
                      {" "}
                      {editId === tag._id ? (
                        <Input
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                        />
                      ) : (
                        <span className="text-sm text-[rgb(var(--text-muted))]">
                          {tag.slug}
                        </span>
                      )}{" "}
                    </td>{" "}
                    <td className="px-5 py-4 text-right">
                      {" "}
                      {editId === tag._id ? (
                        <Button
                          size="sm"
                          isLoading={saving}
                          onClick={handleUpdate}
                          leftIcon={<Save className="h-4 w-4" />}
                        >
                          {" "}
                          Save{" "}
                        </Button>
                      ) : (
                        <div className="inline-flex items-center gap-2">
                          {" "}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(tag)}
                            leftIcon={<Pencil className="h-4 w-4" />}
                          >
                            {" "}
                            Edit{" "}
                          </Button>{" "}
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(tag)}
                            leftIcon={<Trash2 className="h-4 w-4" />}
                          >
                            {" "}
                            Delete{" "}
                          </Button>{" "}
                        </div>
                      )}{" "}
                    </td>{" "}
                  </tr>
                ))
              )}{" "}
            </tbody>{" "}
          </table>{" "}
        </div>{" "}
      </Card>{" "}
    </div>
  );
}

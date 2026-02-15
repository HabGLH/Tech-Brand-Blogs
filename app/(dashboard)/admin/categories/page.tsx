"use client";
import React, { useEffect, useState } from "react";
import { Pencil, PlusCircle, Save, Trash2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Category } from "@/types";
import { adminService } from "@/services/admin-service";
export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await adminService.getCategories();
      setCategories(response.data.categories || []);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadCategories();
  }, []);
  const handleCreate = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const response = await adminService.createCategory({
        name: name.trim(),
        slug: slug.trim() || undefined,
      });
      setCategories((prev) => [response.data.category, ...prev]);
      setName("");
      setSlug("");
    } finally {
      setSaving(false);
    }
  };
  const startEdit = (category: Category) => {
    setEditId(category._id);
    setEditName(category.name);
    setEditSlug(category.slug);
  };
  const handleUpdate = async () => {
    if (!editId || !editName.trim()) return;
    setSaving(true);
    try {
      const response = await adminService.updateCategory(editId, {
        name: editName.trim(),
        slug: editSlug.trim() || undefined,
      });
      setCategories((prev) =>
        prev.map((entry) =>
          entry._id === editId ? response.data.category : entry,
        ),
      );
      setEditId(null);
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (category: Category) => {
    const shouldDelete = confirm(`Delete category "${category.name}"?`);
    if (!shouldDelete) return;
    setSaving(true);
    try {
      await adminService.deleteCategory(category._id);
      setCategories((prev) =>
        prev.filter((entry) => entry._id !== category._id),
      );
      if (editId === category._id) {
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
          Manage Categories
        </h1>{" "}
        <p className="text-[rgb(var(--text-muted))]">
          Create and update post categories.
        </p>{" "}
      </div>{" "}
      <Card title="Create Category">
        {" "}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {" "}
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Technology"
          />{" "}
          <Input
            label="Slug (optional)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="technology"
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
      <Card title="Existing Categories" padding="none">
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
                categories.map((category) => (
                  <tr
                    key={category._id}
                    className="border-b border-[rgb(var(--border))]"
                  >
                    {" "}
                    <td className="px-5 py-4">
                      {" "}
                      {editId === category._id ? (
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                      ) : (
                        <span className="font-semibold text-[rgb(var(--text-primary))]">
                          {category.name}
                        </span>
                      )}{" "}
                    </td>{" "}
                    <td className="px-5 py-4">
                      {" "}
                      {editId === category._id ? (
                        <Input
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                        />
                      ) : (
                        <span className="text-sm text-[rgb(var(--text-muted))]">
                          {category.slug}
                        </span>
                      )}{" "}
                    </td>{" "}
                    <td className="px-5 py-4 text-right">
                      {" "}
                      {editId === category._id ? (
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
                            onClick={() => startEdit(category)}
                            leftIcon={<Pencil className="h-4 w-4" />}
                          >
                            {" "}
                            Edit{" "}
                          </Button>{" "}
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(category)}
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

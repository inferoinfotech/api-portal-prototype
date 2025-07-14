"use client"

import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Search, Plus, Book, Edit, Trash2, UploadCloud } from "lucide-react";
import yaml from "js-yaml";
import { importOpenapiCatalog } from "../api";

const roles = ["admin", "developer"];
const statusOptions = ["active", "inactive"];
const visibilityOptions = ["public", "private"];

export default function CatalogList({
  catalogs,
  onSelect,
  onEdit,
  onDelete,
  onImported,
  search,
  setSearch,
  onAddClick
}) {
  // Dialog & form state
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importError, setImportError] = useState("");
  const [importing, setImporting] = useState(false);
  const [importedFileName, setImportedFileName] = useState("");
  const fileInputRef = useRef(null);

  // Form fields
  const [form, setForm] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
    visibility: "public",
    status: "active",
    accessRoles: [],
    tags: "",
    openapiSpec: null,
  });

  // File select and OpenAPI parse
  const handleFileChange = async (e) => {
    setImportError("");
    const file = e.target.files[0];
    setImportedFileName(file ? file.name : "");
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    try {
      const text = await file.text();
      let spec;
      if (ext === "json") {
        spec = JSON.parse(text);
      } else if (ext === "yaml" || ext === "yml") {
        spec = yaml.load(text);
      } else {
        setImportError("Only JSON or YAML files supported");
        return;
      }
      setForm((f) => ({ ...f, openapiSpec: spec }));
    } catch (err) {
      setImportError("Failed to parse OpenAPI file: " + (err.message || "Unknown error"));
    }
  };

  // Field change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "accessRoles") {
      setForm((f) => ({
        ...f,
        accessRoles: checked
          ? [...f.accessRoles, value]
          : f.accessRoles.filter((role) => role !== value),
      }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  // Submit form
  const handleImport = async (e) => {
    e.preventDefault();
    setImporting(true);
    setImportError("");
    if (!form.name.trim()) {
      setImportError("Catalog Name is required.");
      setImporting(false);
      return;
    }
    if (!form.openapiSpec) {
      setImportError("OpenAPI (Swagger) file is required.");
      setImporting(false);
      return;
    }
    let tagsArr = [];
    if (form.tags.trim()) {
      tagsArr = form.tags.split(",").map((tag) => tag.trim()).filter(Boolean);
    }
    try {
      await importOpenapiCatalog({
        name: form.name.trim(),
        description: form.description,
        color: form.color,
        visibility: form.visibility,
        status: form.status,
        accessRoles: form.accessRoles,
        tags: tagsArr,
        openapiSpec: form.openapiSpec,
      });
      setShowImportDialog(false);
      setForm({
        name: "",
        description: "",
        color: "#3B82F6",
        visibility: "public",
        status: "active",
        accessRoles: [],
        tags: "",
        openapiSpec: null,
      });
      setImportedFileName("");
      setImporting(false);
      if (onImported) onImported();
    } catch (err) {
      setImportError("Failed to import: " + (err.response?.data?.error || err.message));
      setImporting(false);
    }
  };

  // --- UI ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <UploadCloud className="w-5 h-5 text-white" />
            </span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              API Portal
            </h1>
          </div>
          <Button variant="outline" onClick={() => setShowImportDialog(true)}>
            <UploadCloud className="w-4 h-4 mr-2" />
            Add API Catalog
          </Button>
        </div>
      </header>

      {/* Add Catalog (Import) Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add API Catalog (with OpenAPI)</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleImport} className="space-y-4">
            <Input
              name="name"
              placeholder="Catalog Name"
              value={form.name}
              onChange={handleChange}
              required
              disabled={importing}
            />
            <Textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              disabled={importing}
              rows={2}
            />
            <div className="flex gap-2">
              <label className="block flex-1">
                <span className="text-sm text-gray-700">Visibility</span>
                <select
                  name="visibility"
                  value={form.visibility}
                  onChange={handleChange}
                  className="w-full mt-1 rounded border px-2 py-1"
                  disabled={importing}
                >
                  {visibilityOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                  ))}
                </select>
              </label>
              <label className="block flex-1">
                <span className="text-sm text-gray-700">Status</span>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full mt-1 rounded border px-2 py-1"
                  disabled={importing}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                  ))}
                </select>
              </label>
            </div>
            <div>
              <span className="text-sm text-gray-700">Access Roles</span>
              <div className="flex gap-3 mt-1">
                {roles.map((role) => (
                  <label key={role} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      name="accessRoles"
                      value={role}
                      checked={form.accessRoles.includes(role)}
                      onChange={handleChange}
                      disabled={importing}
                    />
                    <span className="capitalize">{role}</span>
                  </label>
                ))}
              </div>
            </div>
            <Input
              name="tags"
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={handleChange}
              disabled={importing}
            />
            <Input
              type="file"
              accept=".json,.yaml,.yml"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={importing}
              required
            />
            {importedFileName && (
              <div className="text-xs text-gray-400">{importedFileName}</div>
            )}
            {importError && (
              <div className="text-red-600 text-xs">{importError}</div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowImportDialog(false)}
                disabled={importing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                disabled={importing}
              >
                {importing ? "Importing..." : "Import"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search catalogs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Catalogs Grid */}
        {/* Catalogs Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {catalogs.length === 0 && (
    <div className="col-span-full text-center py-12">
      <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No catalogs found</h3>
      <p className="text-gray-500 mb-4">Get started by creating your first API catalog</p>
      <Button onClick={onAddClick}>
        <Plus className="w-4 h-4 mr-2" />
        Create Catalog
      </Button>
    </div>
  )}

  {catalogs.map((catalog) => (
    <Card
      key={catalog._id}
      className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md hover:shadow-xl hover:-translate-y-1"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${catalog.color || "#3B82F6"}20` }}
          >
            <Book className="w-6 h-6" style={{ color: catalog.color || "#3B82F6" }} />
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onEdit && onEdit(catalog)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onDelete && onDelete(catalog)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div onClick={() => onSelect && onSelect(catalog)}>
          <CardTitle className="text-xl">{catalog.name}</CardTitle>
          <CardDescription>{catalog.description}</CardDescription>
          <div className="flex flex-wrap gap-2 mt-3">
            {/* Status */}
            <Badge variant={catalog.status === "inactive" ? "secondary" : "default"}>
              {catalog.status === "inactive" ? "Inactive" : "Active"}
            </Badge>
            {/* Visibility */}
            <Badge variant="outline" className="capitalize">
              {catalog.visibility || "public"}
            </Badge>
            {/* Tags */}
            {Array.isArray(catalog.tags) && catalog.tags.length > 0 && catalog.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-gray-100 text-xs">{tag}</Badge>
            ))}
            {/* Access Roles */}
            {Array.isArray(catalog.accessRoles) && catalog.accessRoles.length > 0 && catalog.accessRoles.map((role) => (
              <Badge
                key={role}
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200 text-xs capitalize"
              >
                {role}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent onClick={() => onSelect && onSelect(catalog)}>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Click to explore APIs</span>
        </div>
        <div className="text-xs text-gray-400 mt-2">
          <span>Created: {new Date(catalog.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  ))}
</div>

      </main>
    </div>
  );
}

"use client"

import { useRef, useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Search, Plus, Book, Edit, Trash2, Code, UploadCloud } from "lucide-react"
import yaml from "js-yaml"
import { importOpenapiCatalog } from "../api"

export default function CatalogList({ catalogs, onSelect, onAddClick, search, setSearch, onEdit, onDelete, onImported }) {
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [importError, setImportError] = useState("")
  const [importing, setImporting] = useState(false)
  const [importedFileName, setImportedFileName] = useState("")
  const fileInputRef = useRef(null)

  // OpenAPI file handler
  const handleFileChange = async (e) => {
    setImportError("")
    setImporting(true)
    const file = e.target.files[0]
    if (!file) return

    setImportedFileName(file.name)
    const ext = file.name.split(".").pop().toLowerCase()
    try {
      const text = await file.text()
      let spec
      if (ext === "json") {
        spec = JSON.parse(text)
      } else if (ext === "yaml" || ext === "yml") {
        spec = yaml.load(text)
      } else {
        setImportError("Only JSON or YAML files supported")
        setImporting(false)
        return
      }
      await importOpenapiCatalog({ openapiSpec: spec })
      setShowImportDialog(false)
      setImporting(false)
      setImportedFileName("")
      if (onImported) onImported()
    } catch (err) {
      setImportError("Failed to import: " + (err.message || "Unknown error"))
      setImporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                API Portal
              </h1>
            </div>
            <div className="flex gap-2">
              <Button onClick={onAddClick} className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Catalog
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowImportDialog(true)}
                className="flex items-center"
              >
                <UploadCloud className="w-4 h-4 mr-2" />
                Import OpenAPI
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* OpenAPI Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import OpenAPI File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="file"
              accept=".json,.yaml,.yml"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={importing}
            />
            {importedFileName && (
              <div className="text-xs text-gray-400">{importedFileName}</div>
            )}
            {importError && (
              <div className="text-red-600 text-xs">{importError}</div>
            )}
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowImportDialog(false)}
                disabled={importing}
              >
                Cancel
              </Button>
            </div>
          </div>
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
                    style={{ backgroundColor: `${catalog.color}20` }}
                  >
                    <Book className="w-6 h-6" style={{ color: catalog.color }} />
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => onEdit(catalog)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => onDelete(catalog)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div onClick={() => onSelect(catalog)}>
                  <CardTitle className="text-xl">{catalog.name}</CardTitle>
                  <CardDescription>{catalog.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent onClick={() => onSelect(catalog)}>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Click to explore APIs</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import { X } from "lucide-react"

export default function AddApiForm({ onSave, onCancel, initial }) {
  const [name, setName] = useState("")
  const [endpoint, setEndpoint] = useState("")
  const [method, setMethod] = useState("GET")
  const [description, setDescription] = useState("")
  const [version, setVersion] = useState("1.0.0")
  const [status, setStatus] = useState("active")
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState("")
  const [openapiRaw, setOpenapiRaw] = useState("")

  // Initialize form with initial values when component mounts or initial changes
  useEffect(() => {
    if (initial) {
      setName(initial.name || "")
      setEndpoint(initial.endpoint || "")
      setMethod(initial.method || "GET")
      setDescription(initial.description || "")
      setVersion(initial.version || "1.0.0")
      setStatus(initial.status || "active")
      setTags(initial.tags || [])
      setOpenapiRaw(initial.openapiSpec ? JSON.stringify(initial.openapiSpec, null, 2) : "")
    } else {
      // Reset form for new API
      setName("")
      setEndpoint("")
      setMethod("GET")
      setDescription("")
      setVersion("1.0.0")
      setStatus("active")
      setTags([])
      setTagInput("")
      setOpenapiRaw("")
    }
  }, [initial])

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let openapiSpec = undefined
    if (openapiRaw.trim() !== "") {
      try {
        openapiSpec = JSON.parse(openapiRaw)
      } catch {
        alert("OpenAPI JSON is invalid!")
        return
      }
    }

    onSave({
      name,
      endpoint,
      method,
      description,
      version,
      status,
      tags,
      openapiSpec,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">API Name</Label>
          <Input
            id="name"
            placeholder="Enter API name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="method">Method</Label>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
              <SelectItem value="PATCH">PATCH</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="endpoint">Endpoint</Label>
        <Input
          id="endpoint"
          placeholder="/api/v1/resource"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter API description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="version">Version</Label>
          <Input id="version" placeholder="1.0.0" value={version} onChange={(e) => setVersion(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="deprecated">Deprecated</SelectItem>
              <SelectItem value="beta">Beta</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex space-x-2">
          <Input
            placeholder="Add tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
          />
          <Button type="button" onClick={addTag} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
              <span>{tag}</span>
              <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="openapi">OpenAPI Specification (Optional)</Label>
        <Textarea
          id="openapi"
          placeholder="Paste OpenAPI JSON here..."
          value={openapiRaw}
          onChange={(e) => setOpenapiRaw(e.target.value)}
          rows={8}
          className="font-mono text-sm"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initial ? "Update" : "Create"} API</Button>
      </div>
    </form>
  )
}

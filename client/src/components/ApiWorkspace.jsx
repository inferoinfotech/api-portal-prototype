"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { ScrollArea } from "./ui/scroll-area"
import { Search, Plus, Book, Code, Play, Copy, Edit, Trash2, ArrowLeft, Zap } from "lucide-react"
import TestApiForm from "./TestApiForm"
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

export default function ApiWorkspace({ apis, onBack, onAddClick, search, setSearch, catalog, onEditApi, onDeleteApi }) {
  const [selectedApi, setSelectedApi] = useState(null)
  const [copied, setCopied] = useState(false)

  const uniqueTags = [...new Set(apis.flatMap((api) => api.tags || []))]
  const [selectedTag, setSelectedTag] = useState("")

  const filteredApis = apis
    .filter((api) => api.name.toLowerCase().includes(search.toLowerCase()))
    .filter((api) => selectedTag === "" || (api.tags || []).includes(selectedTag))

  const handleCopy = () => {
    if (selectedApi) {
      navigator.clipboard.writeText(selectedApi.endpoint)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={onBack} className="mr-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${catalog?.color}20` }}
              >
                <Book className="w-5 h-5" style={{ color: catalog?.color }} />
              </div>
              <div>
                <h1 className="text-xl font-bold">{catalog?.name}</h1>
                <p className="text-sm text-gray-500">{catalog?.description}</p>
              </div>
            </div>
            <Button
              onClick={onAddClick}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add API
            </Button>
          </div>
        </div>
      </header>

      {/* Three Panel Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - API List */}
        <div className="w-80 border-r bg-white/50 backdrop-blur-sm">
          <ScrollArea className="h-full">
            <div className="p-4">
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search APIs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Tag filter pills */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <Button
                  variant={selectedTag === "" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag("")}
                  className="text-xs"
                >
                  All
                </Button>
                {uniqueTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTag(tag)}
                    className="text-xs"
                  >
                    {tag}
                  </Button>
                ))}
              </div>

              {/* APIs List */}
              <div className="space-y-3">
                {filteredApis.length === 0 && (
                  <div className="text-center py-8">
                    <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No APIs found</p>
                  </div>
                )}

                {filteredApis.map((api) => (
                  <Card
                    key={api._id}
                    className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                      selectedApi?._id === api._id ? "ring-2 ring-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => setSelectedApi(api)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              api.method === "GET" ? "default" : api.method === "POST" ? "destructive" : "secondary"
                            }
                            className="font-mono text-xs"
                          >
                            {api.method}
                          </Badge>
                          <Badge variant={api.status === "active" ? "default" : "secondary"} className="text-xs">
                            {api.status}
                          </Badge>
                        </div>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              onEditApi(api)
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              onDeleteApi(api)
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <h3 className="font-semibold text-sm mb-1">{api.name}</h3>
                      <p className="text-gray-600 text-xs mb-2 line-clamp-2">{api.description}</p>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono block truncate">
                        {api.endpoint}
                      </code>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">v{api.version}</span>
                        {api.tags && api.tags.length > 0 && (
                          <div className="flex gap-1">
                            {api.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {api.tags.length > 2 && (
                              <span className="text-xs text-gray-400">+{api.tags.length - 2}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Center Panel - API Detail */}
        <div className="flex-1 overflow-auto">
          <ScrollArea className="h-full">
            {selectedApi ? (
              <div className="p-8">
                <div className="max-w-4xl">
                  {/* API Header */}
                  <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                      <Badge
                        variant={
                          selectedApi.method === "GET"
                            ? "default"
                            : selectedApi.method === "POST"
                              ? "destructive"
                              : "secondary"
                        }
                        className="font-mono text-sm px-3 py-1"
                      >
                        {selectedApi.method}
                      </Badge>
                      <code className="text-lg font-mono bg-gray-100 px-3 py-1 rounded">{selectedApi.endpoint}</code>
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        <Copy className="w-4 h-4 mr-2" />
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">{selectedApi.name}</h1>
                    <p className="text-gray-600 text-lg">{selectedApi.description}</p>
                    <div className="flex items-center space-x-4 mt-4">
                      <Badge variant="outline">v{selectedApi.version}</Badge>
                      <Badge variant={selectedApi.status === "active" ? "default" : "secondary"}>
                        {selectedApi.status}
                      </Badge>
                      {selectedApi.tags &&
                        selectedApi.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </div>

                  {/* Documentation Tabs */}
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="parameters">Parameters</TabsTrigger>
                      <TabsTrigger value="responses">Responses</TabsTrigger>
                      <TabsTrigger value="examples">Examples</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>API Overview</CardTitle>
                          <CardDescription>Detailed information about this endpoint</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Description</h4>
                            <p className="text-gray-600">{selectedApi.description}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Base URL</h4>
                            <code className="bg-gray-100 px-2 py-1 rounded">https://api.example.com</code>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Authentication</h4>
                            <p className="text-gray-600">Bearer token required</p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="parameters" className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Parameters</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <code className="font-mono text-sm">id</code>
                                <Badge variant="destructive" className="text-xs">
                                  Required
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">User identifier</p>
                              <div className="text-xs text-gray-500">
                                <span className="font-medium">Type:</span> string
                                <span className="ml-4 font-medium">Location:</span> path
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="responses" className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Responses</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                              <div className="flex items-center space-x-2 mb-3">
                                <Badge variant="default">200</Badge>
                                <span className="font-medium">Success</span>
                              </div>
                              <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
                                {`{
  "id": "12345",
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2024-01-15T10:30:00Z"
}`}
                              </pre>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="examples" className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Code Examples</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Tabs defaultValue="curl" className="w-full">
                            <TabsList>
                              <TabsTrigger value="curl">cURL</TabsTrigger>
                              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                              <TabsTrigger value="python">Python</TabsTrigger>
                            </TabsList>
                            <TabsContent value="curl" className="mt-4">
                              <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
                                {`curl -X GET "https://api.example.com/v1/users/12345" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json"`}
                              </pre>
                            </TabsContent>
                            <TabsContent value="javascript" className="mt-4">
                              <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
                                {`const response = await fetch('https://api.example.com/v1/users/12345', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  }
});
const user = await response.json();`}
                              </pre>
                            </TabsContent>
                          </Tabs>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>

                  {/* OpenAPI Documentation */}
                  {selectedApi.openapiSpec && Object.keys(selectedApi.openapiSpec).length > 0 && (
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>OpenAPI Documentation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <SwaggerUI spec={selectedApi.openapiSpec} />
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <Code className="w-12 h-12 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Select an API</h3>
                  <p className="text-slate-500">
                    Choose an API from the left panel to view its details and documentation.
                  </p>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Right Panel - API Tester */}
        <div className="w-96 border-l bg-white/50 backdrop-blur-sm">
          <ScrollArea className="h-full">
            {selectedApi ? (
              <div className="p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Play className="w-4 h-4 mr-2" />
                  Try It Out
                </h3>
                <TestApiForm apiId={selectedApi._id} />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center h-full">
                <div className="text-center max-w-md p-6">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-100 to-teal-100 rounded-full flex items-center justify-center">
                    <Play className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">API Testing</h3>
                  <p className="text-slate-500">Select an API to start testing its endpoints and functionality.</p>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

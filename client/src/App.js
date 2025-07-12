"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./components/ui/dialog"
import {
  getCatalogs,
  addCatalog,
  getApisInCatalog,
  addApiToCatalog,
  editCatalog,
  deleteCatalog,
  editApi,
  deleteApi,
} from "./api"
import CatalogList from "./components/CatalogList"
import AddCatalogForm from "./components/AddCatalogForm"
import ApiWorkspace from "./components/ApiWorkspace"
import AddApiForm from "./components/AddApiForm"

function App() {
  const [view, setView] = useState("catalogs") // catalogs | apis
  const [catalogs, setCatalogs] = useState([])
  const [selectedCatalog, setSelectedCatalog] = useState(null)
  const [apis, setApis] = useState([])
  const [showAddCatalog, setShowAddCatalog] = useState(false)
  const [showAddApi, setShowAddApi] = useState(false)
  const [searchCatalog, setSearchCatalog] = useState("")
  const [editCatalogData, setEditCatalogData] = useState(null)
  const [searchApi, setSearchApi] = useState("")
  const [editApiData, setEditApiData] = useState(null)

  // Load catalogs on start
  useEffect(() => {
    loadCatalogs()
  }, [])

  const loadCatalogs = async () => {
    const res = await getCatalogs()
    setCatalogs(res.data)
  }

  const handleEditCatalog = async (data) => {
    await editCatalog(editCatalogData._id, data)
    setEditCatalogData(null)
    await loadCatalogs()
  }

  const handleDeleteCatalog = async (cat) => {
    if (window.confirm("Delete this catalog and all its APIs?")) {
      await deleteCatalog(cat._id)
      await loadCatalogs()
    }
  }

  const handleEditApi = async (data) => {
    await editApi(editApiData._id, data)
    setEditApiData(null)
    const res = await getApisInCatalog(selectedCatalog._id)
    setApis(res.data)
  }

  const handleDeleteApi = async (api) => {
    if (window.confirm("Delete this API?")) {
      await deleteApi(api._id)
      const res = await getApisInCatalog(selectedCatalog._id)
      setApis(res.data)
    }
  }

  const handleAddCatalog = async (data) => {
    await addCatalog(data)
    setShowAddCatalog(false)
    await loadCatalogs()
  }

  const handleSelectCatalog = async (catalog) => {
    setSelectedCatalog(catalog)
    setView("apis")
    setSearchApi("")
    const res = await getApisInCatalog(catalog._id)
    setApis(res.data)
  }

  const handleBackToCatalogs = () => {
    setSelectedCatalog(null)
    setView("catalogs")
    loadCatalogs()
  }

  const handleAddApi = async (data) => {
    await addApiToCatalog(selectedCatalog._id, data)
    setShowAddApi(false)
    const res = await getApisInCatalog(selectedCatalog._id)
    setApis(res.data)
  }

  // Filtered lists for search
  const filteredCatalogs = catalogs.filter((cat) => cat.name.toLowerCase().includes(searchCatalog.toLowerCase()))

  const filteredApis = apis.filter((api) => api.name.toLowerCase().includes(searchApi.toLowerCase()))

  return (
    <div className="bg-gray-100 min-h-screen">
      {view === "catalogs" && (
        <>
          <CatalogList
            catalogs={filteredCatalogs}
            onSelect={handleSelectCatalog}
            onAddClick={() => setShowAddCatalog(true)}
            search={searchCatalog}
            setSearch={setSearchCatalog}
            onEdit={setEditCatalogData}
            onDelete={handleDeleteCatalog}
          />

          {/* Add Catalog Dialog */}
          <Dialog open={showAddCatalog} onOpenChange={setShowAddCatalog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New API Catalog</DialogTitle>
              </DialogHeader>
              <AddCatalogForm onSave={handleAddCatalog} onCancel={() => setShowAddCatalog(false)} />
            </DialogContent>
          </Dialog>

          {/* Edit Catalog Dialog */}
          <Dialog open={!!editCatalogData} onOpenChange={() => setEditCatalogData(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit API Catalog</DialogTitle>
              </DialogHeader>
              <AddCatalogForm
                onSave={handleEditCatalog}
                onCancel={() => setEditCatalogData(null)}
                initial={editCatalogData}
              />
            </DialogContent>
          </Dialog>
        </>
      )}

      {view === "apis" && selectedCatalog && (
        <>
          <ApiWorkspace
            apis={filteredApis}
            onBack={handleBackToCatalogs}
            onAddClick={() => setShowAddApi(true)}
            search={searchApi}
            setSearch={setSearchApi}
            catalog={selectedCatalog}
            onEditApi={setEditApiData}
            onDeleteApi={handleDeleteApi}
          />

          {/* Add API Dialog */}
          <Dialog open={showAddApi} onOpenChange={setShowAddApi}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New API</DialogTitle>
              </DialogHeader>
              <AddApiForm onSave={handleAddApi} onCancel={() => setShowAddApi(false)} />
            </DialogContent>
          </Dialog>

          {/* Edit API Dialog */}
          <Dialog open={!!editApiData} onOpenChange={() => setEditApiData(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit API</DialogTitle>
              </DialogHeader>
              <AddApiForm onSave={handleEditApi} onCancel={() => setEditApiData(null)} initial={editApiData} />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}

export default App

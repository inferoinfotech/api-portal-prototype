import { useEffect, useState } from "react";
import {
  getCatalogs,
  addCatalog,
  getApisInCatalog,
  addApiToCatalog,
  getApiDetail
} from "./api";

import CatalogList from "./components/CatalogList";
import AddCatalogForm from "./components/AddCatalogForm";
import ApiList from "./components/ApiList";
import AddApiForm from "./components/AddApiForm";
import ApiDetail from "./components/ApiDetail";
import { editCatalog, deleteCatalog } from "./api";
import { editApi, deleteApi } from "./api";

function App() {
  const [view, setView] = useState("catalogs"); // catalogs | apis | api-detail
  const [catalogs, setCatalogs] = useState([]);
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [apis, setApis] = useState([]);
  const [selectedApi, setSelectedApi] = useState(null);
  const [showAddCatalog, setShowAddCatalog] = useState(false);
  const [showAddApi, setShowAddApi] = useState(false);
  const [searchCatalog, setSearchCatalog] = useState("");
  const [editCatalogData, setEditCatalogData] = useState(null);
  const [searchApi, setSearchApi] = useState("");
const [editApiData, setEditApiData] = useState(null);

  // Load catalogs on start
  useEffect(() => {
    loadCatalogs();
  }, []);

  const loadCatalogs = async () => {
    const res = await getCatalogs();
    setCatalogs(res.data);
  };

  const handleEditCatalog = async (data) => {
  await editCatalog(editCatalogData._id, data);
  setEditCatalogData(null);
  await loadCatalogs();
};

const handleDeleteCatalog = async (cat) => {
  if (window.confirm("Delete this catalog and all its APIs?")) {
    await deleteCatalog(cat._id);
    await loadCatalogs();
  }
};



const handleEditApi = async (data) => {
  await editApi(editApiData._id, data);
  setEditApiData(null);
  const res = await getApisInCatalog(selectedCatalog._id);
  setApis(res.data);
};

const handleDeleteApi = async (api) => {
  if (window.confirm("Delete this API?")) {
    await deleteApi(api._id);
    const res = await getApisInCatalog(selectedCatalog._id);
    setApis(res.data);
  }
};
  const handleAddCatalog = async (data) => {
    await addCatalog(data);
    setShowAddCatalog(false);
    await loadCatalogs();
  };

  const handleSelectCatalog = async (catalog) => {
    setSelectedCatalog(catalog);
    setView("apis");
    setSearchApi("");
    const res = await getApisInCatalog(catalog._id);
    setApis(res.data);
  };

  const handleBackToCatalogs = () => {
    setSelectedCatalog(null);
    setView("catalogs");
    loadCatalogs();
  };

  const handleAddApi = async (data) => {
    await addApiToCatalog(selectedCatalog._id, data);
    setShowAddApi(false);
    const res = await getApisInCatalog(selectedCatalog._id);
    setApis(res.data);
  };

  const handleSelectApi = async (api) => {
    const res = await getApiDetail(api._id);
    setSelectedApi(res.data);
    setView("api-detail");
  };

  const handleBackToApis = async () => {
    setSelectedApi(null);
    setView("apis");
    const res = await getApisInCatalog(selectedCatalog._id);
    setApis(res.data);
  };

  // Filtered lists for search
  const filteredCatalogs = catalogs.filter(cat =>
    cat.name.toLowerCase().includes(searchCatalog.toLowerCase())
  );

  const filteredApis = apis.filter(api =>
    api.name.toLowerCase().includes(searchApi.toLowerCase())
  );

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
          {showAddCatalog && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
              <AddCatalogForm
                onSave={handleAddCatalog}
                onCancel={() => setShowAddCatalog(false)}
              />
            </div>
          )}
          {editCatalogData && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
              <AddCatalogForm
                onSave={handleEditCatalog}
                onCancel={() => setEditCatalogData(null)}
                initial={editCatalogData}
              />
            </div>
          )}
        </>
      )}
      {view === "apis" && selectedCatalog && (
        <>
         <ApiList
  apis={filteredApis}
  onBack={handleBackToCatalogs}
  onSelectApi={handleSelectApi}
  onAddClick={() => setShowAddApi(true)}
  search={searchApi}
  setSearch={setSearchApi}
  catalog={selectedCatalog}
  onEditApi={setEditApiData}
  onDeleteApi={handleDeleteApi}
/>
          {showAddApi && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
              <AddApiForm
                onSave={handleAddApi}
                onCancel={() => setShowAddApi(false)}
              />
            </div>
          )}
        </>
      )}
      {view === "api-detail" && selectedApi && (
        <ApiDetail
          api={selectedApi}
          onBack={handleBackToApis}
        />
        
      )}
    </div>
  );
}

export default App;

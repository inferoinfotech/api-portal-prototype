import React from "react";

export default function CatalogList({ catalogs, onSelect, onAddClick, search, setSearch,onEdit, onDelete }) {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">API Catalog</h1>
        <button onClick={onAddClick} className="bg-blue-600 text-white px-4 py-2 rounded shadow">+ Add Catalog</button>
      </div>
      <input
        className="block w-full border px-3 py-2 rounded mb-4"
        placeholder="Search catalogs..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="grid md:grid-cols-2 gap-4">
        {catalogs.length === 0 && (
          <div className="text-gray-500 col-span-2">No catalogs found.</div>
        )}
        {catalogs.map((cat) => (
    <div key={cat._id} className="p-4 rounded shadow bg-white cursor-pointer flex items-center justify-between"
      style={{ borderLeft: `6px solid ${cat.color}` }}>
      <div onClick={() => onSelect(cat)} className="flex-1">
        <div className="font-semibold text-lg">{cat.name}</div>
        <div className="text-gray-600">{cat.description}</div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onEdit(cat)} className="text-blue-600 px-2">Edit</button>
        <button onClick={() => onDelete(cat)} className="text-red-600 px-2">Delete</button>
      </div>
    </div>
  ))}
      </div>
    </div>
  );
}

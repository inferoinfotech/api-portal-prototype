import { useState } from "react";

export default function AddCatalogForm({ onSave, onCancel, initial }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3B82F6");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, description, color });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold">Add API Catalog</h2>
      <input
        className="block w-full border px-3 py-2 rounded"
        placeholder="Catalog Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        className="block w-full border px-3 py-2 rounded"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <div className="flex items-center space-x-2">
        <label htmlFor="color">Color:</label>
        <input
          type="color"
          id="color"
          value={color}
          onChange={e => setColor(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded border">Cancel</button>
      </div>
    </form>
    
  );
}

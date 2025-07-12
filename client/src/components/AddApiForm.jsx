import { useState } from "react";

export default function AddApiForm({ onSave, onCancel, initial }) {
  const [name, setName] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [method, setMethod] = useState("GET");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("1.0.0");
  const [status, setStatus] = useState("active");
  const [tags, setTags] = useState("");
    const [openapiRaw, setOpenapiRaw] = useState(""); // for OpenAPI JSON input

 const handleSubmit = (e) => {
    e.preventDefault();
    let openapiSpec = undefined;
    if (openapiRaw.trim() !== "") {
      try {
        openapiSpec = JSON.parse(openapiRaw);
      } catch {
        alert("OpenAPI JSON is invalid!");
        return;
      }
    }
    onSave({
      name,
      endpoint,
      method,
      description,
      version,
      status,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      openapiSpec, // <-- send to backend
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold">Add API</h2>
      <input className="block w-full border px-3 py-2 rounded" placeholder="API Name" value={name} onChange={e => setName(e.target.value)} required />
      <input className="block w-full border px-3 py-2 rounded" placeholder="Endpoint (e.g. /v1/resource)" value={endpoint} onChange={e => setEndpoint(e.target.value)} required />
      <select className="block w-full border px-3 py-2 rounded" value={method} onChange={e => setMethod(e.target.value)}>
        <option>GET</option>
        <option>POST</option>
        <option>PUT</option>
        <option>DELETE</option>
      </select>
      <input className="block w-full border px-3 py-2 rounded" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <input className="block w-full border px-3 py-2 rounded" placeholder="Version" value={version} onChange={e => setVersion(e.target.value)} />
      <select className="block w-full border px-3 py-2 rounded" value={status} onChange={e => setStatus(e.target.value)}>
        <option value="active">Active</option>
        <option value="deprecated">Deprecated</option>
      </select>
      <input className="block w-full border px-3 py-2 rounded" placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} />
      <textarea
        rows={5}
        className="block w-full border px-3 py-2 rounded font-mono"
        placeholder="Paste OpenAPI JSON here (optional)"
        value={openapiRaw}
        onChange={e => setOpenapiRaw(e.target.value)}
      />
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded border">Cancel</button>
      </div>
    </form>
  );
}

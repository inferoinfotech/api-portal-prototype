import { useState } from "react";
import { testApi } from "../api";

export default function TestApiForm({ apiId }) {
  const [input, setInput] = useState('{"test": "value"}');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTest = async (e) => {
    e.preventDefault();
    setError("");
    setResponse(null);
    let parsed;
    try {
      parsed = JSON.parse(input);
    } catch {
      setError("Input must be valid JSON.");
      return;
    }
    setLoading(true);
    try {
      const res = await testApi(apiId, parsed);
      setResponse(res.data);
    } catch (err) {
      setError("Failed to test API");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleTest} className="bg-white p-4 rounded shadow">
      <h4 className="text-lg font-semibold mb-2">Test API (Dummy)</h4>
      <textarea
        rows={4}
        className="block w-full border px-3 py-2 rounded font-mono"
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button type="submit" className="mt-2 bg-green-600 text-white px-4 py-2 rounded" disabled={loading}>
        {loading ? "Testing..." : "Test API"}
      </button>
      {error && <div className="text-red-600 mt-2">{error}</div>}
      {response && (
        <pre className="bg-gray-900 text-white p-3 rounded mt-3 overflow-x-auto text-sm">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </form>
  );
}

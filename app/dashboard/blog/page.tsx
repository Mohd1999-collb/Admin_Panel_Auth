"use client";

import { useState, useEffect } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfs, setPdfs] = useState<any[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewPdf, setViewPdf] = useState<string | null>(null);

  const fetchPdfs = async () => {
    const res = await fetch("/api/auth/upload");
    const data = await res.json();
    setPdfs(data);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/auth/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      setFile(null);
      (document.getElementById("pdfInput") as HTMLInputElement).value = "";
      fetchPdfs();
    } else {
      alert(data.error);
    }
  };

  // const handleView = async (id: string) => {
  //   const res = await fetch(`/api/auth/pdf/${id}`);
  //   const data = await res.json();
  //   setViewPdf(data);
  //   console.log("View PDF Data:", data);

  
  // }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    const res = await fetch("/api/auth/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      fetchPdfs();
    } else {
      alert(data.error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId || !file) return alert("Please select a file to update");

    const formData = new FormData();
    formData.append("id", editId);
    formData.append("file", file);

    const res = await fetch("/api/auth/upload", {
      method: "PUT",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      setEditId(null);
      setFile(null);
      (document.getElementById("pdfInput") as HTMLInputElement).value = "";
      fetchPdfs();
    } else {
      alert(data.error);
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Upload PDF</h2>

      <form
        onSubmit={editId ? handleUpdate : handleUpload}
        className="flex items-center gap-3 mb-6"
      >
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border p-2 rounded-md cursor-pointer"
          id="pdfInput"
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded-md text-white cursor-pointer ${
            editId
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {editId ? "Update PDF" : "Upload PDF"}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => setEditId(null)}
            className="px-3 py-2 bg-gray-300 rounded-md"
          >
            Cancel
          </button>
        )}
      </form>

      <h3 className="text-xl font-semibold mb-2">Uploaded PDFs</h3>
      <ul className="space-y-3">
        {pdfs.map((pdf) => (
          <li
            key={pdf._id}
            className="flex justify-between items-center border p-3 rounded-md"
          >
            <span>{pdf.filename}</span>
            <div className="flex gap-3">
              <button
                onClick={() => setViewPdf(`/api/auth/pdf/${pdf._id}`)}
                className="text-blue-600 underline cursor-pointer"
              >
                View
              </button>
              <button
                onClick={() => setEditId(pdf._id)}
                className="text-yellow-600 underline cursor-pointer"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(pdf._id)}
                className="text-red-600 underline cursor-pointer"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* ✅ PDF Modal */}
      {viewPdf && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] h-[90%] p-4 rounded-lg shadow-lg relative">
            <button
              onClick={() => setViewPdf(null)}
              className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded"
            >
              ✕
            </button>
            {/* <h2 className="text-lg font-semibold mb-2 text-center border-b pb-2">
              Hello
            </h2> */}
            <iframe
              src={viewPdf}
              className="w-full h-full rounded-md"
              title="PDF Viewer"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

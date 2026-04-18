"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const f = acceptedFiles[0];
        setFile(f);

        if (f.type.startsWith("image/")) {
          setFilePreview({ url: URL.createObjectURL(f), name: f.name, type: f.type });
        } else if (f.type === "application/pdf") {
          setFilePreview({ name: f.name, type: f.type });
        } else {
          setFilePreview(null);
        }
      }
    },
  });

  const onSubmit = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    setUploadProgress(0);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("http://localhost:8000/api/upload", formData, {
        onUploadProgress: (e) => {
          setUploadProgress(Math.round((e.loaded * 100) / e.total));
        },
      });

      setUploadResult({ success: true, data: response.data });
      setUploadedFiles((prev) => [...prev, response.data]);
    } catch (error) {
      setUploadResult({ success: false, message: error.response?.data?.error || "Upload failed" });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">📂 File Upload</h1>

        {/* Drag & Drop Zone */}
        <div
          {...getRootProps({
            className:
              "border-2 border-dashed border-gray-400 p-6 text-center rounded-lg cursor-pointer hover:border-blue-500 transition",
          })}
        >
          <input {...getInputProps()} />
          <p className="text-gray-600">Drag & drop or click to select a file</p>
        </div>

        {/* Preview */}
        {filePreview && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Preview:</h3>
            {filePreview.type?.startsWith("image/") ? (
              <img
                src={filePreview.url}
                alt={filePreview.name}
                className="max-w-full h-auto rounded shadow"
              />
            ) : (
              <p className="text-gray-700">{filePreview.name}</p>
            )}

            {/* Upload Button */}
            <button
              onClick={onSubmit}
              className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
               Upload
            </button>
          </div>
        )}

        {/* Progress */}
        {uploadProgress > 0 && (
          <div className="mt-4">
            <p className="text-gray-700">Progress: {uploadProgress}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Result */}
        {uploadResult && (
          <div className="mt-4">
            {uploadResult.success ? (
              <p className="text-green-600 font-semibold">✅ {uploadResult.data.message}</p>
            ) : (
              <p className="text-red-600 font-semibold">❌ {uploadResult.message}</p>
            )}
          </div>
        )}

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">📁 Uploaded Files:</h3>
            <ul className="list-disc list-inside text-blue-600">
              {uploadedFiles.map((f, idx) => (
                <li key={idx}>
                  <a
                    href={`http://localhost:8000${f.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {f.originalName || f.filename}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

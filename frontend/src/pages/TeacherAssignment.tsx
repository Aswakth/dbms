import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";

const AssignmentUpload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !description || !file) {
      setMessage("Please fill all fields and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);

    try {
      // Replace with your backend endpoint
      const res = await axios.post("/api/assignments/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Assignment uploaded successfully!");
      setTitle("");
      setDescription("");
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage("Error uploading assignment.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-8">
          <h2 className="text-3xl font-bold text-white">Upload Assignment</h2>
          <p className="text-indigo-100 mt-2">
            Create and share assignments with your students
          </p>
        </div>

        <div className="p-8">
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg text-sm font-medium ${
                message.includes("successfully")
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : message.includes("Error")
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Assignment Title
              </label>
              <input
                type="text"
                placeholder="Enter assignment title (e.g., Math Quiz Chapter 5)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Description
              </label>
              <textarea
                placeholder="Provide detailed instructions, requirements, and any additional information for students..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
              />
              <p className="text-xs text-gray-500">
                Include due date, submission format, and grading criteria
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Assignment File
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer transition-all duration-200"
                />
              </div>
              {file && (
                <div className="mt-2 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <p className="text-sm text-indigo-700 font-medium">
                    Selected file:
                  </p>
                  <p className="text-xs text-indigo-600 mt-1">{file.name}</p>
                </div>
              )}
              <p className="text-xs text-gray-500">
                Upload assignment documents, worksheets, or reference materials
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              Upload Assignment
            </button>
          </form>

          <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              📋 Best Practices:
            </h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Use clear, descriptive titles for easy identification</li>
              <li>• Include specific instructions and expectations</li>
              <li>• Mention due dates and submission requirements</li>
              <li>• Upload supporting materials or reference documents</li>
              <li>• Specify file formats accepted for submissions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentUpload;

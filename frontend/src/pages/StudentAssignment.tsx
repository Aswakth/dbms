// src/pages/StudentAssignment.tsx
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useAuth } from "../firebase/AuthProvider";

const StudentAssignment = () => {
  const { user } = useAuth();
  const [assignmentId, setAssignmentId] = useState("");
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Submit the assignment
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!assignmentId) {
      setMessage("Please enter assignment ID.");
      return;
    }

    if (!user?.email) {
      setMessage("Please log in to submit assignments.");
      return;
    }

    const formData = new FormData();
    formData.append("assignmentId", assignmentId);
    formData.append("studentEmail", user.email);
    if (submissionNotes) {
      formData.append("submissionNotes", submissionNotes);
    }
    if (file) {
      formData.append("file", file);
    }

    try {
      await axios.post("/api/student/assignments/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Assignment submitted successfully!");
      setFile(null);
      setAssignmentId("");
      setSubmissionNotes("");
    } catch (err) {
      console.error(err);
      setMessage("Error submitting assignment.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
          <h2 className="text-3xl font-bold text-white text-center">
            Submit Assignment
          </h2>
          <p className="text-indigo-100 text-center mt-2">
            Upload your completed work
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
                Assignment ID
              </label>
              <input
                type="text"
                placeholder="Enter assignment ID"
                value={assignmentId}
                onChange={(e) => setAssignmentId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Submission Notes (Optional)
              </label>
              <textarea
                placeholder="Add any notes about your submission..."
                value={submissionNotes}
                onChange={(e) => setSubmissionNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Assignment File (Optional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer transition-all duration-200"
                />
              </div>
              {file && (
                <p className="text-xs text-gray-500 mt-1">
                  Selected: {file.name}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              Submit Assignment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentAssignment;

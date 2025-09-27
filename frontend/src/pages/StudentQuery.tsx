// src/pages/StudentQuery.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";

const StudentQuery = () => {
  const [teacherId, setTeacherId] = useState("");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!teacherId || !query) {
      setMessage("Please select a teacher and enter your query.");
      return;
    }

    try {
      await axios.post(`/api/student/queries`, {
        teacherId,
        message: query,
      });
      setMessage("Query submitted successfully!");
      setTeacherId("");
      setQuery("");
    } catch (err) {
      console.error(err);
      setMessage("Error submitting query.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-8">
          <h2 className="text-3xl font-bold text-white">Ask a Query</h2>
          <p className="text-indigo-100 mt-2">
            Get help and support from your teachers
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
                Teacher ID or Email
              </label>
              <input
                type="text"
                placeholder="Enter teacher's ID or email address"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Your Query
              </label>
              <textarea
                placeholder="Describe your question or concern in detail..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
              />
              <p className="text-xs text-gray-500">
                Be specific about your question to get the best help
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              Submit Query
            </button>
          </form>

          <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              💡 Tips for better responses:
            </h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Be clear and specific about your question</li>
              <li>• Include relevant course or assignment details</li>
              <li>• Mention any steps you've already tried</li>
              <li>• Use your teacher's preferred contact method</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentQuery;

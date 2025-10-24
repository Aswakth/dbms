// src/pages/TeacherQueries.tsx
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import axios from "axios";

interface Query {
  id: string;
  studentName: string; // contains student email
  message: string;
  date: string;
  reply?: string;
}

const TeacherQueries = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [replyMap, setReplyMap] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState("");

  // Fetch all queries on component mount
  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const res = await axios.get("/api/teacher/queries");
      setQueries(res.data);
      setMessage("");
    } catch (err) {
      console.error(err);
      setMessage("Error fetching queries.");
    }
  };

  const handleReplyChange = (id: string, value: string) => {
    setReplyMap((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent, queryId: string) => {
    e.preventDefault();
    const reply = replyMap[queryId];
    if (!reply) {
      setMessage("Reply cannot be empty.");
      return;
    }

    try {
      await axios.post(`/api/teacher/queries/${queryId}/reply`, { reply });
      setMessage("Reply submitted successfully!");
      // Optionally update local query with reply
      setQueries((prev) =>
        prev.map((q) => (q.id === queryId ? { ...q, reply } : q))
      );
      setReplyMap((prev) => ({ ...prev, [queryId]: "" }));
    } catch (err) {
      console.error(err);
      setMessage("Error submitting reply.");
    }
  };

  const pendingQueries = queries.filter((q) => !q.reply);
  const answeredQueries = queries.filter((q) => q.reply);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-8">
            <h2 className="text-3xl font-bold text-white">Student Queries</h2>
            <p className="text-indigo-100 mt-2">
              Review and respond to student questions
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

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Pending Queries
                    </h3>
                    <p className="text-sm text-gray-600">
                      Awaiting your response
                    </p>
                  </div>
                  <div className="text-3xl font-bold text-orange-600">
                    {pendingQueries.length}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Answered Queries
                    </h3>
                    <p className="text-sm text-gray-600">
                      Successfully responded
                    </p>
                  </div>
                  <div className="text-3xl font-bold text-emerald-600">
                    {answeredQueries.length}
                  </div>
                </div>
              </div>
            </div>

            {queries.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-50 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                </div>
                <p className="text-gray-500 text-lg font-medium">
                  No queries found.
                </p>
                <p className="text-gray-400 mt-2">
                  Student questions will appear here when available.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Pending Queries Section */}
                {pendingQueries.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                      Pending Queries
                    </h3>
                    <div className="space-y-4">
                      {pendingQueries.map((q) => (
                        <div
                          key={q.id}
                          className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                                {q.studentName}
                              </div>
                              <span className="text-sm text-gray-500">
                                {q.date}
                              </span>
                            </div>
                            <div className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium">
                              Pending
                            </div>
                          </div>

                          <div className="mb-4 p-4 bg-white bg-opacity-60 rounded-lg">
                            <p className="text-gray-800 leading-relaxed">
                              "{q.message}"
                            </p>
                          </div>

                          <form
                            onSubmit={(e) => handleSubmit(e, q.id)}
                            className="space-y-3"
                          >
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Your Reply
                              </label>
                              <textarea
                                placeholder="Type your response to help the student..."
                                value={replyMap[q.id] || ""}
                                onChange={(e) =>
                                  handleReplyChange(q.id, e.target.value)
                                }
                                rows={3}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
                              />
                            </div>
                            <button
                              type="submit"
                              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                            >
                              Submit Reply
                            </button>
                          </form>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Answered Queries Section */}
                {answeredQueries.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                      Answered Queries
                    </h3>
                    <div className="space-y-4">
                      {answeredQueries.map((q) => (
                        <div
                          key={q.id}
                          className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-6"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                                {q.studentName}
                              </div>
                              <span className="text-sm text-gray-500">
                                {q.date}
                              </span>
                            </div>
                            <div className="bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full text-xs font-medium">
                              Answered
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="p-4 bg-white bg-opacity-60 rounded-lg">
                              <p className="text-sm font-medium text-gray-600 mb-1">
                                Student Question:
                              </p>
                              <p className="text-gray-800 leading-relaxed">
                                "{q.message}"
                              </p>
                            </div>

                            <div className="p-4 bg-emerald-100 bg-opacity-60 rounded-lg">
                              <p className="text-sm font-medium text-emerald-700 mb-1">
                                Your Reply:
                              </p>
                              <p className="text-gray-800 leading-relaxed">
                                "{q.reply}"
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherQueries;

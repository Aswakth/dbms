// src/pages/TeacherHome.tsx
import React from "react";
import { Link } from "react-router-dom";

interface QueryNotification {
  id: string;
  studentName: string;
  query: string;
  date: string;
}

// Hardcoded query notifications (simulate backend)
const mockQueryNotifications: QueryNotification[] = [
  {
    id: "1",
    studentName: "Alice",
    query: "Can you explain Chapter 3?",
    date: "2025-09-25",
  },
  {
    id: "2",
    studentName: "Bob",
    query: "I missed the last class, please share notes.",
    date: "2025-09-24",
  },
  {
    id: "3",
    studentName: "Charlie",
    query: "When is the next assignment due?",
    date: "2025-09-23",
  },
];

const TeacherHome: React.FC = () => {
  const notifications = mockQueryNotifications;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-12">
            <h1 className="text-4xl font-bold text-white mb-2">
              Hello, Teacher!
            </h1>
            <p className="text-xl text-indigo-100">
              Welcome to your Teacher Portal.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Query Notifications Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">
                  Query Notifications
                </h2>
                <p className="text-gray-600 mt-1">
                  Student questions requiring your attention
                </p>
              </div>

              <div className="p-8">
                {notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-50 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    </div>
                    <p className="text-gray-500 font-medium">No new queries.</p>
                    <p className="text-gray-400 text-sm mt-1">
                      All student questions have been addressed!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="bg-gradient-to-r from-gray-50 to-indigo-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium mr-3">
                                {n.studentName}
                              </div>
                              <span className="text-xs text-gray-500">
                                {n.date}
                              </span>
                            </div>
                            <p className="text-gray-800 leading-relaxed">
                              "{n.query}"
                            </p>
                          </div>
                          <div className="ml-4 bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                            Pending
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">Navigate</h2>
                <p className="text-gray-600 mt-1">Quick access to your tools</p>
              </div>

              <div className="p-8">
                <div className="space-y-3">
                  <Link
                    to="/teacher/assignment"
                    className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:from-indigo-100 hover:to-purple-100 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="bg-indigo-500 rounded-lg p-2 mr-4">
                      <div className="w-5 h-5 bg-white rounded"></div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 group-hover:text-indigo-700">
                        Upload Assignment
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Create and distribute assignments
                      </p>
                    </div>
                  </Link>

                  <Link
                    to="/teacher/attendance"
                    className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:from-indigo-100 hover:to-purple-100 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="bg-purple-500 rounded-lg p-2 mr-4">
                      <div className="w-5 h-5 bg-white rounded"></div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 group-hover:text-purple-700">
                        Give Attendance
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Mark student attendance
                      </p>
                    </div>
                  </Link>

                  <Link
                    to="/teacher/results"
                    className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:from-indigo-100 hover:to-purple-100 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="bg-cyan-500 rounded-lg p-2 mr-4">
                      <div className="w-5 h-5 bg-white rounded"></div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 group-hover:text-cyan-700">
                        Upload Results
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Publish exam results
                      </p>
                    </div>
                  </Link>

                  <Link
                    to="/teacher/queries"
                    className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:from-indigo-100 hover:to-purple-100 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="bg-emerald-500 rounded-lg p-2 mr-4">
                      <div className="w-5 h-5 bg-white rounded"></div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 group-hover:text-emerald-700">
                        Answer Queries
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Respond to student questions
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherHome;

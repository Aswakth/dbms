// src/pages/StudentHome.tsx
import React from "react";
import { Link } from "react-router-dom";

interface Notification {
  id: string;
  message: string;
  date: string;
}

// Hardcoded notifications for now (simulate backend)
const mockNotifications: Notification[] = [
  { id: "1", message: "Assignment 3 is due tomorrow!", date: "2025-09-25" },
  {
    id: "2",
    message: "New result uploaded for Semester 1",
    date: "2025-09-24",
  },
  { id: "3", message: "Attendance for Physics updated", date: "2025-09-23" },
];

const StudentHome: React.FC = () => {
  const notifications = mockNotifications;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-12">
            <h1 className="text-4xl font-bold text-white mb-2">
              Hello, Student!
            </h1>
            <p className="text-xl text-indigo-100">
              Welcome to your Student Portal.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notifications Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">
                  Notifications
                </h2>
                <p className="text-gray-600 mt-1">
                  Stay updated with your latest activities
                </p>
              </div>

              <div className="p-8">
                {notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-50 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    </div>
                    <p className="text-gray-500 font-medium">
                      No new notifications.
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      You're all caught up!
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
                            <p className="text-gray-800 font-medium leading-relaxed">
                              {n.message}
                            </p>
                          </div>
                          <span className="ml-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200 whitespace-nowrap">
                            {n.date}
                          </span>
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
                    to="/student/assignment"
                    className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:from-indigo-100 hover:to-purple-100 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="bg-indigo-500 rounded-lg p-2 mr-4">
                      <div className="w-5 h-5 bg-white rounded"></div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 group-hover:text-indigo-700">
                        Submit Assignment
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Upload your completed work
                      </p>
                    </div>
                  </Link>

                  <Link
                    to="/student/attendance"
                    className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:from-indigo-100 hover:to-purple-100 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="bg-purple-500 rounded-lg p-2 mr-4">
                      <div className="w-5 h-5 bg-white rounded"></div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 group-hover:text-purple-700">
                        View Attendance
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Check your class attendance
                      </p>
                    </div>
                  </Link>

                  <Link
                    to="/student/results"
                    className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:from-indigo-100 hover:to-purple-100 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="bg-cyan-500 rounded-lg p-2 mr-4">
                      <div className="w-5 h-5 bg-white rounded"></div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 group-hover:text-cyan-700">
                        View Results
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        See your exam scores
                      </p>
                    </div>
                  </Link>

                  <Link
                    to="/student/query"
                    className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:from-indigo-100 hover:to-purple-100 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="bg-emerald-500 rounded-lg p-2 mr-4">
                      <div className="w-5 h-5 bg-white rounded"></div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 group-hover:text-emerald-700">
                        Ask a Query
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Get help and support
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

export default StudentHome;

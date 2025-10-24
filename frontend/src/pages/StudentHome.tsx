// src/pages/StudentHome.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../firebase/AuthProvider";

interface Notification {
  id: string;
  message: string;
  date: string;
  reply?: string; // Add reply field for teacher responses
}

interface Assignment {
  id: number;
  title: string;
  description: string;
  subjectId: string;
  filePath?: string;
  createdAt: string;
  submitted: boolean;
  submissionNotes?: string;
  submittedAt?: string;
}

const StudentHome: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    try {
      // Pass student email to get only their queries
      const email = user?.email;
      const url = email 
        ? `/api/student/notifications?studentEmail=${encodeURIComponent(email)}`
        : "/api/student/notifications";
      
      console.log('Fetching student notifications from:', url);
      const res = await axios.get(url);
      console.log('Student notifications response:', res.data);
      
      const data = res.data;
      if (Array.isArray(data)) {
        setNotifications(data);
      } else if (data && typeof data === "object") {
        // handle common envelope shapes
        if (Array.isArray((data as any).notifications)) {
          setNotifications((data as any).notifications);
        } else if (Array.isArray((data as any).items)) {
          setNotifications((data as any).items);
        } else {
          // single object -> wrap in array
          setNotifications([data as Notification]);
        }
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error('Error fetching student notifications:', err);
    }
  };

  const clearNotification = async (id: string) => {
    try {
      const email = user?.email;
      const url = email 
        ? `/api/student/notifications/${id}?studentEmail=${encodeURIComponent(email)}`
        : `/api/student/notifications/${id}`;
      
      console.log('Clearing student notification:', id, 'from:', url);
      await axios.delete(url);
      console.log('Student notification cleared successfully');
      // Refresh notifications after clearing
      await fetchNotifications();
    } catch (err) {
      console.error('Error clearing student notification:', err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const email = user?.email;
      if (!email) return;
      
      console.log('Fetching assignments for student:', email);
      const res = await axios.get(`/api/student/assignments?studentEmail=${encodeURIComponent(email)}`);
      console.log('Assignments response:', res.data);
      
      if (Array.isArray(res.data)) {
        setAssignments(res.data);
      }
    } catch (err) {
      console.error('Error fetching assignments:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchAssignments();
    
    // Auto-refresh every 30 seconds to check for new replies and assignments
    const interval = setInterval(() => {
      fetchNotifications();
      fetchAssignments();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [user?.email]); // Re-fetch when user email changes

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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium mr-3">
                                  Your Query
                                </div>
                                <span className="text-xs text-gray-500">
                                  {n.date}
                                </span>
                              </div>
                              <button
                                onClick={() => clearNotification(n.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1"
                                title="Clear notification"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            <p className="text-gray-800 font-medium leading-relaxed mb-2">
                              "{n.message}"
                            </p>
                            {n.reply && n.reply.trim() !== '' && (
                              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center mb-1">
                                  <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium mr-2">
                                    Teacher Reply
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    Answered
                                  </span>
                                </div>
                                <p className="text-gray-800 leading-relaxed">
                                  "{n.reply}"
                                </p>
                              </div>
                            )}
                            {(!n.reply || n.reply.trim() === '') && (
                              <div className="mt-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
                                  Awaiting Response
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Assignments Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-8 py-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">
                  Assignments
                </h2>
                <p className="text-gray-600 mt-1">
                  Your assigned tasks and submissions
                </p>
              </div>

              <div className="p-8">
                {assignments.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-50 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    </div>
                    <p className="text-gray-500 font-medium">
                      No assignments yet.
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Check back later for new assignments!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="bg-gradient-to-r from-gray-50 to-emerald-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium mr-3">
                                  {assignment.subjectId}
                                </div>
                                <span className="text-xs text-gray-500">
                                  {new Date(assignment.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center">
                                {assignment.submitted ? (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                    Submitted
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
                                    Pending
                                  </span>
                                )}
                              </div>
                            </div>
                            <h3 className="text-gray-800 font-semibold text-lg mb-2">
                              {assignment.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed mb-3">
                              {assignment.description}
                            </p>
                            {assignment.submitted && assignment.submissionNotes && (
                              <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-sm text-green-700 font-medium mb-1">
                                  Your Submission:
                                </p>
                                <p className="text-sm text-green-600">
                                  "{assignment.submissionNotes}"
                                </p>
                                <p className="text-xs text-green-500 mt-1">
                                  Submitted on: {new Date(assignment.submittedAt!).toLocaleString()}
                                </p>
                              </div>
                            )}
                            <div className="mt-4">
                              <Link
                                to={`/student/assignment/${assignment.id}`}
                                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                              >
                                {assignment.submitted ? 'View Submission' : 'Submit Assignment'}
                              </Link>
                            </div>
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
                    to="/student/link"
                    className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:from-indigo-100 hover:to-purple-100 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="bg-emerald-500 rounded-lg p-2 mr-4">
                      <div className="w-5 h-5 bg-white rounded"></div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 group-hover:text-emerald-700">
                        Link Teacher
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Tell us who your teacher is
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

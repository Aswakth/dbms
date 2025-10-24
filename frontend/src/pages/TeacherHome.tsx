// src/pages/TeacherHome.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../firebase/AuthProvider";

interface QueryNotification {
  id: string;
  studentName: string;
  query: string;
  date: string;
  reply?: string; // Add reply field
}

interface AssignmentSubmission {
  id: number;
  studentName: string;
  assignmentTitle: string;
  subjectId: string;
  submissionNotes?: string;
  submittedAt: string;
  filePath?: string;
}

const TeacherHome: React.FC = () => {
  const [notifications, setNotifications] = useState<QueryNotification[]>([]);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState<AssignmentSubmission[]>([]);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    try {
      const email = user?.email;
      const url = email 
        ? `/api/teacher/notifications?teacherEmail=${encodeURIComponent(email)}`
        : "/api/teacher/notifications";
      
      console.log('Fetching notifications from:', url);
      const res = await axios.get(url);
      console.log('Notifications response:', res.data);
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const clearNotification = async (id: string) => {
    try {
      const email = user?.email;
      const url = email 
        ? `/api/teacher/notifications/${id}?teacherEmail=${encodeURIComponent(email)}`
        : `/api/teacher/notifications/${id}`;
      
      console.log('Clearing notification:', id, 'from:', url);
      await axios.delete(url);
      console.log('Notification cleared successfully');
      // Refresh notifications after clearing
      await fetchNotifications();
    } catch (err) {
      console.error('Error clearing notification:', err);
    }
  };

  const fetchAssignmentSubmissions = async () => {
    try {
      const email = user?.email;
      if (!email) return;
      
      console.log('Fetching assignment submissions for teacher:', email);
      const res = await axios.get(`/api/teacher/assignments/submissions?teacherEmail=${encodeURIComponent(email)}`);
      console.log('Assignment submissions response:', res.data);
      
      if (Array.isArray(res.data)) {
        setAssignmentSubmissions(res.data);
      }
    } catch (err) {
      console.error('Error fetching assignment submissions:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchAssignmentSubmissions();
    
    // Auto-refresh every 30 seconds to check for new queries and submissions
    const interval = setInterval(() => {
      fetchNotifications();
      fetchAssignmentSubmissions();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [user?.email]);

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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium mr-3">
                                  {n.studentName}
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
                            <p className="text-gray-800 leading-relaxed">
                              "{n.query}"
                            </p>
                            {n.reply && n.reply.trim() !== '' && (
                              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center mb-1">
                                  <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium mr-2">
                                    Your Reply
                                  </div>
                                </div>
                                <p className="text-gray-800 leading-relaxed">
                                  "{n.reply}"
                                </p>
                              </div>
                            )}
                          </div>
                          <div className={`ml-4 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            n.reply && n.reply.trim() !== '' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-orange-100 text-orange-600'
                          }`}>
                            {n.reply && n.reply.trim() !== '' ? 'Answered' : 'Pending'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Assignment Submissions Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-8 py-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">
                  Assignment Submissions
                </h2>
                <p className="text-gray-600 mt-1">
                  Student submissions for your assignments
                </p>
              </div>

              <div className="p-8">
                {assignmentSubmissions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-50 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    </div>
                    <p className="text-gray-500 font-medium">
                      No submissions yet.
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Students will appear here when they submit assignments!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assignmentSubmissions.map((submission) => (
                      <div
                        key={submission.id}
                        className="bg-gradient-to-r from-gray-50 to-emerald-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium mr-3">
                                  {submission.subjectId}
                                </div>
                                <span className="text-xs text-gray-500">
                                  {new Date(submission.submittedAt).toLocaleDateString()}
                                </span>
                              </div>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                Submitted
                              </span>
                            </div>
                            <h3 className="text-gray-800 font-semibold text-lg mb-2">
                              {submission.assignmentTitle}
                            </h3>
                            <p className="text-gray-600 mb-2">
                              <span className="font-medium">Student:</span> {submission.studentName}
                            </p>
                            {submission.submissionNotes && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-sm text-blue-700 font-medium mb-1">
                                  Student Notes:
                                </p>
                                <p className="text-sm text-blue-600">
                                  "{submission.submissionNotes}"
                                </p>
                              </div>
                            )}
                            {submission.filePath && (
                              <div className="mt-3">
                                <a
                                  href={`http://localhost:8080/api/files/${submission.filePath}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                  Download Submission File
                                </a>
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

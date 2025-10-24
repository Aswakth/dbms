// src/pages/StudentAttendance.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../firebase/AuthProvider";

interface AttendanceRecord {
  subject: string;
  present: number;
  total: number;
}

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [message, setMessage] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const fetchAttendanceForSubject = async (subject: string) => {
    setLoading(true);
    try {
      const email = user?.email;
      const qs = new URLSearchParams();
      if (email) qs.set("studentEmail", email);
      if (subject) qs.set("subjectId", subject);
      if (teacherEmail) qs.set("teacherEmail", teacherEmail);
      const res = await axios.get(`/api/student/attendance?${qs.toString()}`);
      setAttendance(res.data || []);
      setMessage("");
    } catch (err) {
      console.error(err);
      setMessage("Error fetching attendance.");
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch attendance on component mount
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const email = user?.email;
        const qs = new URLSearchParams();
        if (email) qs.set("studentEmail", email);
        if (teacherEmail) qs.set("teacherEmail", teacherEmail);
        const url = qs.toString()
          ? `/api/student/attendance?${qs.toString()}`
          : "/api/student/attendance";
        const res = await axios.get(url);
        setAttendance(res.data);
      } catch (err) {
        console.error(err);
        setMessage("Error fetching attendance.");
      }
    };
    fetchAttendance();
  }, []);

  const calculatePercentage = (record: AttendanceRecord) =>
    record.total > 0 ? (record.present / record.total) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-8">
            <h2 className="text-3xl font-bold text-white">My Attendance</h2>
            <p className="text-indigo-100 mt-2">
              Track your class attendance and performance
            </p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-4">
              <input
                type="text"
                placeholder="Subject ID (e.g. Math-101)"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full max-w-sm px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-700 font-medium"
              />
              <input
                type="text"
                placeholder="Teacher Email (optional)"
                value={teacherEmail}
                onChange={(e) => setTeacherEmail(e.target.value)}
                className="w-full max-w-sm px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-700 font-medium"
              />
              <button
                onClick={() => fetchAttendanceForSubject(subjectId)}
                disabled={!subjectId || loading}
                className="inline-flex items-center px-4 py-3 bg-indigo-600 text-white rounded-xl shadow-sm hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Fetching..." : "Fetch Attendance"}
              </button>
            </div>

            {message && (
              <div className="mb-6 p-4 rounded-lg text-sm font-medium bg-red-50 text-red-700 border border-red-200">
                {message}
              </div>
            )}

            {attendance.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-50 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                </div>
                <p className="text-gray-500 text-lg font-medium">
                  No attendance records found
                  {subjectId ? ` for subject ${subjectId}` : ""}.
                </p>
                <p className="text-gray-400 mt-2">
                  Enter a Subject ID and click "Fetch Attendance" to view
                  records.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200">
                {/* Show summary percentage for the selected subject (if single subject fetched) */}
                {subjectId && attendance.length === 1 && (
                  <div className="p-6 bg-gradient-to-r from-indigo-50 to-white border-b border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-700">
                      Subject {attendance[0].subject}
                    </h4>
                    <div className="text-3xl font-bold text-indigo-600 mt-2">
                      {(
                        (attendance[0].present / attendance[0].total) *
                        100
                      ).toFixed(2)}
                      %
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Present {attendance[0].present} / {attendance[0].total}
                    </div>
                  </div>
                )}
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                        Subject
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">
                        Present
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">
                        Total
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">
                        Percentage
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {attendance.map((record) => {
                      const percentage = calculatePercentage(record);
                      return (
                        <tr
                          key={record.subject}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {record.subject}
                          </td>
                          <td className="px-6 py-4 text-sm text-center text-gray-700">
                            {record.present}
                          </td>
                          <td className="px-6 py-4 text-sm text-center text-gray-700">
                            {record.total}
                          </td>
                          <td className="px-6 py-4 text-sm text-center">
                            <span
                              className={`font-semibold ${
                                percentage >= 75
                                  ? "text-emerald-600"
                                  : "text-red-600"
                              }`}
                            >
                              {percentage.toFixed(2)}%
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-center">
                            {percentage < 75 ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                Attendance Shortage
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                                OK
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;

// src/pages/StudentAttendance.tsx
import { useState, useEffect } from "react";
import axios from "axios";

interface AttendanceRecord {
  subject: string;
  present: number;
  total: number;
}

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [message, setMessage] = useState("");

  // Fetch attendance on component mount
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get("/api/student/attendance");
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
                  No attendance records found.
                </p>
                <p className="text-gray-400 mt-2">
                  Your attendance data will appear here once available.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200">
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

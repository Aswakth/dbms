// src/pages/TeacherAttendance.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";

interface Student {
  id: string;
  name: string;
  present: boolean;
}

const TeacherAttendance = () => {
  const [classId, setClassId] = useState("");
  const [date, setDate] = useState(""); // yyyy-mm-dd
  const [students, setStudents] = useState<Student[]>([]);
  const [message, setMessage] = useState("");

  // Fetch students for a particular class and date
  const fetchStudents = async () => {
    if (!classId || !date) {
      setMessage("Please enter class ID and date.");
      return;
    }

    try {
      const res = await axios.get(
        `/api/classes/${classId}/students?date=${date}`
      );

      // Initialize attendance as false or use existing data
      const studentData = res.data.map((s: any) => ({
        ...s,
        present: s.present || false,
      }));

      setStudents(studentData);
      setMessage("");
    } catch (err) {
      console.error(err);
      setMessage("Error fetching students.");
    }
  };

  // Toggle attendance for a student
  const handleToggle = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, present: !s.present } : s))
    );
  };

  // Submit attendance to backend
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!classId || !date || students.length === 0) {
      setMessage("Fetch students first.");
      return;
    }

    try {
      await axios.post(`/api/classes/${classId}/attendance`, {
        date,
        attendance: students.map((s) => ({ id: s.id, present: s.present })),
      });
      setMessage("Attendance submitted successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error submitting attendance.");
    }
  };

  const presentCount = students.filter((s) => s.present).length;
  const totalCount = students.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-8">
            <h2 className="text-3xl font-bold text-white">
              Mark Attendance by Date
            </h2>
            <p className="text-indigo-100 mt-2">
              Track student attendance for your classes
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

            <div className="bg-gradient-to-r from-gray-50 to-indigo-50 p-6 rounded-xl border border-gray-200 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Class Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Class ID
                  </label>
                  <input
                    type="text"
                    placeholder="Enter class identifier"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              <button
                onClick={fetchStudents}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                Fetch Students
              </button>
            </div>

            {students.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Attendance Summary
                    </h3>
                    <p className="text-sm text-gray-600">
                      Mark students as present or absent
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600">
                      {presentCount}/{totalCount}
                    </div>
                    <div className="text-xs text-gray-500">Present/Total</div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                      <h4 className="font-semibold text-gray-700">
                        Student List
                      </h4>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {students.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <span className="font-medium text-gray-800">
                            {s.name}
                          </span>
                          <label className="flex items-center cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={s.present}
                              onChange={() => handleToggle(s.id)}
                              className="sr-only"
                            />
                            <div
                              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                                s.present ? "bg-emerald-500" : "bg-gray-300"
                              } group-hover:shadow-md`}
                            >
                              <div
                                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                                  s.present ? "translate-x-6" : "translate-x-0"
                                }`}
                              ></div>
                            </div>
                            <span
                              className={`ml-3 text-sm font-medium ${
                                s.present ? "text-emerald-600" : "text-gray-500"
                              }`}
                            >
                              {s.present ? "Present" : "Absent"}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                  >
                    Submit Attendance
                  </button>
                </form>
              </div>
            )}

            {students.length === 0 && classId && date && (
              <div className="text-center py-16">
                <div className="bg-gray-50 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                </div>
                <p className="text-gray-500 text-lg font-medium">
                  No students found
                </p>
                <p className="text-gray-400 mt-2">
                  Check your class ID and try again
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;

// src/pages/TeacherResultUpload.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";

interface Student {
  id: string;
  name: string;
}

const TeacherResultUpload = () => {
  const [classId, setClassId] = useState("");
  const [semester, setSemester] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [marks, setMarks] = useState("");
  const [message, setMessage] = useState("");

  // Fetch students for a class
  const fetchStudents = async () => {
    if (!classId || !semester) {
      setMessage("Please enter Class ID and select Semester.");
      return;
    }

    try {
      const res = await axios.get(
        `/api/classes/${classId}/students?semester=${semester}`
      );
      setStudents(res.data);
      setMessage("");
    } catch (err) {
      console.error(err);
      setMessage("Error fetching students.");
    }
  };

  // Submit result for selected student
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !marks) {
      setMessage("Select a student and enter marks.");
      return;
    }

    try {
      await axios.post(`/api/students/${selectedStudentId}/results`, {
        semester,
        marks: Number(marks),
      });
      setMessage("Result uploaded successfully!");
      setSelectedStudentId("");
      setMarks("");
    } catch (err) {
      console.error(err);
      setMessage("Error uploading result.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-8">
            <h2 className="text-3xl font-bold text-white">
              Upload Result for a Student
            </h2>
            <p className="text-indigo-100 mt-2">
              Enter and publish student exam results
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

            {/* Class and Semester Selection */}
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
                    Semester
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-700 font-medium"
                  >
                    <option value="">Select Semester</option>
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                    <option value="3">Semester 3</option>
                    <option value="4">Semester 4</option>
                    <option value="5">Semester 5</option>
                    <option value="6">Semester 6</option>
                    <option value="7">Semester 7</option>
                    <option value="8">Semester 8</option>
                  </select>
                </div>
              </div>
              <button
                onClick={fetchStudents}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                Fetch Students
              </button>
            </div>

            {/* Student Result Form */}
            {students.length > 0 && (
              <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 p-6 rounded-xl border border-emerald-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Enter Results
                </h3>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600">
                    Found {students.length} students in this class
                  </p>
                  <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
                    Ready to Upload
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Select Student
                      </label>
                      <select
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-700 font-medium"
                      >
                        <option value="">Select Student</option>
                        {students.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Marks Obtained
                      </label>
                      <input
                        type="number"
                        placeholder="Enter marks (e.g., 85)"
                        value={marks}
                        onChange={(e) => setMarks(e.target.value)}
                        min="0"
                        max="100"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      />
                      <p className="text-xs text-gray-500">
                        Enter marks out of 100
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold py-4 rounded-xl hover:from-emerald-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                  >
                    Upload Result
                  </button>
                </form>
              </div>
            )}

            {/* Empty State */}
            {students.length === 0 && classId && semester && (
              <div className="text-center py-16">
                <div className="bg-gray-50 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                </div>
                <p className="text-gray-500 text-lg font-medium">
                  No students found
                </p>
                <p className="text-gray-400 mt-2">
                  Check your class ID and semester, then try again
                </p>
              </div>
            )}

            {/* Instructions */}
            <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                📋 Instructions:
              </h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Enter the correct Class ID to fetch enrolled students</li>
                <li>• Select the appropriate semester for the results</li>
                <li>• Choose individual students to upload their marks</li>
                <li>
                  • Enter marks as numbers (0-100) for accurate calculation
                </li>
                <li>• Results will be immediately available to students</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherResultUpload;

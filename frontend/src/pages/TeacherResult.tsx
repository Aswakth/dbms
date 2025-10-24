// src/pages/TeacherResult.tsx
import { useState } from "react";
import { useAuth } from "../firebase/AuthProvider";
import type { FormEvent } from "react";
import axios from "axios";

interface Student {
  id: string;
  name: string;
  marks: number | string; // ✅ FIXED: allow both number and string
  maxMarks?: number;
}

const TeacherResult = () => {
  const { user } = useAuth();
  const teacherEmail = user?.email || "";
  const [semester, setSemester] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [message, setMessage] = useState("");

  // Fetch students for a particular class and semester
  const fetchStudents = async () => {
    if (!teacherEmail || !subjectId) {
      setMessage("Please login and enter Subject ID.");
      return;
    }

    try {
      const res = await axios.get(
        `/api/teacher/classes/${encodeURIComponent(
          teacherEmail
        )}/students?subjectId=${encodeURIComponent(subjectId)}`
      );

      // Initialize marks as empty or use existing data
      const studentData = res.data.map((s: any) => ({
        ...s,
        marks: s.marks || "",
        maxMarks: s.maxMarks || 100,
      }));

      setStudents(studentData);
      setMessage("");
    } catch (err) {
      console.error(err);
      setMessage("Error fetching students.");
    }
  };

  // Update marks for a student
  const handleMarksChange = (id: string, marks: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, marks: marks === "" ? "" : Number(marks) } : s
      )
    );
  };

  // Submit results to backend
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!teacherEmail || !subjectId || !semester || students.length === 0) {
      setMessage(
        "Fetch students first and ensure semester is set before submitting."
      );
      return;
    }

    try {
      const resultsData = students
        .filter((s) => s.marks !== "" && s.marks !== undefined)
        .map((s) => ({
          studentId: Number(s.id),
          marks: s.marks,
          maxMarks: s.maxMarks || 100,
        }));

      if (resultsData.length === 0) {
        setMessage("Please enter marks for at least one student.");
        return;
      }

      await axios.post(
        `/api/teacher/classes/${encodeURIComponent(
          teacherEmail
        )}/results?subjectId=${encodeURIComponent(subjectId)}`,
        {
          semester,
          results: resultsData,
        }
      );
      setMessage("Results submitted successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error submitting results.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-8">
            <h2 className="text-3xl font-bold text-white">Enter Student Results</h2>
            <p className="text-indigo-100 mt-2">
              Enter and publish student exam results for your class
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Teacher (logged in)
                  </label>
                  <input
                    type="email"
                    value={teacherEmail}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none transition-all duration-200 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Subject ID
                  </label>
                  <input
                    type="text"
                    placeholder="Enter subject id"
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
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

            {students.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl border border-emerald-200">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Results Summary
                    </h3>
                    <p className="text-sm text-gray-600">
                      Enter marks for each student
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600">
                      {
                        students.filter(
                          (s) => s.marks !== "" && s.marks !== undefined
                        ).length
                      }
                      /{students.length}
                    </div>
                    <div className="text-xs text-gray-500">
                      Marks Entered/Total
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                      <h4 className="font-semibold text-gray-700">
                        Student Results
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
                          <div className="flex items-center space-x-3">
                            <input
                              type="number"
                              placeholder="Marks"
                              value={s.marks === "" ? "" : s.marks}
                              onChange={(e) =>
                                handleMarksChange(s.id, e.target.value)
                              }
                              min="0"
                              max="100"
                              className="w-20 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-center"
                            />
                            <span className="text-sm text-gray-500">/100</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold py-4 rounded-xl hover:from-emerald-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                  >
                    Submit Results
                  </button>
                </form>
              </div>
            )}

            {students.length === 0 && teacherEmail && subjectId && (
              <div className="text-center py-16">
                <div className="bg-gray-50 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                </div>
                <p className="text-gray-500 text-lg font-medium">
                  No students found
                </p>
                <p className="text-gray-400 mt-2">
                  Check your Subject ID and try again
                </p>
              </div>
            )}

            {/* Instructions */}
            <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                📋 Instructions:
              </h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Enter the correct Subject ID to fetch enrolled students</li>
                <li>• Select the appropriate semester for the results</li>
                <li>• Enter marks for each student (0-100)</li>
                <li>• Results will be immediately available to students</li>
                <li>• You can submit results for multiple students at once</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherResult;

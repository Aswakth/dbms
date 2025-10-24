// src/pages/StudentResult.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../firebase/AuthProvider";

interface ResultRecord {
  subject: string;
  semester: string;
  marks: number;
  maxMarks: number;
}

const StudentResult = () => {
  const [results, setResults] = useState<ResultRecord[]>([]);
  const [message, setMessage] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const fetchResultsForSubject = async (subject: string) => {
    setLoading(true);
    try {
      const email = user?.email;
      const qs = new URLSearchParams();
      if (email) qs.set("studentEmail", email);
      if (subject) qs.set("subjectId", subject);
      if (teacherEmail) qs.set("teacherEmail", teacherEmail);
      const res = await axios.get(`/api/student/results?${qs.toString()}`);
      setResults(res.data || []);
      setMessage("");
    } catch (err) {
      console.error(err);
      setMessage("Error fetching results.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch results on component mount
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const email = user?.email;
        const qs = new URLSearchParams();
        if (email) qs.set("studentEmail", email);
        if (teacherEmail) qs.set("teacherEmail", teacherEmail);
        const url = qs.toString()
          ? `/api/student/results?${qs.toString()}`
          : "/api/student/results";
        const res = await axios.get(url);
        setResults(res.data);
      } catch (err) {
        console.error(err);
        setMessage("Error fetching results.");
      }
    };
    fetchResults();
  }, []);

  const calculatePercentage = (record: ResultRecord) =>
    record.maxMarks ? (record.marks / record.maxMarks) * 100 : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-8">
            <h2 className="text-3xl font-bold text-white">My Results</h2>
            <p className="text-indigo-100 mt-2">
              View your academic performance by semester
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
                onClick={() => fetchResultsForSubject(subjectId)}
                disabled={!subjectId || loading}
                className="inline-flex items-center px-4 py-3 bg-indigo-600 text-white rounded-xl shadow-sm hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Fetching..." : "Fetch Results"}
              </button>
            </div>

            {message && (
              <div className="mb-6 p-4 rounded-lg text-sm font-medium bg-red-50 text-red-700 border border-red-200">
                {message}
              </div>
            )}

            {results.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-gray-200">
                {/* Show summary for the selected subject (if single subject fetched) */}
                {subjectId && results.length === 1 && (
                  <div className="p-6 bg-gradient-to-r from-indigo-50 to-white border-b border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-700">
                      Subject {results[0].subject}
                    </h4>
                    <div className="text-3xl font-bold text-indigo-600 mt-2">
                      {results[0].marks}/{results[0].maxMarks}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {calculatePercentage(results[0])?.toFixed(2)}% - {results[0].semester}
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
                        Semester
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">
                        Marks
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">
                        Percentage
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">
                        Grade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {results.map((r) => {
                      const percentage = calculatePercentage(r);
                      const getGrade = (pct: number) => {
                        if (pct >= 90) return "A+";
                        if (pct >= 80) return "A";
                        if (pct >= 70) return "B+";
                        if (pct >= 60) return "B";
                        if (pct >= 50) return "C";
                        return "F";
                      };
                      const getGradeColor = (pct: number) => {
                        if (pct >= 80) return "text-emerald-600";
                        if (pct >= 60) return "text-amber-600";
                        return "text-red-600";
                      };
                      return (
                        <tr
                          key={`${r.subject}-${r.semester}`}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {r.subject}
                          </td>
                          <td className="px-6 py-4 text-sm text-center text-gray-700">
                            {r.semester}
                          </td>
                          <td className="px-6 py-4 text-sm text-center">
                            <span className="font-semibold text-gray-700">
                              {r.marks}
                            </span>
                            <span className="text-gray-500">
                              /{r.maxMarks}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-center">
                            <span
                              className={`font-semibold ${
                                percentage && percentage >= 80
                                  ? "text-emerald-600"
                                  : percentage && percentage >= 60
                                  ? "text-amber-600"
                                  : "text-red-600"
                              }`}
                            >
                              {percentage?.toFixed(2)}%
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-center">
                            <span
                              className={`font-bold ${getGradeColor(percentage || 0)}`}
                            >
                              {percentage ? getGrade(percentage) : "N/A"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : subjectId ? (
              <div className="text-center py-16">
                <div className="bg-gray-50 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                </div>
                <p className="text-gray-500 text-lg font-medium">
                  No results found for subject {subjectId}.
                </p>
                <p className="text-gray-400 mt-2">
                  Results may not be available yet or will be published soon.
                </p>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
                  <div className="bg-indigo-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
                    <div className="w-10 h-10 bg-indigo-500 rounded-full"></div>
                  </div>
                  <p className="text-gray-700 text-lg font-medium">
                    Enter a Subject ID to view results
                  </p>
                  <p className="text-gray-500 mt-2">
                    Provide the Subject ID (e.g. Math-101) and optionally Teacher Email to view results
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentResult;

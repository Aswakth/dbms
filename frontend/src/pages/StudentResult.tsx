// src/pages/StudentResult.tsx
import { useState, useEffect } from "react";
import axios from "axios";

interface ResultRecord {
  subject: string;
  semester: string;
  marks: number;
  maxMarks: number; // optional, for percentage
}

const StudentResult = () => {
  const [semester, setSemester] = useState("");
  const [results, setResults] = useState<ResultRecord[]>([]);
  const [message, setMessage] = useState("");

  // Fetch results whenever semester changes
  useEffect(() => {
    if (!semester) return;

    const fetchResults = async () => {
      try {
        const res = await axios.get(
          `/api/student/results?semester=${semester}`
        );
        setResults(res.data);
        setMessage("");
      } catch (err) {
        console.error(err);
        setMessage("Error fetching results.");
      }
    };

    fetchResults();
  }, [semester]);

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
            {message && (
              <div className="mb-6 p-4 rounded-lg text-sm font-medium bg-red-50 text-red-700 border border-red-200">
                {message}
              </div>
            )}

            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full max-w-sm px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-700 font-medium"
              >
                <option value="">--Select Semester--</option>
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

            {results.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                        Subject
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">
                        Marks
                      </th>
                      {results[0].maxMarks && (
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">
                          Percentage
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {results.map((r) => {
                      const percentage = calculatePercentage(r);
                      return (
                        <tr
                          key={r.subject}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {r.subject}
                          </td>
                          <td className="px-6 py-4 text-sm text-center">
                            <span className="font-semibold text-gray-700">
                              {r.marks}
                            </span>
                            {r.maxMarks && (
                              <span className="text-gray-500">
                                /{r.maxMarks}
                              </span>
                            )}
                          </td>
                          {r.maxMarks && (
                            <td className="px-6 py-4 text-sm text-center">
                              <span
                                className={`font-semibold ${
                                  percentage && percentage >= 75
                                    ? "text-emerald-600"
                                    : percentage && percentage >= 60
                                    ? "text-amber-600"
                                    : percentage && percentage >= 40
                                    ? "text-orange-600"
                                    : "text-red-600"
                                }`}
                              >
                                {percentage?.toFixed(2)}%
                              </span>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : semester ? (
              <div className="text-center py-16">
                <div className="bg-gray-50 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                </div>
                <p className="text-gray-500 text-lg font-medium">
                  No results found for semester {semester}.
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
                    Please select a semester
                  </p>
                  <p className="text-gray-500 mt-2">
                    Choose a semester from the dropdown to view your results
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

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
        const res = await axios.get(`/api/student/results?semester=${semester}`);
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
    <div>
      <h2>My Results</h2>
      {message && <p>{message}</p>}

      <div>
        <label>
          Select Semester:
          <select value={semester} onChange={(e) => setSemester(e.target.value)}>
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
        </label>
      </div>

      {results.length > 0 ? (
        <table border={1} cellPadding={5} style={{ marginTop: "10px" }}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Marks</th>
              {results[0].maxMarks && <th>Percentage</th>}
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.subject}>
                <td>{r.subject}</td>
                <td>{r.marks}</td>
                {r.maxMarks && (
                  <td>{calculatePercentage(r)?.toFixed(2)}%</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : semester ? (
        <p>No results found for semester {semester}.</p>
      ) : (
        <p>Please select a semester.</p>
      )}
    </div>
  );
};

export default StudentResult;

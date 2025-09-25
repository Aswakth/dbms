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
      await axios.post(
        `/api/students/${selectedStudentId}/results`,
        {
          semester,
          marks: Number(marks),
        }
      );
      setMessage("Result uploaded successfully!");
      setSelectedStudentId("");
      setMarks("");
    } catch (err) {
      console.error(err);
      setMessage("Error uploading result.");
    }
  };

  return (
    <div>
      <h2>Upload Result for a Student</h2>
      {message && <p>{message}</p>}

      <div>
        <input
          type="text"
          placeholder="Class ID"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
        />
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
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
        <button onClick={fetchStudents}>Fetch Students</button>
      </div>

      {students.length > 0 && (
        <form onSubmit={handleSubmit}>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
          >
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Enter Marks"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
          />

          <button type="submit">Upload Result</button>
        </form>
      )}
    </div>
  );
};

export default TeacherResultUpload;

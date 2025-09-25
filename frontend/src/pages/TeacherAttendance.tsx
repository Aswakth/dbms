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

  return (
    <div>
      <h2>Mark Attendance by Date</h2>
      {message && <p>{message}</p>}

      <div>
        <input
          type="text"
          placeholder="Class ID"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={fetchStudents}>Fetch Students</button>
      </div>

      {students.length > 0 && (
        <form onSubmit={handleSubmit}>
          <ul>
            {students.map((s) => (
              <li key={s.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={s.present}
                    onChange={() => handleToggle(s.id)}
                  />
                  {s.name}
                </label>
              </li>
            ))}
          </ul>
          <button type="submit">Submit Attendance</button>
        </form>
      )}
    </div>
  );
};

export default TeacherAttendance;

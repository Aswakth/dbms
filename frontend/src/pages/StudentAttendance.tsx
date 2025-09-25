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
    <div>
      <h2>My Attendance</h2>
      {message && <p>{message}</p>}

      {attendance.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <table border={1} cellPadding={5}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Present</th>
              <th>Total</th>
              <th>Percentage</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record) => {
              const percentage = calculatePercentage(record);
              return (
                <tr key={record.subject}>
                  <td>{record.subject}</td>
                  <td>{record.present}</td>
                  <td>{record.total}</td>
                  <td>{percentage.toFixed(2)}%</td>
                  <td>
                    {percentage < 75 ? (
                      <span style={{ color: "red" }}>Attendance Shortage</span>
                    ) : (
                      <span>OK</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentAttendance;

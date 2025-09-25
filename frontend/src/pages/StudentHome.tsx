// src/pages/StudentHome.tsx
import React from "react";
import { Link } from "react-router-dom";

interface Notification {
  id: string;
  message: string;
  date: string;
}

// Hardcoded notifications for now (simulate backend)
const mockNotifications: Notification[] = [
  { id: "1", message: "Assignment 3 is due tomorrow!", date: "2025-09-25" },
  { id: "2", message: "New result uploaded for Semester 1", date: "2025-09-24" },
  { id: "3", message: "Attendance for Physics updated", date: "2025-09-23" },
];

const StudentHome: React.FC = () => {
  const notifications = mockNotifications;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Hello, Student!</h1>
      <p>Welcome to your Student Portal.</p>

      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        <ul>
          {notifications.map((n) => (
            <li key={n.id}>
              <strong>{n.date}:</strong> {n.message}
            </li>
          ))}
        </ul>
      )}

      <h2>Navigate</h2>
      <ul>
        <li>
          <Link to="/student/assignment">Submit Assignment</Link>
        </li>
        <li>
          <Link to="/student/attendance">View Attendance</Link>
        </li>
        <li>
          <Link to="/student/results">View Results</Link>
        </li>
        <li>
          <Link to="/student/query">Ask a Query</Link>
        </li>
      </ul>
    </div>
  );
};

export default StudentHome;

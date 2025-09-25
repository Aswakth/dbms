// src/pages/TeacherHome.tsx
import React from "react";
import { Link } from "react-router-dom";

interface QueryNotification {
  id: string;
  studentName: string;
  query: string;
  date: string;
}

// Hardcoded query notifications (simulate backend)
const mockQueryNotifications: QueryNotification[] = [
  { id: "1", studentName: "Alice", query: "Can you explain Chapter 3?", date: "2025-09-25" },
  { id: "2", studentName: "Bob", query: "I missed the last class, please share notes.", date: "2025-09-24" },
  { id: "3", studentName: "Charlie", query: "When is the next assignment due?", date: "2025-09-23" },
];

const TeacherHome: React.FC = () => {
  const notifications = mockQueryNotifications;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Hello, Teacher!</h1>
      <p>Welcome to your Teacher Portal.</p>

      <h2>Query Notifications</h2>
      {notifications.length === 0 ? (
        <p>No new queries.</p>
      ) : (
        <ul>
          {notifications.map((n) => (
            <li key={n.id}>
              <strong>{n.date}:</strong> {n.studentName} asked: "{n.query}"
            </li>
          ))}
        </ul>
      )}

      <h2>Navigate</h2>
      <ul>
        <li>
          <Link to="/teacher/assignment">Upload Assignment</Link>
        </li>
        <li>
          <Link to="/teacher/attendance">Give Attendance</Link>
        </li>
        <li>
          <Link to="/teacher/results">Upload Results</Link>
        </li>
        <li>
          <Link to="/teacher/queries">Answer Queries</Link>
        </li>
      </ul>
    </div>
  );
};

export default TeacherHome;

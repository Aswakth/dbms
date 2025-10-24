import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentLinkTeacher: React.FC = () => {
  const [studentEmail, setStudentEmail] = useState("");
  const [studentName, setStudentName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail || !teacherEmail || !subjectId) {
      setMessage("Student email, teacher email and subjectId are required.");
      return;
    }
    try {
      await axios.post("/api/student/link-teacher", {
        studentEmail,
        studentName,
        teacherEmail,
        teacherName,
        subjectId,
      });
      setMessage("Linked successfully");
      setTimeout(() => navigate("/student"), 800);
    } catch (err) {
      console.error(err);
      setMessage("Failed to link.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-indigo-50">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white p-6 rounded shadow"
      >
        <h2 className="text-lg font-bold mb-4">Register / Link to Teacher</h2>
        <label className="block text-sm text-gray-700">Student Email</label>
        <input
          value={studentEmail}
          onChange={(e) => setStudentEmail(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <label className="block text-sm text-gray-700">
          Student Name (optional)
        </label>
        <input
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />

        <label className="block text-sm text-gray-700">Teacher Email</label>
        <input
          value={teacherEmail}
          onChange={(e) => setTeacherEmail(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <label className="block text-sm text-gray-700">
          Teacher Name (optional)
        </label>
        <input
          value={teacherName}
          onChange={(e) => setTeacherName(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <label className="block text-sm text-gray-700">
          Subject ID (required)
        </label>
        <input
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <button className="w-full bg-indigo-600 text-white py-2 rounded">
          Link
        </button>
        {message && <p className="mt-3 text-sm text-center">{message}</p>}
      </form>
    </div>
  );
};

export default StudentLinkTeacher;

// src/pages/StudentAssignment.tsx
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";

const StudentAssignment = () => {
  const [classId, setClassId] = useState("");
  const [assignmentId, setAssignmentId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Submit the assignment
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!classId || !assignmentId || !file) {
      setMessage("Please select class, assignment, and file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("classId", classId);
    formData.append("assignmentId", assignmentId);

    try {
      await axios.post("/api/student/assignments/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Assignment submitted successfully!");
      setFile(null);
      setClassId("");
      setAssignmentId("");
    } catch (err) {
      console.error(err);
      setMessage("Error submitting assignment.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-200 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Submit Assignment</h2>
      {message && (
        <p className="mb-4 text-center text-sm text-gray-700">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Class ID"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Assignment ID"
          value={assignmentId}
          onChange={(e) => setAssignmentId(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="border border-gray-300 rounded-md p-2 file:border-0 file:bg-blue-500 file:text-white file:px-3 file:py-1 file:rounded-md cursor-pointer"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Submit Assignment
        </button>
      </form>
    </div>
  );
};

export default StudentAssignment;

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
    <div>
      <h2>Submit Assignment</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Class ID"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Assignment ID"
          value={assignmentId}
          onChange={(e) => setAssignmentId(e.target.value)}
        />
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Submit Assignment</button>
      </form>
    </div>
  );
};

export default StudentAssignment;

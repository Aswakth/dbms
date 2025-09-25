// src/pages/StudentQuery.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";

const StudentQuery = () => {
  const [teacherId, setTeacherId] = useState("");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!teacherId || !query) {
      setMessage("Please select a teacher and enter your query.");
      return;
    }

    try {
      await axios.post(`/api/student/queries`, {
        teacherId,
        message: query,
      });
      setMessage("Query submitted successfully!");
      setTeacherId("");
      setQuery("");
    } catch (err) {
      console.error(err);
      setMessage("Error submitting query.");
    }
  };

  return (
    <div>
      <h2>Ask a Query</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Teacher ID or Email"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
        />
        <textarea
          placeholder="Enter your query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Submit Query</button>
      </form>
    </div>
  );
};

export default StudentQuery;

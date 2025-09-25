// src/pages/TeacherQueries.tsx
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import axios from "axios";

interface Query {
  id: string;
  studentName: string;
  message: string;
  date: string;
  reply?: string;
}

const TeacherQueries = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [replyMap, setReplyMap] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState("");

  // Fetch all queries on component mount
  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const res = await axios.get("/api/teacher/queries");
      setQueries(res.data);
      setMessage("");
    } catch (err) {
      console.error(err);
      setMessage("Error fetching queries.");
    }
  };

  const handleReplyChange = (id: string, value: string) => {
    setReplyMap((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent, queryId: string) => {
    e.preventDefault();
    const reply = replyMap[queryId];
    if (!reply) {
      setMessage("Reply cannot be empty.");
      return;
    }

    try {
      await axios.post(`/api/teacher/queries/${queryId}/reply`, { reply });
      setMessage("Reply submitted successfully!");
      // Optionally update local query with reply
      setQueries((prev) =>
        prev.map((q) => (q.id === queryId ? { ...q, reply } : q))
      );
      setReplyMap((prev) => ({ ...prev, [queryId]: "" }));
    } catch (err) {
      console.error(err);
      setMessage("Error submitting reply.");
    }
  };

  return (
    <div>
      <h2>Student Queries</h2>
      {message && <p>{message}</p>}

      {queries.length === 0 ? (
        <p>No queries found.</p>
      ) : (
        <ul>
          {queries.map((q) => (
            <li key={q.id} style={{ marginBottom: "20px" }}>
              <strong>{q.studentName}</strong> ({q.date}):
              <p>{q.message}</p>
              {q.reply ? (
                <p>
                  <strong>Reply:</strong> {q.reply}
                </p>
              ) : (
                <form onSubmit={(e) => handleSubmit(e, q.id)}>
                  <input
                    type="text"
                    placeholder="Enter reply"
                    value={replyMap[q.id] || ""}
                    onChange={(e) =>
                      handleReplyChange(q.id, e.target.value)
                    }
                  />
                  <button type="submit">Submit Reply</button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TeacherQueries;

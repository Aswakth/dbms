import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import axios from "axios";

const AssignmentUpload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !description || !file) {
      setMessage("Please fill all fields and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);

    try {
      // Replace with your backend endpoint
      const res = await axios.post("/api/assignments/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Assignment uploaded successfully!");
      setTitle("");
      setDescription("");
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage("Error uploading assignment.");
    }
  };

  return (
    <div>
      <h2>Upload Assignment</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <input type="file" onChange={handleFileChange} />
        <br />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default AssignmentUpload;

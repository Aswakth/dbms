import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState<string>(
    localStorage.getItem("role") || "student"
  );
  const navigate = useNavigate();

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      // remember chosen role locally as a fallback when custom claims are not present
      localStorage.setItem("role", role);
      setMessage("Logged in");
      // redirect to selected dashboard
      if (role === "teacher") navigate("/teacher");
      else navigate("/student");
    } catch (err) {
      console.error(err);
      setMessage("Login failed: " + ((err as any)?.message || ""));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-cyan-50">
      <form
        onSubmit={handle}
        className="w-full max-w-md p-8 bg-white rounded shadow"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Sign in to Your Portal
        </h2>

        <label className="block text-sm font-medium text-gray-700">Role</label>
        <div className="flex gap-4 mb-4">
          <label
            className={`flex-1 p-2 border rounded ${
              role === "student" ? "bg-indigo-50 border-indigo-300" : "bg-white"
            }`}
          >
            <input
              type="radio"
              name="role"
              value="student"
              checked={role === "student"}
              onChange={() => setRole("student")}
            />{" "}
            Student
          </label>
          <label
            className={`flex-1 p-2 border rounded ${
              role === "teacher" ? "bg-indigo-50 border-indigo-300" : "bg-white"
            }`}
          >
            <input
              type="radio"
              name="role"
              value="teacher"
              checked={role === "teacher"}
              onChange={() => setRole("teacher")}
            />{" "}
            Teacher
          </label>
        </div>

        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="block w-full mb-3 p-2 border rounded"
        />

        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="block w-full mb-4 p-2 border rounded"
        />

        <button className="w-full bg-blue-600 text-white px-4 py-2 rounded">
          Login
        </button>
        {message && (
          <p className="mt-2 text-center text-sm text-red-600">{message}</p>
        )}

        <p className="mt-4 text-xs text-gray-500">
          Note: If you haven't set roles via Firebase custom claims, the
          selected role is used locally for routing.
        </p>
      </form>
    </div>
  );
};

export default Login;

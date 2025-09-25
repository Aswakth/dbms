// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Student Pages
import StudentHome from "./pages/StudentHome";
import StudentAssignment from "./pages/StudentAssignment";
import StudentAttendance from "./pages/StudentAttendance";
import StudentResult from "./pages/StudentResult";
import StudentQuery from "./pages/StudentQuery";

// Teacher Pages
import TeacherHome from "./pages/TeacherHome";
import TeacherAssignment from "./pages/TeacherAssignment";
import TeacherAttendance from "./pages/TeacherAttendance";
import TeacherResults from "./pages/TeacherResult";
import TeacherQueries from "./pages/TeacherQueries";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Student Routes */}
        <Route path="/student" element={<StudentHome />} />
        <Route path="/student/assignment" element={<StudentAssignment />} />
        <Route path="/student/attendance" element={<StudentAttendance />} />
        <Route path="/student/results" element={<StudentResult />} />
        <Route path="/student/query" element={<StudentQuery />} />

        {/* Teacher Routes */}
        <Route path="/teacher" element={<TeacherHome />} />
        <Route path="/teacher/assignment" element={<TeacherAssignment />} />
        <Route path="/teacher/attendance" element={<TeacherAttendance />} />
        <Route path="/teacher/results" element={<TeacherResults />} />
        <Route path="/teacher/queries" element={<TeacherQueries />} />

        {/* Default Route */}
        <Route path="*" element={<Navigate to="/student" />} />
      </Routes>
    </Router>
  );
};

export default App;

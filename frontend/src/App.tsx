// src/App.tsx
import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./firebase/AuthProvider";
import Login from "./pages/Login";

// Student Pages
import StudentHome from "./pages/StudentHome";
import StudentAssignment from "./pages/StudentAssignment";
import StudentAttendance from "./pages/StudentAttendance";
import StudentResult from "./pages/StudentResult";
import StudentQuery from "./pages/StudentQuery";
import StudentLinkTeacher from "./pages/StudentLinkTeacher";

// Teacher Pages
import TeacherHome from "./pages/TeacherHome";
import TeacherAssignment from "./pages/TeacherAssignment";
import TeacherAttendance from "./pages/TeacherAttendance";
import TeacherResults from "./pages/TeacherResult";
import TeacherQueries from "./pages/TeacherQueries";

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Student Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <StudentHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/assignment"
            element={
              <ProtectedRoute>
                <StudentAssignment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/attendance"
            element={
              <ProtectedRoute>
                <StudentAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/results"
            element={
              <ProtectedRoute>
                <StudentResult />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/query"
            element={
              <ProtectedRoute>
                <StudentQuery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/link"
            element={
              <ProtectedRoute>
                <StudentLinkTeacher />
              </ProtectedRoute>
            }
          />

          {/* Teacher Routes */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute>
                <TeacherHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/assignment"
            element={
              <ProtectedRoute>
                <TeacherAssignment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/attendance"
            element={
              <ProtectedRoute>
                <TeacherAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/results"
            element={
              <ProtectedRoute>
                <TeacherResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/queries"
            element={
              <ProtectedRoute>
                <TeacherQueries />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

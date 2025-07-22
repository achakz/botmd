// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ChatBot from "./components/ChatBot";
import Login from "./pages/Login";
import Register from "./pages/Register";
import History from "./pages/History";
import { AuthProvider, useAuth } from "./context/AuthContext";

const Protected = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // ✅ wait for context to be ready
  return user ? children : <Navigate to="/login" />;
};


const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/chat" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Protected><ChatBot /></Protected>} />
        <Route path="/history" element={<Protected><History /></Protected>} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ChatBot from "./components/ChatBot";
import Login from "./pages/Login";
import Register from "./pages/Register";
import History from "./pages/History";
// Correct the import to point to your new HomePage component
import HomePage from "./pages/HomePage"; 
import { AuthProvider, useAuth } from "./context/AuthContext";

const Protected = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        {/* Change this route to render the HomePage component */}
        <Route path="/" element={<HomePage />} /> 
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* These routes remain protected */}
        <Route path="/chat" element={<Protected><ChatBot /></Protected>} />
        <Route path="/history" element={<Protected><History /></Protected>} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;

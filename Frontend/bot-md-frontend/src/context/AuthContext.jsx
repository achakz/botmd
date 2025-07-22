// ✅ src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";

// ✅ Create Context
const AuthContext = createContext();

// ✅ Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = ({ token, user }) => {
    const userData = { token, ...user };
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook to use Auth
export const useAuth = () => useContext(AuthContext);

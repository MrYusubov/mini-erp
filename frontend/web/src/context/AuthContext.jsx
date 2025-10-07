import React, { createContext, useState, useEffect } from "react";
import api, { setAuthToken } from "../api";

export const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem("user");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    setAuthToken(token);
    api
      .get("/api/auth/me")
      .then((r) => {
        setUser(r.data);
        localStorage.setItem("user", JSON.stringify(r.data));
      })
      .catch(() => {
        setAuthToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });
    const token = res.data.access_token;
    if (!token) throw new Error("No token returned");
    localStorage.setItem("token", token);
    setAuthToken(token);
    const me = await api.get("/api/auth/me");
    setUser(me.data);
    localStorage.setItem("user", JSON.stringify(me.data));
    return me.data;
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (e) {}
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

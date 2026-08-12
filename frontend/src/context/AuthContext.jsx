import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("quickkart_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // On first load, verify the session with the backend (cookie or stored token)
  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await API.get("/auth/me");
        setUser(data.user);
        localStorage.setItem("quickkart_user", JSON.stringify(data.user));
      } catch {
        setUser(null);
        localStorage.removeItem("quickkart_user");
        localStorage.removeItem("quickkart_token");
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []);

  const signup = async (payload) => {
    const { data } = await API.post("/auth/signup", payload);
    localStorage.setItem("quickkart_token", data.token);
    localStorage.setItem("quickkart_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const login = async (payload) => {
    const { data } = await API.post("/auth/login", payload);
    localStorage.setItem("quickkart_token", data.token);
    localStorage.setItem("quickkart_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } finally {
      localStorage.removeItem("quickkart_token");
      localStorage.removeItem("quickkart_user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

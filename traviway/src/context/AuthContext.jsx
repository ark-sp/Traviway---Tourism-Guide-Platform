import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ FIXED here

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setUser({ username: decoded.sub, role: decoded.role });
        setToken(storedToken);
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (jwt) => {
    try {
      const decoded = jwtDecode(jwt);
      const userData = { username: decoded.sub, role: decoded.role };
      localStorage.setItem("token", jwt);
      setUser(userData);
      setToken(jwt);
    } catch {
      alert("Invalid token");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

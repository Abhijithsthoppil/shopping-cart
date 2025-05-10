import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface AuthContextType {
  user: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  // Check auth status on initial mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/user/me", {
          withCredentials: true,
        });
        setUser(res.data.email);
      } catch (err) {
        setUser(null);
        console.log(err);
      }
    };
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    await axios.post(
      "http://localhost:8000/api/auth/login",
      { email, password },
      { withCredentials: true }
    );
    setUser(email);
  };

  const signup = async (email: string, password: string) => {
    await axios.post(
      "http://localhost:8000/api/auth/signup",
      { email, password },
      { withCredentials: true }
    );
    setUser(email);
  };

  const logout = () => {
    setUser(null);
    // You could also call a backend logout route that clears the cookie
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

import { createContext, useContext, useState, ReactNode } from "react";
import { axiosInstance } from "../api/axios";


interface AuthContextType {
  token: string | null;
  user: { id: string; name: string; role: string } | null;
  setAuth: (token: string, user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

 const setAuth = (t: string, u: any) => {
  setToken(t); setUser(u);
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${t}`;
};

const logout = () => {
  setToken(null); setUser(null);
  delete axiosInstance.defaults.headers.common['Authorization'];
};

  return (
    <AuthContext.Provider value={{ token, user, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

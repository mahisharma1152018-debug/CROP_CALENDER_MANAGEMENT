import { createContext, useContext, useEffect, useState } from "react";
import {
  login as loginApi,
  register as registerApi,
  me,
} from "../services/authService";
const C = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (localStorage.getItem("token"))
      me()
        .then((r) => setUser(r.data.data))
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    else setLoading(false);
  }, []);
  const login = async (d) => {
    const r = await loginApi(d);
    localStorage.setItem("token", r.data.data.token);
    setUser(r.data.data.user);
  };
  const register = async (d) => registerApi(d);
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };
  return (
    <C.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </C.Provider>
  );
}
export const useAuth = () => useContext(C);

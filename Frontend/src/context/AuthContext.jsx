import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default Axios config globally
  // axios.defaults.baseURL = "http://localhost:5000/api";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Logged in successfully!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", { name, email, password });
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Registered successfully!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out");
  };

  const authAxios = axios.create({
    baseURL: "http://localhost:5000/api",
  });

  authAxios.interceptors.request.use((config) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.token) {
      config.headers.Authorization = `Bearer ${userData.token}`;
    }
    return config;
  });

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    authAxios, // Use this for authenticated requests instead of regular axios
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

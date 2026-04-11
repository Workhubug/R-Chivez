import { useState, useEffect, createContext, useContext } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// Mock data functions
import {
  initializeMockData,
  mockLogin,
  mockRegister,
  mockGetCurrentUser,
  mockLogout,
} from "@/lib/mockData";

// Pages
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import AuthPage from "@/pages/AuthPage";

// Auth Context
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("rchivez_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize mock data on first load
    initializeMockData();

    const verifyToken = async () => {
      if (token) {
        try {
          const userData = await mockGetCurrentUser();
          setUser(userData);
        } catch (error) {
          localStorage.removeItem("rchivez_token");
          setToken(null);
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    const response = await mockLogin(email, password);
    const { access_token, user: userData } = response;
    localStorage.setItem("rchivez_token", access_token);
    setToken(access_token);
    setUser(userData);
    toast.success("Welcome back!");
    return userData;
  };

  const register = async (email, password, artistName) => {
    const response = await mockRegister(email, password, artistName);
    const { access_token, user: userData } = response;
    localStorage.setItem("rchivez_token", access_token);
    setToken(access_token);
    setUser(userData);
    toast.success("Account created successfully!");
    return userData;
  };

  const logout = () => {
    mockLogout();
    localStorage.removeItem("rchivez_token");
    setToken(null);
    setUser(null);
    toast.info("Logged out");
  };

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0D1A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

function App() {
  return (
    <div className="rchivez-app dark">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route 
              path="/dashboard/*" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Toaster 
            position="top-right" 
            toastOptions={{
              style: {
                background: '#251E49',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                color: '#fff'
              }
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

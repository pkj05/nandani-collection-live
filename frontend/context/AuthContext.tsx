"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: any;
  token: string | null;
  login: (token: string, userData: any) => void;
  logout: () => void;
  refreshUser: () => Promise<void>; // ✅ वापस आ गया
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  refreshUser: async () => {}, // ✅ खाली फंक्शन (placeholder)
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Hardcoded Secure URL
  const API_URL = "https://www.nandanicollection.com/api";

  // ✅ Helper Function: User data dobara fetch karne ke liye
  const fetchUserData = async (currentToken: string) => {
    try {
      const res = await fetch(`${API_URL}/accounts/me`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        // Token expire ho gaya to logout
        logout();
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await fetchUserData(storedToken);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (newToken: string, userData: any) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  // ✅ refreshUser implementation
  const refreshUser = async () => {
    if (token) {
      await fetchUserData(token);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { getToken, saveToken, removeToken } from '@/utils/tokenUtils';
import { getUser, saveUser, removeUser } from '@/utils/userUtils';
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getUser();

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUser) {
      setUser(storedUser);
    }

    setIsLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    saveToken(authToken);
    saveUser(userData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    removeToken();
    removeUser();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

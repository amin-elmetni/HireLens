import { getToken, saveToken, removeToken } from '@/utils/tokenUtils';
import { getUser, saveUser, removeUser } from '@/utils/userUtils';
import { createContext, useState } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(getUser());

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    saveToken(token);
    saveUser(userData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    removeToken();
    removeUser();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

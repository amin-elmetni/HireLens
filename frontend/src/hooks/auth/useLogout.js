// src/hooks/useLogout.js
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthProvider';

const useLogout = () => {
  const navigate = useNavigate();
  const { logout: contextLogout } = useContext(AuthContext);

  const logout = () => {
    contextLogout(); // This will handle removing token and user from localStorage
    navigate('/auth');
  };

  return logout;
};

export default useLogout;

// src/hooks/useLogout.js
import { useNavigate } from 'react-router-dom';
import { removeUser } from '@/utils/userUtils';
import { removeToken } from '@/utils/tokenUtils';

const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    removeUser();
    removeToken();
    navigate('/login');
  };

  return logout;
};

export default useLogout;

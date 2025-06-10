// src/hooks/useLogin.js
import { useState } from 'react';
import { loginUser } from '@/api/userApi';
import { saveUser } from '@/utils/userUtils';
import { saveToken } from '@/utils/tokenUtils';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });
      saveUser(res.data.user);
      saveToken(res.data.token);
      navigate('/');
    } catch (err) {
      alert('Invalid email or password');
    }
  };

  return { email, setEmail, password, setPassword, handleSubmit };
};

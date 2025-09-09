// src/hooks/useLogin.js
import { useState, useContext } from 'react';
import { loginUser } from '@/api/userApi';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthProvider';
import Swal from 'sweetalert2';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });

      // Use the AuthContext login method to properly update state
      login(res.data.user, res.data.token);

      navigate('/');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid email or password. Please try again.',
        confirmButtonColor: '#00b3b3',
      });
    }
  };

  return { email, setEmail, password, setPassword, handleSubmit };
};

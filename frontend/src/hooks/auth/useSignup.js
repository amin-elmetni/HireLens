// src/hooks/useSignup.js
import { useState } from 'react';
import { signupUser } from '@/api/userApi';
import Swal from 'sweetalert2';

export const useSignup = onSignupSuccess => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role] = useState('RECRUITER'); // Default role for new users

  const handleSubmit = async e => {
    e.preventDefault();

    // Password confirmation validation
    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Passwords do not match. Please try again.',
        confirmButtonColor: '#0d9488',
      });
      return;
    }

    // Password strength validation
    if (password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Weak Password',
        text: 'Password must be at least 6 characters long.',
        confirmButtonColor: '#0d9488',
      });
      return;
    }

    try {
      await signupUser({
        name,
        email,
        password,
        role,
        avatar: null,
        isVerified: false,
      });

      Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        text: 'Your account has been created successfully. Please login.',
        confirmButtonColor: '#0d9488',
      });

      // Reset form
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // Switch to login form
      if (onSignupSuccess) onSignupSuccess();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text: err.response?.data?.message || 'Failed to create account. Please try again.',
        confirmButtonColor: '#0d9488',
      });
      console.error('Signup error:', err);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    handleSubmit,
  };
};

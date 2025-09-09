import { useState } from 'react';
import { useLogin } from '@/hooks/auth/useLogin';
import { useSignup } from '@/hooks/auth/useSignup';
import Logo from '@/components/Auth/Logo';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  // Login hook
  const {
    email: loginEmail,
    setEmail: setLoginEmail,
    password: loginPassword,
    setPassword: setLoginPassword,
    handleSubmit: handleLogin,
  } = useLogin();

  // Signup hook
  const {
    name,
    setName,
    email: signupEmail,
    setEmail: setSignupEmail,
    password: signupPassword,
    setPassword: setSignupPassword,
    confirmPassword,
    setConfirmPassword,
    handleSubmit: handleSignup,
  } = useSignup(() => setIsSignUp(false));

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100 px-4 relative overflow-hidden'>
      {/* Background decorative elements */}
      <div className='absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-pink-300 to-red-400 rounded-full opacity-20 -translate-x-40 -translate-y-40'></div>
      <div className='absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-full opacity-20 translate-x-48 translate-y-48'></div>
      <div className='absolute top-1/2 left-0 w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full opacity-20 -translate-x-16'></div>

      <div className='flex justify-center items-center w-full max-w-5xl relative'>
        <div className='bg-white rounded-2xl shadow-2xl flex w-full h-[500px] relative overflow-hidden'>
          {/* Logo positioned on the teal panel */}
          <Logo className='absolute top-6 left-6 z-10' />

          {/* Sign In Panel */}
          <div
            className={`w-3/5 flex flex-col justify-center items-center p-12 transition-all duration-700 ease-in-out ${
              isSignUp ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <h2 className='text-3xl font-bold text-teal-600 mb-4'>User login</h2>
            <p className='text-gray-600 text-center mb-8'>
              To keep connected with us please login with your personal info
            </p>

            <form
              onSubmit={handleLogin}
              className='flex flex-col items-center w-full max-w-sm'
            >
              <div className='bg-gray-100 w-full p-3 flex items-center mb-4 rounded-lg'>
                <svg
                  className='w-5 h-5 text-gray-400 mr-3'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207'
                  />
                </svg>
                <input
                  type='email'
                  placeholder='Email'
                  className='bg-transparent outline-none text-sm flex-1'
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              <div className='bg-gray-100 w-full p-3 flex items-center mb-6 rounded-lg'>
                <svg
                  className='w-5 h-5 text-gray-400 mr-3'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                  />
                </svg>
                <input
                  type='password'
                  placeholder='Password'
                  className='bg-transparent outline-none text-sm flex-1'
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type='submit'
                className='bg-teal-600 text-white rounded-full px-12 py-3 font-semibold hover:bg-teal-700 transition-all shadow-lg cursor-pointer'
              >
                SIGN IN
              </button>
            </form>
          </div>

          {/* Sign Up Panel */}
          <div
            className={`w-3/5 flex flex-col justify-center items-center p-12 absolute inset-0 transition-all duration-700 ease-in-out ${
              isSignUp
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-full pointer-events-none'
            }`}
          >
            <h2 className='text-3xl font-bold text-teal-600 mb-4'>Create Account</h2>

            <p className='text-gray-600 mb-6'>or use your email for registration:</p>

            <form
              onSubmit={handleSignup}
              className='flex flex-col items-center w-full max-w-sm'
            >
              <div className='bg-gray-100 w-full p-3 flex items-center mb-3 rounded-lg'>
                <svg
                  className='w-5 h-5 text-gray-400 mr-3'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
                <input
                  type='text'
                  placeholder='Name'
                  className='bg-transparent outline-none text-sm flex-1'
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div className='bg-gray-100 w-full p-3 flex items-center mb-3 rounded-lg'>
                <svg
                  className='w-5 h-5 text-gray-400 mr-3'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207'
                  />
                </svg>
                <input
                  type='email'
                  placeholder='Email'
                  className='bg-transparent outline-none text-sm flex-1'
                  value={signupEmail}
                  onChange={e => setSignupEmail(e.target.value)}
                  required
                />
              </div>

              <div className='bg-gray-100 w-full p-3 flex items-center mb-3 rounded-lg'>
                <svg
                  className='w-5 h-5 text-gray-400 mr-3'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                  />
                </svg>
                <input
                  type='password'
                  placeholder='Password'
                  className='bg-transparent outline-none text-sm flex-1'
                  value={signupPassword}
                  onChange={e => setSignupPassword(e.target.value)}
                  required
                />
              </div>

              <div className='bg-gray-100 w-full p-3 flex items-center mb-6 rounded-lg'>
                <svg
                  className='w-5 h-5 text-gray-400 mr-3'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                  />
                </svg>
                <input
                  type='password'
                  placeholder='Confirm Password'
                  className='bg-transparent outline-none text-sm flex-1'
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type='submit'
                className='bg-teal-600 text-white rounded-full px-12 py-3 font-semibold hover:bg-teal-700 transition-all shadow-lg cursor-pointer'
              >
                SIGN UP
              </button>
            </form>
          </div>

          {/* Teal Sliding Panel */}
          <div
            className={`w-2/5 bg-gradient-to-br from-teal-500 to-teal-600 text-white flex flex-col items-center justify-center p-8 transition-all duration-700 ease-in-out ${
              isSignUp ? 'rounded-l-2xl' : 'rounded-r-2xl'
            } ${isSignUp ? 'translate-x-0' : 'translate-x-0'}`}
          >
            {!isSignUp ? (
              // Welcome Back! content
              <>
                <h2 className='text-3xl font-bold mb-6'>Welcome Back!</h2>
                <div className='border-2 w-12 border-white mb-6'></div>
                <p className='text-center mb-8 leading-relaxed'>
                  To keep connected with us please login with your personal info
                </p>
                <button
                  onClick={() => setIsSignUp(true)}
                  className='border-2 border-white text-white rounded-full px-12 py-3 font-semibold hover:bg-white hover:text-teal-600 transition-all cursor-pointer'
                >
                  SIGN UP
                </button>
              </>
            ) : (
              // Hello, Recruiter! content
              <>
                <h2 className='text-3xl font-bold mb-6'>Hello, Recruiter!</h2>
                <div className='border-2 w-12 border-white mb-6'></div>
                <p className='text-center mb-8 leading-relaxed'>
                  Fill in your details and start building better teams with the power of AI
                </p>
                <button
                  onClick={() => setIsSignUp(false)}
                  className='border-2 border-white text-white rounded-full px-12 py-3 font-semibold hover:bg-white hover:text-teal-600 transition-all cursor-pointer'
                >
                  SIGN IN
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

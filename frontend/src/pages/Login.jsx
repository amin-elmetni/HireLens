import { useLogin } from '@/hooks/auth/useLogin';
import SocialLoginIcons from '@/components/Login/SocialLoginIcons';
import Logo from '@/components/Login/Logo';
import SignUpPrompt from '@/components/Login/SignUpPrompt';

const Login = () => {
  const { email, setEmail, password, setPassword, handleSubmit } = useLogin();

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4'>
      <div className='flex flex-col justify-center w-full max-w-4xl items-center'>
        <div className='bg-white rounded-2xl shadow-2xl flex flex-col items-stretch md:flex-row w-full '>
          {/* Sign in section */}
          <div className='flex flex-col justify-center w-full md:w-3/5 p-6 md:p-10'>
            <Logo className='-translate-y-14' />
            <div className='flex flex-col items-center'>
              <h2 className='text-2xl md:text-3xl font-bold text-primary mb-4 text-center'>
                Sign in to Account
              </h2>
              <div className='border-2 w-10 border-primary inline-block mb-4'></div>
              {/* <SocialLoginIcons /> */}
              {/* <p className='text-gray-400 my-3 text-sm'>or use your email account</p> */}

              <form
                onSubmit={handleSubmit}
                className='flex flex-col items-center w-full'
              >
                <div className='bg-gray-100 w-72 p-2 flex items-center mb-3 rounded'>
                  <input
                    type='email'
                    name='email'
                    placeholder='Email'
                    className='bg-gray-100 outline-none text-sm flex-1 px-2'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className='bg-gray-100 w-72 p-2 flex items-center mb-2 rounded'>
                  <input
                    type='password'
                    name='password'
                    placeholder='Password'
                    className='bg-gray-100 outline-none text-sm flex-1 px-2'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className='flex justify-between w-72 mb-5 text-sm'>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      className='mr-2'
                    />
                    Remember me
                  </label>
                  <a
                    href='#'
                    className='hover:text-primary text-gray-500'
                  >
                    Forgot Password?
                  </a>
                </div>
                <button
                  type='submit'
                  className='border-2 text-primary border-primary rounded-full px-12 py-2 font-semibold hover:bg-primary hover:text-white transition-all cursor-pointer'
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>

          {/* Sign up prompt */}
          <SignUpPrompt />
        </div>
      </div>
    </div>
  );
};

export default Login;

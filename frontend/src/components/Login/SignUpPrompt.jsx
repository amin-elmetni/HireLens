const SignUpPrompt = () => (
  <div className='w-full md:w-2/5 bg-primary text-white rounded-b-2xl md:rounded-tr-2xl md:rounded-br-2xl md:rounded-bl-none py-10 md:py-36 px-8 flex flex-col items-center justify-center gap-4'>
    <h2 className='text-2xl md:text-3xl font-bold text-center'>Hello, Recruiter</h2>
    <div className='border-2 w-10 border-white inline-block'></div>
    <p className='text-center mb-6 text-sm px-2'>
      Fill in your details and start building better teams with the power of AI.
    </p>
    <a
      href='/register'
      className='capitalize border-2 border-white rounded-full px-12 py-2 font-semibold hover:bg-white hover:text-primary transition-all'
    >
      Sign up
    </a>
  </div>
);

export default SignUpPrompt;

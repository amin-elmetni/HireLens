import logo from '@/assets/logo.png';

const Logo = () => (
  <div className='flex items-center gap-2 mb-4'>
    <img
      src={logo}
      className='w-6'
      alt='HireLens logo'
    />
    <div className='text-left font-bold tracking-widest text-lg'>
      Hire<span className='text-primary'>Lens</span>
    </div>
  </div>
);

export default Logo;

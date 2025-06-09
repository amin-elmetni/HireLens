import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';
import NavLink from './NavLink';
import UserDropdown from './UserDropdown';
import { useAuthUser } from '@/hooks/useAuthUser';
import { TbLayoutSidebarLeftExpandFilled } from 'react-icons/tb';

const Navbar = ({ onFilterClick }) => {
  const user = useAuthUser();

  return (
    <nav className='bg-white sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-18'>
          <div className='flex items-center gap-6'>
            <div>
              {/* <button
                onClick={onFilterClick}
                className='text-primary text-3xl p-2 rounded hover:bg-gray-100 transition cursor-pointer'
                aria-label='Open Filters'
              >
                <TbLayoutSidebarLeftExpandFilled />
              </button> */}
            </div>
            <Link
              to='/'
              className='flex items-center gap-2'
            >
              <img
                src={logo}
                className='w-6'
                alt='HireLens Logo'
              />
              <h1 className='text-lg font-bold tracking-widest'>
                Hire<span className='text-primary'>Lens</span>
              </h1>
            </Link>
          </div>

          <div className='hidden md:flex items-center space-x-8'>
            <NavLink to='/'>Find Resumes</NavLink>
            <NavLink to='/collections'>My Collections</NavLink>
            <NavLink to='/profile'>My Profile</NavLink>
          </div>

          <div className='flex items-center gap-4'>
            <div className='text-gray-500 hover:text-primary duration-200 cursor-pointer border w-8 h-8 rounded-lg border-gray-300 flex items-center justify-center transition group'>
              <FontAwesomeIcon
                icon='fa-regular fa-bell'
                className='group-hover:animate-wiggle'
              />
            </div>
            <div className='h-9 border-l border-gray-300 cursor-pointer' />
            {user && <UserDropdown user={user} />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

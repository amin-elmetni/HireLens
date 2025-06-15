import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';
import NavLink from './NavLink';
import { useAuthUser } from '@/hooks/auth/useAuthUser';
import DropdownMenu from '@/components/ui/DropdownMenu';
import UserAvatar from './UserAvatar';
import DisplayName from './DisplayName';
import useLogout from '@/hooks/auth/useLogout';

const Navbar = () => {
  const user = useAuthUser();
  const navigate = useNavigate();
  const logout = useLogout();

  const userMenuOptions = [
    {
      label: 'My Profile',
      value: 'profile',
      onClick: () => navigate('/profile'),
    },
    {
      label: 'Logout',
      value: 'logout',
      destructive: true,
      onClick: logout,
    },
  ];

  return (
    <nav className='bg-white sticky top-0 z-50 shadow-md'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-18'>
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
            {user && (
              <DropdownMenu
                options={userMenuOptions}
                align='right'
                width='w-48'
                trigger={
                  <button className='flex items-center focus:outline-none px-2 py-1'>
                    <UserAvatar
                      name={user.name}
                      avatar={user.avatar}
                    />
                    <div className='flex flex-col ml-2 text-[11px] items-start'>
                      <p className='text-gray-500'>Hello!</p>
                      <div className='flex items-center gap-2 cursor-pointer capitalize'>
                        <p className='font-semibold'>
                          <DisplayName name={user.name.toLowerCase()} />
                        </p>
                        <FontAwesomeIcon
                          icon='fa-caret-down'
                          className='text-gray-400'
                        />
                      </div>
                    </div>
                  </button>
                }
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

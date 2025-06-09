// components/UserDropdown.jsx
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserAvatar from './UserAvatar';
import DisplayName from './DisplayName';
import useLogout from '@/hooks/useLogout';

const UserDropdown = ({ user }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const logout = useLogout();

  useEffect(() => {
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className='relative'
      ref={dropdownRef}
    >
      <button
        onClick={() => setOpen(!open)}
        className='flex items-center focus:outline-none'
      >
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

      {open && (
        <div className='absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-200 z-50'>
          <Link
            to='/profile'
            onClick={() => setOpen(false)}
            className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
          >
            My Profile
          </Link>
          <button
            onClick={logout}
            className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer'
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;

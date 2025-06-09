// components/NavLink.jsx
import { Link, useLocation } from 'react-router-dom';

const NavLink = ({ to, children }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <div className='relative hover:scale-105 transition-all duration-200'>
      <Link
        to={to}
        className={`font-medium hover:text-primary  ${
          isActive ? 'text-black font-semibold' : 'text-gray-400 '
        }`}
      >
        {children}
      </Link>
      {/* Active indicator bar */}
      {isActive && (
        <div className='absolute -top-[31px] left-0 right-0 mx-auto w-28 h-3 bg-primary rounded-full'></div>
      )}
    </div>
  );
};

export default NavLink;

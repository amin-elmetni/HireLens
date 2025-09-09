import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';

const PrivateRoute = ({ children }) => {
  const { token, isLoading } = useContext(AuthContext);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600'></div>
      </div>
    );
  }

  return token ? (
    children
  ) : (
    <Navigate
      to='/auth'
      replace
    />
  );
};

export default PrivateRoute;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '@/pages/Login';
import Resumes from '@/pages/Resumes';
import PrivateRoute from '@/routes/PrivateRoute';
import { Collections } from '@/pages/Collections';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path='/login'
        element={<Login />}
      />
      <Route
        path='/'
        element={
          <PrivateRoute>
            <Resumes />
          </PrivateRoute>
        }
      />
      <Route
        path='/collections'
        element={
          <PrivateRoute>
            <Collections />
          </PrivateRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;

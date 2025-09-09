import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from '@/routes/PrivateRoute';
import Auth from '@/pages/Auth';
import Resumes from '@/pages/Resumes';
import Collections from '@/pages/Collections';
import ResumeDetails from '@/pages/ResumeDetails';
import AnalyzeResumes from '@/pages/AnalyzeResumes';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path='/auth'
        element={<Auth />}
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
        path='/resumedetails/:uuid'
        element={
          <PrivateRoute>
            <ResumeDetails />
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
      <Route
        path='/collections/:collectionId'
        element={
          <PrivateRoute>
            <Collections />
          </PrivateRoute>
        }
      />
      <Route
        path='/bookmarks'
        element={
          <PrivateRoute>
            <Collections />
          </PrivateRoute>
        }
      />
      <Route
        path='/analyze-resumes'
        element={
          <PrivateRoute>
            <AnalyzeResumes />
          </PrivateRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;

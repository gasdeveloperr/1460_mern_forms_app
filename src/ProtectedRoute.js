import { Navigate, Outlet } from 'react-router-dom';
import { getAuthToken } from './utils';

const ProtectedRoute = () => {
  const isAuthenticated = () => {
    const token = getAuthToken()
    // Check if the user is authenticated
    // You can check the presence of a token in local storage or cookies
    return token !== null;
  };

  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const isAuthenticated = () => {
    // Check if the user is authenticated
    // You can check the presence of a token in local storage or cookies
    return localStorage.getItem('token') !== null;
  };

  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
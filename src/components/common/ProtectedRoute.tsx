import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/auth';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();

  if (!authService.isAuthenticated()) {
    // Redirect unauthenticated visitor to login page with return state
    return <Navigate to="/login" state={{ from: location.pathname, requiredAuth: true }} replace />;
  }

  return children;
};


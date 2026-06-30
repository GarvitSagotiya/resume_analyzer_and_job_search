import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
// 1. Import the new custom hook
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  // 2. Call the hook directly to grab your state variables
  const { accessToken, loading } = useAuth();
  const location = useLocation();

  // 1. Prevent redirection flashes while the app quietly verifies HttpOnly cookies
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <p className="animate-pulse tracking-wide text-sm font-medium text-slate-400">
          Verifying secure session...
        </p>
      </div>
    );
  }

  // 2. If unauthorized, bounce to login but record their targeted destination path
  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 3. Render either nested routes (<Outlet />) or directly wrapped component blocks ({children})
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
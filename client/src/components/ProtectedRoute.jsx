import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
export const ProtectedRoute = ({ allowedRoles }) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"/>
          <span className="text-sm font-semibold text-slate-600">Loading LifeLink...</span>
        </div>
      </div>);
    }
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace/>;
    }
    if (allowedRoles && !allowedRoles.includes(user.role) && user.role !== 'admin') {
        return <Navigate to="/" replace/>;
    }
    return <Outlet />;
};

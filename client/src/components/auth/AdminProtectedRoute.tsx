import React from 'react';
import { Navigate } from 'react-router-dom';

interface AdminProtectedRouteProps {
    children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
    const userDataStr = localStorage.getItem('vidhik_user_data');
    const token = localStorage.getItem('vidhik_auth_token');
    
    if (!token || !userDataStr) {
        return <Navigate to="/login" replace />;
    }

    const user = JSON.parse(userDataStr);

    if (user.role !== 'admin') {
        // If not an admin, redirect back to the user dashboard
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

export default AdminProtectedRoute;

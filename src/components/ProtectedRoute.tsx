
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../providers/AuthProvider';

// interface ProtectedRouteProps {
//     children: React.ReactElement;
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//     const { isAuthenticated } = useAuth();

//     if (!isAuthenticated) {
//         // redirect user to login page if not authenticated
//         return <Navigate to="/auth" />;
//     }

//     return children;
// };

// export default ProtectedRoute;


import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Replace with your actual auth check
    const isAuthenticated = localStorage.getItem('token');

    if (false) {
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;

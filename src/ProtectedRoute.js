import {Navigate, Outlet} from 'react-router-dom';
import { useAuth } from './contexts/auth';
import React from 'react';


export const ProtectedRoute = () => {
    const { user } = useAuth();
    if (user === null) {
        return <Navigate to="/iniciarsesion" />;
    }
    return <Outlet />;
}
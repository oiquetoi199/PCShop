import React from 'react';
import { Navigate } from 'react-router-dom';

// Kiểm tra trạng thái đăng nhập và quyền truy cập trước khi hiển thị trang được bảo vệ.
const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    const roles = localStorage.getItem('roles') ? localStorage.getItem('roles').split(',') : [];

    if (!token || (requiredRole && !roles.includes(requiredRole))) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;

import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function ProtectedRoute({ allowedRoles = ['ADMIN'] }) {
  const { user, token, setLoginModalOpen } = useAuthStore();

  if (!token) {
    // Not logged in, redirect to admin login
    return <Navigate to="/admin/login" replace />;
  }

  if (!allowedRoles.includes(user?.role || '')) {
    // Unauthorized role, redirect to home
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoutes = () => {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoutes;
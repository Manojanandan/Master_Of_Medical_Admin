import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const LoginRoutes = () => {
  const { token } = useAuth();
  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default LoginRoutes;
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from "@material-tailwind/react";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner className="h-16 w-16 text-gray-900/50" />;
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" />;
  }

  return children;
} 
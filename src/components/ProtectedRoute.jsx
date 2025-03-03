import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from "@material-tailwind/react";
import Loading from 'react-fullscreen-loading';
import loadGif from '../gif/loadsmk.gif';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <img src={loadGif} alt="Loading..." className="w-16 h-16" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" />;
  }

  return children;
} 
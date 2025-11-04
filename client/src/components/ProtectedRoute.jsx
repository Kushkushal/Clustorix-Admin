import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="relative">
            {/* Spinner */}
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
            {/* Inner spinner for double effect */}
            <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-t-4 border-purple-400 mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Verifying authentication...</p>
          <p className="mt-2 text-sm text-gray-400">Please wait</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('🔒 Not authenticated, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render child routes
  return <Outlet />;
}
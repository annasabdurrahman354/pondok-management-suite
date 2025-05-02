
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // If user is authenticated, redirect to the appropriate dashboard
  if (isAuthenticated && !isLoading) {
    const redirectPath = user?.role === 'admin_pusat' 
      ? '/admin-pusat/dashboard' 
      : '/admin-pondok/dashboard';
    
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-pondok">Pondok Management</h1>
        <h2 className="mt-2 text-center text-xl font-semibold text-gray-900">
          Log in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm />
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Admin Pusat: admin@pusat.org</p>
          <p>Admin Pondok: admin@alhikam.org</p>
          <p className="mt-1">Password akan diberikan oleh admin</p>
        </div>
      </div>
    </div>
  );
}


import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const Index = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If authentication is complete and user is authenticated,
    // redirect based on role immediately
    if (!isLoading && isAuthenticated && user) {
      const path = user.role === 'admin_pusat' 
        ? '/admin-pusat/dashboard' 
        : '/admin-pondok/dashboard';
      navigate(path, { replace: true });
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  // Show a better loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pondok border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // This return is mostly a fallback - the useEffect should handle redirection
  if (user?.role === 'admin_pusat') {
    return <Navigate to="/admin-pusat/dashboard" replace />;
  } else {
    return <Navigate to="/admin-pondok/dashboard" replace />;
  }
};

export default Index;


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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-center text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // This return is mostly a fallback - the useEffect should handle redirection
  // based on user role before we reach this point
  if (user?.role === 'admin_pusat') {
    return <Navigate to="/admin-pusat/dashboard" replace />;
  } else {
    return <Navigate to="/admin-pondok/dashboard" replace />;
  }
};

export default Index;

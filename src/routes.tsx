
import { Navigate, RouteObject } from "react-router-dom";
import { AdminPondokLayout } from "./components/layout/AdminPondokLayout";
import { AdminPusatLayout } from "./components/layout/AdminPusatLayout";
import Login from "./pages/auth/Login";
import NotFound from "./pages/NotFound";
import AdminPusatDashboard from "./pages/admin-pusat/Dashboard";
import AdminPondokDashboard from "./pages/admin-pondok/Dashboard";
import { useAuth } from "./contexts/AuthContext";
import { ReactNode } from "react";

// Auth middleware
interface PrivateRouteProps {
  children: ReactNode;
  role?: 'admin_pusat' | 'admin_pondok';
}

export function PrivateRoute({ children, role }: PrivateRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    // Show loading state
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-center text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    // Redirect to the appropriate dashboard
    return <Navigate to="/" replace />;
  }

  // Render the protected route
  return <>{children}</>;
}

// Use this function to get the routes configuration
export function getRoutes(): RouteObject[] {
  return [
    // Public routes
    {
      path: "/login",
      element: <Login />,
    },
    
    // Central Admin routes
    {
      path: "/admin-pusat",
      element: (
        <PrivateRoute role="admin_pusat">
          <AdminPusatLayout title="Dashboard" />
        </PrivateRoute>
      ),
      children: [
        {
          index: true,
          element: <Navigate to="/admin-pusat/dashboard" replace />,
        },
        {
          path: "dashboard",
          element: <AdminPusatDashboard />,
        },
        // Add more routes for RAB, LPJ, etc.
      ],
    },
    
    // Branch Admin routes
    {
      path: "/admin-pondok",
      element: (
        <PrivateRoute role="admin_pondok">
          <AdminPondokLayout title="Dashboard" />
        </PrivateRoute>
      ),
      children: [
        {
          index: true,
          element: <Navigate to="/admin-pondok/dashboard" replace />,
        },
        {
          path: "dashboard",
          element: <AdminPondokDashboard />,
        },
        // Add more routes for RAB, LPJ, etc.
      ],
    },
    
    // Root redirect - based on user role
    {
      path: "/",
      element: <RoleBasedRedirect />,
    },
    
    // 404 Not found
    {
      path: "*",
      element: <NotFound />,
    }
  ];
}

// Helper component to redirect based on role
function RoleBasedRedirect() {
  const { isAuthenticated, isLoading, user } = useAuth();

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

  // Redirect based on role
  if (user?.role === 'admin_pusat') {
    return <Navigate to="/admin-pusat/dashboard" replace />;
  } else {
    return <Navigate to="/admin-pondok/dashboard" replace />;
  }
}

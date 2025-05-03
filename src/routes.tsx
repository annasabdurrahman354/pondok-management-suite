
import { Navigate, RouteObject } from "react-router-dom";
import { AdminPondokLayout } from "./components/layout/AdminPondokLayout";
import { AdminPusatLayout } from "./components/layout/AdminPusatLayout";
import Login from "./pages/auth/Login";
import NotFound from "./pages/NotFound";
import AdminPusatDashboard from "./pages/admin-pusat/Dashboard";
import AdminPondokDashboard from "./pages/admin-pondok/Dashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";

// Branch Admin Pages
import BranchProfilePage from "./pages/admin-pondok/profile/BranchProfilePage";
import BranchPersonnelPage from "./pages/admin-pondok/profile/BranchPersonnelPage";
import RABListPage from "./pages/admin-pondok/rab/RABListPage";
import RABFormPage from "./pages/admin-pondok/rab/RABFormPage";
import LPJListPage from "./pages/admin-pondok/lpj/LPJListPage";
import LPJFormPage from "./pages/admin-pondok/lpj/LPJFormPage";

// Central Admin Pages
import CentralRABManagementPage from "./pages/admin-pusat/rab/RABManagementPage";
import CentralLPJManagementPage from "./pages/admin-pusat/lpj/LPJManagementPage";
import CentralRABDetailPage from "./pages/admin-pusat/rab/RABDetailPage";
import CentralLPJDetailPage from "./pages/admin-pusat/lpj/LPJDetailPage";
import PeriodManagementPage from "./pages/admin-pusat/management/PeriodManagementPage";
import BranchManagementPage from "./pages/admin-pusat/management/BranchManagementPage";
import BranchDetailPage from "./pages/admin-pusat/management/BranchDetailPage";

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
      element: <ProtectedRoute requiredRole="admin_pusat" />,
      children: [
        {
          element: <AdminPusatLayout title="Dashboard" />,
          children: [
            {
              index: true,
              element: <Navigate to="/admin-pusat/dashboard" replace />,
            },
            {
              path: "dashboard",
              element: <AdminPusatDashboard />,
            },
            // RAB management routes
            {
              path: "rab",
              children: [
                { index: true, element: <CentralRABManagementPage /> },
                { path: ":id", element: <CentralRABDetailPage /> }
              ]
            },
            // LPJ management routes
            {
              path: "lpj",
              children: [
                { index: true, element: <CentralLPJManagementPage /> },
                { path: ":id", element: <CentralLPJDetailPage /> }
              ]
            },
            // Period management
            {
              path: "management/periode",
              element: <PeriodManagementPage />
            },
            // Branch management
            {
              path: "management/pondok",
              children: [
                { index: true, element: <BranchManagementPage /> },
                { path: ":id", element: <BranchDetailPage /> }
              ]
            }
          ]
        }
      ],
    },
    
    // Branch Admin routes
    {
      path: "/admin-pondok",
      element: <ProtectedRoute requiredRole="admin_pondok" />,
      children: [
        {
          element: <AdminPondokLayout title="Dashboard" />,
          children: [
            {
              index: true,
              element: <Navigate to="/admin-pondok/dashboard" replace />,
            },
            {
              path: "dashboard",
              element: <AdminPondokDashboard />,
            },
            // Branch profile management
            {
              path: "profile",
              children: [
                { index: true, element: <BranchProfilePage /> },
                { path: "personnel", element: <BranchPersonnelPage /> }
              ]
            },
            // RAB routes
            {
              path: "rab",
              children: [
                { index: true, element: <RABListPage /> },
                { path: "new", element: <RABFormPage /> },
                { path: ":id", element: <RABFormPage /> }
              ]
            },
            // LPJ routes
            {
              path: "lpj",
              children: [
                { index: true, element: <LPJListPage /> },
                { path: "new", element: <LPJFormPage /> },
                { path: ":id", element: <LPJFormPage /> }
              ]
            }
          ]
        }
      ],
    },
    
    // Root redirect - based on user role
    {
      path: "/",
      element: <Index />,
    },
    
    // 404 Not found
    {
      path: "*",
      element: <NotFound />,
    }
  ];
}

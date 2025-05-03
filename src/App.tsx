
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useRoutes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { PeriodeProvider } from "./contexts/PeriodeContext";
import { getRoutes } from "./routes";

const queryClient = new QueryClient();

// Router Component that uses AuthProvider
const AppRoutes = () => {
  const routes = useRoutes(getRoutes());
  return routes;
};

// Wrap AppRoutes with AuthProvider inside BrowserRouter
const AppWithAuth = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <NotificationProvider>
        <PeriodeProvider>
          <Toaster />
          <Sonner />
          <AppWithAuth />
        </PeriodeProvider>
      </NotificationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

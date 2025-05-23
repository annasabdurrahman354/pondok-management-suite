
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

// Router Component that uses routes
const AppRoutes = () => {
  const routes = useRoutes(getRoutes());
  return routes;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <PeriodeProvider>
              <Toaster />
              <Sonner />
              <AppRoutes />
            </PeriodeProvider>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { User, AuthState, LoginCredentials } from '../types/auth.types';
import { login as loginAPI, logout as logoutAPI, getCurrentUser } from '../services/auth.service';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
  const { toast } = useToast();
  const hasNavigated = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          try {
            const user = await getCurrentUser();
            setAuthState({
              user,
              isAuthenticated: !!user,
              isLoading: false,
              error: null,
            });
            
            // Handle navigation based on user role
            if (user && location.pathname === "/login" && !hasNavigated.current) {
              const path = user.role === 'admin_pusat' 
                ? '/admin-pusat/dashboard' 
                : '/admin-pondok/dashboard';
              navigate(path, { replace: true });
              hasNavigated.current = true;
            }
          } catch (error) {
            console.error("Error getting user data:", error);
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: 'Failed to get user data',
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          hasNavigated.current = false;
        }
      }
    );

    // Initial auth check
    checkAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  // Reset navigation flag when location changes
  useEffect(() => {
    if (location.pathname === "/login") {
      hasNavigated.current = false;
    }
  }, [location.pathname]);

  async function checkAuth() {
    try {
      const user = await getCurrentUser();
      setAuthState({
        user,
        isAuthenticated: !!user,
        isLoading: false,
        error: null,
      });

      // Handle initial navigation if needed
      if (user && location.pathname === "/" && !hasNavigated.current) {
        const path = user.role === 'admin_pusat' 
          ? '/admin-pusat/dashboard' 
          : '/admin-pondok/dashboard';
        navigate(path, { replace: true });
        hasNavigated.current = true;
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to check auth status',
      });
    }
  }

  async function login(credentials: LoginCredentials) {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      await loginAPI(credentials);
      hasNavigated.current = false; // Reset navigation flag on login
      // Auth state listener will update the state and handle navigation
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  }

  async function logout() {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      await logoutAPI();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      hasNavigated.current = false; // Reset navigation flag on logout
      navigate('/login', { replace: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      toast({
        title: "Logout Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  async function refreshUser() {
    try {
      const user = await getCurrentUser();
      setAuthState(prev => ({
        ...prev,
        user,
        isAuthenticated: !!user,
      }));
    } catch (error) {
      console.error("Failed to refresh user:", error);
      // Don't update state on refresh failure
    }
  }

  const value = {
    ...authState,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

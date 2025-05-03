
export interface User {
  id: string;
  name: string | null;
  phone: string | null;
  role: UserRole;
  pondok_id: string | null;
  created_at: string;
  pondok?: {
    name: string;
  };
}

export type UserRole = 'admin_pusat' | 'admin_pondok';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

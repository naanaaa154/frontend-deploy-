export interface User {
  id: string | number;
  username: string;
  email: string;
  avatar?: string;
  role?: 'user' | 'superadmin' | string;
  is_active?: boolean;
  name?: string; // Optional if you still want to support name
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthError {
  message: string;
  code?: string;
}
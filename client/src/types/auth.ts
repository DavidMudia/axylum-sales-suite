export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;

  login: (token: string, user: User) => void;
  logout: () => void;
}
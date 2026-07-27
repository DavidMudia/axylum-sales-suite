import {
  createContext,
  useContext,
  useState,
} from "react";

import type { ReactNode } from "react";

export type User = {
  id: number;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;

  role: string;

  permissions: string[];
};

type AuthContextType = {
  user: User | null;

  token: string |null;

  isAuthenticated: boolean;

  login: (
    token: string,
    user: User
  ) => void;

  logout: () => void;

  hasPermission: (
    permission: string
  ) => boolean;
};

const AuthContext =
createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
}:{
  children: ReactNode;
}) {

  const [token,setToken] =
    useState<string | null>(
      localStorage.getItem("token")
    );

  const [user,setUser] =
    useState<User | null>(() => {

      const saved =
        localStorage.getItem("user");

      return saved
        ? JSON.parse(saved)
        : null;

    });

  function login(
    token:string,
    user:User
  ){

    localStorage.setItem(
      "token",
      token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    setToken(token);

    setUser(user);

  }

  function logout(){

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setToken(null);

    setUser(null);

  }

  function hasPermission(permission: string) {
  if (!user) return false;

  if (user.role === "SUPER_ADMIN") {
    return true;
  }

  return user.permissions.includes(permission);
}

  return (

    <AuthContext.Provider
      value={{

        user,

        token,

        isAuthenticated: !!token,

        login,

        logout,

        hasPermission,

      }}
    >

      {children}

    </AuthContext.Provider>

  );

}

export function useAuth(){

  const context =
    useContext(AuthContext);

  if(!context){

    throw new Error(
      "useAuth must be used inside AuthProvider."
    );

  }

  return context;

}
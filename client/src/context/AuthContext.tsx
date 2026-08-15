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

  token: string | null;

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

function normalizeUser(user: Partial<User>): User {
  return {
    id: user.id ?? 0,

    employeeNumber:
      user.employeeNumber ?? "",

    firstName:
      user.firstName ?? "",

    lastName:
      user.lastName ?? "",

    email:
      user.email ?? "",

    role:
      user.role ?? "",

    permissions:
      Array.isArray(user.permissions)
        ? user.permissions
        : [],
  };
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [token, setToken] =
    useState<string | null>(
      localStorage.getItem("token")
    );

  const [user, setUser] =
    useState<User | null>(() => {
      const saved =
        localStorage.getItem("user");

      if (!saved) {
        return null;
      }

      try {
        const parsed = JSON.parse(saved);

        return normalizeUser(parsed);
      } catch (error) {
        console.error(
          "Failed to parse saved user:",
          error
        );

        localStorage.removeItem("user");

        return null;
      }
    });

  function login(
    token: string,
    user: User
  ) {
    const normalizedUser =
      normalizeUser(user);

    localStorage.setItem(
      "token",
      token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(normalizedUser)
    );

    setToken(token);

    setUser(normalizedUser);
  }

  function logout() {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setToken(null);

    setUser(null);
  }

  function hasPermission(
    permission: string
  ): boolean {
    if (!user) {
      return false;
    }

    // Super administrators have unrestricted access.
    if (user.role === "SUPER_ADMIN") {
      return true;
    }

    // Safely handle users created before
    // permissions were added to the auth system.
    if (!Array.isArray(user.permissions)) {
      return false;
    }

    return user.permissions.includes(
      permission
    );
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

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}
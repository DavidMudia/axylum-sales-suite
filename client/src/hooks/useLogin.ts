import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login as loginRequest } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export function useLogin() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleLogin(
    email: string,
    password: string
  ) {
    try {
      setLoading(true);
      setError("");

      const result =
        await loginRequest({
          email,
          password,
        });

      login(
        result.token,
        result.user
      );

      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message ??
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    handleLogin,
  };
}
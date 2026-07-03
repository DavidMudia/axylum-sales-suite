import api from "../api/axios";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const register = (data: RegisterData) =>
  api.post("/auth/register", data);

export const login = (data: LoginData) =>
  api.post("/auth/login", data);

export const getCurrentUser = () =>
  api.get("/auth/me");
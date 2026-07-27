import api from "./axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;

  user: {
    id: number;
    employeeNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    permissions: string[];
  };
}

export async function login(
  data: LoginPayload
): Promise<LoginResponse> {
  const response = await api.post(
    "/auth/login",
    data
  );

  return response.data;
}

export async function me() {
  const response = await api.get("/auth/me");

  return response.data.user;
}
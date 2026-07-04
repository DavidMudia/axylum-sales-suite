import api from "./axios";

export async function login(email: string, password: string) {
  const { data } = await api.post("/auth/login", {
    email,
    password,
  });

  return data;
}

export async function register(
  name: string,
  email: string,
  password: string
) {
  const { data } = await api.post("/auth/register", {
    name,
    email,
    password,
  });

  return data;
}
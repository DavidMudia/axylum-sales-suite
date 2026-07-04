import api from "./axios";

export async function getDashboardStats() {
  const { data } = await api.get("/customers/stats");
  return data;
}
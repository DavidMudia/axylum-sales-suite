import api from "./axios";

export async function getCommandCenter() {
  const { data } = await api.get(
    "/command-center"
  );

  return data;
}
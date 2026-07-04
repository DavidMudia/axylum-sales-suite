import api from "./axios";

export async function getCustomers(
  search = "",
  page = 1
) {
  const { data } = await api.get("/customers", {
    params: {
      search,
      page,
    },
  });

  return data;
}

export async function getCustomer(id: number) {
  const { data } = await api.get(`/customers/${id}`);
  return data;
}

export async function createCustomer(data: any) {
  const response = await api.post("/customers", data);
  return response.data;
}

export async function updateCustomer(
  id: number,
  data: any
) {
  const response = await api.patch(
    `/customers/${id}`,
    data
  );

  return response.data;
}

export async function deleteCustomer(id: number) {
  const response = await api.delete(
    `/customers/${id}`
  );

  return response.data;
}

export async function getCustomerStats() {
  const { data } = await api.get("/customers/stats");
  return data;
}
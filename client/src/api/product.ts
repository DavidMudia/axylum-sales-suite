import api from "./axios";

export async function getProducts(
  search = "",
  page = 1
) {
  const { data } = await api.get(
    "/products",
    {
      params: {
        search,
        page,
      },
    }
  );

  return data;
}

export async function getProduct(
  id: number
) {
  const { data } = await api.get(
    `/products/${id}`
  );

  return data;
}

export async function createProduct(
  data: any
) {
  return (
    await api.post(
      "/products",
      data
    )
  ).data;
}

export async function updateProduct(
  id: number,
  data: any
) {
  return (
    await api.patch(
      `/products/${id}`,
      data
    )
  ).data;
}

export async function deleteProduct(
  id: number
) {
  return (
    await api.delete(
      `/products/${id}`
    )
  ).data;
}

export async function getProductStats() {
  return (
    await api.get(
      "/products/stats"
    )
  ).data;
}
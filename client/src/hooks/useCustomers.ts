import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../api/customer";

export function useCustomers(
  search: string,
  page: number
) {
  return useQuery({
    queryKey: ["customers", search, page],
    queryFn: () => getCustomers(search, page),
  });
}

export function useCustomer(
  id: number | null
) {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => getCustomer(id!),
    enabled: id !== null,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomer,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: any;
    }) => updateCustomer(id, data),

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["customer"],
      });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomer,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });
    },
  });
}
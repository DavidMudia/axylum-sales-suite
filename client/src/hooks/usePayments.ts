import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import * as api from '../api/payment';
import type {
  PaymentsResponse,
  PaymentStats,
} from '../api/payment';

export const PAYMENTS_QUERY_KEY = 'payments';

export function usePayments(
  search?: string,
  status?: string,
  refundable = false,
  page = 1,
  limit = 20
) {
  return useQuery<PaymentsResponse>({
    queryKey: [
      PAYMENTS_QUERY_KEY,
      search,
      status,
      refundable,
      page,
      limit,
    ],
    queryFn: () =>
      api.getPayments(
        search,
        status,
        refundable,
        page,
        limit
      ),
    placeholderData: keepPreviousData,
  });
}
export function usePayment(id: number) {
  return useQuery({
    queryKey: [PAYMENTS_QUERY_KEY, id],
    queryFn: () => api.getPayment(id),
    enabled: !!id,
  });
}

export function usePaymentStats() {
  return useQuery<PaymentStats>({
    queryKey: ['payment-stats'],
    queryFn: api.getPaymentStats,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createPayment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PAYMENTS_QUERY_KEY],
      });

      queryClient.invalidateQueries({
        queryKey: ['payment-stats'],
      });

      queryClient.invalidateQueries({
        queryKey: ['invoices'],
      });

      queryClient.invalidateQueries({
        queryKey: ['invoice-stats'],
      });
    },
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: any;
    }) => api.updatePayment(id, data),

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: [PAYMENTS_QUERY_KEY],
      });

      queryClient.invalidateQueries({
        queryKey: [PAYMENTS_QUERY_KEY, id],
      });

      queryClient.invalidateQueries({
        queryKey: ['payment-stats'],
      });

      queryClient.invalidateQueries({
        queryKey: ['invoices'],
      });

      queryClient.invalidateQueries({
        queryKey: ['invoice-stats'],
      });
    },
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.deletePayment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PAYMENTS_QUERY_KEY],
      });

      queryClient.invalidateQueries({
        queryKey: ['payment-stats'],
      });

      queryClient.invalidateQueries({
        queryKey: ['invoices'],
      });

      queryClient.invalidateQueries({
        queryKey: ['invoice-stats'],
      });
    },
  });
}

export function useApprovePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.approvePayment,

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: [PAYMENTS_QUERY_KEY],
      });

      queryClient.invalidateQueries({
        queryKey: [PAYMENTS_QUERY_KEY, id],
      });

      queryClient.invalidateQueries({
        queryKey: ['payment-stats'],
      });

      queryClient.invalidateQueries({
        queryKey: ['invoices'],
      });

      queryClient.invalidateQueries({
        queryKey: ['invoice-stats'],
      });
    },
  });
}

export function useCancelPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      reason,
    }: {
      id: number;
      reason: string;
    }) => api.cancelPayment(id, reason),

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: [PAYMENTS_QUERY_KEY],
      });

      queryClient.invalidateQueries({
        queryKey: [PAYMENTS_QUERY_KEY, id],
      });

      queryClient.invalidateQueries({
        queryKey: ['payment-stats'],
      });

      queryClient.invalidateQueries({
        queryKey: ['invoices'],
      });

      queryClient.invalidateQueries({
        queryKey: ['invoice-stats'],
      });
    },
  });
}
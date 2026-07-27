import api from "./axios";

/*
|--------------------------------------------------------------------------
| Dashboard Types
|--------------------------------------------------------------------------
*/

export interface GoodsReceiptCard {
  id: number;

  receiptNumber: string;

  status: "RECEIVED" | "VERIFIED" | "CANCELLED" | "DRAFT";

  supplierInvoiceNumber: string | null;

  supplierDeliveryNote: string | null;

  truckNumber: string | null;

  driverName: string | null;

  totalReceivedItems: number;

  totalRejectedItems: number;

  createdAt: string;

  warehouse: {
    id: number;
    name: string;
  };

  supplier: {
    id: number;
    name: string;
  };

  purchaseOrder: {
    id: number;
    purchaseOrderNumber: string;
  };

  receivedBy: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export interface GoodsReceiptSummary {
  totalReceipts: number;

  received: number;

  verified: number;

  cancelled: number;

  totalReceivedItems: number;

  totalRejectedItems: number;
}

export interface GoodsReceiptDashboardResponse {
  summary: GoodsReceiptSummary;

  receipts: GoodsReceiptCard[];
}

/*
|--------------------------------------------------------------------------
| Details
|--------------------------------------------------------------------------
*/

export interface GoodsReceiptItem {
  id: number;

  product: {
    id: number;

    name: string;

    sku: string;
  };

  orderedQuantity: number;

  receivedQuantity: number;

  rejectedQuantity: number;

  acceptedQuantity: number;

  unitCost: number;

  remarks?: string | null;
}

export interface GoodsReceiptDetails {
  id: number;

  receiptNumber: string;

  supplier: {
    id: number;

    name: string;
  };

  warehouse: {
    id: number;

    name: string;
  };

  purchaseOrder: {
    id: number;

    purchaseOrderNumber: string;
  };

  receivedBy: {
    id: number;

    firstName: string;

    lastName: string;
  };

  verifiedBy?: {
    id: number;

    firstName: string;

    lastName: string;
  } | null;

  status:
    | "DRAFT"
    | "RECEIVED"
    | "VERIFIED"
    | "CANCELLED";

  supplierInvoiceNumber?: string | null;

  supplierDeliveryNote?: string | null;

  truckNumber?: string | null;

  driverName?: string | null;

  remarks?: string | null;

  totalReceivedItems: number;

  totalRejectedItems: number;

  verifiedAt?: string | null;

  createdAt: string;

  items: GoodsReceiptItem[];
}

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export async function getDashboard() {
  const response =
    await api.get<GoodsReceiptDashboardResponse>(
      "/goods-receipts/dashboard"
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| List
|--------------------------------------------------------------------------
*/

export async function getGoodsReceipts(
  page = 1,
  search = ""
) {
  const response =
    await api.get(
      "/goods-receipts",
      {
        params: {
          page,
          search,
        },
      }
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Single
|--------------------------------------------------------------------------
*/

export async function getGoodsReceipt(
  id: number
) {
  const response =
    await api.get<GoodsReceiptDetails>(
      `/goods-receipts/${id}`
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

export async function createGoodsReceipt(
  data: any
) {
  const response =
    await api.post(
      "/goods-receipts",
      data
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export async function updateGoodsReceipt(
  id: number,
  data: any
) {
  const response =
    await api.patch(
      `/goods-receipts/${id}`,
      data
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Verify
|--------------------------------------------------------------------------
*/

export async function verifyGoodsReceipt(
  id: number
) {
  const response =
    await api.patch(
      `/goods-receipts/${id}/verify`
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export async function deleteGoodsReceipt(
  id: number
) {
  const response =
    await api.delete(
      `/goods-receipts/${id}`
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/

export async function restoreGoodsReceipt(
  id: number
) {
  const response =
    await api.patch(
      `/goods-receipts/${id}/restore`
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export async function getStatistics() {
  const response =
    await api.get(
      "/goods-receipts/stats"
    );

  return response.data;
}
export interface CreateGoodsReceiptRequest {
  purchaseOrderId: number;

  warehouseId: number;

  supplierInvoiceNumber?: string;

  supplierDeliveryNote?: string;

  truckNumber?: string;

  driverName?: string;

  remarks?: string;

  items: {
    purchaseOrderItemId: number;

    receivedQuantity: number;

    rejectedQuantity: number;

    remarks?: string;
  }[];
}

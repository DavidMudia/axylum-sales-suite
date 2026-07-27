import api from "./axios";

/*
|--------------------------------------------------------------------------
| Shared Types
|--------------------------------------------------------------------------
*/

export type WarehouseStatus =
  | "ACTIVE"
  | "INACTIVE";

export interface Inventory {
  id: number;
  quantity: number;

  product: {
    id: number;
    name: string;
    sku?: string | null;
    costPrice: number;



    brand?: {
      id: number;
      name: string;
    };
  };
}

export interface PurchaseOrder {
  id: number;
  purchaseOrderNumber?: string;
  status: string;
  createdAt: string;
}

export interface GoodsReceipt {
  id: number;
  goodsReceiptNumber?: string;
  status: string;
  createdAt: string;
}

export interface StockCount {
  id: number;
  createdAt: string;
}

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export interface WarehouseCard {
  id: number;

  name: string;

  code: string;

  managerName: string | null;

  status: WarehouseStatus;

  isPrimary: boolean;

  products: number;

  inventoryValue: number;

  lowStock: number;

  outOfStock: number;

  goodsReceipts: number;

  purchaseOrders: number;

  stockCounts: number;
}

export interface WarehouseSummary {
  totalWarehouses: number;

  activeWarehouses: number;

  inventoryRecords: number;

  inventoryValue: number;

  goodsReceipts: number;

  purchaseOrders: number;
}

export interface WarehouseDashboardResponse {
  summary: WarehouseSummary;

  warehouses: WarehouseCard[];
}

/*
|--------------------------------------------------------------------------
| Warehouse Details
|--------------------------------------------------------------------------
*/

export interface WarehouseDetails {
  id: number;

  name: string;

  code: string;

  description?: string | null;

  address?: string | null;

  city: string | null;

  state: string | null;

  country?: string | null;

  phone?: string | null;

  email?: string | null;

  managerName: string | null;

  status: WarehouseStatus;

  isPrimary: boolean;

  inventories: Inventory[];

  purchaseOrders: PurchaseOrder[];

  goodsReceipts: GoodsReceipt[];

  stockCounts: StockCount[];
}

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export async function getDashboard() {
  const response =
    await api.get<WarehouseDashboardResponse>(
      "/warehouses/dashboard"
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Warehouses
|--------------------------------------------------------------------------
*/

export async function getWarehouses(
  page = 1,
  search = ""
) {
  const response = await api.get(
    "/warehouses",
    {
      params: {
        page,
        search,
      },
    }
  );

  return response.data;
}

export async function getWarehouse(
  id: number
) {
  const response =
    await api.get<WarehouseDetails>(
      `/warehouses/${id}`
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

export async function createWarehouse(
  data: unknown
) {
  const response =
    await api.post(
      "/warehouses",
      data
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export async function updateWarehouse(
  id: number,
  data: unknown
) {
  const response =
    await api.patch(
      `/warehouses/${id}`,
      data
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Status
|--------------------------------------------------------------------------
*/

export async function activateWarehouse(
  id: number
) {
  return api.patch(
    `/warehouses/${id}/activate`
  );
}

export async function deactivateWarehouse(
  id: number
) {
  return api.patch(
    `/warehouses/${id}/deactivate`
  );
}

/*
|--------------------------------------------------------------------------
| Delete / Restore
|--------------------------------------------------------------------------
*/

export async function deleteWarehouse(
  id: number
) {
  return api.delete(
    `/warehouses/${id}`
  );
}

export async function restoreWarehouse(
  id: number
) {
  return api.patch(
    `/warehouses/${id}/restore`
  );
}
export interface WarehouseOption {
  id: number;
  name: string;
}

export async function getWarehouseOptions() {
  const response =
    await api.get("/warehouses");

  return response.data.data.map(
    (warehouse: any) => ({
      id: warehouse.id,
      name: warehouse.name,
    })
  );
}
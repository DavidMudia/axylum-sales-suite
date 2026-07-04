export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  status:
    | "IN_STOCK"
    | "LOW_STOCK"
    | "OUT_OF_STOCK";

  createdAt: string;
}
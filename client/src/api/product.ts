// src/api/product.ts
import api from "./axios";

// ============================================================
// Types
// ============================================================

export interface Product {
  id: number;
  name: string;
  sku?: string | null;
  barcode?: string | null;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  minimumStock: number;
  reorderLevel: number;
  description?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================
// API functions
// ============================================================

export const getProducts = (search = "", page = 1) =>
  api.get(`/products?search=${search}&page=${page}`).then(r => r.data);

export const getProduct = (id: number) =>
  api.get(`/products/${id}`).then(r => r.data);

export const createProduct = (data: any) =>
  api.post("/products", data).then(r => r.data);

export const updateProduct = (id: number, data: any) =>
  api.patch(`/products/${id}`, data).then(r => r.data);

export const deleteProduct = (id: number) =>
  api.delete(`/products/${id}`);

export const getProductStats = () =>
  api.get("/products/stats").then(r => r.data);
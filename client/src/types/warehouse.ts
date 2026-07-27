export interface Warehouse {
  id: number;

  name: string;

  code: string;

  description?: string;

  address?: string;

  city?: string;

  state?: string;

  country?: string;

  phone?: string;

  email?: string;

  managerName?: string;

  status:
    | "ACTIVE"
    | "INACTIVE";

  isPrimary: boolean;

  createdAt: string;

  updatedAt: string;
}
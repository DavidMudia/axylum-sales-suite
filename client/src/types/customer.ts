export interface Customer {
  id: number;
  name: string;
  companyName?: string;
  email?: string;
  phone: string;
  status: string;
  city?: string;
  country?: string;
}
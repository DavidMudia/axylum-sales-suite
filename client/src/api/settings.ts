import api from './axios';

export interface Settings {
  id: number;
  companyName: string;
  industry?: string;
  registrationNumber?: string;
  taxNumber?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  currency: string;
  currencySymbol: string;
  tax: number;
  quotePrefix: string;
  invoicePrefix: string;
  paymentPrefix: string;
  expensePrefix: string;
  quoteValidity: number;
  invoiceDueDays: number;
  decimalPlaces: number;
  theme: 'LIGHT' | 'DARK' | 'SYSTEM';
  primaryColor: string;
  compactMode: boolean;
  sidebarCollapsed: boolean;
  fontSize: 'SMALL' | 'MEDIUM' | 'LARGE';
  tableDensity: 'COMFORTABLE' | 'COMPACT' | 'SPACIOUS';
  companyLogo?: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
}

export const getSettings = async (): Promise<Settings> => {
  const res = await api.get('/settings');
  return res.data;
};

export const updateSettings = async (data: Partial<Settings>): Promise<Settings> => {
  const res = await api.patch('/settings', data);
  return res.data;
};
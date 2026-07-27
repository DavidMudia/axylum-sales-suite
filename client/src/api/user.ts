// src/api/user.ts
import api from './axios';

export interface User {
  id: number;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roleId: number;
  role: {
    id: number;
    name: string;
    displayName: string;
  };
  isActive: boolean;
  profileImage?: string;
  loginAllowedFromMobile: boolean;
  loginAllowedFromDesktop: boolean;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  lockedUsers: number;
}

export const getUsers = async (search?: string, page = 1, limit = 20): Promise<UsersResponse> => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  params.append('page', String(page));
  params.append('limit', String(limit));
  const res = await api.get(`/users?${params.toString()}`);
  return res.data;
};

export const getUser = async (id: number): Promise<User> => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const createUser = async (data: any): Promise<User> => {
  const res = await api.post('/users', data);
  return res.data;
};

export const updateUser = async (id: number, data: any): Promise<User> => {
  const res = await api.patch(`/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};

export const activateUser = async (id: number): Promise<User> => {
  const res = await api.patch(`/users/${id}/activate`);
  return res.data;
};

export const deactivateUser = async (id: number): Promise<User> => {
  const res = await api.patch(`/users/${id}/deactivate`);
  return res.data;
};

export const changeUserPassword = async (id: number, data: any): Promise<void> => {
  await api.patch(`/users/${id}/change-password`, data);
};

export const getUserStats = async (): Promise<UserStats> => {
  const res = await api.get('/users/stats');
  return res.data;
};
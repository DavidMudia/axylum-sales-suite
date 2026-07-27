// src/api/role.ts
import api from './axios';

export interface Permission {
  id: number;
  module: string;
  action: string;
  name: string;
  description?: string;
}

export interface Role {
  id: number;
  name: string;
  displayName: string;
  description?: string;
  color?: string;
  isSystem: boolean;
  rolePermissions: {
    permission: Permission;
  }[];
  users?: { id: number }[];
}

export interface RolesResponse {
  data: Role[];
}

export const getRoles = async (): Promise<RolesResponse> => {
  const res = await api.get('/roles');
  return res.data;
};

export const createRole = async (data: any): Promise<Role> => {
  const res = await api.post('/roles', data);
  return res.data;
};

export const updateRole = async (id: number, data: any): Promise<Role> => {
  const res = await api.patch(`/roles/${id}`, data);
  return res.data;
};

export const deleteRole = async (id: number): Promise<void> => {
  await api.delete(`/roles/${id}`);
};
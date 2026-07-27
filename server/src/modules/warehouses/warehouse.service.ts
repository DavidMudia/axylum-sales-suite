import { Prisma } from "@prisma/client";

import { AppError } from "../../utils/AppError";

import * as repository from "./warehouse.repository";

import {
  CreateWarehouseInput,
  UpdateWarehouseInput,
} from "./warehouse.schema";

/*
|--------------------------------------------------------------------------
| Create Warehouse
|--------------------------------------------------------------------------
*/

export async function create(
  data: CreateWarehouseInput
) {
  const existing =
    await repository.findByCode(data.code);

  if (existing) {
    throw new AppError(
      "Warehouse code already exists.",
      409
    );
  }

  return repository.create(data);
}

/*
|--------------------------------------------------------------------------
| Get All
|--------------------------------------------------------------------------
*/

export async function getAll(
  search?: string,
  page = 1,
  limit = 20
) {
  const warehouses =
    await repository.findAll(
      search,
      page,
      limit
    );

  const total =
    await repository.count(search);

  return {
    data: warehouses,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(
        total / limit
      ),
    },
  };
}
/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Get One
|--------------------------------------------------------------------------
*/

export async function getOne(
  id: number
) {
  const warehouse =
    await repository.findById(id);

  if (!warehouse) {
    throw new AppError(
      "Warehouse not found.",
      404
    );
  }

  return warehouse;
}

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export async function update(
  id: number,
  data: UpdateWarehouseInput
) {
  await getOne(id);

  if (data.code) {
    const existing =
      await repository.findByCode(
        data.code
      );

    if (
      existing &&
      existing.id !== id
    ) {
      throw new AppError(
        "Warehouse code already exists.",
        409
      );
    }
  }

  const updateData: Prisma.WarehouseUpdateInput =
    {};

  if (data.name !== undefined)
    updateData.name = data.name;

  if (data.code !== undefined)
    updateData.code = data.code;

  if (data.address !== undefined)
    updateData.address =
      data.address;

  if (data.city !== undefined)
    updateData.city =
      data.city;

  if (data.state !== undefined)
    updateData.state =
      data.state;

  if (data.country !== undefined)
    updateData.country =
      data.country;

  if (data.phone !== undefined)
    updateData.phone =
      data.phone;

  if (data.managerName !== undefined)
    updateData.managerName =
  data.managerName;

  if (data.isPrimary !== undefined)
    updateData.isPrimary =
      data.isPrimary;

  return repository.update(
    id,
    updateData
  );
}

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export async function remove(
  id: number
) {
  const warehouse =
    await getOne(id);

  if (
    warehouse.inventories.length > 0
  ) {
    throw new AppError(
      "Warehouse cannot be deleted because inventory exists.",
      400
    );
  }

  return repository.softDelete(id);
}

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/

export async function restore(
  id: number
) {
  return repository.restore(id);
}

/*
|--------------------------------------------------------------------------
| Activate Warehouse
|--------------------------------------------------------------------------
*/

export async function activate(
  id: number
) {
  await getOne(id);

  return repository.activate(id);
}

/*
|--------------------------------------------------------------------------
| Deactivate Warehouse
|--------------------------------------------------------------------------
*/

export async function deactivate(
  id: number
) {
  await getOne(id);

  return repository.deactivate(id);
}
/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export async function stats() {
  return repository.getStats();
}
/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export async function dashboard() {
  return repository.getDashboard();
}
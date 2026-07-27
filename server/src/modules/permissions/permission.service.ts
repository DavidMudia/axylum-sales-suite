import { AppError } from "../../utils/AppError";
import { PermissionAction } from "@prisma/client";
import * as repository from "./permission.repository";

/*
|--------------------------------------------------------------------------
| Get All
|--------------------------------------------------------------------------
*/

export function getAll() {
  return repository.findAll();
}

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

export async function create(
  name: string,
  module: string,
  action: PermissionAction,
  description?: string
) {
  name = name.trim().toLowerCase();

  const existing =
    await repository.findByName(name);

  if (existing) {
    throw new AppError(
      "Permission already exists.",
      400
    );
  }

  return repository.create({
  name,
  module,
  action,
  description,
});
}

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export async function remove(
  id: number
) {
  const permission =
    await repository.findById(id);

  if (!permission) {
    throw new AppError(
      "Permission not found.",
      404
    );
  }

  return repository.remove(id);
}
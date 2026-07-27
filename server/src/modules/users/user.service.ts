import bcrypt from "bcrypt";

import { Prisma } from "@prisma/client";

import { AppError } from "../../utils/AppError";

import * as repository from "./user.repository";

import {
  CreateUserInput,
  UpdateUserInput,
} from "./user.schema";

import prisma from "../../lib/prisma";

/*
|--------------------------------------------------------------------------
| Create User
|--------------------------------------------------------------------------
*/

export async function create(
  data: CreateUserInput
) {
  const existingEmail =
    await repository.findByEmail(
      data.email
    );

  if (existingEmail) {
    throw new AppError(
      "Email already exists.",
      409
    );
  }

  const existingEmployee =
    await repository.findByEmployeeNumber(
      data.employeeNumber
    );

  if (existingEmployee) {
    throw new AppError(
      "Employee number already exists.",
      409
    );
  }

  const role =
    await prisma.role.findUnique({
      where: {
        id: data.roleId,
      },
    });

  if (!role) {
    throw new AppError(
      "Role not found.",
      404
    );
  }

  const password =
    await bcrypt.hash(
      data.password,
      12
    );

  const createData: Prisma.UserCreateInput =
    {
      employeeNumber:
        data.employeeNumber,

      firstName:
        data.firstName,

      lastName:
        data.lastName,

      email:
        data.email,

      phone:
        data.phone,

      password,

      mustChangePassword: true,

      role: {
        connect: {
          id: data.roleId,
        },
      },
    };

  return repository.create(
    createData
  );
}

/*
|--------------------------------------------------------------------------
| Get All Users
|--------------------------------------------------------------------------
*/

export async function getAll(
  search?: string,
  page = 1,
  limit = 20
) {
  const users =
    await repository.findAll(
      search,
      page,
      limit
    );

  const total =
    await repository.count(
      search
    );

  return {
    data: users,

    pagination: {
      page,

      limit,

      total,

      totalPages:
        Math.ceil(
          total / limit
        ),
    },
  };
}

/*
|--------------------------------------------------------------------------
| Get One User
|--------------------------------------------------------------------------
*/

export async function getOne(
  id: number
) {
  const user =
    await repository.findById(
      id
    );

  if (!user) {
    throw new AppError(
      "User not found.",
      404
    );
  }

  return user;
}

/*
|--------------------------------------------------------------------------
| Update User
|--------------------------------------------------------------------------
*/

export async function update(id: number, data: any) {
  // 1. Verify admin password
  if (!data.adminPassword) throw new AppError("Admin password is required", 400);
  const currentUser = await prisma.user.findUnique({
    where: { id: data.currentUserId }, // we need to pass the logged-in user's id
    select: { password: true },
  });
  if (!currentUser) throw new AppError("User not found", 404);
  const isValid = await bcrypt.compare(data.adminPassword, currentUser.password);
  if (!isValid) throw new AppError("Invalid admin password", 401);

  // 2. Remove sensitive fields
  delete data.adminPassword;
  delete data.currentUserId;

  // 3. Update user
  return repository.update(id, data);
}
/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Activate
|--------------------------------------------------------------------------
*/

export async function activate(
  id: number
) {
  await getOne(id);

  return repository.activate(
    id
  );
}

/*
|--------------------------------------------------------------------------
| Deactivate
|--------------------------------------------------------------------------
*/

export async function deactivate(
  id: number
) {
  await getOne(id);

  return repository.deactivate(
    id
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
  await getOne(id);

  return repository.softDelete(
    id
  );
}

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/

export async function restore(
  id: number
) {
  const user =
    await prisma.user.findUnique({
      where: {
        id,
      },
    });

  if (
    !user ||
    !user.deletedAt
  ) {
    throw new AppError(
      "User not found.",
      404
    );
  }

  return repository.restore(
    id
  );
}

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export async function stats() {
  return repository.getStats();
}
export async function changePassword(userId: number, currentPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("User not found.", 404);
  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) throw new AppError("Current password is incorrect.", 401);
  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed, passwordChangedAt: new Date() },
  });
}
import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client";

/*
|--------------------------------------------------------------------------
| Create User
|--------------------------------------------------------------------------
*/

export function create(
  data: Prisma.UserCreateInput
) {
  return prisma.user.create({
    data,

    include: {
      role: true,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Find All Users
|--------------------------------------------------------------------------
*/

export function findAll(
  search?: string,
  page = 1,
  limit = 20
) {
  return prisma.user.findMany({
    where: {
      deletedAt: null,

      ...(search && {
        OR: [
          {
            firstName: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            employeeNumber: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
    },

    include: {
      role: true,
    },

    orderBy: {
      firstName: "asc",
    },

    skip: (page - 1) * limit,

    take: limit,
  });
}

/*
|--------------------------------------------------------------------------
| Count Users
|--------------------------------------------------------------------------
*/

export function count(
  search?: string
) {
  return prisma.user.count({
    where: {
      deletedAt: null,

      ...(search && {
        OR: [
          {
            firstName: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            employeeNumber: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
    },
  });
}

/*
|--------------------------------------------------------------------------
| Find By ID
|--------------------------------------------------------------------------
*/

export function findById(
  id: number
) {
  return prisma.user.findFirst({
    where: {
      id,
      deletedAt: null,
    },

    include: {
      role: true,

      settings: true,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Find By Email
|--------------------------------------------------------------------------
*/

export function findByEmail(
  email: string
) {
  return prisma.user.findUnique({
    where: {
      email,
    },

    include: {
      role: true,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Find By Employee Number
|--------------------------------------------------------------------------
*/

export function findByEmployeeNumber(
  employeeNumber: string
) {
  return prisma.user.findUnique({
    where: {
      employeeNumber,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Update User
|--------------------------------------------------------------------------
*/

export function update(
  id: number,
  data: Prisma.UserUpdateInput
) {
  return prisma.user.update({
    where: {
      id,
    },

    data,

    include: {
      role: true,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Update Password
|--------------------------------------------------------------------------
*/

export function updatePassword(
  id: number,
  password: string,
  mustChangePassword = false
) {
  return prisma.user.update({
    where: {
      id,
    },

    data: {
      password,

      mustChangePassword,

      passwordChangedAt:
        new Date(),

      failedLoginAttempts: 0,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Activate User
|--------------------------------------------------------------------------
*/

export function activate(
  id: number
) {
  return prisma.user.update({
    where: {
      id,
    },

    data: {
      isActive: true,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Deactivate User
|--------------------------------------------------------------------------
*/

export function deactivate(
  id: number
) {
  return prisma.user.update({
    where: {
      id,
    },

    data: {
      isActive: false,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Soft Delete
|--------------------------------------------------------------------------
*/

export function softDelete(
  id: number
) {
  return prisma.user.update({
    where: {
      id,
    },

    data: {
      deletedAt: new Date(),
    },
  });
}

/*
|--------------------------------------------------------------------------
| Restore User
|--------------------------------------------------------------------------
*/

export function restore(
  id: number
) {
  return prisma.user.update({
    where: {
      id,
    },

    data: {
      deletedAt: null,
    },
  });
}

/*
|--------------------------------------------------------------------------
| User Statistics
|--------------------------------------------------------------------------
*/

export async function getStats() {
  const [
    total,
    active,
    inactive,
    locked,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        deletedAt: null,
      },
    }),

    prisma.user.count({
      where: {
        isActive: true,
        deletedAt: null,
      },
    }),

    prisma.user.count({
      where: {
        isActive: false,
        deletedAt: null,
      },
    }),

    prisma.user.count({
      where: {
        failedLoginAttempts: {
          gte: 5,
        },

        deletedAt: null,
      },
    }),
  ]);

  return {
    totalUsers: total,

    activeUsers: active,

    inactiveUsers: inactive,

    lockedUsers: locked,
  };
}
import prisma from "../../lib/prisma";
import {
  Prisma,
  WaybillStatus,
} from "@prisma/client";

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

export function create(
  data: Prisma.WaybillCreateInput
) {
  return prisma.waybill.create({
    data,

    include: {
      invoice: true,
      vehicle: true,
      driver: true,
      warehouse: true,
      createdBy: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

/*
|--------------------------------------------------------------------------
| Find All
|--------------------------------------------------------------------------
*/

export function findAll(
  search?: string,
  status?: WaybillStatus,
  page = 1,
  limit = 20
) {
  return prisma.waybill.findMany({

    where: {

      ...(search && {
        OR: [
          {
            waybillNumber: {
              contains: search,
              mode: "insensitive",
            },
          },

          {
            destination: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),

      ...(status && {
        status,
      }),
    },

    include: {

      invoice: true,

      vehicle: true,

      driver: true,

      warehouse: true,

      createdBy: true,

      _count: {
        select: {
          items: true,
        },
      },

    },

    orderBy: {
      createdAt: "desc",
    },

    skip: (page - 1) * limit,

    take: limit,

  });
}

/*
|--------------------------------------------------------------------------
| Count
|--------------------------------------------------------------------------
*/

export function count(
  search?: string,
  status?: WaybillStatus
) {
  return prisma.waybill.count({

    where: {

      ...(search && {
        OR: [

          {
            waybillNumber: {
              contains: search,
              mode: "insensitive",
            },
          },

          {
            destination: {
              contains: search,
              mode: "insensitive",
            },
          },

        ],
      }),

      ...(status && {
        status,
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
  return prisma.waybill.findUnique({

    where: {
      id,
    },

    include: {

      invoice: true,

      vehicle: true,

      driver: true,

      warehouse: true,

      createdBy: true,

      items: {
        include: {
          product: true,
        },
      },

    },

  });
}

/*
|--------------------------------------------------------------------------
| Find By Number
|--------------------------------------------------------------------------
*/

export function findByNumber(
  waybillNumber: string
) {
  return prisma.waybill.findUnique({

    where: {
      waybillNumber,
    },

  });
}

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export function update(
  id: number,
  data: Prisma.WaybillUpdateInput
) {
  return prisma.waybill.update({

    where: {
      id,
    },

    data,

    include: {

      invoice: true,

      vehicle: true,

      driver: true,

      warehouse: true,

      createdBy: true,

      items: {
        include: {
          product: true,
        },
      },

    },

  });
}

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export async function getStats() {

  const [

    total,

    pending,

    loading,

    inTransit,

    delivered,

    returned,

    cancelled,

  ] = await Promise.all([

    prisma.waybill.count(),

    prisma.waybill.count({
      where: {
        status: WaybillStatus.PENDING,
      },
    }),

    prisma.waybill.count({
      where: {
        status: WaybillStatus.LOADING,
      },
    }),

    prisma.waybill.count({
      where: {
        status: WaybillStatus.IN_TRANSIT,
      },
    }),

    prisma.waybill.count({
      where: {
        status: WaybillStatus.DELIVERED,
      },
    }),

    prisma.waybill.count({
      where: {
        status: WaybillStatus.RETURNED,
      },
    }),

    prisma.waybill.count({
      where: {
        status: WaybillStatus.CANCELLED,
      },
    }),

  ]);

  return {

    totalWaybills: total,

    pending,

    loading,

    inTransit,

    delivered,

    returned,

    cancelled,

  };

}
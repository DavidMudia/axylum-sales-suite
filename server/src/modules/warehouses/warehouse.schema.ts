import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Create Warehouse
|--------------------------------------------------------------------------
*/

export const createWarehouseSchema =
  z.object({

    name: z
      .string()
      .min(2)
      .max(100),

    code: z
      .string()
      .min(2)
      .max(20),

    description:
      z.string().optional(),

    address:
      z.string().optional(),

    city:
      z.string().optional(),

    state:
      z.string().optional(),

    country:
      z.string().optional(),

    phone:
      z.string().optional(),

    email:
      z.string().email().optional(),

    managerName:
      z.string().optional(),

    isPrimary:
      z.boolean().optional(),
  });

/*
|--------------------------------------------------------------------------
| Update Warehouse
|--------------------------------------------------------------------------
*/

export const updateWarehouseSchema =
  createWarehouseSchema.partial();

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

export type CreateWarehouseInput =
  z.infer<
    typeof createWarehouseSchema
  >;

export type UpdateWarehouseInput =
  z.infer<
    typeof updateWarehouseSchema
  >;
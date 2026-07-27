import { Prisma, DocumentType } from "@prisma/client";

import prisma from "../../lib/prisma";

import { AppError } from "../../utils/AppError";

import * as repository from "./customer.repository";

import { generateDocumentNumber } from "../document-number/document-number.service";

/*
|--------------------------------------------------------------------------
| Create Customer
|--------------------------------------------------------------------------
*/

export async function create(
  data: Prisma.CustomerCreateInput
) {

  const existing =
    await repository.findByName(
      data.name as string
    );

  if (existing) {
    throw new AppError(
      "Customer already exists.",
      400
    );
  }

  if (data.email) {

    const emailExists =
      await prisma.customer.findFirst({

        where: {
          email: data.email as string,
          isDeleted: false,
        },

      });

    if (emailExists) {
      throw new AppError(
        "Email already exists.",
        400
      );
    }

  }

  if (data.phone) {

    const phoneExists =
      await prisma.customer.findFirst({

        where: {
          phone: data.phone as string,
          isDeleted: false,
        },

      });

    if (phoneExists) {
      throw new AppError(
        "Phone number already exists.",
        400
      );
    }

  }

  const customerNumber =
    await generateDocumentNumber(
      DocumentType.CUSTOMER
    );

  return repository.create({

    ...data,

    customerNumber,

  });

}

/*
|--------------------------------------------------------------------------
| Get Customers
|--------------------------------------------------------------------------
*/

export async function getAll(
  search?: string,
  page = 1,
  limit = 20
) {

  const customers =
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

    data: customers,

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
| Get Customer
|--------------------------------------------------------------------------
*/

export async function getOne(
  id: number
) {

  const customer =
    await repository.findById(id);

  if (!customer) {
    throw new AppError(
      "Customer not found.",
      404
    );
  }

  return customer;

}

/*
|--------------------------------------------------------------------------
| Update Customer
|--------------------------------------------------------------------------
*/

export async function update(
  id: number,
  data: Prisma.CustomerUpdateInput
) {

  await getOne(id);

  return repository.update(
    id,
    data
  );

}

/*
|--------------------------------------------------------------------------
| Delete Customer
|--------------------------------------------------------------------------
*/

export async function remove(
  id: number
) {

  const customer =
    await getOne(id);

  if (
    customer.outstandingBalance.toNumber() > 0
  ) {
    throw new AppError(
      "Customer has an outstanding balance and cannot be deleted.",
      400
    );
  }

  return repository.softDelete(id);

}

/*
|--------------------------------------------------------------------------
| Restore Customer
|--------------------------------------------------------------------------
*/

export async function restore(
  id: number
) {

  await getOne(id);

  return repository.restore(id);

}

/*
|--------------------------------------------------------------------------
| Customer Statistics
|--------------------------------------------------------------------------
*/

export async function stats() {

  return repository.getStats();

}
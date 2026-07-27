import { PrismaClient, DocumentType } from "@prisma/client";

const prisma = new PrismaClient();

/*
|--------------------------------------------------------------------------
| Find Sequence
|--------------------------------------------------------------------------
*/

export async function findSequence(
  type: DocumentType,
  year: number
) {
  return prisma.documentSequence.findUnique({
    where: {
      type_year: {
        type,
        year,
      },
    },
  });
}

/*
|--------------------------------------------------------------------------
| Create Sequence
|--------------------------------------------------------------------------
*/

export async function createSequence(
  type: DocumentType,
  year: number
) {
  return prisma.documentSequence.create({
    data: {
      type,
      year,
      currentNumber: 1,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Increment Sequence
|--------------------------------------------------------------------------
*/

export async function incrementSequence(
  id: number
) {
  return prisma.documentSequence.update({
    where: {
      id,
    },
    data: {
      currentNumber: {
        increment: 1,
      },
    },
  });
}
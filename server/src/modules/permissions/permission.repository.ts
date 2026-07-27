import prisma from "../../lib/prisma";
import {

PermissionAction

} from "@prisma/client";

/*
|--------------------------------------------------------------------------
| Find All
|--------------------------------------------------------------------------
*/

export function findAll() {
  return prisma.permission.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

/*
|--------------------------------------------------------------------------
| Find By ID
|--------------------------------------------------------------------------
*/

export function findById(id: number) {
  return prisma.permission.findUnique({
    where: {
      id,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Find By Name
|--------------------------------------------------------------------------
*/

export function findByName(
  name: string
) {
  return prisma.permission.findUnique({
    where: {
      name,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

export function create(data:{

    name:string;

    module:string;

    action:PermissionAction;

    description?:string;

})
{
  return prisma.permission.create({
    data,
  });
}
/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export function remove(id: number) {
  return prisma.permission.delete({
    where: {
      id,
    },
  });
}
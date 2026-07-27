import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";

import prisma from "../../lib/prisma";
import { env } from "../../config/env";
import { AppError } from "../../utils/AppError";

import {
  RegisterInput,
  LoginInput,
} from "./auth.schema";

export async function registerUser(
  data: RegisterInput
) {
  const existing =
    await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

  if (existing) {
    throw new AppError(
      "Email already exists.",
      409
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      data.password,
      10
    );

  const user =
    await prisma.user.create({
      data: {
        firstName:
          data.firstName,

        lastName:
          data.lastName,

        employeeNumber:
          data.employeeNumber,

        email:
          data.email,

        password:
          hashedPassword,

        role: {
          connect: {
            id: data.roleId,
          },
        },
      },

      include: {
        role: true,
      },
    });

  return {
    id: user.id,

    employeeNumber:
      user.employeeNumber,

    firstName:
      user.firstName,

    lastName:
      user.lastName,

    email:
      user.email,

    role:
      user.role.name,
  };
}
export async function loginUser(
  data: LoginInput
) {
  const user =
    await prisma.user.findUnique({
      where: {
        email: data.email,
      },

      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

  if (!user) {
    throw new AppError(
      "Invalid email or password",
      401
    );
  }

  const passwordMatches =
    await bcrypt.compare(
      data.password,
      user.password
    );

  if (!passwordMatches) {
    throw new AppError(
      "Invalid email or password",
      401
    );
  }

  if (!user.isActive) {
    throw new AppError(
      "This account has been disabled.",
      403
    );
  }

  const signOptions: SignOptions = {
    expiresIn:
      env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  const token = jwt.sign(

{

id: user.id,

email: user.email,

roleId: user.roleId

},

env.JWT_SECRET,

signOptions

);

  return {
    token,

    user: {
  id: user.id,

  employeeNumber: user.employeeNumber,

  firstName: user.firstName,

  lastName: user.lastName,

  email: user.email,

  role: user.role.name,

  permissions:
    user.role.rolePermissions.map(
      (rp) => rp.permission.name
    ),
},
  };
}
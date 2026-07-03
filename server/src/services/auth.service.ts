import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";

import prisma from "../lib/prisma";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

import {
  RegisterInput,
  LoginInput,
} from "../schemas/auth.schema";

export async function registerUser(data: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return user;
}

export async function loginUser(data: LoginInput) {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  // Never reveal whether the email or password was incorrect
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const passwordMatches = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!passwordMatches) {
    throw new AppError("Invalid email or password", 401);
  }

  const signOptions: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    env.JWT_SECRET,
    signOptions
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}
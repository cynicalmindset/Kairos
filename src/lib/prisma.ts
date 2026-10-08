import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" && process.env.DEBUG_PRISMA ? ["query", "info", "warn", "error"] : ["error"],
});
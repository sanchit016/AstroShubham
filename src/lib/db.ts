import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL;

let prismaInstance: PrismaClient;

if (typeof window === "undefined") {
  const fallbackUrl = "postgresql://postgres:postgres@localhost:5432/astroshubham";
  
  if (!globalForPrisma.prisma) {
    const pool = new Pool({
      connectionString: connectionString || fallbackUrl,
      max: 5,
      connectionTimeoutMillis: 5000,
    });
    const adapter = new PrismaPg(pool);
    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log: ["error", "warn"],
    });
  }
  prismaInstance = globalForPrisma.prisma;
} else {
  prismaInstance = {} as PrismaClient;
}

export const db = prismaInstance;

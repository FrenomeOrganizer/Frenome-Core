import { PrismaPg } from "@prisma/adapter-pg";
import prismaClientPackage from "@prisma/client";
import { Pool } from "pg";

const { PrismaClient } = prismaClientPackage as unknown as {
  PrismaClient: new (options: { adapter: PrismaPg }) => {
    user: {
      findUnique: (...args: unknown[]) => Promise<unknown>;
      findMany: (...args: unknown[]) => Promise<unknown>;
      create: (...args: unknown[]) => Promise<unknown>;
    };
  };
};

type PrismaClientInstance = InstanceType<typeof PrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientInstance | undefined;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

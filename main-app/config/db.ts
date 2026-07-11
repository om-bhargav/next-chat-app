import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

// Attach adapter
const adapter = new PrismaPg({
  connectionString,
});

// Global cache (important for Next.js hot reload)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create or reuse instance
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

// Save to global in dev
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
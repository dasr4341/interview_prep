import { PrismaClient } from '@prisma/client';
import { config } from '../../config/config.js';

const client = new PrismaClient({
  datasourceUrl: config.db.postgresql.base_url,
});

interface Context {
  prisma: PrismaClient;
}

export const context: Context = {
  get prisma() {
    return client;
  },
};

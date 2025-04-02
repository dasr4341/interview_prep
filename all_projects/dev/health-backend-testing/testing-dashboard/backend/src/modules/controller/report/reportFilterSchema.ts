import { z } from 'zod';

export const reportFilterSchema = z
  .object({
    facilityId: z.string(),
    date: z.string().regex(/^(\d{2}-\d{2}-\d{4})$/),
  })
  .strict();

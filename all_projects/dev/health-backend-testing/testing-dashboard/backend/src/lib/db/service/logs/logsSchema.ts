import { z } from 'zod';

export const reportLogsPayload = z
  .object({
    userId: z.string(),
    date: z.string()
  })
  .strict();

export type ReportLogsPayload = z.infer<typeof reportLogsPayload>;

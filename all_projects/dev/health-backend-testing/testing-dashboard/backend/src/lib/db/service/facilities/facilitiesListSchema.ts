import { z } from 'zod';

export const facilitiesListPayload = z
  .object({
    clientId: z.optional(z.string()),
    facilityId: z.optional(z.string()),
    date: z.optional(z.string()),
  })
  .strict();

export type FacilitiesListPayload = z.infer<typeof facilitiesListPayload>;

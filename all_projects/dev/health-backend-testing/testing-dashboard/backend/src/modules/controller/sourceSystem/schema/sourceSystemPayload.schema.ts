import { z } from 'zod';
import { PatientDischargeStatus } from '../../../../config/config.enum';

export const kipuSourceSystemPayload = z
  .object({
    facilityId: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    discharged: z.boolean(),
    inPatient: z.boolean(),
  })
  .strict();

export type KipuSourceSystemPayloadSchema = z.infer<typeof kipuSourceSystemPayload>;


export const rittenSourceSystemPayload = z
  .object({
    facilityId: z.string(),
    discharged: z.boolean(),
    inPatient: z.boolean(),
  })
  .strict();

export type RittenSourceSystemPayloadSchema = z.infer<typeof rittenSourceSystemPayload>;





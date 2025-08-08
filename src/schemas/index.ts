import { z } from "zod";

export const clinicSchema = z.object({
  name: z.string().min(2),
  document: z.string().min(11),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const doctorSchema = z.object({
  clinicId: z.string().min(1),
  name: z.string().min(2),
  crm: z.string().min(4),
  specialty: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export const contractSchema = z.object({
  clinicId: z.string().min(1),
  doctorId: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().optional(),
  revenueShare: z.coerce.number().min(0).max(1),
  isActive: z.boolean().default(true),
});

export const slotSchema = z.object({
  doctorId: z.string().min(1),
  weekday: z.number().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  durationMin: z.number().min(5).max(180),
});

export const patientSchema = z.object({
  name: z.string().min(2),
  document: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export const appointmentSchema = z.object({
  clinicId: z.string().min(1),
  doctorId: z.string().min(1),
  patientId: z.string().min(1),
  startsAt: z.string(), // ISO
});

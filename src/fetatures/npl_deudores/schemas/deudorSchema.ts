import z from 'zod';

export const DeudorSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, { error: 'El nombre es obligatorio' })
    .max(255, { error: 'El nombre no puede superar los 255 caracteres' }),
  dni: z.string().trim().max(20).optional().or(z.literal('')),
  direccionCompleta: z.string().trim().optional().or(z.literal('')),
  estadoOcupacional: z.string().trim().optional().or(z.literal('')),
  vulnerabilidad: z.string().trim().optional().or(z.literal('')),
  notas: z.string().trim().optional().or(z.literal('')),
  esPrincipal: z.boolean().default(false),
});

export type DeudorInput = z.input<typeof DeudorSchema>;

import z from 'zod';
import {
  TASK_CATEGORIES,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from '../types/task.types';

export const TaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { error: 'El título es obligatorio' })
    .max(200, { error: 'El título no puede superar los 200 caracteres' }),
  description: z
    .string()
    .trim()
    .min(10, { error: 'La descripción es obligatoria' }),
  expediente: z
    .string()
    .trim()
    .min(2, { error: 'El expediente es obligatorio' })
    .max(100, { error: 'El expediente no puede superar los 100 caracteres' }),
  communityId: z.uuid({ error: 'Selecciona una comunidad válida' }),
  status: z.enum(TASK_STATUSES, { error: 'Selecciona un estado válido' }),
  priority: z.enum(TASK_PRIORITIES, {
    error: 'Selecciona una prioridad válida',
  }),
  category: z.enum(TASK_CATEGORIES, {
    error: 'Selecciona una categoría válida',
  }),
  attachments: z.array(z.url()).default([]),
  assigneeId: z.string().trim().min(1, { error: 'Selecciona un responsable' }),
});

export const UpdateTaskStatusSchema = z.object({
  status: z.enum(['COMPLETADA', 'BLOQUEADA', 'CANCELADA', 'EN_CURSO', 'PENDIENTE']),
});

export type TaskInput = z.infer<typeof TaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof UpdateTaskStatusSchema>;

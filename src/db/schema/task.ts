import {
  pgEnum,
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { community } from './community';
import { users } from './auth-schema';

export const taskStatusEnum = pgEnum('task_status', [
  'PENDIENTE',
  'EN_CURSO',
  'COMPLETADA',
  'BLOQUEADA',
  'CANCELADA',
]);

export const taskPriorityEnum = pgEnum('task_priority', [
  'ALTA',
  'MEDIA',
  'BAJA',
]);

export const taskCategoryEnum = pgEnum('task_category', [
  'DUE_DILIGENCE',
  'LEGAL',
  'VALORACION',
  'NEGOCIACION',
  'CATASTRO',
  'SUBASTA',
  'ADMINISTRATIVO',
  'OTRO',
]);

export const task = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  expediente: varchar('expediente', { length: 100 }).notNull(),
  communityId: uuid('community_id')
    .notNull()
    .references(() => community.id, { onDelete: 'cascade' }),
  status: taskStatusEnum('status').notNull().default('PENDIENTE'),
  priority: taskPriorityEnum('priority').notNull().default('MEDIA'),
  category: taskCategoryEnum('category').notNull().default('OTRO'),
  attachments: text('attachments').array().notNull().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  completedAt: timestamp('completed_at'),
  creatorId: text('creator_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  assigneeId: text('assignee_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

export type TaskStatus = (typeof taskStatusEnum.enumValues)[number];
export type TaskPriority = (typeof taskPriorityEnum.enumValues)[number];
export type TaskCategory = (typeof taskCategoryEnum.enumValues)[number];

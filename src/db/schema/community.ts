// import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const community = pgTable('communities', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  image: varchar('image', { length: 120 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  createdBy: text('created_by').notNull(),
});

// segunda sintaxis para inferir tipos
// type InsertCommunity = InferInsertModel<typeof community>;
// type SelectCommunity = InferSelectModel<typeof community>;

// primera sintaxis que no necesita importar nada y es recomendada
// finalmente los llevamos a /communities/types
// type InsertCommunity = typeof community.$inferInsert;
// type SelectCommunity = typeof community.$inferSelect;

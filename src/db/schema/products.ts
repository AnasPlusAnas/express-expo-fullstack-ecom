import {
  pgTable,
  integer,
  varchar,
  text,
  doublePrecision,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod/v4';

export const productsTable = pgTable('products', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  image: varchar({ length: 255 }),
  price: doublePrecision().notNull(),
  quantity: integer().default(0),
});

export const createProductSchema = createInsertSchema(productsTable).partial();

import {
  pgTable,
  integer,
  varchar,
  doublePrecision,
  timestamp,
} from 'drizzle-orm/pg-core';
import { usersTable } from './users';
import { productsTable } from './products';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Orders Table - The Parent Table
// Represents the order header or main order record
// Contains order-level information like order ID, creation timestamp, status, and which user placed the order
// One order can contain multiple products
export const ordersTable = pgTable('orders', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp().notNull().defaultNow(),
  status: varchar({ length: 50 }).notNull().default('new'),
  userId: integer()
    .references(() => usersTable.id)
    .notNull(),
});

// Order Items Table - The Child Table
// Represents the order line items or individual products within an order
// Contains item-specific information like which order it belongs to, which product was ordered,
// quantity and price for that specific item
// Multiple items can belong to one order (one-to-many relationship)
// This design provides normalization and flexibility for handling multiple products per order
export const orderItemsTable = pgTable('order_items', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer()
    .references(() => ordersTable.id)
    .notNull(),
  productId: integer()
    .references(() => productsTable.id)
    .notNull(),
  quantity: integer().notNull(),
  price: doublePrecision().notNull().default(0),
});

export const createOrderSchema = createInsertSchema(ordersTable).omit({
  id: true,
  createdAt: true,
  userId: true,
  status: true,
});

export const createOrderItemsSchema = createInsertSchema(orderItemsTable).omit({
  id: true,
  orderId: true,
});

export const createOrderWithItemsSchema = z.object({
  order: createOrderSchema,
  items: z.array(createOrderItemsSchema),
});

export const updateOrderSchema = createInsertSchema(ordersTable).pick({
  status: true,
});

/*
Order #1 (ordersTable):
├── Customer: John Doe
├── Status: "processing"
└── Items (orderItemsTable):
    ├── 2x iPhone ($999 each)
    ├── 1x Case ($29)
    └── 3x Screen Protector ($15 each)
*/

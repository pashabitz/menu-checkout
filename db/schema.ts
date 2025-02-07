import { integer, pgTable, real, timestamp } from "drizzle-orm/pg-core";

export const ordersTable = pgTable("orders", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    created_at: timestamp().defaultNow(),
    totalAmount: real().notNull(),
    cardLast4: integer().notNull(),
});
export const orderItemsTable = pgTable("order_items", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    order_id: integer().notNull().references(() => ordersTable.id),
    item_id: integer().notNull(),
    quantity: integer().notNull(),
});
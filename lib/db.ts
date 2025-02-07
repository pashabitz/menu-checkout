import { drizzle } from "drizzle-orm/neon-serverless";
import { Order } from "./types";
import { orderItemsTable, ordersTable } from "@/db/schema";

const db = drizzle(process.env.DATABASE_URL!);


export async function createOrder(order: Order) {
    const orderItems = order.items.filter((item) => item.quantity > 0);
    if (orderItems.length === 0) {
        throw new Error("No items in cart");
    }
    return await db.transaction(async (tx) => {
        const insertedOrder = await tx.insert(ordersTable).values({
            totalAmount: order.totalAmount,
            cardLast4: order.cardLast4,
        }).returning();
        if (!insertedOrder || insertedOrder.length === 0) {
            throw new Error("Failed to create order");
        }
        const orderId = insertedOrder[0].id;
        await tx.insert(orderItemsTable).values(orderItems.map(i => ({
            order_id: insertedOrder[0].id,
            item_id: i.id,
            quantity: i.quantity,
        })));
        return orderId;
    });
}
import { Cart } from "@/lib/cart";
import { createOrder } from "@/lib/db";
import { getItems } from "@/lib/menu";
import { CartItem } from "@/lib/types";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { cartItems, cardLast4, totalAmount } = await req.json();
    if (!cartItems || !cardLast4 || !totalAmount) {
        return new Response("Missing data", { status: 400 });
    }
    const menuItems = getItems();
    // need to check that the price we showed to the user is correct
    // otherwise - error out
    const computedAmount = new Cart(cartItems, menuItems).totalPrice;
    if (computedAmount !== parseFloat(totalAmount)) {
        return new Response("Invalid total amount", { status: 400 });
    }
    if (cartItems.filter((i: CartItem) => i.quantity > 0).length === 0) {
        return new Response("No items in cart", { status: 400 });
    }
    try {
        const orderId = await createOrder({ items: cartItems, cardLast4, totalAmount });
        return new Response(JSON.stringify({ orderId}));
    } catch (e) {
        console.error(e);
        return new Response("Error creating the order", { status: 500 });
    }
}
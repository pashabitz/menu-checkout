import { CartItem } from "./types";

export function storeLocalCart(cart: CartItem[]) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

export function getLocalCart(): CartItem[] {
    const cart = localStorage.getItem("cart");
    if (!cart) return [];
    return JSON.parse(cart);
}
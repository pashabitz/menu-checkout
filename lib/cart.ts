import { CartItem, MenuItem } from "./types";

export function storeLocalCart(cart: CartItem[]) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

export function getLocalCart(): CartItem[] {
    const cart = localStorage.getItem("cart");
    if (!cart) return [];
    return JSON.parse(cart);
}

export class Cart {
  constructor(public itemsInCart: CartItem[], private menuItems?: MenuItem[]) { }
  getItemQuantity(itemId: number) {
    return this.itemsInCart.find((item) => item.id === itemId)?.quantity || 0;
  }
  get totalQuantiy() {
    return this.itemsInCart.reduce((acc, item) => acc + item.quantity, 0);
  }
  get totalPrice() {
    return this.itemsInCart.reduce((acc, item) => {
      const menuItem = this.menuItems?.find((i) => i.id === item.id);
      if (!menuItem) return acc;
      return acc + menuItem.price * item.quantity;
    }, 0);
  }
}
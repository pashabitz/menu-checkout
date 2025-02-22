export type CartItem = {
    id: number;
    quantity: number;
};
export type MenuItem = {
    category_id: number;
    id: number;
    image_id: string;
    name: string;
    price: number;
};
export type Order = {
    items: CartItem[];
    totalAmount: number;
    cardLast4: number;
};
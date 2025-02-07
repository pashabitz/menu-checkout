"use client";
import { Cart, getLocalCart, storeLocalCart } from "@/lib/cart";
import { CartItem, MenuItem } from "@/lib/types";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { NumberSelector } from "../components/number-selector";

function BackToMenu() {
    return (
        <a href="/">
            <button 
            className="text-lg font-bold mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
                Back to Menu
            </button>
        </a>
    )
}
export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    useEffect(() => {
        const cart = getLocalCart();
        setCartItems(cart);
    }, []);
    const query = useQuery({
        queryKey: ['items'], queryFn: async () => {
            const response = await fetch(`/api/items`);
            return await response.json();
        }
    });
    if (query.isLoading) return <div>Loading...</div>;
    const renderedCartItems = [];
    for (const item of cartItems.filter((i) => i.quantity > 0).sort((a, b) => a.id - b.id)) {
        const itemDetails = query.data.find((i: CartItem) => i.id === item.id);
        if (itemDetails) {
            renderedCartItems.push({ ...itemDetails, quantity: item.quantity });
        }
    }
    if (renderedCartItems.length === 0) {
        return <div>
            <div>Cart is empty</div>
            <BackToMenu />
        </div>;
    }
    return (
        <div className="flex flex-col min-h-screen py-2 px-8">
            <header className="">
                <span>Cart</span>
            </header>
            <main className="flex-grow overflow-auto">
                {renderedCartItems.map((item: CartItem & MenuItem) => (
                    <div key={item.id} className="flex gap-2 items-center">
                        <img src={`/menu/${item.image_id}.jpg`} alt={item.name} className="w-24 h-24 object-cover" />
                        <span>{item.name}</span>
                        <span>${item.price.toFixed(2)}</span>
                        {/* <span>{item.id}</span> */}
                        <NumberSelector 
                            initialValue={item.quantity}
                            onChange={(newValue) => {
                                // TODO reuse - this is also in homepage
                                setCartItems((prev) => {
                                    const otherItems = prev.filter((i) => i.id !== item.id);
                                    const newCart = [...otherItems, { id: item.id, quantity: newValue }];
                                    storeLocalCart(newCart);
                                    return newCart;
                                });
                            }} />
                    </div>
                ))}
                <div className="my-4 py-2 border-t border-gray-300">Total: ${new Cart(cartItems, query.data).totalPrice.toFixed(2)}</div>
                <BackToMenu />
            </main>
        </div>
    )
}
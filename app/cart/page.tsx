"use client";
import { Cart, getLocalCart, storeLocalCart } from "@/lib/cart";
import { CartItem, MenuItem } from "@/lib/types";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { NumberSelector } from "../components/number-selector";
import Link from "next/link";

function BackToMenu() {
    return (
        <Link href="/">
            <button
                className="text-lg font-bold mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
                Back to Menu
            </button>
        </Link>
    )
}
function ItemsInCart({ cartItems, menuItems, disabled, onChange }: {
    cartItems: CartItem[],
    menuItems: MenuItem[],
    disabled: boolean,
    onChange: (item: CartItem) => void
}) {
    const renderedCartItems = [];
    for (const item of cartItems.filter((i) => i.quantity > 0).sort((a, b) => a.id - b.id)) {
        const itemDetails = menuItems.find((i: MenuItem) => i.id === item.id);
        if (itemDetails) {
            renderedCartItems.push({ ...itemDetails, quantity: item.quantity });
        }
    }
    if (renderedCartItems.length === 0) {
        return <div className="min-h-screen py-2 px-8">
            <div>Cart is empty</div>
            <BackToMenu />
        </div>;
    }
    return (
        <div className="flex flex-col gap-6">
            {renderedCartItems.map((item: CartItem & MenuItem) => (
                <div key={item.id} className="flex gap-2 items-center">
                    <img src={`/menu/${item.image_id}.jpg`} alt={item.name} className="w-24 h-24 object-cover" />
                    <span>{item.name}</span>
                    {!disabled && <span>${item.price.toFixed(2)}</span>}
                    {disabled ? (
                        <span>({item.quantity})</span>
                    ) : (
                        <NumberSelector
                            initialValue={item.quantity}
                            onChange={(newValue) => onChange({ id: item.id, quantity: newValue })} />
                    )}
                </div>
            ))}
        </div>
    )
}
export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [placed, setPlaced] = useState(false);
    const [cardNumber, setCardNumber] = useState("");
    const [orderId, setOrderId] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const response = await fetch('/api/order', {
            method: 'POST',
            body: JSON.stringify({
                cartItems,
                cardLast4: cardNumber.slice(-4),
                totalAmount,
            })
        });
        if (!response.ok) {
            alert("Failed to place order");
            return;
        }
        const { orderId } = await response.json();
        setPlaced(true);
        setOrderId(orderId);
        storeLocalCart([]);
    }

    useEffect(() => {
        const cart = getLocalCart();
        setCartItems(cart);
        // random card number
        setCardNumber(Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join(''));
    }, []);

    const menuItemsQuery = useQuery({
        queryKey: ['items'], queryFn: async () => {
            const response = await fetch(`/api/items`);
            return await response.json();
        }
    });
    useEffect(() => {
        if (menuItemsQuery.data) {
            const totalAmount = new Cart(cartItems, menuItemsQuery.data).totalPrice;
            setTotalAmount(totalAmount);
        }
    }, [menuItemsQuery.data, cartItems]);

    if (menuItemsQuery.isLoading) return <div>Loading...</div>;

    
    return (
        <div className="flex flex-col min-h-screen py-2 px-8">
            <header className="">
                <span>Cart</span>
            </header>
            <main className="flex-grow overflow-auto">
                <ItemsInCart
                cartItems={cartItems}
                menuItems={menuItemsQuery.data}
                disabled={placed}
                onChange={(item) => {
                    setCartItems((prev) => {
                        const otherItems = prev.filter((i) => i.id !== item.id);
                        const newCart = [...otherItems, item];
                        storeLocalCart(newCart);
                        return newCart;
                    });
                }} />
                <div className="my-4 py-2 border-t border-gray-300">Total: ${totalAmount.toFixed(2)}</div>
                
                {placed ? (
                    <>
                    <div className="text-lg font-bold text-green-500">Order #{orderId} Placed.</div>
                    <BackToMenu />
                    </>
                ) : (
                    <form className="flex flex-col" onSubmit={onSubmit}>
                        <label className="text-lg font-bold">Credit Card Number</label>
                        <input
                            type="text"
                            className="border border-gray-300 rounded p-2 w-64"
                            disabled={true}
                            value={cardNumber}
                        />
                        <button
                            type="submit"
                            className="text-lg font-bold mt-4 bg-blue-500 text-white py-2 px-4 rounded w-64"
                        >
                            Place Order
                        </button>
                    </form>
                )}

            </main>
        </div>
    )
}
"use client";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { NumberSelector } from "./components/number-selector";
import CartIndicator from "./components/cart-indicator";
import { CartItem } from "@/lib/types";
import { Cart, getLocalCart, storeLocalCart } from "@/lib/cart";
import Link from "next/link";

function Categories({ onSelect }: { onSelect: (categoryId: number) => void }) {
  const query = useQuery({
    queryKey: ['categories'], queryFn: async () => {
      const response = await fetch(`/api/categories`);
      return await response.json();
    }
  });
  // TODO add a skeleton loader
  if (query.isLoading) return <div>Loading...</div>;
  return (
    <div className="flex gap-6 flex-wrap">
      {query.data.map((category: { id: number, name: string; image_id: string }) => (
        <div key={category.name} className="flex flex-col gap-2 items-center cursor-pointer" onClick={() => onSelect(category.id)}>
          <img src={`/menu/${category.image_id}.jpg`} alt={category.name} className="w-24 h-24 object-cover" />
          <span>{category.name}</span>
        </div>
      ))}
    </div>
  )

}


function Items({ category_id, cart, onChange }: {
  category_id: number | null,
  cart: Cart,
  onChange: (item: CartItem) => void,
}) {
  const query = useQuery({
    queryKey: ['items', category_id], queryFn: async () => {
      if (category_id === null) return [];
      const response = await fetch(`/api/categories/${category_id}/items`);
      return await response.json();
    }
  });
  if (query.isLoading) return <div>Loading...</div>;
  if (query.data.length === 0) return;
  return (
    <div className="flex flex-col gap-6">
      {query.data.map((item: { id: number, name: string; image_id: string, price: number }) => (
        <div key={item.name} className="flex gap-2 items-center">
          <img src={`/menu/${item.image_id}.jpg`} alt={item.name} className="w-24 h-24 object-cover" />
          <span>{item.name}</span>
          <span>${item.price.toFixed(2)}</span>
          <NumberSelector
            initialValue={cart.getItemQuantity(item.id)}
            onChange={(newValue) => onChange({ id: item.id, quantity: newValue })} />
        </div>
      ))}
    </div>
  )
}
export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  useEffect(() => {
    const existingCartItems = getLocalCart();
    if (existingCartItems) {
      setCartItems(existingCartItems);
    }
  }, []);
  const addToCart = (item: { id: number, quantity: number }) => {
    setCartItems((prev) => {
      const otherItems = prev.filter((i) => i.id !== item.id);
      const newCart = [...otherItems, item];
      storeLocalCart(newCart);
      return newCart;
    });
  }



  return (
    <div className="flex flex-col min-h-screen py-2 px-8">
      <header className="">
        <span>Menu Checkout</span>
        <Link href="/cart"><CartIndicator count={new Cart(cartItems).totalQuantiy} /></Link>
      </header>
      <main className="flex-grow overflow-auto">
        <Categories onSelect={setSelectedCategory} />
        <Items category_id={selectedCategory} cart={new Cart(cartItems)} onChange={addToCart} />
        <Link href="/cart"><button className="text-lg font-bold mt-4 bg-blue-500 text-white py-2 px-4 rounded">Checkout</button></Link>
      </main>
    </div>
  );
}

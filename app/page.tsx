"use client";
import { useState } from "react";
import { useQuery } from "react-query";

function Categories({ onSelect } : { onSelect: (categoryId: number) => void }) {
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
function Items({ category_id } : { category_id: number | null }) {
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
      {query.data.map((item: { name: string; image_id: string }) => (
        <div key={item.name} className="flex gap-2 items-center">
          <img src={`/menu/${item.image_id}.jpg`} alt={item.name} className="w-24 h-24 object-cover" />
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  )
}
export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  return (
    <div className="flex flex-col min-h-screen py-2 px-8">
      <header className="">Menu Checkout</header>
      <main className="flex-grow overflow-auto">
        <Categories onSelect={setSelectedCategory} />
        <Items category_id={selectedCategory} />
      </main>
      <footer className="">
        Copyright 2025 Menu Checkout
      </footer>
    </div>
  );
}

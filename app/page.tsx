"use client";
import { useQuery } from "react-query";

function Categories() {
  const query = useQuery({
    queryKey: ['categories'], queryFn: async () => {
      const response = await fetch(`/api/categories`);
      return await response.json();
    }
  });
  // TODO add a skeleton loader
  if (query.isLoading) return <div>Loading...</div>;
  return (
    <div className="flex gap-6 flex-wrap items-center justify-center">
      {query.data.map((category: { name: string; image: string }) => (
        <div key={category.name} className="flex flex-col gap-2 items-center">
          <span>{category.name}</span>
        </div>
      ))}
    </div>
  )

}
export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="row-start-1 flex gap-6 items-center">Menu Checkout</header>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
       Hello World
        <Categories />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        Copyright 2025 Menu Checkout
      </footer>
    </div>
  );
}

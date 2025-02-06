import { getMenuCategories } from "@/lib/menu";
export async function GET() {
    const categories = getMenuCategories();
    return new Response(JSON.stringify(categories));
}
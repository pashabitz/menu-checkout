import { getItems } from "@/lib/menu";

export async function GET() {
    const items = getItems();
    return new Response(JSON.stringify(items));
}
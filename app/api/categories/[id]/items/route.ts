import { getCategoryItems } from "@/lib/menu";
import { NextRequest } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: number } }) {
    const { id } = await params;
    console.log(id);
    const items = getCategoryItems(id);
    console.log(items);
    return new Response(JSON.stringify(items));
}
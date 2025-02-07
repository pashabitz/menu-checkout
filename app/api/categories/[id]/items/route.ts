import { getCategoryItems } from "@/lib/menu";
import { NextRequest } from "next/server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const items = getCategoryItems(parseInt(id));
    return new Response(JSON.stringify(items));
}
import fs from "fs";
export async function GET() {
    const menu = JSON.parse(fs.readFileSync("data/menu.json", "utf8"));
    return new Response(JSON.stringify(menu.categories));
}
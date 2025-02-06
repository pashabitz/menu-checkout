import fs from "fs";
export async function GET() {
    const menu = JSON.parse(fs.readFileSync(`${process.cwd()}/data/menu.json`, "utf8"));
    return new Response(JSON.stringify(menu.categories));
}
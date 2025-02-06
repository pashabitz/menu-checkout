const fs = require("fs");
export async function GET(request: Request) {
    const menu = JSON.parse(fs.readFileSync("data/menu.json", "utf8"));
    return new Response(JSON.stringify(menu.categories));
}
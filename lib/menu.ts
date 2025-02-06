import fs from "fs";
function getMenu() {
    const menu = JSON.parse(fs.readFileSync(`${process.cwd()}/data/menu.json`, "utf8"));
    return menu;
}
export function getMenuCategories() {
    const menu = getMenu();
    return menu.categories;
}
export function getCategoryItems(categoryId: number) {
    const menu = getMenu();
    // TODO create type for item
    return menu.items.filter((item: { category_id: number }) => item.category_id === parseInt(categoryId));
}
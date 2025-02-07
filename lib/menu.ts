import fs from "fs";
import { MenuItem } from "./types";
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
    return menu.items.filter((item: MenuItem) => item.category_id === categoryId);
}
export function getItems() {
    const menu = getMenu();
    return menu.items;
}
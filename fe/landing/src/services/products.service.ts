import { getProducts, type Product } from "../repositories/products.repository";

export function listActiveProducts(): Product[] {
  return getProducts()
    .filter((p) => p.status === "active" || p.status === "coming-soon")
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function listAllProducts(): Product[] {
  return getProducts().sort((a, b) => a.sortOrder - b.sortOrder);
}

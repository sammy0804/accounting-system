import { http } from "../lib/http";
import type { Product } from "../types/types";


export const Products = {
    list: (q?: string) => http.get<Product[]>(`/products${q ? `?q=${encodeURIComponent(q)}` : ""}`),
    create: (data: Partial<Product>) => http.post<Product>("/products", data),
    get: (id: string) => http.get<Product>(`/products/${id}`),
    update: (id: string, data: Partial<Product>) => http.patch<Product>(`/products/${id}`, data),
    remove: (id: string) => http.del<Product>(`/products/${id}`),
};
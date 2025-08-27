export type ID = string;


export type Product = {
    id: ID;
    sku: string;
    name: string;
    price: number; // Decimal como number para la UI
    cost?: number | null;
    taxRate: number;
    inventoryAccountId?: ID | null;
    revenueAccountId?: ID | null;
    cogsAccountId?: ID | null;
    taxAccountId?: ID | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};


export type Account = {
    id: ID;
    code: string;
    name: string;
    nature: "DEBIT" | "CREDIT";
    isActive: boolean;
};

export type FormType = {
  sku: string;
  name: string;
  price: number;
  cost: number;
  taxRate: number;
  inventoryAccountId: string;
  revenueAccountId: string;
  cogsAccountId: string;
  taxAccountId: string;
};
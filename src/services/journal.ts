import { http } from "../lib/http";
import type { JournalEntry } from "../types/types";


export const Journal = {
  list: () => http.get<JournalEntry[]>("/journals"),
  delete: (id: string) => http.del<JournalEntry>(`/journals/${id}`),
  
  // registrar una COMPRA
  purchase: (data: {
    productId: string;
    qty: number;
    unitCost?: number;
    paymentAccountId: string;
    reference?: string;
    memo?: string;
  }) => http.post<JournalEntry>("/journal/purchase", data),

  // registrar una VENTA
  sale: (data: {
    productId: string;
    qty: number;
    unitPrice?: number;
    unitCostOverride?: number;
    cashAccountId: string;
    reference?: string;
    memo?: string;
  }) => http.post<JournalEntry>("/journal/sale", data),
};

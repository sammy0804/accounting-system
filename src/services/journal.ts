import { http } from "../lib/http";


export const Journal = {
    postSale: (payload: {
        productId: string;
        qty: number;
        unitPrice?: number;
        unitCostOverride?: number;
        cashAccountId: string;
        date?: string;
        reference?: string;
        memo?: string;
    }) => http.post("/journal/sale", payload),


    postPurchase: (payload: {
        productId: string;
        qty: number;
        unitCost?: number;
        paymentAccountId: string;
        date?: string;
        reference?: string;
        memo?: string;
    }) => http.post("/journal/purchase", payload),
};
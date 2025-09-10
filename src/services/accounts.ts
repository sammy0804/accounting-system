import { http } from "../lib/http";
import type { Account } from "../types/types";


export const Accounts = {
    list: () => http.get<Account[]>("/accounts"),
    get : (id: string) => http.get<Account>(`/accounts/${id}`),
    create: (data: Partial<Account>) => http.post<Account>("/accounts", data),
    delete: (id: string) => http.del<Account>(`/accounts/${id}`),
    update : (id: string, data: Partial<Account>) => http.patch<Account>(`/accounts/${id}`, data),
};
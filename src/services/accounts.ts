import { http } from "../lib/http";
import type { Account } from "../types/types";


export const Accounts = {
    list: () => http.get<Account[]>("/accounts"),
    create: (data: Partial<Account>) => http.post<Account>("/accounts", data),
    delete: (id: number) => http.del<Account>(`/accounts/${id}`),
};
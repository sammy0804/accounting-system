import { http } from "../lib/http";
import type { Account } from "../types/types";


export const Accounts = {
    list: () => http.get<Account[]>("/accounts"),
};
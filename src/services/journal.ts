import { http } from "../lib/http";
import type { JournalEntry } from "../types/types";


export const Journal = {
  list: () => http.get<JournalEntry[]>("/journals"),
};

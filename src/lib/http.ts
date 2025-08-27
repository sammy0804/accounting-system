const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";


async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...init,
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
    }
    return res.json();
}


export const http = {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, body?: object) => request<T>(path, { method: "POST", body: JSON.stringify(body) }),
    patch: <T>(path: string, body?: object) => request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
    del: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
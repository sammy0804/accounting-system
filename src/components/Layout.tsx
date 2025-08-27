import type { ReactNode } from "react";
import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";


export function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex" >
            <Sidebar />
            < div className="flex-1 flex flex-col" >
                <Topbar />
                <main className="p-4" > {children} </main>
            </div>
        </div>
    );
}
import { NavLink } from "react-router-dom";
import { useState } from "react";


const linkBase = "block px-3 py-2 rounded-lg transition";
const active = "bg-gray-900 text-white";
const inactive = "text-gray-700 hover:bg-gray-100";


export function Sidebar() {
    const [open, setOpen] = useState(true);
    return (
        <aside className={`h-screen sticky top-0 border-r bg-white ${open ? "w-64" : "w-16"} transition-all`}>
            <div className="flex items-center justify-between p-3">
                <button className="text-xl font-bold" onClick={() => setOpen(!open)}>≡</button>
                {open && <span className="text-sm text-gray-500">Accounting</span>}
            </div>
            <nav className="px-2 space-y-1">
                <NavLink to="/dashboard" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>Dashboard</NavLink>
                <div className="mt-2 text-xs uppercase tracking-wide text-gray-400 px-3">Maestros</div>
                <NavLink to="/products" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>Productos</NavLink>
                <NavLink to="/accounts" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>Cuentas</NavLink>
                <div className="mt-2 text-xs uppercase tracking-wide text-gray-400 px-3">Asientos</div>
                <NavLink to="/journal/sale" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>Venta</NavLink>
                <NavLink to="/journal/purchase" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>Compra</NavLink>
            </nav>
        </aside>
    );
}
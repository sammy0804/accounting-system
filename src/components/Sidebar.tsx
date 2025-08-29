import { NavLink } from "react-router-dom";
import { useState } from "react";


const linkBase = "block px-3 py-2 rounded-lg transition";
const active = "bg-gray-900 text-white";
const inactive = "text-white hover:bg-gray-100 hover:text-black";


export function Sidebar() {
    const [open, setOpen] = useState(true);
    return (
        <aside className={`h-screen sticky top-0 border-r bg-black ${open ? "w-64" : "w-16"} transition-all`}>
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                    <img src="/public/assets/svg/softmaster_logo.svg" alt="Logo" className={`bg-black transition-all ${open ? "w-20" : "w-8"}`} />
                    {/* {open && <span className="text-sm text-gray-700 font-semibold">Accounting</span>} */}
                </div>
                <button className="text-xl font-bold text-white ml-2" title={open ? "Cerrar" : "Abrir"} onClick={() => setOpen(!open)}>
                    &#9776;
                </button>
            </div>
            <nav className="px-2 space-y-1">
                <NavLink to="/dashboard" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>{open ? "Dashboard" : <span title="Dashboard">🏠</span>}</NavLink>
                {open && <div className="mt-2 text-xs uppercase tracking-wide text-gray-400 px-3">Maestros</div>}
                <NavLink to="/products" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>{open ? "Productos" : <span title="Productos">📦</span>}</NavLink>
                <NavLink to="/accounts" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>{open ? "Cuentas" : <span title="Cuentas">💼</span>}</NavLink>
                {open && <div className="mt-2 text-xs uppercase tracking-wide text-gray-400 px-3">Asientos</div>}
                <NavLink to="/journal/sale" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>{open ? "Venta" : <span title="Venta">🛒</span>}</NavLink>
                <NavLink to="/journal/purchase" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>{open ? "Compra" : <span title="Compra">🧾</span>}</NavLink>
            </nav>
        </aside>
    );
}
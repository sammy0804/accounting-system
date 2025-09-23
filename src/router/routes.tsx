import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import ProductsList from "../pages/Products/list";
import ProductNew from "../pages/Products/new";
import AccountsList from "../pages/Accounts/list";
import NewAccount from "../pages/Accounts/new";
import JournalEntriesList from "../pages/Journal/list-journal";
import NewSale from "../pages/Journal/new-sale";
import NewPurchase from "../pages/Journal/new-purchase";


export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />


            <Route path="/products" element={<ProductsList />} />
            <Route path="/products/new" element={<ProductNew />} />
            <Route path="/products/:id/edit" element={<ProductNew />} />


            <Route path="/accounts" element={<AccountsList />} />
            <Route path="/accounts/:id/edit" element={<NewAccount />} />
            <Route path="/accounts/new" element={<NewAccount />} />

            <Route path="/journal" element={<JournalEntriesList />} />
            <Route path="/journal/sale" element={<NewSale />} />
            <Route path="/journal/purchase" element={<NewPurchase />} />


            <Route path="*" element={<div className="p-6">404</div>} />
        </Routes>
    );
}
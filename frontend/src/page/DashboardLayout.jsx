import React from "react";
import Navbar from "../compontes/navbar";
import { Route, Routes } from "react-router-dom";
import ProductPage from "./products-page";
import CategoriesPage from "./categoriesPage";
import ProductTable from "../compontes/table/all-products";
import AddSale from "../compontes/form/Add-sale";
import AllSales from "../compontes/table/all-sales";
const DashboardLayout = () => {
  return (
    <div>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<ProductPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/products" element={<ProductTable />} />
          <Route path="/add-sale" element={<AddSale />} />
          <Route path="/sales" element={<AllSales />} />
        </Routes>
      </div>
    </div>
  );
};

export default DashboardLayout;

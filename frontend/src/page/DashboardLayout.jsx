import React from 'react'
import Navbar from '../compontes/navbar'
import { Route, Routes } from 'react-router-dom'
import ProductPage from "./products-page"
import CategoriesPage from './categoriesPage'
const DashboardLayout = () => {
  return (
    <div>
        <Navbar />
        <div>
            <Routes>
                <Route path='/' element={<ProductPage />}/>
                <Route path='/categories' element={<CategoriesPage />}/>
            </Routes>
        </div>
    </div>
  )
}

export default DashboardLayout
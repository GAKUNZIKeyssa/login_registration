import React from 'react'
import AddProduct from '../compontes/form/add-product'
import ProductTable from '../compontes/table/all-products'

const ProductPage = () => {
  return (
    <div>
        <AddProduct />
        <ProductTable />
    </div>
  )
}

export default ProductPage
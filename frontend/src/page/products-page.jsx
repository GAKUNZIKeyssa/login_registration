import React from 'react'
import AddProduct from '../compontes/form/add-product'
import ProductTable from '../compontes/table/all-products'

const ProductPage = () => {
  return (
    <div className=' flex'>
        <AddProduct />
        <ProductTable />
    </div>
  )
}

export default ProductPage
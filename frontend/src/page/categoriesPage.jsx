import React from 'react'
import AddCategory from '../compontes/form/add-categories'
import AllCategories from '../compontes/table/all-categories'

const CategoriesPage = () => {
    return (
        <div>
            <AddCategory />
            <AllCategories />
        </div>
    )
}

export default CategoriesPage
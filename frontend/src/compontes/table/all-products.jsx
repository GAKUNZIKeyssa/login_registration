import { useEffect, useState } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

function ProductTable() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');

  // Fetch products based on query
  const fetchProducts = async (search = '') => {
    try {
      const url = search
        ? `http://localhost:3001/products/search?query=${search}`
        : `http://localhost:3001/products`;
      const res = await axios.get(url);
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  // Initial fetch for products
  useEffect(() => {
    fetchProducts(); // Initial load
  }, []);

  // Debounced search function
  const debouncedSearch = debounce((value) => {
    fetchProducts(value);
  }, 300);

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value); // Trigger search with debounce
  };

  return (
    <div className="overflow-x-auto max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">Product List</h2>

      <div className="mb-4 text-center">
        <input
          type="text"
          placeholder="Search by name, ID, or category..."
          value={query}
          onChange={handleSearch}
          className="input input-bordered w-full max-w-md"
        />
      </div>

      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Price ($)</th>
            <th>Items</th>
            <th>Category</th>
            <th>Expiry Date</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr><td colSpan="6" className="text-center">No products found</td></tr>
          ) : (
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.items}</td>
                <td>{product.category || product.category_name}</td>
                <td>{product.expiry_date}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;

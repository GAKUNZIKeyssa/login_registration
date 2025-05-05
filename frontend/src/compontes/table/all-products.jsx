import { useEffect, useState } from 'react';
import axios from 'axios';

function ProductTable() {
  const [products, setProducts] = useState([]);

  // Fetch products every 5 seconds
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:3001/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };

    fetchProducts(); // Initial fetch

    const interval = setInterval(fetchProducts, 5000); // Polling every 5 seconds

    return () => clearInterval(interval); // Cleanup
  }, []);

  return (
    <div className="overflow-x-auto max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">Product List</h2>
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Price ($)</th>
            {/* <th>Items</th> */}
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
                {/* <td>{product.items}</td> */}
                <td>{product.category_name || product.category}</td>
                <td>{product.expiry_date ? new Date(product.expiry_date).toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;

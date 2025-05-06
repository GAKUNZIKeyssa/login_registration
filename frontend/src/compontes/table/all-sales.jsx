import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import debounce from "lodash.debounce";

const formatDateTime = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString();
  } catch {
    return '';
  }
};

function AllSales() {
  const [sales, setSales] = useState([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const fetchSales = async () => {
    try {
      setError("");
      const res = await axios.get("http://localhost:3001/sales");
      setSales(res.data);
    } catch (err) {
      console.error("Failed to fetch sales:", err);
      setError("❌ Failed to load sales data.");
    }
  };

  const searchSales = async (search) => {
    try {
      if (!search) return fetchSales();
      setError("");
      const res = await axios.get(`http://localhost:3001/sales/search?query=${encodeURIComponent(search)}`);
      setSales(res.data);
    } catch (err) {
      console.error("Search failed:", err);
      setError("❌ Failed to search sales.");
    }
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      searchSales(value);
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">All Sales</h2>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by product, user, or amount..."
          className="input input-bordered w-full max-w-sm"
          value={query}
          onChange={handleSearchChange}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Sold At</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No sales found.
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id}>
                  <td>{sale.id}</td>
                  <td>{`${sale.first_name} ${sale.last_name}`}</td>
                  <td>{sale.product_name}</td>
                  <td>{sale.quantity}</td>
                  <td>${(sale.quantity * sale.unit_price).toFixed(2)}</td>
                  <td>{formatDateTime(sale.sold_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllSales;

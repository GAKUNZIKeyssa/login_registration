import { useState, useEffect } from "react";
import axios from "axios";

function AddSale() {
  const [formData, setFormData] = useState({
    userId: "",
    productId: "",
    quantity: ""
  });

  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, usersRes] = await Promise.all([
          axios.get("http://localhost:3001/products"),
          axios.get("http://localhost:3001/users")
        ]);
        setProducts(productsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/sales", formData);
      setMessage("✅ Sale recorded successfully!");
      setFormData({ userId: "", productId: "", quantity: "" });
    } catch (error) {
      console.error("Error recording sale:", error);
      setMessage("❌ Failed to record sale. Make sure stock is sufficient.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-base-100 rounded-lg shadow-md mt-10">
      <div className="card bg-base-100 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Sell Product</h2>

        {message && (
          <div className="alert alert-info mb-4">
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            className="select select-bordered w-full"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.first_name} {user.last_name}
              </option>
            ))}
          </select>

          <select
            className="select select-bordered w-full"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            required
          >
            <option value="">Select Product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} (Stock: {product.items})
              </option>
            ))}
          </select>

          <input
            className="input input-bordered w-full"
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="1"
          />

          <button type="submit" className="btn btn-primary w-full">
            Record Sale
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddSale;

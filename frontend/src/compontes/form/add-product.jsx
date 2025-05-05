import { useState, useEffect } from 'react';
import axios from 'axios';

function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    items: '',
    category: '',
    expiryDate: '',
  });

  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3001/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
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
      await axios.post('http://localhost:3001/products', formData);
      setMessage('✅ Product added successfully!');
      setFormData({
        name: '',
        price: '',
        items: '',
        category: '',
        expiryDate: '',
      });
    } catch (error) {
      console.error('Error adding product:', error);
      setMessage('❌ Failed to add product. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-base-100 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Product</h2>

      {message && (
        <div className="alert alert-info mb-4">
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="input input-bordered w-full"
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          className="input input-bordered w-full"
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <input
          className="input input-bordered w-full"
          type="number"
          name="items"
          placeholder="Number of Items"
          value={formData.items}
          onChange={handleChange}
          required
        />

        <select
          className="select select-bordered w-full"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          className="input input-bordered w-full"
          type="date"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn btn-primary w-full">
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProduct;

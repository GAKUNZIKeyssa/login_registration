import { useState } from 'react';
import axios from 'axios';

function AddCategory() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await axios.post('http://localhost:3001/categories', { name });
      setMessage('Category added successfully!');
      setName('');
    } catch (err) {
      setMessage('Failed to add category');
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-base-100 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Category</h2>

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
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary w-full">Add Category</button>
      </form>
    </div>
  );
}

export default AddCategory;

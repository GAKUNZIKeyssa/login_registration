import { useEffect, useState } from 'react';
import axios from 'axios';

function AllCategories() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!name.trim()) return;

//     try {
//       await axios.post('http://localhost:3001/categories', { name });
//       setMessage('Category added successfully!');
//       setName('');
//     } catch (err) {
//       setMessage('Failed to add category');
//       console.error(err);
//     }
//   };

  // Fetch categories (real-time)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:3001/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
    const interval = setInterval(fetchCategories, 5000); // refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10">
      {/* <div className="p-6 bg-base-100 rounded-lg shadow-md">
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
      </div> */}

      {/* Category Table */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2 text-center">All Categories</h3>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Category Name</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr><td colSpan="2" className="text-center">No categories found</td></tr>
              ) : (
                categories.map((cat, index) => (
                  <tr key={cat.id}>
                    <td>{index + 1}</td>
                    <td>{cat.name}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AllCategories;

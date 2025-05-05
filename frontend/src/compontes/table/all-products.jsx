import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

// Helper to format date for input type="date"
const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
        // Assumes dateString is in a format recognized by Date constructor (like ISO 8601)
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    } catch (e) {
        console.error("Error parsing date:", dateString, e);
        return ''; // Return empty or a default if parsing fails
    }
};


function ProductTable() {
    const [products, setProducts] = useState([]);
    const [query, setQuery] = useState('');
    const [message, setMessage] = useState(''); // For feedback messages
    const [error, setError] = useState(''); // For error messages

    // --- Modal State ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); // Store the whole product being edited
    const [editFormData, setEditFormData] = useState({
        id: '',
        name: '',
        price: '',
        items: '',
        category_id: '', // Use category_id for the form
        expiry_date: '',
    });
    const [categories, setCategories] = useState([]); // For category dropdown in modal

    // --- Fetch Categories (for Edit Modal) ---
    const fetchCategories = async () => {
        try {
            setError(''); // Clear previous errors
            const response = await axios.get('http://localhost:3001/categories');
            setCategories(response.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to load categories for editing.');
        }
    };

    // --- Fetch Products ---
    const fetchProducts = useCallback(async (search = '') => {
        try {
            setMessage(''); // Clear messages on fetch
            setError('');
            const url = search
                ? `http://localhost:3001/products/search?query=${encodeURIComponent(search)}`
                : `http://localhost:3001/products`;
            const res = await axios.get(url);
            // Ensure category_id is present (requires backend update)
             if (res.data.length > 0 && res.data[0].category_id === undefined) {
                 console.warn("Warning: `category_id` is missing from fetched products. Please update backend `getAllProducts` and `searchProducts` queries.");
             }
            setProducts(res.data);
        } catch (err) {
            console.error('Failed to fetch products:', err);
            setError('Failed to fetch products. Please ensure the backend is running.');
            setProducts([]); // Clear products on error
        }
    }, []); // Empty dependency array means this function definition doesn't change

    // --- Initial Fetch ---
    useEffect(() => {
        fetchProducts(); // Initial load
        fetchCategories(); // Load categories for modal
    }, [fetchProducts]); // Depend on fetchProducts

    // --- Debounced Search ---
    const debouncedSearch = useCallback(
        debounce((value) => {
            fetchProducts(value);
        }, 300),
        [fetchProducts] // Depend on fetchProducts
    );

    // --- Handle Search Input ---
    const handleSearch = (e) => {
        const value = e.target.value;
        setQuery(value);
        debouncedSearch(value);
    };

    // --- Handle Delete ---
    const handleDelete = async (productId) => {
        if (window.confirm(`Are you sure you want to delete product ID ${productId}?`)) {
            try {
                setMessage('');
                setError('');
                await axios.delete(`http://localhost:3001/products/${productId}`);
                setMessage(`✅ Product ${productId} deleted successfully!`);
                // Remove product from local state
                setProducts(products.filter(p => p.id !== productId));
            } catch (err) {
                console.error('Failed to delete product:', err);
                setError(`❌ Failed to delete product ${productId}.`);
            }
        }
    };

    // --- Handle Edit Modal ---
    const handleOpenEditModal = (product) => {
        if (!product.category_id) {
             console.error("Cannot edit product: `category_id` is missing.", product);
             setError("Cannot edit product: category information is missing. Please update backend.");
             return; // Prevent opening modal if category_id is missing
        }
        setEditingProduct(product);
        setEditFormData({
            id: product.id,
            name: product.name,
            price: product.price,
            items: product.items,
            category_id: product.category_id, // Use the ID here
            expiry_date: formatDateForInput(product.expiry_date), // Format date for input
        });
        setIsModalOpen(true);
        setMessage(''); // Clear messages when opening modal
        setError('');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null); // Clear editing state
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- Handle Update Submit ---
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!editingProduct) return;

        // Basic validation (optional, add more as needed)
        if (!editFormData.name || !editFormData.price || !editFormData.items || !editFormData.category_id || !editFormData.expiry_date) {
             setError("All fields are required in the edit form.");
             return;
        }

        // Prepare data for backend (map category_id back to 'category' as expected by backend controller)
        // **Important Correction:** Your backend `updateProduct` actually expects `category` to be the ID.
        // So, we send `category_id` as `category`.
        const dataToSend = {
             name: editFormData.name,
             price: parseFloat(editFormData.price), // Ensure price is number
             items: parseInt(editFormData.items, 10), // Ensure items is integer
             category: parseInt(editFormData.category_id, 10), // Send category_id as 'category'
             expiryDate: editFormData.expiry_date, // Send formatted date string
        };


        try {
            setMessage('');
            setError('');
            await axios.put(`http://localhost:3001/products/${editingProduct.id}`, dataToSend);
            setMessage(`✅ Product ${editingProduct.id} updated successfully!`);
            handleCloseModal();
            // Refresh the product list to show updated data
            fetchProducts(query); // Re-fetch with current query
        } catch (err) {
            console.error('Failed to update product:', err);
            setError(`❌ Failed to update product ${editingProduct.id}. ${err.response?.data?.message || ''}`);
        }
    };

    return (
        <div className="overflow-x-auto max-w-4xl mx-auto mt-10 p-4">
            <h2 className="text-2xl font-bold text-center mb-4">Product List</h2>

            {/* Feedback Messages */}
            {message && <div className="alert alert-success shadow-lg mb-4"><div><span>{message}</span></div></div>}
            {error && <div className="alert alert-error shadow-lg mb-4"><div><span>{error}</span></div></div>}


            <div className="mb-4 text-center">
                <input
                    type="text"
                    placeholder="Search by name, ID, or category..."
                    value={query}
                    onChange={handleSearch}
                    className="input input-bordered w-full max-w-md"
                />
            </div>

            <div className="overflow-x-auto"> {/* Added for better table responsiveness */}
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Price ($)</th>
                            <th>Items</th>
                            <th>Category</th>
                            <th>Expiry Date</th>
                            <th>Actions</th> {/* Added Actions Header */}
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr><td colSpan="7" className="text-center">No products found</td></tr> // Updated colSpan
                        ) : (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.items}</td>
                                    {/* Display category name, use category_id for logic */}
                                    <td>{product.category || 'N/A'}</td>
                                    <td>{formatDateForInput(product.expiry_date)}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning mr-2"
                                            onClick={() => handleOpenEditModal(product)}
                                            disabled={!product.category_id} // Disable if category_id is missing
                                            title={!product.category_id ? "Cannot edit: Category ID missing" : "Edit Product"}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-error"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- Edit Product Modal --- */}
            {isModalOpen && editingProduct && (
                <div className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
                    <div className="modal-box relative">
                        <button
                            className="btn btn-sm btn-circle absolute right-2 top-2"
                            onClick={handleCloseModal}
                        >✕</button>
                        <h3 className="text-lg font-bold mb-4">Edit Product (ID: {editingProduct.id})</h3>

                        {/* Edit Form */}
                        <form onSubmit={handleUpdateSubmit} className="space-y-4">
                             {error && <div className="alert alert-error shadow-lg mb-4"><div><span>{error}</span></div></div>}
                            <input
                                className="input input-bordered w-full"
                                type="text"
                                name="name"
                                placeholder="Product Name"
                                value={editFormData.name}
                                onChange={handleEditFormChange}
                                required
                            />
                            <input
                                className="input input-bordered w-full"
                                type="number"
                                name="price"
                                placeholder="Price"
                                step="0.01" // Allow decimals for price
                                value={editFormData.price}
                                onChange={handleEditFormChange}
                                required
                            />
                            <input
                                className="input input-bordered w-full"
                                type="number"
                                name="items"
                                placeholder="Number of Items"
                                value={editFormData.items}
                                onChange={handleEditFormChange}
                                required
                            />
                            <select
                                className="select select-bordered w-full"
                                name="category_id" // Use category_id in form state
                                value={editFormData.category_id} // Bind to category_id
                                onChange={handleEditFormChange}
                                required
                            >
                                <option value="" disabled>Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                className="input input-bordered w-full"
                                type="date"
                                name="expiry_date" // Use expiry_date in form state
                                value={editFormData.expiry_date} // Bind to formatted date
                                onChange={handleEditFormChange}
                                required
                            />
                            <div className="modal-action">
                                <button type="button" className="btn" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                    {/* Click outside to close */}
                     <div className="modal-backdrop" onClick={handleCloseModal}></div>
                </div>
            )}
        </div>
    );
}

export default ProductTable;
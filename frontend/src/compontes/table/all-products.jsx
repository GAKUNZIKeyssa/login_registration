import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    } catch {
        return '';
    }
};

function AllProducts() {
    const [products, setProducts] = useState([]);
    const [query, setQuery] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editFormData, setEditFormData] = useState({
        id: '',
        name: '',
        price: '',
        items: '',
        category_id: '',
        expiry_date: '',
    });
    const [categories, setCategories] = useState([]);

    const [expiryFilter, setExpiryFilter] = useState('');
    const [customExpiryDate, setCustomExpiryDate] = useState('');

    const fetchCategories = async () => {
        try {
            setError('');
            const response = await axios.get('http://localhost:3001/categories');
            setCategories(response.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to load categories for editing.');
        }
    };

    const fetchProducts = useCallback(async (search = '') => {
        try {
            setError('');
            const url = search
                ? `http://localhost:3001/products/search?query=${encodeURIComponent(search)}`
                : `http://localhost:3001/products`;
            const res = await axios.get(url);
            setProducts(res.data);
        } catch (err) {
            console.error('Failed to fetch products:', err);
            setError('Failed to fetch products. Please ensure the backend is running.');
            setProducts([]);
        }
    }, []);

    const debouncedSearch = useCallback(
        debounce((value) => {
            fetchProducts(value);
        }, 300),
        [fetchProducts]
    );

    const handleSearch = (e) => {
        const value = e.target.value;
        setQuery(value);
        debouncedSearch(value);
    };

    const handleDelete = async (productId) => {
        if (window.confirm(`Are you sure you want to delete product ID ${productId}?`)) {
            try {
                await axios.delete(`http://localhost:3001/products/${productId}`);
                setMessage(`✅ Product ${productId} deleted successfully!`);
                setProducts(products.filter(p => p.id !== productId));
            } catch (err) {
                console.error('Failed to delete product:', err);
                setError(`❌ Failed to delete product ${productId}.`);
            }
        }
    };

    const handleOpenEditModal = (product) => {
        setEditingProduct(product);
        setEditFormData({
            id: product.id,
            name: product.name,
            price: product.price,
            items: product.items,
            category_id: product.category_id,
            expiry_date: formatDateForInput(product.expiry_date),
        });
        setIsModalOpen(true);
        setMessage('');
        setError('');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = {
            name: editFormData.name,
            price: parseFloat(editFormData.price),
            items: parseInt(editFormData.items, 10),
            category: parseInt(editFormData.category_id, 10),
            expiryDate: editFormData.expiry_date,
        };
        try {
            await axios.put(`http://localhost:3001/products/${editingProduct.id}`, dataToSend);
            setMessage(`✅ Product ${editingProduct.id} updated successfully!`);
            handleCloseModal();
            fetchProducts(query);
        } catch (err) {
            console.error('Failed to update product:', err);
            setError(`❌ Failed to update product ${editingProduct.id}.`);
        }
    };

    const handleExpiryFilter = async () => {
        try {
            if (!expiryFilter) return fetchProducts();
            let url = `http://localhost:3001/products/expiry-filter?type=${expiryFilter}`;
            if (expiryFilter === 'date') {
                if (!customExpiryDate) {
                    setError('Please select a date.');
                    return;
                }
                url += `&value=${customExpiryDate}`;
            }
            const res = await axios.get(url);
            setProducts(res.data);
            setMessage(`Showing products expiring: ${expiryFilter === 'date' ? customExpiryDate : expiryFilter}`);
        } catch (err) {
            console.error('Error filtering expiry:', err);
            setError('Failed to filter products by expiry date.');
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [fetchProducts]);

    return (
        <div className="max-w-5xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-center mb-4">All Products</h2>

            {/* {message && <div className="alert alert-success mb-4"><span>{message}</span></div>} */}
            {error && <div className="alert alert-error mb-4"><span>{error}</span></div>}

            <div className="mb-4 flex flex-col sm:flex-row items-center gap-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={query}
                    onChange={handleSearch}
                    className="input input-bordered w-full max-w-xs"
                />

                <select
                    className="select select-bordered"
                    value={expiryFilter}
                    onChange={(e) => setExpiryFilter(e.target.value)}
                >
                    <option value="">-- Filter by Expiry --</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                    <option value="date">Custom Date</option>
                </select>

                {expiryFilter === 'date' && (
                    <input
                        type="date"
                        className="input input-bordered"
                        value={customExpiryDate}
                        onChange={(e) => setCustomExpiryDate(e.target.value)}
                    />
                )}

                <button className="btn btn-primary" onClick={handleExpiryFilter}>Filter</button>
            </div>

            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Items</th>
                            <th>Category</th>
                            <th>Expiry Date</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr><td colSpan="8" className="text-center">No products found</td></tr>
                        ) : (
                            products.map(product => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>{product.items}</td>
                                    <td>{product.category || 'N/A'}</td>
                                    <td>{formatDateForInput(product.expiry_date)}</td>
                                    <td>{formatDateForInput(product.created_at)}</td>
                                    <td>
                                        <button className="btn btn-sm btn-warning mr-2" onClick={() => handleOpenEditModal(product)}>Edit</button>
                                        <button className="btn btn-sm btn-error" onClick={() => handleDelete(product.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box relative">
                        <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={handleCloseModal}>✕</button>
                        <h3 className="text-lg font-bold mb-4">Edit Product</h3>

                        <form onSubmit={handleUpdateSubmit} className="space-y-4">
                            <input className="input input-bordered w-full" type="text" name="name" value={editFormData.name} onChange={handleEditFormChange} placeholder="Name" required />
                            <input className="input input-bordered w-full" type="number" name="price" value={editFormData.price} onChange={handleEditFormChange} placeholder="Price" required />
                            <input className="input input-bordered w-full" type="number" name="items" value={editFormData.items} onChange={handleEditFormChange} placeholder="Items" required />
                            <select className="select select-bordered w-full" name="category_id" value={editFormData.category_id} onChange={handleEditFormChange} required>
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            <input className="input input-bordered w-full" type="date" name="expiry_date" value={editFormData.expiry_date} onChange={handleEditFormChange} required />
                            <div className="modal-action">
                                <button type="button" className="btn" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                    <div className="modal-backdrop" onClick={handleCloseModal}></div>
                </div>
            )}
        </div>
    );
}

export default AllProducts;

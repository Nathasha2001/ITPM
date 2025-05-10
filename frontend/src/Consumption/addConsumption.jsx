import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddConsumption = ({ onAddSuccess }) => {
    const [formData, setFormData] = useState({
        item: '',
        quantity: '',
        category: '',
        notes: '',
        inventoryItemId: ''
    });
    const [inventoryItems, setInventoryItems] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInventoryItems();
    }, []);

    const fetchInventoryItems = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/inventory');
            setInventoryItems(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching inventory:', error);
            setError('Failed to load inventory items');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // If inventory item is selected, update the form with its details
        if (name === 'inventoryItemId') {
            const selectedItem = inventoryItems.find(item => item._id === value);
            if (selectedItem) {
                setFormData(prev => ({
                    ...prev,
                    item: selectedItem.item,
                    category: selectedItem.Category
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/consumption', {
                ...formData,
                quantity: parseInt(formData.quantity)
            });
            setFormData({
                item: '',
                quantity: '',
                category: '',
                notes: '',
                inventoryItemId: ''
            });
            setError('');
            if (onAddSuccess) onAddSuccess(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding consumption record');
        }
    };

    if (loading) {
        return <div className="text-center p-8 text-blue-600 font-semibold animate-pulse">Loading inventory items...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
            <div className="w-full max-w-lg mx-auto">
                <h2 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">Add Consumption Record</h2>
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 animate-fade-in">
                        {error}
                    </div>
                )}
                <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-blue-700 mb-2" htmlFor="inventoryItemId">
                                Select Item
                            </label>
                            <select
                                name="inventoryItemId"
                                id="inventoryItemId"
                                value={formData.inventoryItemId}
                                onChange={handleChange}
                                className="w-full p-3 border border-blue-200 rounded-lg bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200"
                                required
                            >
                                <option value="">Select an item</option>
                                {inventoryItems.map(item => (
                                    <option key={item._id} value={item._id}>
                                        {item.item} (Available: {item.Quantity})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-blue-700 mb-2" htmlFor="quantity">
                                Quantity
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                id="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="w-full p-3 border border-blue-200 rounded-lg bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200"
                                required
                                min="1"
                                placeholder="Enter quantity"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-blue-700 mb-2" htmlFor="notes">
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                id="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="w-full p-3 border border-blue-200 rounded-lg bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 resize-none"
                                rows="4"
                                placeholder="Add any additional notes here..."
                            />
                        </div>
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 transition duration-200 transform hover:scale-105"
                            >
                                Add Consumption Record
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddConsumption;
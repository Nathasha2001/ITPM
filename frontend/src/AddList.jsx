import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';

function AddList() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        item: "",
        Quantity: "",
        Price: ""
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(null);
    const [negativeInputError, setNegativeInputError] = useState(null);

    const validateForm = () => {
        const newErrors = {};
        // Item validation: required, only letters, numbers, and spaces allowed
        if (!formData.item.trim()) {
            newErrors.item = 'Item name is required';
        } else if (!/^[a-zA-Z0-9\s]+$/.test(formData.item.trim())) {
            newErrors.item = 'Item name can only contain letters, numbers, and spaces';
        }
        // Quantity validation: required, must be a positive integer
        if (!formData.Quantity) {
            newErrors.Quantity = 'Quantity is required';
        } else if (!Number.isInteger(Number(formData.Quantity)) || Number(formData.Quantity) <= 0) {
            newErrors.Quantity = 'Quantity must be a positive integer';
        }
        // Price validation: required, must be a non-negative number with up to 2 decimal places
        if (!formData.Price) {
            newErrors.Price = 'Price is required';
        } else if (isNaN(formData.Price) || Number(formData.Price) < 0) {
            newErrors.Price = 'Price cannot be negative';
        } else if (!/^\d+(\.\d{1,2})?$/.test(formData.Price)) {
            newErrors.Price = 'Price must have up to 2 decimal places';
        }
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        // Clear error for the field being edited
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: null
        }));
    };

    const handleKeyDown = (e, fieldName) => {
        // Prevent entering the minus key and show a temporary error message
        if (e.key === '-') {
            e.preventDefault();
            setNegativeInputError(`${fieldName} cannot be negative`);
            setTimeout(() => {
                setNegativeInputError(null);
            }, 2000); // Clear the error message after 2 seconds
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setLoading(false);
            return;
        }

        setLoading(true);
        setErrors({});
        setSuccess(null);
        setNegativeInputError(null);

        try {
            const response = await fetch('http://localhost:3000/api/shopping-list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    item: formData.item.trim(),
                    Quantity: parseInt(formData.Quantity),
                    Price: parseFloat(formData.Price)
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add item');
            }

            setSuccess('Item added successfully!');
            setFormData({
                item: "",
                Quantity: "",
                Price: ""
            });
            setTimeout(() => {
                setSuccess(null);
                navigate('/shoppinglist'); // Navigate to the shopping list view after 2 seconds
            }, 2000);
        } catch (error) {
            setErrors({ submit: error.message || 'Failed to add item. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
                <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:shadow-2xl">
                    <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
                        Add Shopping List Item
                    </h2>
                    {success && (
                        <div className="text-green-600 text-center font-semibold bg-green-100 py-3 rounded-lg mb-6">
                            {success}
                        </div>
                    )}
                    {errors.submit && (
                        <div className="text-red-500 text-center font-semibold bg-red-100 py-3 rounded-lg mb-6">
                            {errors.submit}
                        </div>
                    )}
                    {negativeInputError && (
                        <div className="text-red-500 text-center font-semibold bg-red-100 py-3 rounded-lg mb-6">
                            {negativeInputError}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="item" className="block text-sm font-medium text-gray-700 mb-1">
                                Item Name
                            </label>
                            <input
                                type="text"
                                id="item"
                                name="item"
                                value={formData.item}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg border ${errors.item ? 'border-red-300' : 'border-gray-200'} focus:ring-2 focus:ring-blue-300 focus:border-blue-500 bg-gray-50 text-gray-800 transition-colors duration-200`}
                                required
                                placeholder="Enter item name"
                            />
                            {errors.item && (
                                <p className="mt-1 text-sm text-red-500">{errors.item}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="Quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity
                            </label>
                            <input
                                type="number"
                                id="Quantity"
                                name="Quantity"
                                value={formData.Quantity}
                                onChange={handleChange}
                                onKeyDown={(e) => handleKeyDown(e, 'Quantity')}
                                className={`w-full px-4 py-2 rounded-lg border ${errors.Quantity ? 'border-red-300' : 'border-gray-200'} focus:ring-2 focus:ring-blue-300 focus:border-blue-500 bg-gray-50 text-gray-800 transition-colors duration-200`}
                                required
                                min="1"
                                placeholder="Enter quantity"
                            />
                            {errors.Quantity && (
                                <p className="mt-1 text-sm text-red-500">{errors.Quantity}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="Price" className="block text-sm font-medium text-gray-700 mb-1">
                                Price (Rs.)
                            </label>
                            <input
                                type="number"
                                id="Price"
                                name="Price"
                                value={formData.Price}
                                onChange={handleChange}
                                onKeyDown={(e) => handleKeyDown(e, 'Price')}
                                className={`w-full px-4 py-2 rounded-lg border ${errors.Price ? 'border-red-300' : 'border-gray-200'} focus:ring-2 focus:ring-blue-300 focus:border-blue-500 bg-gray-50 text-gray-800 transition-colors duration-200`}
                                required
                                min="0"
                                step="0.01"
                                placeholder="Enter price"
                            />
                            {errors.Price && (
                                <p className="mt-1 text-sm text-red-500">{errors.Price}</p>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 font-semibold"
                                >
                                    {loading ? 'Adding...' : 'Add Item'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate('/shoppinglist')}
                                className="w-full bg-blue-100 text-blue-700 py-3 px-6 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 font-semibold"
                            >
                                View Shopping List
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddList;
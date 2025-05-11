import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './navbar';

function UpdateItem() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        item: "",
        Quantity: "",
        Price: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/shopping-list/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch item');
                }
                const data = await response.json();
                setFormData({
                    item: data.item,
                    Quantity: data.Quantity,
                    Price: data.Price
                });
            } catch (error) {
                setError(error.message);
            }
        };
        fetchItem();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`http://localhost:3000/api/shopping-list/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    item: formData.item,
                    Quantity: parseInt(formData.Quantity),
                    Price: parseFloat(formData.Price)
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update item');
            }

            setSuccess('Item updated successfully!');
            setTimeout(() => {
                navigate('/shoppinglist');
            }, 2000); // Navigate after 2 seconds to allow user to see the success message
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className="text-red-500 text-center mt-10 font-semibold bg-red-100 py-4 rounded-lg max-w-md mx-auto">
                {error}
            </div>
        );
    }

    return (
        <div>
             <Navbar/>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:shadow-2xl">
                {success && (
                    <div className="text-green-600 text-center font-semibold bg-green-100 py-3 rounded-lg mb-6">
                        {success}
                    </div>
                )}
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
                    Update Shopping Item
                </h2>
                
                <div className="space-y-6">
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
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 bg-gray-50 text-gray-800 transition-colors duration-200"
                            required
                            placeholder="Enter item name"
                        />
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
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 bg-gray-50 text-gray-800 transition-colors duration-200"
                            required
                            min="1"
                            placeholder="Enter quantity"
                        />
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
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 bg-gray-50 text-gray-800 transition-colors duration-200"
                            required
                            min="0"
                            step="0.01"
                            placeholder="Enter price"
                        />
                    </div>

                    <div className="flex space-x-4 mt-8">
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 font-semibold"
                        >
                            {loading ? 'Updating...' : 'Update Item'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 font-semibold"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}

export default UpdateItem;
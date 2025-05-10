import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import AddConsumption from './addConsumption';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ConsumptionTable = () => {
    const [consumption, setConsumption] = useState([]);
    const [filteredConsumption, setFilteredConsumption] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [totalConsumption, setTotalConsumption] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchConsumption();
    }, []);

    const fetchConsumption = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3000/api/consumption');
            // Ensure each item has a totalPrice, calculate it if missing
            const consumptionWithTotal = response.data.map(item => ({
                ...item,
                totalPrice: item.totalPrice || (item.quantity * (item.inventoryItemId?.Price || 0))
            }));
            setConsumption(consumptionWithTotal);
            setFilteredConsumption(consumptionWithTotal);
            // Calculate total consumption value
            const total = consumptionWithTotal.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
            setTotalConsumption(total);
            setError('');
        } catch (error) {
            console.error('Error fetching consumption records:', error);
            setError('Failed to load consumption records');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = consumption.filter(item =>
            item.item.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query) ||
            new Date(item.date).toLocaleDateString().toLowerCase().includes(query)
        );
        setFilteredConsumption(filtered);
        const newTotal = filtered.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
        setTotalConsumption(newTotal);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this consumption record?')) {
            try {
                await axios.delete(`http://localhost:3000/api/consumption/${id}`);
                const updatedConsumption = consumption.filter(item => item._id !== id);
                setConsumption(updatedConsumption);
                setFilteredConsumption(updatedConsumption);
                // Recalculate total after deletion
                const newTotal = updatedConsumption.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
                setTotalConsumption(newTotal);
                setError('');
            } catch (error) {
                console.error('Error deleting consumption record:', error);
                setError('Failed to delete consumption record');
            }
        }
    };

    const handleAddSuccess = () => {
        setShowAddForm(false);
        fetchConsumption();
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Consumption Records Report', 14, 22);
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
        doc.text(`Total Consumption Value: Rs. ${totalConsumption.toFixed(2)}`, 14, 38);

        const tableColumn = ['Item', 'Quantity', 'Category', 'Date', 'Total Price', 'Notes'];
        const tableRows = filteredConsumption.map(item => [
            item.item,
            item.quantity,
            item.category,
            new Date(item.date).toLocaleDateString(),
            `Rs. ${(item.totalPrice || 0).toFixed(2)}`,
            item.notes || '-'
        ]);

        doc.autoTable({
            startY: 50,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
            styles: { fontSize: 10 },
        });

        doc.save('consumption_report.pdf');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
                <div className="text-center p-8 text-blue-600 font-semibold animate-pulse text-xl">
                    Loading consumption records...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                    <div className="mb-4 sm:mb-0">
                        <h2 className="text-3xl font-extrabold text-blue-600">Consumption Records</h2>
                        <p className="text-blue-700 mt-2 font-semibold">
                            Total Consumption Value: Rs. {totalConsumption.toFixed(2)}
                        </p>
                    </div>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 transition duration-200 transform hover:scale-105"
                        >
                            Add New Record
                        </button>
                        <button
                            onClick={generatePDF}
                            className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 transition duration-200 transform hover:scale-105"
                        >
                            Generate PDF Report
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 animate-fade-in">
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search by item, category, or date..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full sm:w-1/2 p-3 border border-blue-200 rounded-lg bg-blue-50 text-blue-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200"
                    />
                </div>

                {showAddForm ? (
                    <AddConsumption onAddSuccess={handleAddSuccess} />
                ) : consumption && consumption.length > 0 ? (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-blue-100">
                                <thead className="bg-blue-500 text-white">
                                    <tr>
                                        <th className="py-4 px-6 text-left text-sm font-semibold">Item</th>
                                        <th className="py-4 px-6 text-left text-sm font-semibold">Quantity</th>
                                        <th className="py-4 px-6 text-left text-sm font-semibold">Category</th>
                                        <th className="py-4 px-6 text-left text-sm font-semibold">Date</th>
                                        <th className="py-4 px-6 text-left text-sm font-semibold">Total Price</th>
                                        <th className="py-4 px-6 text-left text-sm font-semibold">Notes</th>
                                        <th className="py-4 px-6 text-left text-sm font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-blue-100">
                                    {filteredConsumption.map(item => (
                                        <tr key={item._id} className="hover:bg-blue-50 transition duration-200">
                                            <td className="py-4 px-6 text-sm text-blue-900">{item.item}</td>
                                            <td className="py-4 px-6 text-sm text-blue-900">{item.quantity}</td>
                                            <td className="py-4 px-6 text-sm text-blue-900">{item.category}</td>
                                            <td className="py-4 px-6 text-sm text-blue-900">
                                                {new Date(item.date).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-blue-900">
                                                Rs. {(item.totalPrice || 0).toFixed(2)}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-blue-900">{item.notes}</td>
                                            <td className="py-4 px-6 text-sm">
                                                <div className="flex space-x-4">
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="text-red-500 hover:text-red-700 transition-colors transform hover:scale-110"
                                                        title="Delete"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-xl">
                        <p className="text-blue-600 font-medium">No consumption records available.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConsumptionTable;
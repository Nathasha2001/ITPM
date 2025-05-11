import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaTrash, FaShoppingBasket, FaPlus, FaSearch, FaFileDownload, FaPrint, FaFilePdf, FaFileExcel } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';

function ShoppingListView() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [showReportModal, setShowReportModal] = useState(false);
    const reportTableRef = useRef(null);

    const fetchItems = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/shopping-list');
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const data = await response.json();
            setItems(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        // Filter items based on search term
        const filtered = items.filter(item => 
            item.item.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredItems(filtered);
    }, [searchTerm, items]);

    const handleEdit = (id) => {
        navigate(`/update/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                const response = await fetch(`http://localhost:3000/api/shopping-list/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Failed to delete item');
                }
                // Refresh the list after deletion
                fetchItems();
            } catch (error) {
                setError(error.message);
            }
        }
    };

    const calculateTotal = () => {
        return filteredItems.reduce((sum, item) => sum + item.Total, 0).toFixed(2);
    };

    const generateReport = (reportType) => {
        // Close the modal
        setShowReportModal(false);
        
        // Prepare report data
        const itemsToReport = searchTerm ? filteredItems : items;
        const reportTitle = `Shopping List Report - ${new Date().toLocaleDateString()}`;
        const totalAmount = itemsToReport.reduce((sum, item) => sum + item.Total, 0).toFixed(2);
        
        switch (reportType) {
            case 'csv':
                downloadCSV(itemsToReport, reportTitle);
                break;
            case 'print':
                printReport(itemsToReport, reportTitle, totalAmount);
                break;
            case 'pdf':
                alert('PDF generation would require a PDF library integration.');
                // Implementation would require a PDF library like jsPDF
                break;
            case 'excel':
                alert('Excel generation would require an Excel library integration.');
                // Implementation would require an Excel library like SheetJS
                break;
            default:
                break;
        }
    };

    const downloadCSV = (data, fileName) => {
        // Create CSV content
        const headers = ['Item', 'Quantity', 'Price (Rs.)', 'Total (Rs.)'];
        const csvContent = [
            headers.join(','),
            ...data.map(item => [
                `"${item.item}"`,
                item.Quantity,
                item.Price.toFixed(2),
                item.Total.toFixed(2)
            ].join(','))
        ].join('\\n');
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${fileName}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const printReport = (data, title, total) => {
        // Create a printable version
        const printWindow = window.open('', '_blank', 'height=600,width=800');
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>${title}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h1 { color: #1e40af; text-align: center; margin-bottom: 20px; }
                        table { width: 100%; border-collapse: collapse; }
                        th { background-color: #dbeafe; padding: 10px; text-align: left; border-bottom: 2px solid #93c5fd; }
                        td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
                        .total-row { font-weight: bold; border-top: 2px solid #93c5fd; }
                        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #6b7280; }
                        .date { text-align: right; margin-bottom: 20px; }
                    </style>
                </head>
                <body>
                    <div class="date">Generated on: ${new Date().toLocaleString()}</div>
                    <h1>${title}</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Price (Rs.)</th>
                                <th>Total (Rs.)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(item => `
                                <tr>
                                    <td>${item.item}</td>
                                    <td>${item.Quantity}</td>
                                    <td>${item.Price.toFixed(2)}</td>
                                    <td>${item.Total.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                            <tr class="total-row">
                                <td colspan="3">Grand Total</td>
                                <td>Rs. ${total}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="footer">
                        Shopping List Manager — Generated Report
                    </div>
                </body>
            </html>
        `);
        
        printWindow.document.close();
        // Wait for content to load before printing
        setTimeout(() => {
            printWindow.print();
            // printWindow.close();
        }, 250);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-blue-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
    
    if (error) return (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mx-auto max-w-6xl mt-8 rounded shadow-md">
            <p className="font-bold">Error</p>
            <p>{error}</p>
        </div>
    );

    return (
        <div>
             <Navbar/>
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 p-4 sm:p-6 md:p-8">
           
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-blue-700 text-white p-6 flex flex-col sm:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 sm:mb-0">
                        <FaShoppingBasket className="w-8 h-8 mr-3" />
                        <h2 className="text-2xl font-extrabold">My Shopping List</h2>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FaSearch className="w-4 h-4 text-blue-300" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search items..."
                                className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border-none rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={() => navigate('/add')}
                            className="flex items-center bg-white text-blue-700 px-5 py-2 rounded-full font-medium shadow-md hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700 w-full sm:w-auto justify-center"
                        >
                            <FaPlus className="w-4 h-4 mr-2" />
                            Add New Item
                        </button>
                    </div>
                </div>
                
                {/* Content with Report Options in the right corner */}
                <div className="p-6">
                    <div className="flex flex-col md:flex-row">
                        {/* Main Content - Shopping List Table */}
                        <div className={filteredItems.length > 0 ? "md:w-3/4 pr-0 md:pr-6" : "w-full"}>
                            {filteredItems.length === 0 ? (
                                <div className="text-center py-12">
                                    {items.length === 0 ? (
                                        <>
                                            <FaShoppingBasket className="w-12 h-12 mx-auto text-blue-300" />
                                            <p className="mt-4 text-lg text-gray-500">Your shopping list is empty.</p>
                                            <button
                                                onClick={() => navigate('/add')}
                                                className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
                                            >
                                                <FaPlus className="w-4 h-4 mr-2" />
                                                Add your first item
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <FaSearch className="w-12 h-12 mx-auto text-blue-300" />
                                            <p className="mt-4 text-lg text-gray-500">No items match your search.</p>
                                            <button
                                                onClick={() => setSearchTerm('')}
                                                className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
                                            >
                                                Clear search
                                            </button>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-blue-100 rounded-lg overflow-hidden">
                                        <thead>
                                            <tr className="bg-blue-50">
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
                                                    Item
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
                                                    Quantity
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
                                                    Price
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
                                                    Total
                                                </th>
                                                <th className="px-6 py-4 text-center text-xs font-semibold text-blue-800 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-blue-50">
                                            {filteredItems.map((item, index) => (
                                                <tr 
                                                    key={item._id} 
                                                    className={`hover:bg-blue-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-25'}`}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-medium text-gray-900">{item.item}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                        {item.Quantity}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                        Rs. {item.Price.toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="font-medium text-blue-700">
                                                            Rs. {item.Total.toFixed(2)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <div className="flex justify-center space-x-3">
                                                            <button
                                                                onClick={() => handleEdit(item._id)}
                                                                className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-200 transition-colors duration-150"
                                                                title="Edit"
                                                            >
                                                                <FaEdit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(item._id)}
                                                                className="bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200 transition-colors duration-150"
                                                                title="Delete"
                                                            >
                                                                <FaTrash className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            
                            {/* Total Summary */}
                            {filteredItems.length > 0 && (
                                <div className="mt-6 bg-blue-100 rounded-xl p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-blue-800 font-medium">
                                            {searchTerm ? 
                                                `Found Items: ${filteredItems.length} / ${items.length}` : 
                                                `Total Items: ${items.length}`}
                                        </span>
                                        <div className="bg-white px-6 py-3 rounded-lg shadow">
                                            <span className="text-gray-600 mr-2">Grand Total:</span>
                                            <span className="text-blue-800 font-bold text-lg">Rs. {calculateTotal()}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Report Generation Panel in Right Corner */}
                        {items.length > 0 && (
                            <div className="md:w-1/4 mt-6 md:mt-0">
                                <div className="bg-gray-50 rounded-xl p-4 shadow-md">
                                    <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                                        <FaFileDownload className="w-5 h-5 mr-2" />
                                        Report Options
                                    </h3>

                                    <div className="grid grid-cols-1 gap-3">
                                        <button
                                            onClick={() => generateReport('csv')}
                                            className="flex items-center justify-left bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg transition duration-150"
                                        >
                                            <FaFileExcel className="w-4 h-4 mr-3" />
                                            CSV Export
                                        </button>
                                        
                                        <button
                                            onClick={() => generateReport('print')}
                                            className="flex items-center justify-left bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg transition duration-150"
                                        >
                                            <FaFileDownload className="w-4 h-4 mr-3" />
                                            Download Report
                                        </button>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
                                        <p>Items: {searchTerm ? filteredItems.length : items.length}</p>
                                        <p>Total Amount: Rs. {calculateTotal()}</p>
                                        <p className="mt-2">Last updated: {new Date().toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            </div>
            {/* Footer */}
            <div className="max-w-6xl mx-auto text-center text-blue-400 text-sm mt-8">
                <p>Shopping List Manager • {new Date().getFullYear()}</p>
            </div>
        </div>
    );
}

export default ShoppingListView;
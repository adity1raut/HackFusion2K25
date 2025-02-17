import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ComplainTable() {
    const [complaints, setComplaints] = useState([]);

    const fetchComplaints = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/complaints');
            const complaintsData = await response.json();
            
            if (!response.ok) {
                throw new Error('Failed to fetch complaints');
            }

            // Ensure the data is a valid JSON object
            if (Array.isArray(complaintsData)) {
                setComplaints(complaintsData); // Set complaints as an array
            } else {
                console.error('Fetched data is not a valid JSON array:', complaintsData);
                setComplaints([]);
            }
        } catch (error) {
            toast.error('Failed to fetch complaints! Please try again.', {
                position: "top-right",
                theme: "light",
                style: {
                    background: '#FFF5F5',
                    color: '#E53E3E',
                }
            });
        }
    };

    // Call fetchComplaints when component mounts
    useEffect(() => {
        fetchComplaints();
    }, []);

    return (
        <div>
            <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Complaints Status</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {complaints.map((complaint, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{complaint.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{complaint.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{complaint.subject}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        <div className="max-w-xs truncate">{complaint.message}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${complaint.status === 'unread'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-green-100 text-green-700'
                                            }`}
                                        >
                                            {complaint.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {complaint.createdAt ? new Date(complaint.createdAt).toLocaleString() : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ComplainTable;

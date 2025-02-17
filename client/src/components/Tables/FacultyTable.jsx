import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function FacultyTable() {
    const [availabilities, setAvailabilities] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchAvailabilities();
    }, [page]);

    const fetchAvailabilities = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/faculty-availability?page=${page}&limit=10`);
            setAvailabilities(response.data.data);
            setTotalPages(response.data.pagination.totalPages);
        } catch (error) {
            toast.error('Failed to fetch availabilities');
        }
    };

    return (
        <div>
            <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Faculty Availabilities</h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Slots</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {availabilities.map((availability, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        <div>{availability.name}</div>
                                        <div className="text-xs text-gray-500">{availability.designation}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{availability.department}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{availability.dayOfWeek}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {availability.availableTimeSlots.map((slot, index) => (
                                            <div key={index}>{slot.start} - {slot.end}</div>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-8">
                    <button
                        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                        Previous
                    </button>

                    <div className="text-gray-600">
                        Page {page} of {totalPages}
                    </div>

                    <button
                        onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                        className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FacultyTable;

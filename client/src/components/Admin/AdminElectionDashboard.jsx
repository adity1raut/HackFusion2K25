import React, { useState, useEffect } from 'react';
import { Search, Check, X, Edit, Trash2, Eye, Calendar, Book, Award } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminElectionDashboard = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        year: '',
        branch: '',
        position: '',
        search: ''
    });
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [remarks, setRemarks] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [editData, setEditData] = useState(null);

    const years = ["second", "third", "last"];
    const branches = ["CSE", "EXTC", "IT", "Prod", "Mech", "Text", "Civil", "Elect", "Instru", "Chem"];
    const positions = ["techsecretary", "gensecretary", "sportsecretary", "cultusecretary", "girlsrepresentative"];
    const statuses = ["pending", "approved", "rejected"];

    useEffect(() => {
        fetchCandidates();
    }, [filters]);

    const fetchCandidates = async () => {
        try {
            const queryParams = new URLSearchParams(
                Object.entries(filters).filter(([_, value]) => value)
            );
            const response = await fetch(`http://localhost:4000/api/admin/candidates?${queryParams}`);
            const data = await response.json();

            if (!response.ok) throw new Error(data.message);

            setCandidates(data.data);
        } catch (error) {
            toast.error(error.message || 'Error fetching candidates');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (candidateId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:4000/api/admin/candidates/${candidateId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: newStatus,
                    remarks: remarks.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message);

            toast.success(`Candidate ${newStatus} successfully`);
            setSelectedCandidate(null);
            setRemarks('');
            fetchCandidates();
        } catch (error) {
            toast.error(error.message || `Error updating candidate status`);
        }
    };

    const handleDelete = async (candidateId) => {
        if (!window.confirm('Are you sure you want to delete this candidate?')) return;

        try {
            const response = await fetch(`http://localhost:4000/api/admin/candidates/${candidateId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message);

            toast.success('Candidate deleted successfully');
            fetchCandidates();
        } catch (error) {
            toast.error(error.message || 'Error deleting candidate');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            // Append all form fields
            Object.keys(editData).forEach(key => {
                if (key !== 'scoreCard' && key !== 'profileImage') {
                    formData.append(key, editData[key]);
                }
            });

            // Append files if they exist
            if (editData.scoreCard) {
                formData.append('scoreCard', editData.scoreCard);
            }
            if (editData.profileImage) {
                formData.append('profileImage', editData.profileImage);
            }

            const response = await fetch(`http://localhost:4000/api/admin/candidates/${selectedCandidate._id}`, {
                method: 'PUT',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message);

            toast.success('Candidate updated successfully');
            setIsEditMode(false);
            setSelectedCandidate(null);
            setEditData(null);
            fetchCandidates();
        } catch (error) {
            toast.error(error.message || 'Error updating candidate');
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'text-green-600';
            case 'rejected': return 'text-red-600';
            case 'pending': return 'text-yellow-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl pt-20 mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Election Candidates Management</h1>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                className="w-full p-2 border rounded-lg"
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                <option value="">All Statuses</option>
                                {statuses.map(status => (
                                    <option key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Year
                            </label>
                            <select
                                className="w-full p-2 border rounded-lg"
                                value={filters.year}
                                onChange={(e) => handleFilterChange('year', e.target.value)}
                            >
                                <option value="">All Years</option>
                                {years.map(year => (
                                    <option key={year} value={year}>
                                        {year.charAt(0).toUpperCase() + year.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Branch
                            </label>
                            <select
                                className="w-full p-2 border rounded-lg"
                                value={filters.branch}
                                onChange={(e) => handleFilterChange('branch', e.target.value)}
                            >
                                <option value="">All Branches</option>
                                {branches.map(branch => (
                                    <option key={branch} value={branch}>{branch}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Position
                            </label>
                            <select
                                className="w-full p-2 border rounded-lg"
                                value={filters.position}
                                onChange={(e) => handleFilterChange('position', e.target.value)}
                            >
                                <option value="">All Positions</option>
                                {positions.map(position => (
                                    <option key={position} value={position}>
                                        {position.charAt(0).toUpperCase() + position.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg pl-10"
                                    placeholder="Search name, email..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Candidates Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Candidate
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Position
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center">
                                            Loading candidates...
                                        </td>
                                    </tr>
                                ) : candidates.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center">
                                            No candidates found
                                        </td>
                                    </tr>
                                ) : (
                                    candidates.map((candidate) => (
                                        <tr key={candidate._id}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <img
                                                        src={candidate.image}
                                                        alt={candidate.name}
                                                        className="h-10 w-10 rounded-full mr-3"
                                                    />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {candidate.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {candidate.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    <Book className="inline-block w-4 h-4 mr-1" />
                                                    Reg No: {candidate.regNo}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    <Calendar className="inline-block w-4 h-4 mr-1" />
                                                    Year: {candidate.year}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Branch: {candidate.branch}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    <Award className="inline-block w-4 h-4 mr-1" />
                                                    {candidate.position.charAt(0).toUpperCase() + candidate.position.slice(1)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(candidate.status)}`}>
                                                    {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                                                </span>
                                                {candidate.remarks && (
                                                    <div className="mt-2 text-sm text-gray-500">
                                                        Remarks: {candidate.remarks}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    {candidate.status === 'pending' && (
                                                        <button
                                                            onClick={() => setSelectedCandidate(candidate)}
                                                            className="bg-blue-100 text-blue-600 p-2 rounded-md hover:bg-blue-200"
                                                            title="Review"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            setSelectedCandidate(candidate);
                                                            setIsEditMode(true);
                                                            setEditData({
                                                                name: candidate.name,
                                                                email: candidate.email,
                                                                regNo: candidate.regNo,
                                                                year: candidate.year,
                                                                branch: candidate.branch,
                                                                position: candidate.position
                                                            });
                                                        }}
                                                        className="bg-yellow-100 text-yellow-600 p-2 rounded-md hover:bg-yellow-200"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(candidate._id)}
                                                        className="bg-red-100 text-red-600 p-2 rounded-md hover:bg-red-200"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>


                {selectedCandidate && !isEditMode && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold mb-4">Review Candidate Application</h2>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <img
                                            src={selectedCandidate.image}
                                            alt="Profile"
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                        <img
                                            src={selectedCandidate.scorecard}
                                            alt="Scorecard"
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="font-medium">Name</h3>
                                            <p>{selectedCandidate.name}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-medium">Email</h3>
                                            <p>{selectedCandidate.email}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-medium">Registration Number</h3>
                                            <p>{selectedCandidate.regNo}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-medium">Position</h3>
                                            <p>{selectedCandidate.position}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-medium">Year</h3>
                                            <p>{selectedCandidate.year}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-medium">Branch</h3>
                                            <p>{selectedCandidate.branch}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-medium mb-2">
                                            Remarks
                                        </label>
                                        <textarea
                                            value={remarks}
                                            onChange={(e) => setRemarks(e.target.value)}
                                            className="w-full p-2 border rounded-lg"
                                            rows="3"
                                            placeholder="Add remarks (optional)"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-4 mt-6">
                                        <button
                                            onClick={() => {
                                                setSelectedCandidate(null);
                                                setRemarks('');
                                            }}
                                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(selectedCandidate._id, 'rejected')}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(selectedCandidate._id, 'approved')}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                        >
                                            Approve
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {isEditMode && selectedCandidate && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-2xl w-full">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold mb-4">Edit Candidate</h2>

                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-medium mb-2">Name</label>
                                            <input
                                                type="text"
                                                value={editData.name}
                                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                className="w-full p-2 border rounded-lg"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-medium mb-2">Email</label>
                                            <input
                                                type="email"
                                                value={editData.email}
                                                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                                className="w-full p-2 border rounded-lg"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-medium mb-2">Registration Number</label>
                                            <input
                                                type="text"
                                                value={editData.regNo}
                                                onChange={(e) => setEditData({ ...editData, regNo: e.target.value })}
                                                className="w-full p-2 border rounded-lg"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-medium mb-2">Year</label>
                                            <select
                                                value={editData.year}
                                                onChange={(e) => setEditData({ ...editData, year: e.target.value })}
                                                className="w-full p-2 border rounded-lg"
                                                required
                                            >
                                                {years.map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block font-medium mb-2">Branch</label>
                                            <select
                                                value={editData.branch}
                                                onChange={(e) => setEditData({ ...editData, branch: e.target.value })}
                                                className="w-full p-2 border rounded-lg"
                                                required
                                            >
                                                {branches.map(branch => (
                                                    <option key={branch} value={branch}>{branch}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block font-medium mb-2">Position</label>
                                            <select
                                                value={editData.position}
                                                onChange={(e) => setEditData({ ...editData, position: e.target.value })}
                                                className="w-full p-2 border rounded-lg"
                                                required
                                            >
                                                {positions.map(position => (
                                                    <option key={position} value={position}>{position}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-4 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditMode(false);
                                                setSelectedCandidate(null);
                                                setEditData(null);
                                            }}
                                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                <ToastContainer position="top-right" theme="light" />
            </div>
        </div>
    );
};

export default AdminElectionDashboard;

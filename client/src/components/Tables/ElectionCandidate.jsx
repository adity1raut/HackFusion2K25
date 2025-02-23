import React, { useState, useEffect } from 'react';
import { User, Mail, BookOpen, Clock, AlertCircle, Award, RefreshCcw, Image, ChevronDown } from 'lucide-react';

// Function to get status color and icon
const getStatusDetails = (status) => {
  switch (status) {
    case "pending":
      return { color: "bg-yellow-500", icon: <AlertCircle size={16} /> };
    case "approved":
      return { color: "bg-green-500", icon: <Award size={16} /> };
    case "rejected":
      return { color: "bg-red-500", icon: <AlertCircle size={16} /> };
    default:
      return { color: "bg-gray-500", icon: <AlertCircle size={16} /> };
  }
};

function ElectionCandidate() {
  const [candidates, setCandidates] = useState([]); // Store all candidates
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch candidates data from the API
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/api/election-candidates'); // Adjust the URL if necessary
      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }
      const data = await response.json();
      setCandidates(data); // Set the fetched candidates
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setError('Failed to fetch candidates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Filter candidates to only include approved ones
  const filteredCandidates = candidates.filter((candidate) => candidate.status === "approved");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading candidates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={fetchCandidates}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCcw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-gray-100 p-4">
  <div className="w-full max-w-5xl space-y-6">
    {/* Table for Approved Candidates */}
    <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-purple-600 to-indigo-600">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Name</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Email</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Branch</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Year</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Position</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Image</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredCandidates.map((candidate, index) => {
            const statusDetails = getStatusDetails(candidate.status);
            return (
              <tr key={index} className="hover:bg-gray-50 transition-colors duration-200 ease-in-out transform hover:scale-101">
                {/* Name */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{candidate.name}</td>

                {/* Email */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{candidate.email}</td>

                {/* Branch */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{candidate.branch}</td>

                {/* Year */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{candidate.year}</td>

                {/* Position */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{candidate.position}</td>

                {/* Image */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-200 shadow-sm">
                    {candidate.image ? (
                      <img
                        src={candidate.image}
                        alt={candidate.name}
                        className="w-full h-full object-cover transition-transform duration-200 ease-in-out hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-purple-100">
                        <Image className="text-purple-500" size={20} />
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
</div>
)}
export default ElectionCandidate;
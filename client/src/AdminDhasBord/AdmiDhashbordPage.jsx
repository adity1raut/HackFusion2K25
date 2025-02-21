import React from 'react';
import { User, Calendar, FileText, MessageSquare, DollarSign, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdmiDhashbordPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-20 gap-6">
        {/* Elections Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Elections</h2>
          </div>
          <div className="space-y-2 mb-6">
            <div className="flex items-center">
              <span className="text-gray-600">Total Candidates:</span>
              <span className="ml-2 font-medium">0</span> {/* Placeholder */}
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/dashboard/election')}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            View Details
          </button>
        </div>

        {/* Facility Booking Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold">Facility Booking</h2>
          </div>
          <div className="space-y-2 mb-6">
            <div className="flex items-center">
              <span className="text-gray-600">Booked Facilities:</span>
              <span className="ml-2 font-medium">0</span> {/* Placeholder */}
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">Available Facilities:</span>
              <span className="ml-2 font-medium">0</span> {/* Placeholder */}
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/dashboard/booking')}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
          >
            View Details
          </button>
        </div>

        {/* Applications Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold">Applications</h2>
          </div>
          <div className="space-y-2 mb-6">
            <div className="flex items-center">
              <span className="text-gray-600">Pending:</span>
              <span className="ml-2 font-medium">0</span> {/* Placeholder */}
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">Approved:</span>
              <span className="ml-2 font-medium">0</span> {/* Placeholder */}
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/dashboard/leaves')}
            className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
          >
            View Details
          </button>
        </div>

        {/* Complaints Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-semibold">Complaints</h2>
          </div>
          <div className="space-y-2 mb-6">
            <div className="flex items-center">
              <span className="text-gray-600">Processed:</span>
              <span className="ml-2 font-medium">0</span> {/* Placeholder */}
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">Pending:</span>
              <span className="ml-2 font-medium">0</span> {/* Placeholder */}
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/dashboard/complaints')}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            View Details
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-yellow-600" />
            <h2 className="text-xl font-semibold">Add Notification</h2>
          </div>
          <div className="space-y-2 mb-6">
            <div className="flex items-center">
              <span className="text-gray-600">Total Budget:</span>
              <span className="ml-2 font-medium">$20,000</span> {/* Placeholder */}
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">Expenses:</span>
              <span className="ml-2 font-medium">$15,000</span> {/* Placeholder */}
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard/budget-details')}
            className="w-full py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdmiDhashbordPage;
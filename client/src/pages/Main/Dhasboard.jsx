import React, { useState, useEffect } from 'react';
import { User, Calendar, FileText, MessageSquare, DollarSign, Users } from 'lucide-react'; // Added Users icon
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();

  // State for storing fetched data
  const [electionData, setElectionData] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [leaveData, setLeaveData] = useState(null);
  const [complaintData, setComplaintData] = useState(null);
  const [facultyAvailability, setFacultyAvailability] = useState({ available: 0, unavailable: 0 }); // Added faculty state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch election data
        const electionResponse = await fetch('http://localhost:4000/api/election-candidates');
        const electionData = await electionResponse.json();
        setElectionData(electionData);

        // Fetch booking data
        const bookingResponse = await fetch('http://localhost:4000/api/bookings/data');
        const bookingData = await bookingResponse.json();
        setBookingData(bookingData);

        // Fetch leave application data
        const leaveResponse = await axios.get('http://localhost:4000/api/leave-applications?page=1&limit=10');
        setLeaveData(leaveResponse.data);

        // Fetch complaint data
        const complaintResponse = await fetch('http://localhost:4000/api/complaints/users');
        const complaintData = await complaintResponse.json();
        setComplaintData(complaintData);

        // Fetch faculty availability data
        const facultyResponse = await axios.get('http://localhost:4000/api/faculty-availability');
        setFacultyAvailability(facultyResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
              <span className="ml-2 font-medium">{electionData?.length || 0}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard/election-details')}
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
              <span className="ml-2 font-medium">{bookingData?.booked?.length || 0}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">Available Facilities:</span>
              <span className="ml-2 font-medium">{bookingData?.available?.length || 0}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard/booking-details')}
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
              <span className="ml-2 font-medium">{leaveData?.pending || 0}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">Approved:</span>
              <span className="ml-2 font-medium">{leaveData?.approved || 0}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard/leave-details')}
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
              <span className="ml-2 font-medium">{complaintData?.processed || 0}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">Pending:</span>
              <span className="ml-2 font-medium">{complaintData?.pending || 0}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard/complaint-details')}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            View Details
          </button>
        </div>

        {/* Sponsorship & Budgets Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-yellow-600" />
            <h2 className="text-xl font-semibold">Sponsorship & Budgets</h2>
          </div>
          <div className="space-y-2 mb-6">
            <div className="flex items-center">
              <span className="text-gray-600">Total Budget:</span>
              <span className="ml-2 font-medium">$20,000</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">Expenses:</span>
              <span className="ml-2 font-medium">$15,000</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard/budget-details')}
            className="w-full py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors"
          >
            View Details
          </button>
        </div>

        {/* Faculty Availability Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-indigo-600" /> {/* Updated icon */}
            <h2 className="text-xl font-semibold">Faculty Availability</h2>
          </div>
          <div className="space-y-2 mb-6">
            <div className="flex items-center">
              <span className="text-gray-600">Available:</span>
              <span className="ml-2 font-medium">{facultyAvailability.available}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">Unavailable:</span>
              <span className="ml-2 font-medium">{facultyAvailability.unavailable}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard/faculty-details')}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
          >
            View Details
          </button>
        </div>

        {/* Complaint managment Card */}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-indigo-600" /> {/* Updated icon */}
            <h2 className="text-xl font-semibold">Cheating Resolution</h2>
          </div>
          <div className="space-y-2 mb-6">
            <div className="flex items-center">
              <span className="text-gray-600">Available:</span>
              <span className="ml-2 font-medium">{facultyAvailability.available}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">Unavailable:</span>
              <span className="ml-2 font-medium">{facultyAvailability.unavailable}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard/cheating-details')}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
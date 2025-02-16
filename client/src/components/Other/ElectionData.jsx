import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ElectionData() {
  const [availabilities, setAvailabilities] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    registrationNo: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/candidate-list?page=${page}`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        setAvailabilities(data.availabilities);
        setTotalPages(data.totalPages);
      } catch (err) {
        toast.error('Failed to load faculty availabilities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailSubmit = async () => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to send OTP');
      }

      toast.success('OTP sent successfully');
      setStep(2);
    } catch (err) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: formData.email, 
          otp: formData.otp 
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Invalid OTP');
      }

      toast.success('OTP verified successfully');
      setStep(3);
    } catch (err) {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-4xl mt-4 pt-24 px-4">
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
            Faculty Availabilities
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Day
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Slots
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {availabilities.map((availability, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div>{availability.name}</div>
                      <div className="text-xs text-gray-500">{availability.designation}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {availability.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {availability.dayOfWeek}
                    </td>
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
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1 || loading}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            <div className="text-gray-600">
              Page {page} of {totalPages}
            </div>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages || loading}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        {step === 1 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setStep(2)}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Your Vote
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-8 border border-gray-100 mt-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
              Verify Email
            </h2>
            <input
              type="email"
              name="email"
              className="px-4 py-2 w-full border border-gray-300 rounded-lg mb-4"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
            />
            <button
              onClick={handleEmailSubmit}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-8 border border-gray-100 mt-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
              Verify OTP
            </h2>
            <input
              type="text"
              name="otp"
              className="px-4 py-2 w-full border border-gray-300 rounded-lg mb-4"
              placeholder="Enter 6-digit OTP"
              value={formData.otp}
              onChange={handleInputChange}
              maxLength={6}
              disabled={loading}
            />
            <button
              onClick={handleOtpSubmit}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        )}
      </div>
      <ToastContainer/>
    </div>
  );
}

export default ElectionData;
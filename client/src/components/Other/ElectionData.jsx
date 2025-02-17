import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ElectionData() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    registrationNo: '', 
  });
  const [userRollNo, setUserRollNo] = useState('');

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
      const response = await fetch('http://localhost:4000/api/election/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send OTP');
      }

      toast.success('OTP sent successfully');
      setStep(3); // Update step to 3 to match the verification step
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
      const response = await fetch('http://localhost:4000/api/election/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid OTP');
      }

      // Assuming the response from the backend contains the user's roll number
      const data = await response.json();
      setUserRollNo(data.rollno); // Set the roll number in state
      toast.success('OTP verified successfully');
      setStep(4); // Move to the roll number input step
    } catch (err) {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRollNumberSubmit = () => {
    if (!formData.rollno || formData.rollno !== userRollNo) {
      toast.error('Invalid roll number');
      return;
    }

    toast.success('Candidate can vote!');
    // You can proceed with voting process here.
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-4xl mt-4 pt-24 px-4">
        {/* Add your election candidate component here if needed */}
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

        {step === 4 && (
          <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-8 border border-gray-100 mt-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
              Enter Your Roll Number
            </h2>
            <input
              type="text"
              name="registrationNo"
              className="px-4 py-2 w-full border border-gray-300 rounded-lg mb-4"
              placeholder="Enter your roll number"
              value={formData.rollno}
              onChange={handleInputChange}
              disabled={loading}
            />
            <button
              onClick={handleRollNumberSubmit}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify Roll Number
            </button>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default ElectionData;

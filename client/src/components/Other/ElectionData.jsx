import React, { useState, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ElectionTable from "../Tables/ElectionCandidate";
import VotingDetails from '../Details/VotingDetails';

function ElectionData() {
  const [showVerification, setShowVerification] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showVotingPortal, setShowVotingPortal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    password: '',
    rollno: '',
  });

  // Refs for input fields
  const emailRef = useRef(null);
  const otpRef = useRef(null);
  const passwordRef = useRef(null);
  const rollnoRef = useRef(null);

  const handleStartVoting = () => {
    setShowVerification(true);
    // Focus email input when verification form appears
    setTimeout(() => {
      emailRef.current?.focus();
    }, 100);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    
    // Special handling for OTP - only allow numbers
    if (name === 'otp') {
      newValue = value.replace(/[^0-9]/g, '').slice(0, 6);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleEmailSubmit = async () => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      emailRef.current?.focus();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/election/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send OTP');
      }

      toast.success('OTP sent successfully');
      setStep(2);
      // Focus OTP input after success
      setTimeout(() => {
        otpRef.current?.focus();
      }, 100);
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP. Please try again.');
      emailRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      otpRef.current?.focus();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/election/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'OTP verification failed');
      }

      toast.success('OTP verified successfully');
      setStep(3);
      // Focus password input after success
      setTimeout(() => {
        passwordRef.current?.focus();
      }, 100);
    } catch (err) {
      toast.error(err.message || 'Verification failed. Please try again.');
      otpRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!formData.password) {
      toast.error('Please enter your password');
      passwordRef.current?.focus();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/election/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Password verification failed');
      }

      toast.success('Password verified successfully');
      setStep(4);
      // Focus roll number input after success
      setTimeout(() => {
        rollnoRef.current?.focus();
      }, 100);
    } catch (err) {
      toast.error(err.message || 'Password verification failed. Please try again.');
      passwordRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleRollNumberSubmit = async () => {
    if (!formData.rollno) {
      toast.error('Please enter your roll number');
      rollnoRef.current?.focus();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/election/verify-rollno', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          rollno: formData.rollno,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Roll number verification failed');
      }

      const data = await response.json();
      toast.success('Verification complete! You can now vote.');
      setStep(5);
      setShowVotingPortal(true);
      // Hide verification form after successful verification
      setShowVerification(false);
    } catch (err) {
      toast.error(err.message || 'Verification failed. Please try again.');
      rollnoRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const VerificationStep = ({ currentStep, title, children }) => (
    <div className={`bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-8 border border-gray-100 mt-4 
      ${step > currentStep ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-200">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
          ${step > currentStep ? 'bg-green-100 text-green-600' : 
            step === currentStep ? 'bg-blue-500 text-white' : 
            'bg-gray-100 text-gray-400'}`}>
          {step > currentStep ? '✓' : currentStep}
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-4xl mt-4 pt-24 px-4">
        <ElectionTable />

        {!showVerification && !showVotingPortal && (
          <div className="mt-8 bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-8 border border-gray-100">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Cast Your Vote</h2>
              <p className="text-gray-600 mb-6">Click below to start the verification process</p>
              <button
                onClick={handleStartVoting}
                className="px-8 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-all duration-300 hover:scale-105"
              >
                Vote Now
              </button>
            </div>
          </div>
        )}
        
        {showVerification && (
          <div className="space-y-4">
            <VerificationStep currentStep={1} title="Verify Email">
              <input
                ref={emailRef}
                type="email"
                name="email"
                className="px-4 py-2 w-full border border-gray-300 rounded-lg mb-4"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading || step !== 1}
              />
              {step === 1 && (
                <button
                  onClick={handleEmailSubmit}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              )}
            </VerificationStep>

            <VerificationStep currentStep={2} title="Verify OTP">
              <input
                ref={otpRef}
                type="text"
                name="otp"
                className="px-4 py-2 w-full border border-gray-300 rounded-lg mb-4"
                placeholder="Enter 6-digit OTP"
                value={formData.otp}
                onChange={handleInputChange}
                maxLength={6}
                disabled={loading || step !== 2}
              />
              {step === 2 && (
                <button
                  onClick={handleOtpSubmit}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              )}
            </VerificationStep>

            <VerificationStep currentStep={3} title="Verify Password">
              <input
                ref={passwordRef}
                type="password"
                name="password"
                className="px-4 py-2 w-full border border-gray-300 rounded-lg mb-4"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading || step !== 3}
              />
              {step === 3 && (
                <button
                  onClick={handlePasswordSubmit}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify Password'}
                </button>
              )}
            </VerificationStep>

            <VerificationStep currentStep={4} title="Verify Roll Number">
              <input
                ref={rollnoRef}
                type="text"
                name="rollno"
                className="px-4 py-2 w-full border border-gray-300 rounded-lg mb-4"
                placeholder="Enter your roll number"
                value={formData.rollno}
                onChange={handleInputChange}
                disabled={loading || step !== 4}
              />
              {step === 4 && (
                <button
                  onClick={handleRollNumberSubmit}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify Roll Number'}
                </button>
              )}
            </VerificationStep>
          </div>
        )}

        {showVotingPortal && (
          <div className="mt-8 mb-16 w-">
            <VotingDetails />
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default ElectionData;
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Mail, Lock, Key, RotateCw, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgetPassFrom = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateFields = () => {
    const { email, otp, newPassword, confirmPassword } = formData;

    if (step === 1 && !email) {
      toast.error("Email is required.");
      return false;
    }

    if (step === 2 && !otp) {
      toast.error("OTP is required.");
      return false;
    }

    if (step === 3) {
      if (!newPassword || newPassword.length < 6) {
        toast.error("Password must be at least 6 characters long.");
        return false;
      }
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    setLoading(true);

    try {
      if (step === 1) {
        const response = await fetch("http://localhost:4000/api/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        });

        const data = await response.json();
        if (response.ok) {
          setStep(2);
          toast.success("OTP sent to your email!");
        } else {
          throw new Error(data.message || "Failed to send OTP.");
        }
      } else if (step === 2) {
        const response = await fetch("http://localhost:4000/api/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            otp: formData.otp,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setStep(3);
          toast.success("OTP verified successfully!");
        } else {
          throw new Error(data.message || "Invalid OTP.");
        }
      } else if (step === 3) {
        const response = await fetch("http://localhost:4000/api/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            newPassword: formData.newPassword,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          toast.success("Password reset successfully!");
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        } else {
          throw new Error(data.message || "Failed to reset password.");
        }
      }
    } catch (err) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 transform transition-all duration-300">
          {/* Header Icon */}
          <div className="text-center">
            <div className="inline-flex p-3 bg-[#2f2f7b]/10 rounded-full mb-4">
              <Key className="w-8 h-8 text-[#2f2f7b]" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h2>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-[#2f2f7b]' : 'bg-gray-300'}`}></div>
              <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-[#2f2f7b]' : 'bg-gray-300'}`}></div>
              <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-[#2f2f7b]' : 'bg-gray-300'}`}></div>
            </div>
            <p className="text-gray-600">
              {step === 1
                ? "Enter your email to receive an OTP"
                : step === 2
                ? "Enter the OTP sent to your email"
                : "Create your new password"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2f2f7b] focus:border-[#2f2f7b] transition-colors"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter OTP
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CheckCircle2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      maxLength="4"
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2f2f7b] focus:border-[#2f2f7b] transition-colors"
                      placeholder="Enter 4-digit OTP"
                      required
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center w-full gap-2 text-[#2f2f7b] hover:text-blue-700 transition-colors"
                  disabled={loading}
                >
                  <RotateCw className="w-4 h-4" />
                  Resend OTP
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2f2f7b] focus:border-[#2f2f7b] transition-colors"
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2f2f7b] focus:border-[#2f2f7b] transition-colors"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-white bg-[#2f2f7b] rounded-lg hover:bg-[#3f3f8b] focus:ring-2 focus:ring-offset-2 focus:ring-[#2f2f7b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RotateCw className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {step === 1 ? "Send OTP" : step === 2 ? "Verify OTP" : "Reset Password"}
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <a 
              href="/login" 
              className="inline-flex items-center text-sm text-[#2f2f7b] hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </a>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ForgetPassFrom;
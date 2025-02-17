import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LeaveTable from '../Tables/LeaveTable';

const LeaveApplicationForm = () => {
  const [formData, setFormData] = useState({
    student_information: {
      roll_no: '',
      student_name: '',
      student_email: ''
    },
    parent_information: {
      parent_name: '',
      parent_email: ''
    },
    leave_details: {
      reason_for_leave: '',
      leave_start_date: '',
      leave_end_date: ''
    }
  });
  const handleChange = (e, section) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/leave-applications', formData);
      alert('Leave application submitted successfully!');
      setFormData({
        student_information: {
          roll_no: '',
          student_name: '',
          student_email: ''
        },
        parent_information: {
          parent_name: '',
          parent_email: ''
        },
        leave_details: {
          reason_for_leave: '',
          leave_start_date: '',
          leave_end_date: ''
        }
      });
      fetchApplications();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast('Error submitting leave application. Please try again.');
    }
  };

  return (
    <div> <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-12 text-center">Leave Application Form</h1>

        <div className="flex flex-col lg:flex-row gap-8">

          <div className="lg:w-1/3">
            <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-8 sticky top-8 border border-gray-100">
              {/* Student Information */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Student Information</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-brown-600">First Name<span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="student_name"
                        value={formData.student_information.student_name}
                        onChange={(e) => handleChange(e, 'student_information')}
                        className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white/50 hover:bg-white"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-brown-600">Roll Number<span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="roll_no"
                        value={formData.student_information.roll_no}
                        onChange={(e) => handleChange(e, 'student_information')}
                        className="mt-1 block w-full px-3 py-2 border border-brown-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brown-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-600">Email address</label>
                    <input
                      type="email"
                      name="student_email"
                      value={formData.student_information.student_email}
                      onChange={(e) => handleChange(e, 'student_information')}
                      className="mt-1 block w-full px-3 py-2 border border-brown-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brown-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Parent Information */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-brown-700 mb-4">Parent Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-brown-600">Name<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="parent_name"
                      value={formData.parent_information.parent_name}
                      onChange={(e) => handleChange(e, 'parent_information')}
                      className="mt-1 block w-full px-3 py-2 border border-brown-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brown-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-600">Email address<span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      name="parent_email"
                      value={formData.parent_information.parent_email}
                      onChange={(e) => handleChange(e, 'parent_information')}
                      className="mt-1 block w-full px-3 py-2 border border-brown-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brown-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Leave Details */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-brown-700 mb-4">Leave Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-brown-600">Reason for Leave<span className="text-red-500">*</span></label>
                    <textarea
                      name="reason_for_leave"
                      value={formData.leave_details.reason_for_leave}
                      onChange={(e) => handleChange(e, 'leave_details')}
                      rows="4"
                      className="mt-1 block w-full px-3 py-2 border border-brown-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brown-500"
                      required
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-brown-600">Start Date<span className="text-red-500">*</span></label>
                      <input
                        type="date"
                        name="leave_start_date"
                        value={formData.leave_details.leave_start_date}
                        onChange={(e) => handleChange(e, 'leave_details')}
                        className="mt-1 block w-full px-3 py-2 border border-brown-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brown-500"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-brown-600">End Date<span className="text-red-500">*</span></label>
                      <input
                        type="date"
                        name="leave_end_date"
                        value={formData.leave_details.leave_end_date}
                        onChange={(e) => handleChange(e, 'leave_details')}
                        className="mt-1 block w-full px-3 py-2 border border-brown-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brown-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] mt-8 text-lg uppercase tracking-wide"
              >
                Submit Application
              </button>
            </form>
          </div>

          {/* Applications List */}
          <div className="flex w-full justify-center py-10">
            <div className="w-full lg:w-2/3">
              <LeaveTable />
            </div>
          </div>

        </div>
      </div>
      <ToastContainer />
    </div></div>
  );
};

export default LeaveApplicationForm;
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Card from "../../components/Other/Card";
import { useNavigate } from 'react-router-dom';

const EditProfileModal = ({ isOpen, onClose, studentInfo, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    branch: '',
    rollno: '',
    profile: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (studentInfo) {
      setFormData({
        name: studentInfo.name || '',
        email: studentInfo.email || '',
        branch: studentInfo.branch || '',
        rollno: studentInfo.rollno || '',
        profile: null
      });
    }
  }, [studentInfo]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('branch', formData.branch);
      formDataToSend.append('rollno', formData.rollno);
      if (formData.profile) {
        formDataToSend.append('profileImage', formData.profile);
      }

      await onUpdate(formDataToSend);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Picture
            </label>
            <input
              type="file"
              name="profile"
              onChange={handleChange}
              accept="image/*"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch
            </label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Roll No
            </label>
            <input
              type="text"
              name="rollno"
              value={formData.rollno}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StudentProfile = () => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');
      
      if (!token || !email) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:4000/api/profile/${email}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success && response.data.data) {
        const userData = response.data.data;
        const transformedData = {
          ...userData,
          generalInfo: {
            'Roll Number': userData.rollno || 'N/A',
            'Email': userData.email || 'N/A',
            'Branch': userData.branch || 'N/A',
            'Type': userData.type || 'N/A',
            'Acdamic Year': userData.year || 'N/A',
          }
        };
        setStudentInfo(transformedData);
      }
      
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch profile data');
      }
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');

      const response = await axios.put(
        `http://localhost:4000/api/profile/${email}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        await fetchProfile(); // Refresh profile data
      }
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-green-500 p-8 flex items-center justify-center">
        <p className="text-white text-xl">Loading profile data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-green-500 p-8 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-red-600 text-xl font-bold mb-4">Error Loading Profile</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-green-500 p-4 pt-24 md:p-8">
      <div className="max-w-5xl pt-20 mx-auto">
        <h1 className="text-3xl md:text-4xl text-purple-600 text-center font-bold mb-2">
          Student Profile
        </h1>
        <br />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card>
            <div className="flex flex-col items-center p-4">
              <div className="relative group">
                <img
                  src={studentInfo.profile}
                  alt="profile"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full mb-4 object-cover"
                />
              </div>
              <h2 className="text-xl font-bold mb-4">{studentInfo.name || 'N/A'}</h2>
              <div className="space-y-2 w-full">
                <p>Roll Number: {studentInfo.rollno || 'N/A'}</p>
                <p>Email: {studentInfo.email || 'N/A'}</p>
                <p>Branch: {studentInfo.branch || 'N/A'}</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            </div>
          </Card>

          <div className="col-span-1 md:col-span-2 space-y-4 md:space-y-6">
            <Card>
              <h3 className="text-xl font-bold mb-4">General Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(studentInfo.generalInfo).map(([key, value]) => (
                  <div key={key} className="border-b py-2">
                    <div className="flex justify-between">
                      <span className="capitalize">{key}</span>
                      <span>: {value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          studentInfo={studentInfo}
          onUpdate={handleUpdateProfile}
        />
      </div>
    </div>
  );
};

export default StudentProfile;
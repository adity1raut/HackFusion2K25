import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CandidateElectionForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    regNo: "",
    year: "second",
    branch: "CSE",
    position: "techsecretary",
    scoreCard: null,
    profileImage: null,
  });

  const [focused, setFocused] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      // Validate file size (5MB limit)
      if (files[0].size > 5 * 1024 * 1024) {
        toast.error(`${name} must be less than 5MB`);
        e.target.value = '';
        return;
      }
      // Validate file type
      if (!files[0].type.match('image.*')) {
        toast.error(`${name} must be an image file`);
        e.target.value = '';
        return;
      }
    }
    setFormData(prev => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formSubmitData = new FormData();
      
      // Append all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'scoreCard' && key !== 'profileImage') {
          formSubmitData.append(key, value);
        }
      });

      // Append files
      if (formData.scoreCard) {
        formSubmitData.append('scoreCard', formData.scoreCard);
      }
      if (formData.profileImage) {
        formSubmitData.append('profileImage', formData.profileImage);
      }

      const response = await fetch('/api/candidates/submit', {
        method: 'POST',
        body: formSubmitData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Submission failed');
      }

      toast.success('Application submitted successfully!');
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        regNo: "",
        year: "second",
        branch: "CSE",
        position: "techsecretary",
        scoreCard: null,
        profileImage: null,
      });

      // Reset file inputs
      document.getElementById('scoreCard').value = '';
      document.getElementById('profileImage').value = '';

    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = (field) => setFocused(field);
  const handleBlur = () => setFocused("");

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r p-4">
      {/* Toast Container */}
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
        theme="light"
      />

      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl transform transition-all duration-500 hover:shadow-lg">
        <div className="relative overflow-hidden rounded-t-xl bg-gradient-to-r from-indigo-300 to-purple-300 p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/50 to-purple-600/50 animate-pulse"></div>
          <h1 className="relative text-3xl font-bold text-center text-white mb-2">
            Candidate Election Form
          </h1>
          <p className="relative text-center text-white/80">Please fill in your details below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-8">
          {/* Profile Image Field */}
          <div className={`transform transition-all duration-300 ${focused === "profileImage" ? "scale-105" : ""}`}>
            <label htmlFor="profileImage" className="block text-lg font-medium text-gray-700 mb-2">
              Upload Profile Image
            </label>
            <div className="relative">
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                accept="image/*"
                className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:shadow-md hover:border-indigo-500 bg-gray-50 focus:bg-white"
                onChange={handleFileChange}
                onFocus={() => handleFocus("profileImage")}
                onBlur={handleBlur}
                required
              />
            </div>
          </div>

          {/* Name Field */}
          <div className={`transform transition-all duration-300 ${focused === "name" ? "scale-105" : ""}`}>
            <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:shadow-md bg-gray-50 focus:bg-white"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => handleFocus("name")}
              onBlur={handleBlur}
              required
            />
          </div>

          {/* Email Field */}
          <div className={`transform transition-all duration-300 ${focused === "email" ? "scale-105" : ""}`}>
            <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:shadow-md bg-gray-50 focus:bg-white"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => handleFocus("email")}
              onBlur={handleBlur}
              required
            />
          </div>

          {/* Registration Number */}
          <div className={`transform transition-all duration-300 ${focused === "regNo" ? "scale-105" : ""}`}>
            <label htmlFor="regNo" className="block text-lg font-medium text-gray-700 mb-2">
              Registration Number
            </label>
            <input
              type="text"
              id="regNo"
              name="regNo"
              className="block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:shadow-md bg-gray-50 focus:bg-white"
              placeholder="Enter registration number"
              value={formData.regNo}
              onChange={handleChange}
              onFocus={() => handleFocus("regNo")}
              onBlur={handleBlur}
              required
            />
          </div>

          {/* Academic Year and Branch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`transform transition-all duration-300 ${focused === "year" ? "scale-105" : ""}`}>
              <label htmlFor="year" className="block text-lg font-medium text-gray-700 mb-2">
                Academic Year
              </label>
              <select
                name="year"
                id="year"
                className="block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:shadow-md bg-gray-50 focus:bg-white"
                value={formData.year}
                onChange={handleChange}
                onFocus={() => handleFocus("year")}
                onBlur={handleBlur}
                required
              >
                <option value="second">Second Year</option>
                <option value="third">Third Year</option>
                <option value="last">Last Year</option>
              </select>
            </div>

            <div className={`transform transition-all duration-300 ${focused === "branch" ? "scale-105" : ""}`}>
              <label htmlFor="branch" className="block text-lg font-medium text-gray-700 mb-2">
                Branch
              </label>
              <select
                name="branch"
                id="branch"
                className="block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:shadow-md bg-gray-50 focus:bg-white"
                value={formData.branch}
                onChange={handleChange}
                onFocus={() => handleFocus("branch")}
                onBlur={handleBlur}
                required
              >
                <option value="CSE">CSE</option>
                <option value="EXTC">EXTC</option>
                <option value="IT">IT</option>
                <option value="Prod">Prod</option>
                <option value="Mech">Mech</option>
                <option value="Text">Text</option>
                <option value="Civil">Civil</option>
                <option value="Elect">Elect</option>
                <option value="Instru">Instru</option>
                <option value="Chem">Chem</option>
              </select>
            </div>
          </div>

          {/* Score Card Upload */}
          <div className={`transform transition-all duration-300 ${focused === "scoreCard" ? "scale-105" : ""}`}>
            <label htmlFor="scoreCard" className="block text-lg font-medium text-gray-700 mb-2">
              Upload Score Card
            </label>
            <div className="relative">
              <input
                type="file"
                id="scoreCard"
                name="scoreCard"
                accept="image/*"
                className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:shadow-md hover:border-indigo-500 bg-gray-50 focus:bg-white"
                onChange={handleFileChange}
                onFocus={() => handleFocus("scoreCard")}
                onBlur={handleBlur}
                required
              />
            </div>
          </div>

          {/* Position Selection */}
          <div className={`transform transition-all duration-300 ${focused === "position" ? "scale-105" : ""}`}>
            <label htmlFor="position" className="block text-lg font-medium text-gray-700 mb-2">
              Select Position
            </label>
            <select
              name="position"
              id="position"
              className="block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:shadow-md bg-gray-50 focus:bg-white"
              value={formData.position}
              onChange={handleChange}
              onFocus={() => handleFocus("position")}
              onBlur={handleBlur}
              required
            >
              <option value="techsecretary">Technical Secretary</option>
              <option value="gensecretary">General Secretary</option>
              <option value="sportsecretary">Sport Secretary</option>
              <option value="cultusecretary">Cultural Secretary</option>
              <option value="girlsrepresentative">Girls Representative</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CandidateElectionForm;
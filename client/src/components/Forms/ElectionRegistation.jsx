import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { User, Mail, BookOpen, Building2, Upload, Award, Save } from 'lucide-react';

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

  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

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
      if (files[0].size > 5 * 1024 * 1024) {
        toast.error(`${name} must be less than 5MB`);
        e.target.value = '';
        return;
      }
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
      
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'scoreCard' && key !== 'profileImage') {
          formSubmitData.append(key, value);
        }
      });

      if (formData.scoreCard) formSubmitData.append('scoreCard', formData.scoreCard);
      if (formData.profileImage) formSubmitData.append('profileImage', formData.profileImage);

      const response = await fetch('/api/candidates/submit', {
        method: 'POST',
        body: formSubmitData,
      });

      if (!response.ok) {
        throw new Error((await response.json()).message || 'Submission failed');
      }

      toast.success('Application submitted successfully!');
      
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

  const inputClassName = "block w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white hover:bg-white";
  const labelClassName = "flex items-center gap-2 text-sm font-medium text-gray-700 mb-2";
  const fileInputClassName = "block w-full p-3 border-2 border-dashed border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-400 bg-gray-50 focus:bg-white";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
          <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <h1 className="text-2xl font-bold text-center text-white mb-2">
              Candidate Election Form
            </h1>
            <p className="text-center text-white/80 text-sm">
              Please fill in your details below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Profile Image Upload */}
            <div className={`transform transition-all duration-200 ${focused === "profileImage" ? "scale-102" : ""}`}>
              <label htmlFor="profileImage" className={labelClassName}>
                <Upload size={16} /> Upload Profile Image
              </label>
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                accept="image/*"
                className={fileInputClassName}
                onChange={handleFileChange}
                onFocus={() => handleFocus("profileImage")}
                onBlur={handleBlur}
                required
              />
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className={`transform transition-all duration-200 ${focused === "name" ? "scale-102" : ""}`}>
                <label htmlFor="name" className={labelClassName}>
                  <User size={16} /> Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={inputClassName}
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => handleFocus("name")}
                  onBlur={handleBlur}
                  required
                />
              </div>

              <div className={`transform transition-all duration-200 ${focused === "email" ? "scale-102" : ""}`}>
                <label htmlFor="email" className={labelClassName}>
                  <Mail size={16} /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={inputClassName}
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus("email")}
                  onBlur={handleBlur}
                  required
                />
              </div>
            </div>

            <div className={`transform transition-all duration-200 ${focused === "regNo" ? "scale-102" : ""}`}>
              <label htmlFor="regNo" className={labelClassName}>
                <BookOpen size={16} /> Registration Number
              </label>
              <input
                type="text"
                id="regNo"
                name="regNo"
                className={inputClassName}
                placeholder="Enter registration number"
                value={formData.regNo}
                onChange={handleChange}
                onFocus={() => handleFocus("regNo")}
                onBlur={handleBlur}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className={`transform transition-all duration-200 ${focused === "year" ? "scale-102" : ""}`}>
                <label htmlFor="year" className={labelClassName}>
                  <BookOpen size={16} /> Academic Year
                </label>
                <select
                  name="year"
                  id="year"
                  className={inputClassName}
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

              <div className={`transform transition-all duration-200 ${focused === "branch" ? "scale-102" : ""}`}>
                <label htmlFor="branch" className={labelClassName}>
                  <Building2 size={16} /> Branch
                </label>
                <select
                  name="branch"
                  id="branch"
                  className={inputClassName}
                  value={formData.branch}
                  onChange={handleChange}
                  onFocus={() => handleFocus("branch")}
                  onBlur={handleBlur}
                  required
                >
                  {["CSE", "EXTC", "IT", "Prod", "Mech", "Text", "Civil", "Elect", "Instru", "Chem"]
                    .map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                </select>
              </div>
            </div>

            <div className={`transform transition-all duration-200 ${focused === "scoreCard" ? "scale-102" : ""}`}>
              <label htmlFor="scoreCard" className={labelClassName}>
                <Upload size={16} /> Upload Score Card
              </label>
              <input
                type="file"
                id="scoreCard"
                name="scoreCard"
                accept="image/*"
                className={fileInputClassName}
                onChange={handleFileChange}
                onFocus={() => handleFocus("scoreCard")}
                onBlur={handleBlur}
                required
              />
            </div>

            <div className={`transform transition-all duration-200 ${focused === "position" ? "scale-102" : ""}`}>
              <label htmlFor="position" className={labelClassName}>
                <Award size={16} /> Select Position
              </label>
              <select
                name="position"
                id="position"
                className={inputClassName}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Upload className="animate-spin" size={20} />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" theme="light" />
    </div>
  );
};

export default CandidateElectionForm;
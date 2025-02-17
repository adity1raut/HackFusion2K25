import React, { useState } from "react";

const CandidateElectionForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    regNo: "",
    year: "",
    branch: "",
    post: "",
    scoreCard: null,
    profileImage: null, // New field for profile image
  });

  const [focused, setFocused] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleFocus = (field) => {
    setFocused(field);
  };

  const handleBlur = () => {
    setFocused("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl pt-20 shadow-2xl pt-20 transform transition-all duration-500 hover:shadow-3xl">
        <div className="relative overflow-hidden rounded-t-xl bg-gradient-to-r from-indigo-300 to-purple-300 p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/50 to-purple-600/50 animate-pulse"></div>
          <h1 className="relative text-3xl font-bold text-center text-white mb-2">
            Candidate Election Form
          </h1>
          <p className="relative text-center text-white/80">Please fill in your details below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-8">
          {/* Input Fields */}
          <div className="space-y-6">
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
                  className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:shadow-md hover:border-indigo-500 bg-gray-50 focus:bg-white"
                  onChange={handleFileChange}
                  onFocus={() => handleFocus("profileImage")}
                  onBlur={handleBlur}
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
                  className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:shadow-md hover:border-indigo-500 bg-gray-50 focus:bg-white"
                  onChange={handleFileChange}
                  onFocus={() => handleFocus("scoreCard")}
                  onBlur={handleBlur}
                  multiple
                />
              </div>
            </div>

            {/* Post Selection */}
            <div className={`transform transition-all duration-300 ${focused === "post" ? "scale-105" : ""}`}>
              <label htmlFor="post" className="block text-lg font-medium text-gray-700 mb-2">
                Select Post
              </label>
              <select
                name="post"
                id="post"
                className="block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:shadow-md bg-gray-50 focus:bg-white"
                value={formData.post}
                onChange={handleChange}
                onFocus={() => handleFocus("post")}
                onBlur={handleBlur}
              >
                <option value="techsecretary">Technical Secretary</option>
                <option value="gensecretary">General Secretary</option>
                <option value="sportsecretary">Sport Secretary</option>
                <option value="cultusecretary">Cultural Secretary</option>
                <option value="girlsrepresentative">Girls Representative</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 active:scale-95"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default CandidateElectionForm;

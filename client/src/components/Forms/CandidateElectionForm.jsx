import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { User, Mail, BookOpen, Building2, Upload, Award, Save } from "lucide-react";

const CandidateElectionForm = () => {
  const VALID_YEARS = ["second", "third", "last"];
  const VALID_BRANCHES = ["CSE", "EXTC", "IT", "PROD", "MECH", "TEXT", "CIVIL", "ELECT", "INSTRU", "CHEM"];
  const VALID_POSITIONS = ["Technical Secretary", "General Secretary", "Sport Secretary", "Cultural Secretary", "Girls Representative"];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    regNo: "",
    year: "second",
    branch: "CSE",
    position: "Technical Secretary",
    scoreCard: null,
    profileImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const validateForm = () => {
    const { name, email, regNo, year, branch, position, scoreCard, profileImage } = formData;

    if (!name?.trim() || !email?.trim() || !regNo?.trim()) {
      toast.error("Please fill in all required fields");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!VALID_YEARS.includes(year.toLowerCase())) {
      toast.error(`Invalid academic year. Must be one of: ${VALID_YEARS.join(", ")}`);
      return false;
    }

    if (!VALID_BRANCHES.includes(branch)) {
      toast.error(`Invalid branch. Must be one of: ${VALID_BRANCHES.join(", ")}`);
      return false;
    }

    if (!VALID_POSITIONS.includes(position)) {
      toast.error(`Invalid position. Must be one of: ${VALID_POSITIONS.join(", ")}`);
      return false;
    }

    if (!scoreCard || !profileImage) {
      toast.error("Please upload both score card and profile image");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files?.[0]) {
      if (files[0].size > 5 * 1024 * 1024) {
        toast.error(`${name} must be less than 5MB`);
        e.target.value = "";
        return;
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(files[0].type)) {
        toast.error(`${name} must be a JPEG, JPG or PNG file`);
        e.target.value = "";
        return;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formSubmitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formSubmitData.append(key, value);
        }
      });

      const response = await fetch("http://localhost:4000/api/candidates/submit", {
        method: "POST",
        body: formSubmitData,
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error?.message || "Submission failed";
        toast.error(errorMessage);
        return;
      }

      toast.success("Application submitted successfully!");

      // Reset form
      setFormData({
        name: "",
        email: "",
        regNo: "",
        year: "second",
        branch: "CSE",
        position: "Technical Secretary",
        scoreCard: null,
        profileImage: null,
      });

      // Reset file inputs
      ["scoreCard", "profileImage"].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = "";
      });

    } catch (err) {
      toast.error(err.message || "An unexpected error occurred");
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
    <div className="min-h-screen  bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-2xl pt-10 mx-auto px-4">
        <div className="bg-white/90  backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
          <div className="relative  bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <h1 className="text-2xl font-bold text-center text-white mb-2">
              Candidate Election Form
            </h1>
            <p className="text-center text-white/80 text-sm">
              Please fill in your details below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
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

              <div className={`transform transition-all duration-200 ${focused === "regNo" ? "scale-102" : ""}`}>
                <label htmlFor="regNo" className={labelClassName}>
                  <BookOpen size={16} /> Registration Number
                </label>
                <input
                  type="text"
                  id="regNo"
                  name="regNo"
                  className={inputClassName}
                  placeholder="Enter your registration number"
                  value={formData.regNo}
                  onChange={handleChange}
                  onFocus={() => handleFocus("regNo")}
                  onBlur={handleBlur}
                  required
                />
              </div>

              <div className={`transform transition-all duration-200 ${focused === "year" ? "scale-102" : ""}`}>
                <label htmlFor="year" className={labelClassName}>
                  <Building2 size={16} /> Academic Year
                </label>
                <select
                  id="year"
                  name="year"
                  className={inputClassName}
                  value={formData.year}
                  onChange={handleChange}
                  onFocus={() => handleFocus("year")}
                  onBlur={handleBlur}
                  required
                >
                  {VALID_YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year.charAt(0).toUpperCase() + year.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className={`transform transition-all duration-200 ${focused === "branch" ? "scale-102" : ""}`}>
                <label htmlFor="branch" className={labelClassName}>
                  <Building2 size={16} /> Branch
                </label>
                <select
                  id="branch"
                  name="branch"
                  className={inputClassName}
                  value={formData.branch}
                  onChange={handleChange}
                  onFocus={() => handleFocus("branch")}
                  onBlur={handleBlur}
                  required
                >
                  {VALID_BRANCHES.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              <div className={`transform transition-all duration-200 ${focused === "position" ? "scale-102" : ""}`}>
                <label htmlFor="position" className={labelClassName}>
                  <Award size={16} /> Position
                </label>
                <select
                  id="position"
                  name="position"
                  className={inputClassName}
                  value={formData.position}
                  onChange={handleChange}
                  onFocus={() => handleFocus("position")}
                  onBlur={handleBlur}
                  required
                >
                  {VALID_POSITIONS.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
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
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <>
                    <Save size={16} /> Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  );
};

export default CandidateElectionForm;
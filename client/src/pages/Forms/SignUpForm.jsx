import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    rollno: "",
    email: "",
    type: "",
    otp: "",
    password: "",
    confirmPassword: "",
    extraFields: [],
  });
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e, index) => {
    if (index !== undefined) {
      const updatedFields = [...formData.extraFields];
      updatedFields[index].value = e.target.value;
      setFormData({ ...formData, extraFields: updatedFields });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const validateFields = () => {
    const { name, rollno, email, type, password, confirmPassword } = formData;
    const emailPattern = /@sggs\.ac\.in$/;
    const rollnoPattern = /^\d{4}[a-zA-Z]{3}\d{3}$/;

    if (!name || !rollno || !email || !type) {
      toast.error("Name, Roll Number, Email, and Type are required.");
      return false;
    }

    if (!emailPattern.test(email)) {
      toast.error("Email must be from the sggs.ac.in domain.");
      return false;
    }

    if (!rollnoPattern.test(rollno)) {
      toast.error("Roll Number must follow the format YYYYXXXNNN.");
      return false;
    }

    if (otpSent) {
      if (!password || password.length < 6) {
        toast.error("Password must be at least 6 characters long.");
        return false;
      }
      if (password !== confirmPassword) {
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
      if (!otpSent) {
        const response = await axios.post("http://localhost:4000/api/send-otp", {
          email: formData.email,
          name: formData.name,
          rollno: formData.rollno,
          type: formData.type,
        });
        if (response.status === 200) {
          setOtpSent(true);
          toast.success("OTP sent to your email!");
        }
      } else {
        // Create account using axios
        const signupResponse = await axios.post("http://localhost:4000/api/users", {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          rollno: formData.rollno,
          type: formData.type,
          extraFields: formData.extraFields,
        });
        if (signupResponse.status === 200) {
          toast.success("Account created successfully!");
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        }
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Roll Number</label>
            <input
              type="text"
              name="rollno"
              placeholder="2024xxx012"
              value={formData.rollno}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">College Email</label>
            <input
              type="email"
              name="email"
              placeholder="2024xxx014@sggs.ac.in"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Type</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {otpSent && (
            <div>
              <label className="block text-sm font-medium text-gray-700">OTP</label>
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {otpSent && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {formData.extraFields.map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700">Custom Field</label>
              <input
                type="text"
                placeholder="Custom Field"
                value={field.value}
                onChange={(e) => handleChange(e, index)}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {loading ? "Processing..." : otpSent ? "Create Account" : "Send OTP"}
          </button>
        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default SignUpForm;

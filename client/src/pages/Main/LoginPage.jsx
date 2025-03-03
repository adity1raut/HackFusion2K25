import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, ShieldCheck } from 'lucide-react';

const LoginPortal = () => {
  const navigate = useNavigate();

  const handleStudentLogin = () => {
    navigate('/login/student');
  };

  const handleFacultyLogin = () => {
    navigate('/login/faculty');
  };

  const handleAdminLogin = () => {
    navigate('/login/admin');
  };
  const handleDoctorLogin = () => {
    navigate('/login/doctor');
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-40 flex flex-col items-center justify-center p-4">
      <div className="container mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-blue-600 pb-5 to-blue-800 bg-clip-text text-transparent mb-6 animate-pulse">
  Welcome to Login Portal
</h1>
        <p className="text-gray-600 mb-8 text-center max-w-xl mx-auto">
          Access your personalized profile through our secure portal.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Student Portal */}
          <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <div className="mb-4 flex justify-center">
              <GraduationCap className="h-12 w-12 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Student Portal</h2>
            <p className="text-gray-600 mb-4 flex-grow">
              Access courses, submit assignments, and track your progress.
            </p>
            <button 
              onClick={handleStudentLogin}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
            >
              Student Login →
            </button>
          </div>

          {/* Faculty Portal */}
          <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <div className="mb-4 flex justify-center">
              <BookOpen className="h-12 w-12 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Faculty Portal</h2>
            <p className="text-gray-600 mb-4 flex-grow">
              Manage content, communicate with students, and access resources.
            </p>
            <button 
              onClick={handleFacultyLogin}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
            >
              Faculty Login →
            </button>
          </div>

          {/* Admin Portal */}
          <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <div className="mb-4 flex justify-center">
              <ShieldCheck className="h-12 w-12 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Admin Portal</h2>
            <p className="text-gray-600 mb-4 flex-grow">
              Manage user accounts, configure settings, and monitor performance.
            </p>
            <button 
              onClick={handleAdminLogin}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
            >
              Admin Login →
            </button>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <div className="mb-4 flex justify-center">
              <ShieldCheck className="h-12 w-12 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Doctor Portal</h2>
            <p className="text-gray-600 mb-4 flex-grow">
              Manage user accounts, configure settings, and monitor performance.
            </p>
            <button 
              onClick={handleDoctorLogin}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
            >
              DoctorLogin →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPortal;
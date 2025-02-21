import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, ShieldCheck } from 'lucide-react';

const SignUpPage = () => {
  const navigate = useNavigate();

  const handleStudentLogin = () => {
    navigate('/signin/student');
  };

  const handleFacultyLogin = () => {
    navigate('/signin/faculty');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-navy-800 mb-6">
          Welcome to SignUp Portal
        </h1>
        <p className="text-gray-600 mb-8 text-center max-w-xl mx-auto">
          Access your personalized profile through our secure portal.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 w-8/12 gap-6 max-w-6xl mx-auto">
          {/* Student Portal */}
          <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 flex flex-col items-center">
            <div className="mb-4">
              <GraduationCap className="h-12 w-12 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Student Portal</h2>
            <p className="text-gray-600 mb-4 text-center">
              Access courses, submit assignments, and track your progress.
            </p>
            <button 
              onClick={handleStudentLogin}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
            >
              Student Signin →
            </button>
          </div>

          {/* Faculty Portal */}
          <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 flex flex-col items-center">
            <div className="mb-4">
              <BookOpen className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Faculty Portal</h2>
            <p className="text-gray-600 mb-4 text-center">
              Manage content, communicate with students, and access resources.
            </p>
            <button 
              onClick={handleFacultyLogin}
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors duration-300"
            >
              Faculty Signin →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

import React, { useState } from 'react';
import { Vote, AlertCircle, FileText, Edit, User, Mail, Calendar, Hash, Book, Building2 } from 'lucide-react';

const UserDashboard = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  const userData = {
    name: "Nagesh Mansuke",
    regNo: "2023bcs042",
    branch: "CSE",
    type: "Student",
    email: "mansukecse@gmail.com",
    academicYear: "Second Year"
  };

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="group relative p-3 bg-gray-50 rounded-lg transition-all duration-300 hover:bg-white hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="font-medium text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );

  const ActionCard = ({ title, description, icon: Icon, color, onClick }) => (
    <div 
      className="group bg-white rounded-xl shadow-lg p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
      onMouseEnter={() => setActiveCard(title)}
      onMouseLeave={() => setActiveCard(null)}
      onClick={onClick}
    >
      <div className={`w-16 h-16 ${color} rounded-xl flex items-center justify-center mx-auto mb-4 transform transition-transform duration-500 group-hover:rotate-12`}>
        <Icon className={`w-8 h-8 ${color.includes('red') ? 'text-red-600' : color.includes('green') ? 'text-green-600' : 'text-indigo-600'}`} />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      <button 
        className={`w-full py-3 rounded-lg font-medium transform transition-all duration-300
          ${color.includes('red') ? 'bg-red-500 hover:bg-red-600' : 
            color.includes('green') ? 'bg-green-500 hover:bg-green-600' : 
            'bg-indigo-500 hover:bg-indigo-600'} 
          text-white shadow-md hover:shadow-lg active:scale-95`}
      >
        {title}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2c2c7b] to-[#1a1a4b] p-6">
      <div className="max-w-6xl mx-auto  pt-24 space-y-8 animate-fadeIn">
        {/* Header Welcome */}
        <div className="text-center text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back, {userData.name}!</h1>
          <p className="text-gray-300">Access your dashboard and manage your activities</p>
        </div>

        {/* Profile Cards Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden transform hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32 relative">
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                <div className="relative group">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-lg transform transition-transform duration-300 group-hover:scale-105">
                    <User size={48} className="text-gray-400" />
                  </div>
                  <button 
                    onClick={() => setIsEditMode(!isEditMode)}
                    className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 shadow-lg transform transition-all duration-300 hover:bg-blue-600 hover:scale-110"
                  >
                    <Edit size={14} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="pt-16 p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{userData.name}</h2>
              <p className="text-gray-500">{userData.type} | {userData.branch}</p>
              <div className="mt-6 flex items-center justify-center space-x-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                  {userData.academicYear}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* General Details Card */}
          <div className="bg-white rounded-xl shadow-xl p-6 transform hover:shadow-2xl transition-all duration-300">
            <h3 className="text-xl font-bold text-gray-800 mb-6">General Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem icon={Building2} label="Branch" value={userData.branch} />
              <InfoItem icon={Book} label="Type" value={userData.type} />
              <InfoItem icon={Mail} label="Email" value={userData.email} />
              <InfoItem icon={Hash} label="Reg No" value={userData.regNo} />
              <InfoItem icon={Calendar} label="Academic Year" value={userData.academicYear} />
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ActionCard
            title="Election"
            description="Register here for election and make your voice heard"
            icon={Vote}
            color="bg-indigo-100"
          />
          <ActionCard
            title="Complaint"
            description="Submit your concerns and track their resolution"
            icon={AlertCircle}
            color="bg-red-100"
          />
          <ActionCard
            title="Leave"
            description="Apply for leave and manage your absences"
            icon={FileText}
            color="bg-green-100"
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md p-3 text-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-sm">Last login: Today at 9:30 AM</p>
          <p className="text-sm">Status: Online</p>
        </div>
      </div>
    </div>
  );
};

// Add these animations to your global CSS
const styles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}
`;

export default UserDashboard;
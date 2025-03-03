import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from "../src/context/AuthContext";
import PrivateRoute from '../src/utils/PrivateRoute'
import ProfilePage from './pages/Main/ProfilePage'
import Navbar from './pages/Navbar/Navbar'
import Dhasboard from './pages/Main/Dhasboard';
import ForgetPassFrom from './pages/Forms/ForgetPassFrom';
import ComplaintsForm from "./components/Forms/ComplaintsForm";
import LeaveApplicationForm from './components/Forms/LeaveApplicationForm';
import FacultyAvailabilityForm from './components/Other/FacultyAvailabilityForm';
import ElectionData from './components/Other/ElectionData';
import StudentSignUp from "./pages/Forms/StudentSignUp"
import GroundBooking from './components/Forms/GroundBooking';
import CandidateElectionForm from './components/Forms/CandidateElectionForm';
import VenueDetails from './components/Details/VenueDetails';
import FacultySignup from "./pages/Forms/FacultySignForm"
import LoginPage from './pages/Main/LoginPage';
import SignUpPage from './pages/Main/SignUpPage';
import AdmiLogin from './pages/Forms/AdmiLogin';
import LoginForm from './pages/Forms/StudentLogin';
import FacultyLogin from './pages/Forms/FacultyLogin';
import AdminBookingDashboard from './components/Admin/AdminBookingDashboard';
import AdminComplaintsDashboard from './components/Admin/AdminComplaintsDashboard';
import AdminLeaveDashboard from './components/Admin/AdminLeaveDashboard';
import FacultyProfile from "./pages/Main/FalcultyProfile"
import AdminElectionDashboard from './components/Admin/AdminElectionDashboard';
import Footer from './pages/Main/Footer';
import ElectionDetailsst from './StudentDashBord/ElectionDetailsst';
import LeaveApplication from './StudentDashBord/LeavApllication';
import ComplaintPage from './StudentDashBord/ComplaintsPage';
import BookingCard from './StudentDashBord/VenueBooking';
import FacultyBook from './StudentDashBord/FacultyBook'; 
import AdmiDhashbordPage from "./AdminDhasBord/AdmiDhashbordPage"
import CheatingReports from "./components/Forms/CheatingFrom"
import CheatingStudent from "./StudentDashBord/CheatingStudent"
import StudentAppoiment from './components/Doctor/StudentAppoiment';
import DoctorDashboard from './components/Doctor/DoctorDashboard';
import DoctorLogin from "./pages/Forms/DoctorsLogin"
import SecetryLogin from "./pages/Forms/SecetryLogin"
import SecetrySingin from './pages/Forms/SecetrySingin';
import AdminProfileCard from './pages/Profile/AdminProfileCard';
import DoctorProfile from './pages/Profile/DoctoreProfile';
import NoticeBord  from "./components/Forms/NoticeBord"
import NoticeList from './components/Forms/NoticeList';
import ElectionDashboard from './pages/Profile/ElectionDashboard';
import VotingDetails from './components/Details/VotingDetails';
import ElectionCandidate from '../../server/models/ElectionCandidate';
function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <div className='min-h-screen'>
            <Navbar />
            <Routes>
              {/* <Route path="/" element={<Dhasboard />} /> */}
              <Route path="/signin" element={<SignUpPage />} />
              <Route path="/signin/student" element={<StudentSignUp />} />
              <Route path="/signin/faculty" element={<FacultySignup />} />
              <Route path="/signin/secetry" element={<SecetrySingin/>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/login/faculty" element={<FacultyLogin />} />
              <Route path="/login/student" element={<LoginForm />} />
              <Route path="/login/admin" element={<AdmiLogin />} />
              <Route path="/login/doctor" element={<DoctorLogin />} />
              <Route path="/login/secetry" element={<SecetryLogin/>} />
              <Route path="/forgot-password" element={<ForgetPassFrom />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dhasboard />} />
                <Route path='/dashboard/booking-details' element={<BookingCard />} />
                <Route path='/dashboard/leave-details' element={<LeaveApplication />} />
                <Route path='/dashboard/complaint-details' element={<ComplaintPage />} />
                <Route path='/dashboard/faculty-details' element={<FacultyBook/>} />
                <Route path='/dashboard/election-details' element={<ElectionDetailsst />} />
                <Route path='/dashboard/cheating-details' element={<CheatingStudent />} />
                <Route path="/student/profile" element={<ProfilePage />} />
                <Route path="/election" element={<ElectionData />} />
                <Route path="/student/complaints" element={<ComplaintsForm />} />
                <Route path="/student/leave-application" element={<LeaveApplicationForm />} />
                <Route path="/student/election-form" element={<CandidateElectionForm />} />
                <Route path="/bookings" element={<GroundBooking />} />
                {/* <Route path="/studoctor-appointment" element={<DoctorAppointmentForm />} /> */}
                <Route path='/faculty/profile' element={<FacultyProfile />} />
                <Route path="/faculty/availability" element={<FacultyAvailabilityForm />} />
                <Route path="/bookings/details/:name" element={<VenueDetails />} />
                <Route path='/admin-dashboard/' element={<AdmiDhashbordPage />} />
                <Route path='/admin/dashboard/complaints' element={<AdminComplaintsDashboard />} />
                <Route path='/admin/dashboard/leaves' element={<AdminLeaveDashboard />} />
                <Route path='/admin/dashboard/election' element={<AdminElectionDashboard />} />
                <Route path='/admin/dashboard/booking' element={<AdminBookingDashboard />} />
                <Route path='/faculty/cheating' element={<CheatingReports />} />
                <Route path='/student/doctor/appointment' element={<StudentAppoiment/>} />
                <Route path='/admin/profile' element={<AdminProfileCard />} />
                <Route path='/doctor/profile' element={<DoctorProfile/>} />
                <Route path='/doctor-appointments' element={<DoctorDashboard />} />
                <Route path='/dashboard/notice' element={<NoticeBord />} />
                <Route path='/admin/dashboard/notices' element={<NoticeList />} />
                <Route path='/admin/dashboard/election'element={<ElectionDashboard />} />
                <Route path='/dashboard/el' element={<ElectionCandidate />} />
              </Route>
              <Route path="/voting" element={<VotingDetails />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </div>
  )
}

export default App

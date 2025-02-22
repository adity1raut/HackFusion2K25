import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from "../src/context/AuthContext";
import PrivateRoute from '../src/utils/PrivateRoute'
import Navbar from './pages/Navbar/Navbar'
import Dhasboard from './pages/Main/Dhasboard';
import ForgetPassFrom from './pages/Forms/ForgetPassFrom';
import ComplaintsForm from "./components/Forms/ComplaintsForm";
import LeaveApplicationForm from './components/Forms/LeaveApplicationForm';
import DoctorAppointmentForm from './components/Other/DoctorAppointmentForm';
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
import FacultyProfile from "./pages/Main/FalcultyProfile"
import Footer from './pages/Main/Footer';
import ElectionDetailsst from './StudentDashBord/ElectionDetailsst';
import LeaveApplication from './StudentDashBord/LeavApllication';
import ComplaintPage from './StudentDashBord/ComplaintsPage';
import BookingCard from './StudentDashBord/VenueBooking';
import FacultyBook from './StudentDashBord/FacultyBook'; 
import CheatingReports from "./components/Forms/CheatingFrom"
import CheatingStudent from "./StudentDashBord/CheatingStudent"
import FacultyNavbar from "./pages/Navbar/FacultyNavbar"

function Faculty() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <div className='min-h-screen'>
            <FacultyNavbar />
            <Routes>
              {/* <Route path="/" element={<Dhasboard />} /> */}
              <Route path="/signin" element={<SignUpPage />} />
              <Route path="/signin/student" element={<StudentSignUp />} />
              <Route path="/signin/faculty" element={<FacultySignup />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/login/faculty" element={<FacultyLogin />} />
              <Route path="/login/student" element={<LoginForm />} />
              <Route path="/login/admin" element={<AdmiLogin />} />
              <Route path="/forgot-password" element={<ForgetPassFrom />} />
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dhasboard />} />
                <Route path='/dashboard/booking-details' element={<BookingCard />} />
                <Route path='/dashboard/leave-details' element={<LeaveApplication />} />
                <Route path='/dashboard/complaint-details' element={<ComplaintPage />} />
                <Route path='/dashboard/faculty-details' element={<FacultyBook/>} />
                <Route path='/dashboard/election-details' element={<ElectionDetailsst />} />
                <Route path='/dashboard/cheating-details' element={<CheatingStudent />} />

                <Route path="/election" element={<ElectionData />} />
                <Route path="/complaints" element={<ComplaintsForm />} />
                <Route path="/leave-application" element={<LeaveApplicationForm />} />
                <Route path="/doctor-appointment" element={<DoctorAppointmentForm />} />
                <Route path="/bookings" element={<GroundBooking />} />
                <Route path='/faculty/profile' element={<FacultyProfile />} />
                <Route path="/faculty-availability" element={<FacultyAvailabilityForm />} />
                <Route path="/condidate-election-form" element={<CandidateElectionForm />} />
                <Route path="/bookings/details/:name" element={<VenueDetails />} />
                <Route path='/faculty/cheating' element={<CheatingReports />} />
              </Route>
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </div>
  )
}

export default Faculty ;

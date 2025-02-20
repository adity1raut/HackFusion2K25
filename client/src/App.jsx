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
import DoctorAppointmentForm from './components/Other/DoctorAppointmentForm';
import FacultyAvailabilityForm from './components/Other/FacultyAvailabilityForm';
import ElectionData from './components/Other/ElectionData';
import StudentSignUp from "./pages/Forms/StudentSignUp"
import GroundBooking from './components/Forms/GroundBooking';
import CandidateElectionForm from './components/Forms/ElectionRegistation';
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


function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <div className='min-h-screen'>
            <Navbar />
            <Routes>
              <Route path="/" element={<Dhasboard />} />
              <Route path="/signin" element={<SignUpPage />} />
              <Route path="/signin/student" element={<StudentSignUp />} />
              <Route path="/signin/faculty" element={<FacultySignup />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/login/faculty" element={<FacultyLogin />} />
              <Route path="/login/student" element={<LoginForm />} />
              <Route path="/login/admin" element={<AdmiLogin />} />
              <Route path="/forgot-password" element={<ForgetPassFrom />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route element={<PrivateRoute />}>
               <Route path='/admin' element = {<AdminBookingDashboard/>}/>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/election" element={<ElectionData />} />
                <Route path="/complaints" element={<ComplaintsForm />} />
                <Route path="/leave-application" element={<LeaveApplicationForm />} />
                <Route path="/doctor-appointment" element={<DoctorAppointmentForm />} />
                <Route path="/bookings" element={<GroundBooking />} />
                <Route path="/faculty-availability" element={<FacultyAvailabilityForm />} />
                <Route path="/condidate-election-form" element={<CandidateElectionForm />} />
                <Route path="/bookings/details/:name" element={<VenueDetails/>}/>
                <Route path='/admin/complaints' element={<AdminComplaintsDashboard />} />
                <Route path='/admin/leave' element={<AdminLeaveDashboard/>} />
              </Route>
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </div>
  )
}

export default App

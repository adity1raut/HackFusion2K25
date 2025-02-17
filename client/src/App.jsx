import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from "../src/context/AuthContext";
import SignUpForm from './pages/Forms/SignUpForm'
import LoginForm from './pages/Forms/LoginForm'
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
import FacultyLogin from './pages/Forms/FacultyLogin';
import FacultyProfile from './pages/Main/FalcultyProfile';
import FacultySignIn from './pages/Forms/FacultySignForm';

function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <div className='min-h-screen'>
            <Navbar />
            <Routes>
              <Route path="/" element={<Dhasboard />} />
              <Route path="/faculty/login" element={<FacultyLogin />} />
              <Route path="/faculty/signin" element={<FacultySignIn />} />
              <Route path="/signup" element={<SignUpForm />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/forgot-password" element={<ForgetPassFrom />} />
              <Route element={<PrivateRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path='/falculty/profile' element={<FacultyProfile />} />
                <Route path="/election" element={<ElectionData />} />
                <Route path="/complaints" element={<ComplaintsForm />} />
                <Route path="/leave-application" element={<LeaveApplicationForm />} />
                <Route path="/doctor-appointment" element={<DoctorAppointmentForm />} />
                <Route path="/faculty-availability" element={<FacultyAvailabilityForm />} />
              </Route>
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </div>
  )
}

export default App

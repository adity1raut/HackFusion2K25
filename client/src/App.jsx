import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from "../src/context/AuthContext";
import SignUpForm from './pages/Forms/SignUpForm'
import LoginForm from './pages/Forms/LoginForm'
import PrivateRoute from '../src/utils/PrivateRoute'
import ProfilePage from './pages/Main/ProfilePage'

function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          {/* <Navbar /> */}

          <Routes>
            {/* <Route path="/forgot_password" element={<Fo />} /> */}
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
             {/* <Route path="/uplode-video" element={<VideoUpload />} />
              <Route path="/store" element={<StorePage />} />
              <Route path="/live" element={<LivePage />} />
              <Route path="/live-stream" element={<LiveStream />} /> */}
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  )
}

export default App

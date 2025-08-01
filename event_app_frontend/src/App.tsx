import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from "./pages/Home"
import Login from './pages/Login'
import Signup from './pages/Signup'
import VerifyOtp from './pages/VerifyOtp'

import Dashboard from './pages/Dashboard'

function App() {

  return (
    <>
      <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify" element={<VerifyOtp />} />

            <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App

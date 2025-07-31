import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from "./pages/Home"
import Login from './pages/Login'
import Signup from './pages/Signup'
import VerifyOtp from './pages/VerifyOtp'

import BrokerDashboard from './pages/BrokerDashboard'
import NormalDashboard from './pages/NormalDashboard'

import EventPage from './pages/EventPage'
import PastEventPage from './pages/PastEventPage'
import BookingManagementPage from './pages/BookingManagementPage'
import RecommendationsPage from './pages/RecommendationsPage'
import EventDetails from './pages/EventDetailPage'
import EventBookingPage from './pages/Booking'
import HallsListingPage from './pages/Halls'
import HallDetailPage from './pages/HallDetailPage'

function App() {

  return (
    <>
      <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify" element={<VerifyOtp />} />

            <Route path='/broker-dashboard' element={<BrokerDashboard />} />


            <Route path='/normal-dashboard' element={<NormalDashboard />} />
            <Route path='/events' element={<EventPage />} />
            <Route path='/events/past' element={<PastEventPage />} />
            <Route path='/booking' element={<BookingManagementPage />} />
            <Route path='/recommend' element={<RecommendationsPage />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path='/booking/:id' element={<EventBookingPage />}></Route>
            <Route path='/halls' element={<HallsListingPage />} />
            <Route path='/halls/:id' element={<HallDetailPage />} />
      </Routes>
    </>
  )
}

export default App

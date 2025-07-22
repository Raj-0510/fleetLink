import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AddVehiclePage from './pages/components/AddVehiclepage';
import { ToastContainer } from 'react-toastify';
import SearchAndBookPage from './pages/components/SearchAndBookPage';
import BookingsPage from './pages/components/BookingPage';

const App = () => {
  return (
    <>
     <ToastContainer position="top-center" autoClose={1500} hideProgressBar={true}  />
    <Router>
      <nav className="p-4 bg-gray-800 text-white flex gap-4">
        <Link to="/add-vehicle">Add Vehicle</Link>
        <Link to="/search-book">Search & Book</Link>
        <Link to="/view-bookings">View Bookings</Link>

      </nav>

      <Routes>
        <Route path="/add-vehicle" element={<AddVehiclePage />} />
        <Route path="/search-book" element={<SearchAndBookPage />} />
        <Route path="/view-bookings" element={<BookingsPage />} />

      </Routes>
    </Router>
    </>
  );
};

export default App;

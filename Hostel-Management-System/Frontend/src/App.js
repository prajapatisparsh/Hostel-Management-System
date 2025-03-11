import React from 'react';
import './App.css'; 
import WebFont from "webfontloader";
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';  // Updated import for Navigate
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard.jsx';
import About from './pages/About.jsx';
import AddRoomForm from './pages/AddRoomForm'; 
import Product from './pages/StudentDetails.jsx';
import AttendancePage from './pages/Attendance';
import RoomAllocation from './pages/RoomAllocation.jsx'; 
import Login from './pages/Login';
import Admin from './pages/SignUpPage.jsx';
import StaffManagementPage from './pages/AddStaff';
import Nav from './components/Nav';
import SearchPage from './pages/SearchPage'; 
import SignUpPage from './pages/SignUpPage.jsx';

const App = () => {
  return (
    <div className='app'>   
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} /> {/* Default route for login page */}
          <Route path="/login" element={<Login />} /> {/* Updated route definition */}
          <Route path="/add_staff" element={<StaffManagementPage />} /> 
          <Route path="/signup" element={<SignUpPage />} /> 
          <Route path="/home" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path="/AddStudents" element={<About />} />
          <Route path="/RoomAllocation" element={<RoomAllocation />} />
          <Route path="/AddRooms" element={<AddRoomForm />} />
          <Route path="/Student_Details" element={<Product />} />
          <Route path="/Attendance" element={<AttendancePage />} />
          <Route path="/attendance_detail" element={<SearchPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

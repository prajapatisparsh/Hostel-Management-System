import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/dashboard.css';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [roomCount, setRoomCount] = useState(0);
  const [allocationCount, setAllocationCount] = useState(0);

  useEffect(() => {
    // Fetch data from Spring Boot backend
    fetchStudentCount();
    fetchRoomCount();
    fetchAllocationCount();
  }, []);

  // Function to get token from localStorage
  const getToken = () => {
    return localStorage.getItem('token'); // Assuming token is stored in localStorage
  };

  const fetchStudentCount = async () => {
    try {
      const token = getToken(); // Get the token
      const response = await fetch('http://localhost:8080/api/students', {
        headers: {
          'Authorization': `Bearer ${token}`, // Add token to the request header
        },
      });
      const data = await response.json();
      setStudentCount(data.length);
    } catch (error) {
      console.error('Error fetching student count:', error);
    }
  };

  const fetchRoomCount = async () => {
    try {
      const token = getToken(); // Get the token
      const response = await fetch('http://localhost:8080/api/rooms', {
        headers: {
          'Authorization': `Bearer ${token}`, // Add token to the request header
        },
      });
      const data = await response.json();
      setRoomCount(data.length);
    } catch (error) {
      console.error('Error fetching room count:', error);
    }
  };

  const fetchAllocationCount = async () => {
    try {
      const token = getToken(); // Get the token
      const response = await fetch('http://localhost:8080/api/roomAllocations', {
        headers: {
          'Authorization': `Bearer ${token}`, // Add token to the request header
        },
      });
      const data = await response.json();
      setAllocationCount(data.length);
    } catch (error) {
      console.error('Error fetching allocation count:', error);
    }
  };

  return (
    <div>
      <Sidebar>
        <h1 className="dashboard-heading">DASHBOARD</h1>
        <div className="dashboard-container">
          {/* Student Count Card */}
          <div className="dashboard-card">
            <div className="dashboard-card-content">
              <span className="card-title">STUDENT COUNT</span>
              <span className="card-value">{studentCount}</span>
            </div>
            <div className="card-footer">
              <Link to="/AddStudents" className="card-link">Add Students</Link>
            </div>
          </div>

          {/* Room Count Card */}
          <div className="dashboard-card">
            <div className="dashboard-card-content">
              <span className="card-title">ROOM COUNT</span>
              <span className="card-value">{roomCount}</span>
            </div>
            <div className="card-footer">
              <Link to="/AddRooms" className="card-link">Add Rooms</Link>
            </div>
          </div>

          {/* Allocation Count Card */}
          <div className="dashboard-card">
            <div className="dashboard-card-content">
              <span className="card-title">ALLOCATION COUNT</span>
              <span className="card-value">{allocationCount}</span>
            </div>
            <div className="card-footer">
              <Link to="/RoomAllocation" className="card-link">ALLOCATE</Link>
            </div>
          </div>

          {/* Attendance Card */}
          <div className="dashboard-card">
            <div className="dashboard-card-content">
              <span className="card-title">ATTENDANCE</span>
            </div>
            <div className="card-footer">
              <Link to="/Attendance" className="card-link">View Attendance</Link>
            </div>
          </div>

          {/* Student Details Card */}
          <div className="dashboard-card">
            <div className="dashboard-card-content">
              <span className="card-title">STUDENT DETAILS</span>
            </div>
            <div className="card-footer">
              <Link to="/Student_Details" className="card-link">View</Link>
            </div>
          </div>

          {/* Admin Login Card */}
          <div className="dashboard-card">
            <div className="dashboard-card-content">
              <span className="card-title">SWITCH TO ADMIN</span>
            </div>
            <div className="card-footer">
              <Link to="/admin_login" className="card-link">LOGIN</Link>
            </div>
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

export default Dashboard;

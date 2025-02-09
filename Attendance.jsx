import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; 
import Sidebar from '../components/Sidebar';

// Function to get the local date in yyyy-mm-dd format
const getLocalDate = () => {
  const date = new Date();
  // Adjust the date based on local time zone
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);  // Returns the date in yyyy-mm-dd format
};

const AttendancePage = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [existingDates, setExistingDates] = useState([]);

  useEffect(() => {
    const fetchStudentsAndAttendance = async () => {
      try {
        // Retrieve the JWT token from localStorage
        const token = localStorage.getItem('token');
        
        // Set the token in the headers for Axios requests
        const headers = {
          'Authorization': `Bearer ${token}`, // Add token to Authorization header
          'Content-Type': 'application/json',
        };

        const studentResponse = await axios.get('http://localhost:8080/api/students', { headers });
        const studentsData = studentResponse.data;

        const attendanceResponse = await axios.get('http://localhost:8080/api/attendances/get', { headers });
        const attendancesData = attendanceResponse.data;

        const attendanceMap = {};
        const datesMap = new Set();  // To track existing attendance dates
        attendancesData.forEach((attendanceData) => {
          const { studentId, status, date } = attendanceData;
          attendanceMap[studentId] = status;
          datesMap.add(date);  // Add the date to the set
        });

        setExistingDates(Array.from(datesMap)); // Store the unique dates
        setStudents(studentsData);
        setAttendance(attendanceMap);
      } catch (error) {
        console.error('Error fetching student and attendance data:', error);
      }
    };

    fetchStudentsAndAttendance();
  }, []);

  const handleAttendanceUpdate = async (studentId, attendanceStatus) => {
    const currentDate = getLocalDate();

    // Check if the attendance for the selected date already exists
    if (existingDates.includes(currentDate)) {
      alert('Attendance for today has already been recorded.');
      return;
    }

    if (attendanceStatus === 'PRESENT') {
      attendanceStatus = 'true';
    } else {
      attendanceStatus = 'false';
    }

    const data = {
      student: {
        id: studentId,
      },
      date: currentDate,  // This will send today's correct date in local time
      status: attendanceStatus,
    };

    try {
      // Retrieve the JWT token from localStorage
      const token = localStorage.getItem('token');

      // Set the token in the headers for Axios requests
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Send the data to the backend
      await axios.post('http://localhost:8080/api/attendances', data, { headers });
      setAttendance({ ...attendance, [studentId]: attendanceStatus });
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  const filterStudents = () => {
    if (searchQuery.trim() === '') {
      return students;
    } else {
      return students.filter((student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  };

  return (
    <div className='attendance'>
      <Sidebar>
        <div className='box'>
          <Link to={'/attendance_detail'}>
            <button style={{ backgroundColor: 'blue' }} className='btn'>VIEW DETAILS</button>
          </Link>
          <div className="attendance-page">
            <h1 style={{ fontSize: '30px' }}>ATTENDANCE</h1>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="search-button">Search</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filterStudents().map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>
                      {attendance[student.id] !== undefined ? (
                        attendance[student.id] === 'true' ? 'Present' : 'Absent'
                      ) : (
                        <>
                          <button className="present-button" onClick={() => handleAttendanceUpdate(student.id, 'PRESENT')}>
                            Present
                          </button>
                          <button className="absent-button" onClick={() => handleAttendanceUpdate(student.id, 'ABSENT')}>
                            Absent
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

export default AttendancePage;

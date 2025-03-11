import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const SearchPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const [data, setData] = useState([]);

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearch = () => {
    if (!searchInput) {
      alert('Please select a date to search.');
      return;
    }

    // Ensure the date is in yyyy-mm-dd format
    const formattedDate = new Date(searchInput).toISOString().split('T')[0];

    const token = localStorage.getItem('token');  // Retrieve token from localStorage

    fetch(`http://localhost:8080/api/attendances/date?date=${formattedDate}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,  // Include the token in the Authorization header
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        setData(responseData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  return (
    <div>
      <Sidebar>
        <div className="search-page">
          <div className="search-container" style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <input
              type="date"
              value={searchInput}
              onChange={handleInputChange}
              className="search-input"
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                fontSize: '16px',
                marginRight: '10px',
                width: '250px',  // Adjusting width to make it more comfortable
                outline: 'none',
                transition: 'border-color 0.3s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#4CAF50')}
              onBlur={(e) => (e.target.style.borderColor = '#ccc')}
            />
            <button
              onClick={handleSearch}
              className="search-button"
              style={{
                padding: '10px 20px',
                borderRadius: '5px',
                backgroundColor: '#4CAF50',
                color: '#fff',
                fontSize: '16px',
                cursor: 'pointer',
                border: 'none',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#45a049')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#4CAF50')}
            >
              Search
            </button>
          </div>

          <table className="search-results-table" style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th>ID</th>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Date of Birth</th>
                <th>Admission Date</th>
                <th>Course</th>
                <th>Date</th>
                <th><b>Status</b></th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((attendance) => (
                  <tr key={attendance.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td>{attendance.id}</td>
                    <td>{attendance.student.id}</td>
                    <td>{attendance.student.name}</td>
                    <td>{attendance.student.email}</td>
                    <td>{attendance.student.dateOfBirth}</td>
                    <td>{attendance.student.admissionDate}</td>
                    <td>{attendance.student.course}</td>
                    <td>{attendance.date}</td>
                    <td><b>{attendance.status ? 'Present' : 'Absent'}</b></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>No data found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Sidebar>
    </div>
  );
};

export default SearchPage;

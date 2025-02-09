import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StaffManagementPage = () => {
  const [staffList, setStaffList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Get token from localStorage

  useEffect(() => {
    if (!token) {
      navigate('/login'); // Redirect to login if no token
      return;
    }

    // Fetch staff data from the API
    fetch('http://localhost:8080/signup/getall', {
      headers: {
        Authorization: `Bearer ${token}`, // Attach token to the request
      },
    })
      .then(response => response.json())
      .then(data => {
        setStaffList(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/login'); // Redirect to login
  };

  const handleAddClick = () => {
    setEditingStaff(null);
    setShowAddForm(true);
  };

  const handleEditClick = (staff) => {
    setEditingStaff(staff);
    setShowAddForm(true);
  };

  const handleDeleteClick = (staffId) => {
    fetch(`http://localhost:8080/signup/delete/${staffId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`, // Attach token to the request
      },
    })
      .then(response => {
        if (response.ok) {
          setStaffList(prevStaffList =>
            prevStaffList.filter(staff => staff.id !== staffId)
          );
        } else {
          console.error('Error:', response.status);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleFormSubmit = (staffData) => {
    const apiUrl = editingStaff
      ? `http://localhost:8080/signup/update/${editingStaff.id}`
      : 'http://localhost:8080/signup/post';

    const method = editingStaff ? 'PUT' : 'POST';

    fetch(apiUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Attach token to the request
      },
      body: JSON.stringify(staffData),
    })
      .then(response => response.json())
      .then(updatedStaff => {
        if (editingStaff) {
          setStaffList(prevStaffList =>
            prevStaffList.map(staff =>
              staff.id === updatedStaff.id ? updatedStaff : staff
            )
          );
        } else {
          setStaffList(prevStaffList => [...prevStaffList, updatedStaff]);
        }
        setShowAddForm(false);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <h1>Staff Management</h1>
      
      {/* Centered buttons container */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <button onClick={handleLogout} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
          LOG OUT
        </button>
        
        {showAddForm ? (
          <StaffForm
            staff={editingStaff}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowAddForm(false)}
          />
        ) : (
          <button onClick={handleAddClick} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
            Add Staff
          </button>
        )}
      </div>

      <StaffTable
        staffList={staffList}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />
    </div>
  );
};

const StaffTable = ({ staffList, onEdit, onDelete }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Password</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {staffList.map(staff => (
          <tr key={staff.id}>
            <td>{staff.email}</td>
            <td>{staff.password}</td>
            <td>
              <button onClick={() => onEdit(staff)} style={{ padding: '5px 10px', cursor: 'pointer' }}>
                Edit
              </button>
              <button onClick={() => onDelete(staff.id)} style={{ padding: '5px 10px', cursor: 'pointer' }}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const StaffForm = ({ staff, onSubmit, onCancel }) => {
  const [email, setEmail] = useState(staff ? staff.email : '');
  const [password, setPassword] = useState(staff ? staff.password : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const staffData = { email, password };
    onSubmit(staffData);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '8px', marginBottom: '10px', width: '200px' }}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '8px', marginBottom: '10px', width: '200px' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer' }}>
            {staff ? 'Save' : 'Add'}
          </button>
          <button type="button" onClick={onCancel} style={{ padding: '8px 15px', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffManagementPage;

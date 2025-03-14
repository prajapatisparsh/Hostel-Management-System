import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/roomallocation.css';
import Sidebar from '../components/Sidebar';

const AllocationPage = () => {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [allocationDate, setAllocationDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const token = localStorage.getItem('token'); // Get the token from localStorage

  useEffect(() => {
    fetchStudents();
    fetchRooms();
    fetchAllocations();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/students', {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token in the request header
        },
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/rooms', {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token in the request header
        },
      });
      const availableRooms = response.data.filter((room) => room.availability && room.capacity > 0);
      setRooms(availableRooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchAllocations = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/roomAllocations', {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token in the request header
        },
      });
      setAllocations(response.data);
    } catch (error) {
      console.error('Error fetching allocations:', error);
    }
  };

  const handleCancel = () => {
    setSelectedStudent(null);
    setSelectedRoom('');
    setAllocationDate('');
    setShowForm(false);
  };

  const studentAllocated = (student) => {
    return allocations.some((allocation) => allocation.student.id === student.id);
  };

  const handleAllocateButtonClick = (student) => {
    if (studentAllocated(student)) {
      console.error('Student already allocated.');
      return;
    }

    setSelectedStudent(student);
    setSelectedRoom('');
    setShowForm(true);
  };

  const handleRoomSelection = (event) => {
    const roomId = event.target.value;
    setSelectedRoom(roomId);
  };

  const handleAllocationDateChange = (event) => {
    setAllocationDate(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!selectedStudent) {
      console.error('Please select a student.');
      return;
    }

    if (!selectedRoom) {
      console.error('Please select a room.');
      return;
    }

    const payload = {
      student: {
        id: selectedStudent.id,
      },
      room: {
        id: selectedRoom,
      },
      allocationDate,
    };

    try {
      const response = await axios.post('http://localhost:8080/api/roomAllocations/post', payload, {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token in the request header
        },
      });
      console.log('Allocation created:', response.data);

      setAllocations([...allocations, response.data]);

      const updatedRooms = rooms.map((room) => {
        if (room.id === selectedRoom) {
          const updatedRoom = {
            ...room,
            capacity: room.capacity - 1,
            availability: room.capacity - 1 > 0,
          };
          // Update room capacity on the server
          return axios.put(`http://localhost:8080/api/rooms/update/${selectedRoom}`, updatedRoom, {
            headers: {
              Authorization: `Bearer ${token}`, // Send the token in the request header
            },
          }).then(() => {
            console.log('Room capacity updated successfully.');
            return updatedRoom;
          });
        }
        return room;
      });

      Promise.all(updatedRooms).then((updatedRoomsArray) => {
        setRooms(updatedRoomsArray);
        setSelectedStudent(null);
        setSelectedRoom('');
        setAllocationDate('');
        setShowForm(false);
      });
    } catch (error) {
      console.error('Error creating allocation:', error);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDisallocateButtonClick = async (allocationId) => {
    try {
      await axios.delete(`http://localhost:8080/api/roomAllocations/${allocationId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token in the request header
        },
      });

      // Remove the disallocated student from the allocations list
      setAllocations(allocations.filter((allocation) => allocation.id !== allocationId));

      // Optionally update the room's capacity and availability in the UI
      setRooms(
        rooms.map((room) => {
          if (room.id === allocationId.room.id) {
            return { ...room, capacity: room.capacity + 1, availability: true };
          }
          return room;
        })
      );
      console.log('Room deallocated successfully.');
    } catch (error) {
      console.error('Error disallocating room:', error);
    }
  };

  return (
    <div className="roomallocation">
      <Sidebar>
        <h1 style={{ fontSize: "30px" }}>STUDENT ALLOCATION</h1>

        <div className="search-container">
          <input
            style={{ width: "230px" }}
            type="text"
            placeholder="Search by name or course or ID"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>

        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Admission Date</th>
              <th>Course</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.admissionDate}</td>
                <td>{student.course}</td>
                <td>
                  {!studentAllocated(student) ? (
                    <button onClick={() => handleAllocateButtonClick(student)}>Allocate</button>
                  ) : (
                    <span>Allocated</span>
                  )}
                </td>
              </tr>
            ))}
            {allocations.map((allocation) => (
              <tr key={allocation.id}>
                <td>{allocation.student.id}</td>
                <td>{allocation.student.name}</td>
                <td>{allocation.student.email}</td>
                <td>{allocation.student.admissionDate}</td>
                <td>{allocation.student.course}</td>
                <td>
                  <div style={{ position: 'relative' }}>
                    <button
                      style={{
                        position: 'absolute',
                        zIndex: 2,
                        width: '100%',
                      }}
                      onClick={() => handleDisallocateButtonClick(allocation.id)}
                    >
                      Disallocate
                    </button>
                    <button
                      style={{
                        width: '100%',
                      }}
                    >
                      Allocate
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showForm && (
          <div className="overlay">
            <div className="form-container">
              <div className="sameline" style={{ display: 'flex' }}>
                <h2 className="form-heading">Allocate Room</h2>
                <button
                  style={{ marginLeft: '50%' }}
                  type="button"
                  className="form-heading"
                  onClick={handleCancel}
                >
                  X
                </button>
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="room">Room:</label>
                  <select id="room" onChange={handleRoomSelection} required value={selectedRoom}>
                    <option value="">Select Room</option>
                    {rooms.map((room) => (
                      room.availability &&
                      room.capacity > 0 && (
                        <option key={room.id} value={room.id}>
                          {room.roomNumber}
                        </option>
                      )
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="allocationDate">Allocation Date:</label>
                  <input
                    type="date"
                    id="allocationDate"
                    value={new Date().toISOString().substr(0, 10)}
                    onChange={handleAllocationDateChange}
                    required
                  />
                </div>

                <button type="submit" className="form-submit">
                  Allocate Room
                </button>
              </form>
            </div>
          </div>
        )}
      </Sidebar>
    </div>
  );
};

export default AllocationPage;

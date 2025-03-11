package com.example.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.entity.Room;
import com.example.entity.RoomAllocation;
import com.example.entity.Student;
import com.example.repo.RoomAllocationRepository;
import com.example.repo.RoomRepository;
import com.example.repo.StudentRepository;

@Service
public class RoomService {
	private final RoomRepository roomRepository;
    private final RoomAllocationRepository roomAllocationRepository;
    private final StudentRepository studentRepository;

    public RoomService(StudentRepository studentRepository, RoomRepository roomRepository, RoomAllocationRepository roomAllocationRepository) {
        this.roomRepository = roomRepository;
        this.roomAllocationRepository = roomAllocationRepository;
        this.studentRepository=studentRepository;
    }
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id).orElse(null);
    }

    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }

    public Room updateRoom(Room room) {
        return roomRepository.save(room);
    }

    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }
    
    
   


    

    
    public long getStudentCount() {
        return roomRepository.count();
      }
    
    // Check room availability before allocating
    public boolean isRoomAvailable(Long roomId) {
        Room room = roomRepository.findById(roomId).orElse(null);
        if (room == null) {
            return false;
        }
        // Count how many students are already allocated to this room
        long studentCount = roomAllocationRepository.countByRoomId(roomId);
        // Return if the room's capacity is greater than the current student count
        return studentCount < room.getCapacity();
    }

    // This will return the count of students allocated to a specific room
    public long getStudentCountInRoom(Long roomId) {
        return roomAllocationRepository.countByRoomId(roomId);
    }
}

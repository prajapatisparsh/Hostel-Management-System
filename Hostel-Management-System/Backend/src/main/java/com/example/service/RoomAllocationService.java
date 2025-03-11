package com.example.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.entity.RoomAllocation;
import com.example.repo.RoomAllocationRepository;

@Service
public class RoomAllocationService {
	private final RoomAllocationRepository roomAllocationRepository;
    private final RoomService roomService;

    public RoomAllocationService(RoomAllocationRepository roomAllocationRepository, RoomService roomService) {
        this.roomAllocationRepository = roomAllocationRepository;
        this.roomService = roomService;
    }


    public List<RoomAllocation> getAllRoomAllocations() {
        return roomAllocationRepository.findAll();
    }

    public RoomAllocation getRoomAllocationById(Long id) {
        return roomAllocationRepository.findById(id).orElse(null);
    }

    public RoomAllocation createRoomAllocation(RoomAllocation roomAllocation) {
        Long roomId = roomAllocation.getRoom().getId();

        // Check if room is available and has capacity
        if (roomService.isRoomAvailable(roomId)) {
            // Save the room allocation
            return roomAllocationRepository.save(roomAllocation);
        } else {
            // Return null or throw an exception if room is full or unavailable
            throw new IllegalStateException("Room is not available or full.");
        }
    }

    public void deleteRoomAllocation(Long id) {
        roomAllocationRepository.deleteById(id);
    }
    public RoomAllocation updateRoomAllocation(RoomAllocation roomAllocation) {
        return roomAllocationRepository.save(roomAllocation);
    }

}

package com.example.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.entity.Room;
import com.example.entity.RoomAllocation;
import com.example.entity.Student;
import com.example.repo.RoomAllocationRepository;
import com.example.repo.RoomRepository;
import com.example.service.RoomAllocationService;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/roomAllocations")
public class RoomAllocationController {
    private final RoomAllocationService roomAllocationService;
    private final RoomAllocationRepository roomAllocationRepository;
    private final RoomRepository roomRepository;

    public RoomAllocationController(RoomRepository roomRepository,RoomAllocationService roomAllocationService, RoomAllocationRepository roomAllocationRepository) {
        this.roomAllocationService = roomAllocationService;
        this.roomAllocationRepository=roomAllocationRepository;
		this.roomRepository = roomRepository;
    }

    @GetMapping
    public List<RoomAllocation> getAllRoomAllocations() {
        return roomAllocationService.getAllRoomAllocations();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomAllocation> getRoomAllocationById(@PathVariable Long id) {
        RoomAllocation roomAllocation = roomAllocationService.getRoomAllocationById(id);
        return ResponseEntity.ok(roomAllocation);
    }

    @PostMapping("/post")
    public ResponseEntity<RoomAllocation> createRoomAllocation(@RequestBody RoomAllocation roomAllocation) {
        RoomAllocation createdRoomAllocation = roomAllocationService.createRoomAllocation(roomAllocation);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRoomAllocation);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoomAllocation> updateRoomAllocation(@PathVariable Long id, @RequestBody RoomAllocation roomAllocation) {
        roomAllocation.setId(id);
        RoomAllocation updatedRoomAllocation = roomAllocationService.updateRoomAllocation(roomAllocation);
        return ResponseEntity.ok(updatedRoomAllocation);
    }

//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteRoomAllocation(@PathVariable Long id) {
//        roomAllocationService.deleteRoomAllocation(id);
//        return ResponseEntity.noContent().build();
//    }
    
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> disallocateRoom(@PathVariable Long id) {
        // Get the allocation and student info
        RoomAllocation allocation = roomAllocationRepository.findById(id).orElseThrow();
        Student student = allocation.getStudent();
        Room room = allocation.getRoom();

        

        // Update the room capacity
        room.setCapacity(room.getCapacity() + 1);
        room.setAvailability(true); // Mark room as available if it now has available capacity
        roomRepository.save(room);

        // Delete the room allocation
        roomAllocationRepository.delete(allocation);

        return ResponseEntity.noContent().build();
    }

}


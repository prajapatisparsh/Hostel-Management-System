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
public class StudentService {
    private final StudentRepository studentRepository;
    private final RoomAllocationRepository roomAllocationRepository;
    private final RoomRepository roomRepository;
    
    public StudentService(StudentRepository studentRepository, RoomRepository roomRepository,RoomAllocationRepository roomAllocationRepository) {
        this.studentRepository = studentRepository;
        this.roomAllocationRepository=roomAllocationRepository;
        this.roomRepository=roomRepository;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(String id) {
        return studentRepository.findById(id).orElse(null);
    }

    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }

    public Student updateStudent(Student student) {
        return studentRepository.save(student);
    }

    public void deleteStudent(String id) {
        studentRepository.deleteById(id);
    }
    
    

    
    public long getStudentCount() {
        return studentRepository.count();
      }
}

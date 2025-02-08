package com.example.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.entity.SignUp;
import com.example.repo.SignUpRepo;

import com.example.service.SignUpService;

@RestController
@CrossOrigin
@RequestMapping("/login")
public class LoginController {
	@Autowired
	SignUpService ser;

	@GetMapping("/get")
	private Iterable<SignUp> GetUsers() {
		return ser.GetAll();
	}

	
}
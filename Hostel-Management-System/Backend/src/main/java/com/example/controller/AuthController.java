

package com.example.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.entity.SignUp;
import com.example.repo.SignUpRepo;
import com.example.security.JwtHelper;
import com.example.security.JwtRequest;
import com.example.security.JwtResponse;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtHelper jwtHelper;

    @Autowired
    private SignUpRepo signUpRepo;  // Assuming you have a UserService that handles user operations

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody JwtRequest jwtRequest) {
        // Authenticate using email (not username)
        authenticate(jwtRequest.getEmail(), jwtRequest.getPassword());
        
        // Load user details by email, since email is used for authentication
        UserDetails userDetails = userDetailsService.loadUserByUsername(jwtRequest.getEmail()); // Corrected to use email
        
        // Generate JWT token for the authenticated user
        String token = jwtHelper.generateToken(userDetails);
        
        // Fetch the User entity from the database
        Optional<SignUp> user = signUpRepo.findByEmail(jwtRequest.getEmail()); // Assuming this method exists in UserService
        
        // Extract the userId from the User entity
        SignUp user1 = user.get();
       int userId = user1.getId();
        String role = user1.getRole();
        String email = user1.getEmail();
        // Get role (assuming first authority is role)
       // String role = userDetails.getAuthorities().toArray()[0].toString();  // Assuming first authority is role
        
        // Return response with token, role, and userId
        return ResponseEntity.ok(new JwtResponse(token, email, role, userId));
    }

    private void authenticate(String email, String password) {
        try {
            // Authenticate using the email for username
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid credentials");
        }
    }
}

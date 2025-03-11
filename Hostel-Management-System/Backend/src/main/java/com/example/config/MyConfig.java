package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.repo.SignUpRepo;


@Configuration
public class MyConfig {

	private final SignUpRepo signUpRepo;

	// Inject the repository and encoder via constructor
	public MyConfig(SignUpRepo signUpRepo) {
		this.signUpRepo = signUpRepo;
	}

	@Bean
	public UserDetailsService userDetailsService() {
		return username -> signUpRepo.findByEmail(username).map(user -> {
			// Map the database user to a Spring Security User
			return User.builder().username(user.getEmail()).password(user.getPassword())
					.roles(user.getRole()) // Assuming Role entity has getRoleName()
					.build();
		}).orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager customAuthenticationManager(AuthenticationConfiguration configuration) throws Exception {
		return configuration.getAuthenticationManager();
	}
}

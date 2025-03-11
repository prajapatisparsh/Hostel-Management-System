package com.example.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.example.entity.SignUp;

@Repository
public interface SignUpRepo extends CrudRepository<SignUp, Integer> {
	

	Optional<SignUp> findByEmail(String email);


	
}
package com.talktalk.repository.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.talktalk.model.entity.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {

}

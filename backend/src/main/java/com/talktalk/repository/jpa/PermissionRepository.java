package com.talktalk.repository.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.talktalk.model.entity.Permission;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, String> {

}

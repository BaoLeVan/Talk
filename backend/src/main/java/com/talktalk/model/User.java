package com.talktalk.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@Builder
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "usr_id")
    Long id;
    @Column(name = "usr_avatar")
    String avatar;
    @Column(name = "usr_full_name")
    String fullName;
    @Column(name = "usr_user_name")
    String userName;
    @Column(name = "usr_email", unique = true, nullable = false)
    String email;
    @Column(name = "usr_password", nullable = false)
    String password;
    @Column(name = "is_verified")
    Boolean isVerified;
    @Column(name = "verification_token")
    String verificationToken;
    @Column(name = "deleted_at")
    LocalDateTime deletedAt;

    @OneToMany(mappedBy = "user")
    List<Conversations_members> conversationsMembers;
}

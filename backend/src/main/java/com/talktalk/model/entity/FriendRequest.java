package com.talktalk.model.entity;

import com.talktalk.exception.enums.FriendRequestStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "friend_requests", uniqueConstraints = {
        @UniqueConstraint(columnNames = {
                "sender_id",
                "receiver_id",
                "status"
        })
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FriendRequest extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "message")
    String message;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    FriendRequestStatus status;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    User receiver;
}

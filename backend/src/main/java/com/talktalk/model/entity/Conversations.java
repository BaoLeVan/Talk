package com.talktalk.model.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.talktalk.exception.enums.TypeConversation;

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
@Table(name = "conversations")
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Conversations extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cvs_id")
    Long id;
    @Column(name = "cvs_avatar")
    String avatar;
    @Column(name = "cvs_title")
    String title;
    @Column(name = "cvs_type")
    TypeConversation type;
    @Column(name = "last_message")
    String lastMessage;
    @Column(name = "last_message_at")
    LocalDateTime lastMessageAt;
    @Column(name = "deleted_at")
    LocalDateTime deletedAt;

    @OneToMany(mappedBy = "conversations")
    List<Conversations_members> conversationsMembers;
}

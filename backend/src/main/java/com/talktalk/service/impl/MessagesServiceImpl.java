package com.talktalk.service.impl;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.talktalk.dto.response.MessagePageResponse;
import com.talktalk.dto.response.MessageResponse;
import com.talktalk.mapper.MessageMapper;
import com.talktalk.model.document.Message;
import com.talktalk.repository.mongo.MessagesRepository;
import com.talktalk.service.MessagesService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MessagesServiceImpl implements MessagesService {

    MessagesRepository messagesRepository;
    MessageMapper messageMapper;

    @Override
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public MessagePageResponse getMessagesByConversationId(String conversationId, LocalDateTime cursor, int size) {
        int validSize = size <= 0 ? size : Math.min(size, 50);

        Pageable pageable = PageRequest.of(0, validSize);

        List<Message> messages;

        if (cursor == null) {
            // Lần đầu mở chat
            messages = messagesRepository
                    .findByConversationIdOrderByCreatedAtDesc(conversationId, pageable);
        } else {
            // Scroll lên → lấy tin cũ hơn
            messages = messagesRepository
                    .findByConversationIdAndCreatedAtBeforeOrderByCreatedAtDesc(
                            conversationId,
                            cursor,
                            pageable);
        }

        // Đảo lại để UI hiển thị từ cũ → mới
        Collections.reverse(messages);

        List<MessageResponse> response = messages.stream()
                .map(messageMapper::toMessageResponse)
                .toList();

        // cursor mới = tin nhắn cũ nhất trong batch
        LocalDateTime nextCursor = messages.isEmpty()
                ? null
                : messages.get(0).getCreatedAt();

        return MessagePageResponse.builder()
                .messages(response)
                .nextCursor(nextCursor)
                .hasNext(messages.size() == validSize)
                .build();
    }
}

package com.talktalk.dto.response;

import com.talktalk.exception.enums.MemberRole;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleUserInConversation {
    Long userId;
    String userName;
    MemberRole role;
}

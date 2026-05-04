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
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MembersResponse {
    Long userId;
    String userAvatar;
    String userName;
    MemberRole userRole;
    Boolean isOnline;

    public MembersResponse(Long userId, String userAvatar, String userName, MemberRole userRole) {
        this.userId = userId;
        this.userAvatar = userAvatar;
        this.userName = userName;
        this.userRole = userRole;
    }
}

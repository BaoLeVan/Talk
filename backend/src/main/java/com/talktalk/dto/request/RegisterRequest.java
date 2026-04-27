package com.talktalk.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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
public class RegisterRequest {
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 20)
    @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*\\d)[A-Za-z\\d\\W]{8,256}$", message = "Invalid password")
    String password;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email")
    String email;

    @NotBlank(message = "User name is required")
    @Size(min = 6, max = 20, message = "User name must be between 6 and 20 characters")
    String userName;
}

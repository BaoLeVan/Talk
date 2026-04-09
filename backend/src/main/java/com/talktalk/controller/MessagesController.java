package com.talktalk.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/v1/messages")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MessagesController {

}

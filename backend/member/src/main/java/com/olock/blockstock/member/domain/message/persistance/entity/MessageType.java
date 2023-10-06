package com.olock.blockstock.member.domain.message.persistance.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum MessageType {
    RECEIVE("receive"), SEND("send"), MARK("mark");

    private final String key;
}

package com.olock.blockstock.member.domain.message.application;

import com.olock.blockstock.member.domain.message.dto.request.MessageSendRequest;
import com.olock.blockstock.member.domain.message.dto.response.MessageDetailResponse;

import java.util.List;

public interface MessageService {
    void sendMessage(Long MemberId, MessageSendRequest messageSendRequest);

    void markMessage(Long memberId, Long messageId);

    List<MessageDetailResponse> getMyMessages(Long memberId, String type);

    MessageDetailResponse getMessage(Long messageId);

    void deleteMessage(Long messageId);
}

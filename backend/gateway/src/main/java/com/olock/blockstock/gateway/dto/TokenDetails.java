package com.olock.blockstock.gateway.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class TokenDetails {
    private Long memberId;
    private String nickname;
    private String accessToken;
    private String refreshToken;
    private Date issuedAt;
}
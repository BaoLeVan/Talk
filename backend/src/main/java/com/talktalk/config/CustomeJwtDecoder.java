package com.talktalk.config;

import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoderInitializationException;

@Configurable
public class CustomeJwtDecoder implements JwtDecoder {

    @Override
    public Jwt decode(String token) throws JwtDecoderInitializationException {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'decode'");
    }

}

package com.pafproject.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * General application bean configuration.
 */
@Configuration
public class AppConfig {

    /**
     * RestTemplate bean used by AuthController to call Google tokeninfo API.
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

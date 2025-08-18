package com.travyway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;


@SpringBootApplication
@EnableFeignClients
public class TravywayApplication {

	public static void main(String[] args) {
		SpringApplication.run(TravywayApplication.class, args);
	}

}


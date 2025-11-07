package com.example.praca_inzynierska;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PracaInzynierskaApplication {

	public static void main(String[] args) {
		SpringApplication.run(PracaInzynierskaApplication.class, args);
	}

}


// ./mvnw package; cd target; java -jar pracainzynierska.jar
// ./mvnw compile -> test -> package -> verify
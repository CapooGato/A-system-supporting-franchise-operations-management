package com.example.praca_inzynierska.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
@Data
@NoArgsConstructor
public class EmailFormDto {

    @NotBlank(message = "Imię i nazwisko są wymagane")
    private String nameAndLastName;

    @NotBlank(message = "Email jest wymagany.")
    @Email(message = "Podaj poprawny adres e-mail.")
    private String email;

    @NotBlank(message = "Numer telefonu jest wymagany.")
    @Pattern(
            regexp = "^(\\+\\d{1,3} ?)?\\d{6,12}$",
            message = "Podaj poprawny numer telefonu"
    )
    private String phoneNumber;

    @NotBlank(message = "Miasto jest wymagane.")
    private String city;

    @Size(max = 500, message = "Doświadczenie może mieć maksymalnie 500 znaków.")
    private String experience;

    @Size(max = 1000, message = "Dodatkowe informacje mogą mieć maksymalnie 1000 znaków.")
    private String message;
}

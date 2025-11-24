package com.example.praca_inzynierska.util.email;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailFormDto {
    private String nameAndLastName;
    private String email;
    private String phone;
    private String city;
    private String experience;
    private String message;
}

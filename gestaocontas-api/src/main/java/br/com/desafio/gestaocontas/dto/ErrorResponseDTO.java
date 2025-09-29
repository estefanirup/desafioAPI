package br.com.desafio.gestaocontas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponseDTO {
    private OffsetDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
}

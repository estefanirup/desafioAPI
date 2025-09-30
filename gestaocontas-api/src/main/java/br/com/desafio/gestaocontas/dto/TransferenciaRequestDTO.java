package br.com.desafio.gestaocontas.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransferenciaRequestDTO {

    @NotNull(message = "O ID da conta de destino é obrigatório.")
    private Long idContaDestino;

    @NotNull(message = "O valor da transferência é obrigatório.")
    @Positive(message = "O valor da transferência deve ser positivo.")
    private BigDecimal valor;
}

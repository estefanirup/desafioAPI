package br.com.desafio.gestaocontas.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ContaRequestDTO {

    @NotNull(message = "O ID da pessoa é obrigatório.")
    private Long idPessoa;

    @NotNull(message = "O limite de saque diário é obrigatório.")
    @Positive(message = "O limite de saque diário deve ser um valor positivo.")
    private BigDecimal limiteSaqueDiario;

    @NotNull(message = "O tipo da conta é obrigatório.")
    private Integer tipoConta;
}
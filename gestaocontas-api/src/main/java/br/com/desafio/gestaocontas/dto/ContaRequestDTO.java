package br.com.desafio.gestaocontas.dto;

// Jakarta para ajudar na validação
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data // Gera getters, setters, toString, equals, hashCode
// Request é para os dados que o cliente manda
public class ContaRequestDTO {

    @NotNull(message = "O ID da pessoa é obrigatório.")
    private Long idPessoa; // Só os dados que o usuário envia

    @NotNull(message = "O limite de saque diário é obrigatório.")
    @Positive(message = "O limite de saque diário deve ser um valor positivo.")
    private BigDecimal limiteSaqueDiario;

    @NotNull(message = "O tipo da conta é obrigatório.")
    private Integer tipoConta;
}
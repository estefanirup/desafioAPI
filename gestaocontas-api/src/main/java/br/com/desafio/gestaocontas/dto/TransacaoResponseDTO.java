package br.com.desafio.gestaocontas.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
public class TransacaoResponseDTO {
    private Long idTransacao;
    private BigDecimal valor;
    private OffsetDateTime dataTransacao;
}
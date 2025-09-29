package br.com.desafio.gestaocontas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaldoDTO {
    private BigDecimal saldo;
    private OffsetDateTime dataConsulta;
}
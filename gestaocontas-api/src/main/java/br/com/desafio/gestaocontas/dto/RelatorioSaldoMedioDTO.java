package br.com.desafio.gestaocontas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RelatorioSaldoMedioDTO {

    private BigDecimal saldoMedioGeral;
    private long totalContasConsideradas;

}

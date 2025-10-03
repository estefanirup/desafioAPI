package br.com.desafio.gestaocontas.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
public class ContaResponseDTO { // Dados que a API devolve para o cliente (só os que ele precisa saber)
    private Long idConta;
    private Long idPessoa;
    private String nomePessoa; 
    private BigDecimal saldo;
    private BigDecimal limiteSaqueDiario;
    private Boolean flagAtivo;
    private Integer tipoConta;
    private OffsetDateTime dataCriacao;
}
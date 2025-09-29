package br.com.desafio.gestaocontas.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@Entity
@Table(name = "tb_conta")
public class Conta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idConta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idPessoa", nullable = false)
    private Pessoa pessoa;

    @Column(nullable = false, columnDefinition = "DECIMAL(18, 2)")
    private BigDecimal saldo;

    @Column(nullable = false, columnDefinition = "DECIMAL(18, 2)")
    private BigDecimal limiteSaqueDiario;

    @Column(nullable = false)
    private Boolean flagAtivo;

    @Column(nullable = false)
    private Integer tipoConta;

    @Column(nullable = false, updatable = false)
    private OffsetDateTime dataCriacao;
}
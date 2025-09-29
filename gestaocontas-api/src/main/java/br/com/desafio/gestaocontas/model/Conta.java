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
    @Column(name = "idConta")
    private Long idConta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idPessoa", nullable = false)
    private Pessoa pessoa;

    @Column(name = "saldo", nullable = false, columnDefinition = "DECIMAL(18, 2)")
    private BigDecimal saldo;

    @Column(name = "limiteSaqueDiario", nullable = false, columnDefinition = "DECIMAL(18, 2)")
    private BigDecimal limiteSaqueDiario;

    @Column(name = "flagAtivo", nullable = false)
    private Boolean flagAtivo;

    @Column(name = "tipoConta", nullable = false)
    private Integer tipoConta;

    @Column(name = "dataCriacao", nullable = false, updatable = false)
    private OffsetDateTime dataCriacao;
}

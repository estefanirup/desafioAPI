package br.com.desafio.gestaocontas.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data // Lombok 
@Entity
@Table(name = "tb_conta") // JPA para mapear a classe para a tabela
public class Conta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_conta")
    private Long idConta; // camelCase x snake_case

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pessoa", nullable = false)
    private Pessoa pessoa;

    @Column(name = "saldo", nullable = false, columnDefinition = "DECIMAL(18, 2)")
    private BigDecimal saldo;

    @Column(name = "limite_saque_diario", nullable = false, columnDefinition = "DECIMAL(18, 2)")
    private BigDecimal limiteSaqueDiario;

    @Column(name = "flag_ativo", nullable = false)
    private Boolean flagAtivo;

    @Column(name = "tipo_conta", nullable = false)
    private Integer tipoConta;

    @Column(name = "data_criacao", nullable = false, updatable = false)
    private OffsetDateTime dataCriacao;
}

package br.com.desafio.gestaocontas.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@Entity
@Table(name = "tb_transacao")
public class Transacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idTransacao")
    private Long idTransacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idConta", nullable = false)
    private Conta conta;

    @Column(name = "valor", nullable = false, columnDefinition = "DECIMAL(18, 2)")
    private BigDecimal valor;

    @Column(name = "dataTransacao", nullable = false, updatable = false)
    private OffsetDateTime dataTransacao;
}

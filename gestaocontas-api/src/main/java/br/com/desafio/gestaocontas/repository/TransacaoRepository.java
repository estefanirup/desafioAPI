package br.com.desafio.gestaocontas.repository;

import br.com.desafio.gestaocontas.model.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {

    List<Transacao> findByConta_IdContaOrderByDataTransacaoDesc(Long idConta);

    List<Transacao> findByConta_IdContaAndDataTransacaoBetweenOrderByDataTransacaoDesc(Long idConta, OffsetDateTime inicio, OffsetDateTime fim);

    @Query("SELECT SUM(t.valor * -1) FROM Transacao t WHERE t.conta.idConta = :idConta AND t.valor < 0 AND t.dataTransacao BETWEEN :inicio AND :fim")
    BigDecimal sumSaquesByContaAndData(@Param("idConta") Long idConta, @Param("inicio") OffsetDateTime inicio, @Param("fim") OffsetDateTime fim);
}

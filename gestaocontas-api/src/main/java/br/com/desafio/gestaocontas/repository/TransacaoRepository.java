package br.com.desafio.gestaocontas.repository;

import br.com.desafio.gestaocontas.model.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {
    List<Transacao> findByConta_IdContaOrderByDataTransacaoDesc(Long idConta);
    
    List<Transacao> findByConta_IdContaAndDataTransacaoBetweenOrderByDataTransacaoDesc(Long idConta, OffsetDateTime inicio, OffsetDateTime fim);
}
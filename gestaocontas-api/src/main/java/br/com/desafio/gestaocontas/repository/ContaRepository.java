package br.com.desafio.gestaocontas.repository;

import br.com.desafio.gestaocontas.model.Conta;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ContaRepository extends JpaRepository<Conta, Long> {
    @Query("SELECT COALESCE(AVG(c.saldo), 0) FROM Conta c WHERE c.flagAtivo = true")
    BigDecimal findSaldoMedioContasAtivas();

    boolean existsByPessoaIdPessoa(Long idPessoa);
}
package br.com.desafio.gestaocontas.repository;

import br.com.desafio.gestaocontas.model.Conta;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository 
public interface ContaRepository extends JpaRepository<Conta, Long> { // JPA 
    // Se não achar, retorna 0
    @Query("SELECT COALESCE(AVG(c.saldo), 0) FROM Conta c WHERE c.flagAtivo = true")
    BigDecimal findSaldoMedioContasAtivas();

    boolean existsByPessoaIdPessoa(Long idPessoa); // método automático

    // Consulta direto no banco com JPQL
    @Query("SELECT c FROM Conta c WHERE c.pessoa.idPessoa = :idPessoa")
    List<Conta> findByPessoaIdPessoa(Long idPessoa);
}
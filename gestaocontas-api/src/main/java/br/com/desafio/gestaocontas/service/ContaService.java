package br.com.desafio.gestaocontas.service;

import br.com.desafio.gestaocontas.dto.*;

import java.util.List;

public interface ContaService {

    ContaResponseDTO criarConta(ContaRequestDTO contaRequestDTO);

    SaldoDTO consultarSaldo(Long idConta);

    ContaResponseDTO depositar(Long idConta, TransacaoRequestDTO transacaoRequestDTO);

    ContaResponseDTO sacar(Long idConta, TransacaoRequestDTO transacaoRequestDTO);

    ContaResponseDTO bloquearConta(Long idConta);

    void transferir(Long idContaOrigem, TransferenciaRequestDTO transferenciaDTO);

    List<TransacaoResponseDTO> extrato(Long idConta);

    List<ContaResponseDTO> buscarContasPorPessoa(Long idPessoa);
}
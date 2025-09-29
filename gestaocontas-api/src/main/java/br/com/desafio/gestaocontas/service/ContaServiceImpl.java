package br.com.desafio.gestaocontas.service;

import br.com.desafio.gestaocontas.dto.*;
import br.com.desafio.gestaocontas.mapper.ContaMapper;
import br.com.desafio.gestaocontas.mapper.TransacaoMapper;
import br.com.desafio.gestaocontas.repository.ContaRepository;
import br.com.desafio.gestaocontas.repository.PessoaRepository;
import br.com.desafio.gestaocontas.repository.TransacaoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ContaServiceImpl implements ContaService {

    private final ContaRepository contaRepository;
    private final PessoaRepository pessoaRepository;
    private final TransacaoRepository transacaoRepository;
    private final ContaMapper contaMapper;
    private final TransacaoMapper transacaoMapper;

    public ContaServiceImpl(ContaRepository contaRepository, PessoaRepository pessoaRepository,
                            TransacaoRepository transacaoRepository, ContaMapper contaMapper,
                            TransacaoMapper transacaoMapper) {
        this.contaRepository = contaRepository;
        this.pessoaRepository = pessoaRepository;
        this.transacaoRepository = transacaoRepository;
        this.contaMapper = contaMapper;
        this.transacaoMapper = transacaoMapper;
    }

    @Override
    public ContaResponseDTO criarConta(ContaRequestDTO contaRequestDTO) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'criarConta'");
    }

    @Override
    public SaldoDTO consultarSaldo(Long idConta) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'consultarSaldo'");
    }

    @Override
    public ContaResponseDTO depositar(Long idConta, TransacaoRequestDTO transacaoRequestDTO) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'depositar'");
    }

    @Override
    public ContaResponseDTO sacar(Long idConta, TransacaoRequestDTO transacaoRequestDTO) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'sacar'");
    }

    @Override
    public ContaResponseDTO bloquearConta(Long idConta) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'bloquearConta'");
    }

    @Override
    public List<TransacaoResponseDTO> extrato(Long idConta) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'extrato'");
    }

}
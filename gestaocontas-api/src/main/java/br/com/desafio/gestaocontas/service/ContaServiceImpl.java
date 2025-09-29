package br.com.desafio.gestaocontas.service;

import br.com.desafio.gestaocontas.dto.*;
import br.com.desafio.gestaocontas.exception.IllegalOperationException;
import br.com.desafio.gestaocontas.exception.ResourceNotFoundException;
import br.com.desafio.gestaocontas.mapper.ContaMapper;
import br.com.desafio.gestaocontas.mapper.TransacaoMapper;
import br.com.desafio.gestaocontas.model.Conta;
import br.com.desafio.gestaocontas.model.Pessoa;
import br.com.desafio.gestaocontas.model.Transacao;
import br.com.desafio.gestaocontas.repository.ContaRepository;
import br.com.desafio.gestaocontas.repository.PessoaRepository;
import br.com.desafio.gestaocontas.repository.TransacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
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
    @Transactional
    public ContaResponseDTO criarConta(ContaRequestDTO contaRequestDTO) {
        Pessoa pessoa = pessoaRepository.findById(contaRequestDTO.getIdPessoa())
                .orElseThrow(() -> new ResourceNotFoundException("Pessoa com ID " + contaRequestDTO.getIdPessoa() + " não encontrada."));

        Conta novaConta = new Conta();
        novaConta.setPessoa(pessoa);
        novaConta.setSaldo(BigDecimal.ZERO);
        novaConta.setLimiteSaqueDiario(contaRequestDTO.getLimiteSaqueDiario());
        novaConta.setFlagAtivo(true);
        novaConta.setTipoConta(contaRequestDTO.getTipoConta());
        novaConta.setDataCriacao(OffsetDateTime.now(ZoneOffset.UTC));

        Conta contaSalva = contaRepository.save(novaConta);
        return contaMapper.toResponseDTO(contaSalva);
    }

    @Override
    public SaldoDTO consultarSaldo(Long idConta) {
        Conta conta = contaRepository.findById(idConta)
                .orElseThrow(() -> new ResourceNotFoundException("Conta com ID " + idConta + " não encontrada."));
        return new SaldoDTO(conta.getSaldo(), OffsetDateTime.now(ZoneOffset.UTC));
    }

    @Override
    @Transactional
    public ContaResponseDTO depositar(Long idConta, TransacaoRequestDTO transacaoRequestDTO) {
        Conta conta = contaRepository.findById(idConta)
                .orElseThrow(() -> new ResourceNotFoundException("Conta com ID " + idConta + " não encontrada."));

        if (!conta.getFlagAtivo()) {
            throw new IllegalOperationException("Não é possível depositar em uma conta bloqueada.");
        }

        conta.setSaldo(conta.getSaldo().add(transacaoRequestDTO.getValor()));
        registrarTransacao(conta, transacaoRequestDTO.getValor());
        Conta contaAtualizada = contaRepository.save(conta);

        return contaMapper.toResponseDTO(contaAtualizada);
    }

    @Override
    @Transactional
    public ContaResponseDTO sacar(Long idConta, TransacaoRequestDTO transacaoRequestDTO) {
        Conta conta = contaRepository.findById(idConta)
                .orElseThrow(() -> new ResourceNotFoundException("Conta com ID " + idConta + " não encontrada."));

        BigDecimal valorSaque = transacaoRequestDTO.getValor();

        if (!conta.getFlagAtivo()) {
            throw new IllegalOperationException("Não é possível sacar de uma conta bloqueada.");
        }
        if (conta.getSaldo().compareTo(valorSaque) < 0) {
            throw new IllegalOperationException("Saldo insuficiente para realizar o saque.");
        }

        BigDecimal totalSacadoHoje = transacaoRepository.sumSaquesByContaAndData(idConta, getInicioDoDia(), getFimDoDia());
        if (totalSacadoHoje == null) {
            totalSacadoHoje = BigDecimal.ZERO;
        }

        if (totalSacadoHoje.add(valorSaque).compareTo(conta.getLimiteSaqueDiario()) > 0) {
            throw new IllegalOperationException("Limite de saque diário excedido.");
        }

        conta.setSaldo(conta.getSaldo().subtract(valorSaque));
        registrarTransacao(conta, valorSaque.negate());
        Conta contaAtualizada = contaRepository.save(conta);

        return contaMapper.toResponseDTO(contaAtualizada);
    }

    @Override
    @Transactional
    public ContaResponseDTO bloquearConta(Long idConta) {
        Conta conta = contaRepository.findById(idConta)
                .orElseThrow(() -> new ResourceNotFoundException("Conta com ID " + idConta + " não encontrada."));

        conta.setFlagAtivo(false);
        Conta contaAtualizada = contaRepository.save(conta);
        return contaMapper.toResponseDTO(contaAtualizada);
    }

    @Override
    public List<TransacaoResponseDTO> extrato(Long idConta) {
        if (!contaRepository.existsById(idConta)) {
            throw new ResourceNotFoundException("Conta com ID " + idConta + " não encontrada.");
        }
        List<Transacao> transacoes = transacaoRepository.findByConta_IdContaOrderByDataTransacaoDesc(idConta);
        return transacaoMapper.toResponseDTOList(transacoes);
    }

    private void registrarTransacao(Conta conta, BigDecimal valor) {
        Transacao transacao = new Transacao();
        transacao.setConta(conta);
        transacao.setValor(valor);
        transacao.setDataTransacao(OffsetDateTime.now(ZoneOffset.UTC));
        transacaoRepository.save(transacao);
    }

    private OffsetDateTime getInicioDoDia() {
        return OffsetDateTime.of(LocalDate.now(), LocalTime.MIN, ZoneOffset.UTC);
    }

    private OffsetDateTime getFimDoDia() {
        return OffsetDateTime.of(LocalDate.now(), LocalTime.MAX, ZoneOffset.UTC);
    }
}

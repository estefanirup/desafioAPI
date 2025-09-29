package br.com.desafio.gestaocontas.service;

import br.com.desafio.gestaocontas.dto.RelatorioSaldoMedioDTO;
import br.com.desafio.gestaocontas.dto.RelatorioTopClientesDTO;
import br.com.desafio.gestaocontas.repository.ContaRepository;
import br.com.desafio.gestaocontas.repository.TransacaoRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class RelatorioServiceImpl implements RelatorioService {

    private final ContaRepository contaRepository;
    private final TransacaoRepository transacaoRepository;

    public RelatorioServiceImpl(ContaRepository contaRepository, TransacaoRepository transacaoRepository) {
        this.contaRepository = contaRepository;
        this.transacaoRepository = transacaoRepository;
    }

    @Override
    public RelatorioSaldoMedioDTO gerarRelatorioSaldoMedio() {
        BigDecimal saldoMedio = contaRepository.findSaldoMedioContasAtivas();
        long totalContas = contaRepository.count();
        return new RelatorioSaldoMedioDTO(saldoMedio, totalContas);
    }

    @Override
    public List<RelatorioTopClientesDTO> gerarRelatorioTopClientes() {
        Pageable topDez = PageRequest.of(0, 10);
        return transacaoRepository.findTopClientesPorVolume(topDez);
    }
}
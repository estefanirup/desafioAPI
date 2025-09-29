package br.com.desafio.gestaocontas.service;

import br.com.desafio.gestaocontas.dto.RelatorioSaldoMedioDTO;
import br.com.desafio.gestaocontas.dto.RelatorioTopClientesDTO;

import java.util.List;

public interface RelatorioService {

    RelatorioSaldoMedioDTO gerarRelatorioSaldoMedio();

    List<RelatorioTopClientesDTO> gerarRelatorioTopClientes();
}
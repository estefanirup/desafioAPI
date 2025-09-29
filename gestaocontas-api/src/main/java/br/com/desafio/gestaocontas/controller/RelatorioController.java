package br.com.desafio.gestaocontas.controller;

import br.com.desafio.gestaocontas.dto.RelatorioSaldoMedioDTO;
import br.com.desafio.gestaocontas.dto.RelatorioTopClientesDTO;
import br.com.desafio.gestaocontas.service.RelatorioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/relatorios")
@Tag(name = "Relatórios", description = "Endpoints para análises e relatórios de dados")
public class RelatorioController {

    private final RelatorioService relatorioService;

    public RelatorioController(RelatorioService relatorioService) {
        this.relatorioService = relatorioService;
    }

    @GetMapping("/saldo-medio")
    @Operation(summary = "Gera relatório de saldo médio",
               description = "Calcula e retorna o saldo médio de todas as contas ativas no sistema.")
    @ApiResponse(responseCode = "200", description = "Relatório gerado com sucesso")
    public ResponseEntity<RelatorioSaldoMedioDTO> getSaldoMedio() {
        RelatorioSaldoMedioDTO relatorio = relatorioService.gerarRelatorioSaldoMedio();
        return ResponseEntity.ok(relatorio);
    }

    @GetMapping("/top-10-clientes")
    @Operation(summary = "Gera relatório dos top 10 clientes por movimentação",
               description = "Retorna uma lista dos 10 clientes que mais movimentaram fundos (soma de saques e depósitos).")
    @ApiResponse(responseCode = "200", description = "Relatório gerado com sucesso")
    public ResponseEntity<List<RelatorioTopClientesDTO>> getTop10Clientes() {
        List<RelatorioTopClientesDTO> relatorio = relatorioService.gerarRelatorioTopClientes();
        return ResponseEntity.ok(relatorio);
    }
}
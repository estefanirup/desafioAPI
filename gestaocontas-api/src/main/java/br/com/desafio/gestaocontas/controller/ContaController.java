package br.com.desafio.gestaocontas.controller;

import br.com.desafio.gestaocontas.dto.*;
import br.com.desafio.gestaocontas.service.ContaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/contas")
@Tag(name = "Contas", description = "Endpoints para gerenciamento de contas bancárias")
public class ContaController {

    private final ContaService contaService;

    public ContaController(ContaService contaService) {
        this.contaService = contaService;
    }

    @Operation(summary = "Cria uma nova conta", description = "Cria uma nova conta associada a um ID de pessoa existente.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Conta criada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados de entrada inválidos"),
            @ApiResponse(responseCode = "404", description = "Pessoa não encontrada com o ID informado")
    })
    @PostMapping
    public ResponseEntity<ContaResponseDTO> criarConta(@Valid @RequestBody ContaRequestDTO contaRequestDTO) {
        ContaResponseDTO novaConta = contaService.criarConta(contaRequestDTO);
        return new ResponseEntity<>(novaConta, HttpStatus.CREATED);
    }

    @Operation(summary = "Consulta o saldo de uma conta", description = "Retorna o saldo atual de uma conta específica.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Saldo retornado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Conta não encontrada")
    })
    @GetMapping("/{idConta}/saldo")
    public ResponseEntity<SaldoDTO> consultarSaldo(@PathVariable Long idConta) {
        SaldoDTO saldo = contaService.consultarSaldo(idConta);
        return ResponseEntity.ok(saldo);
    }

    @Operation(summary = "Realiza um depósito em uma conta", description = "Adiciona um valor ao saldo de uma conta ativa.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Depósito realizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Operação inválida (ex: conta bloqueada ou valor inválido)"),
            @ApiResponse(responseCode = "404", description = "Conta não encontrada")
    })
    @PostMapping("/{idConta}/deposito")
    public ResponseEntity<ContaResponseDTO> depositar(@PathVariable Long idConta,
            @Valid @RequestBody TransacaoRequestDTO transacaoRequestDTO) {
        ContaResponseDTO contaAtualizada = contaService.depositar(idConta, transacaoRequestDTO);
        return ResponseEntity.ok(contaAtualizada);
    }

    @Operation(summary = "Realiza um saque de uma conta", description = "Subtrai um valor do saldo de uma conta, validando o saldo e o limite diário.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Saque realizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Operação inválida (ex: saldo insuficiente, limite diário excedido)"),
            @ApiResponse(responseCode = "404", description = "Conta não encontrada")
    })
    @PostMapping("/{idConta}/saque")
    public ResponseEntity<ContaResponseDTO> sacar(@PathVariable Long idConta,
            @Valid @RequestBody TransacaoRequestDTO transacaoRequestDTO) {
        ContaResponseDTO contaAtualizada = contaService.sacar(idConta, transacaoRequestDTO);
        return ResponseEntity.ok(contaAtualizada);
    }

    @Operation(summary = "Bloqueia uma conta", description = "Altera o status de uma conta para inativo, impedindo transações futuras.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Conta bloqueada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Conta não encontrada")
    })
    @PatchMapping("/{idConta}/bloquear")
    public ResponseEntity<ContaResponseDTO> bloquearConta(@PathVariable Long idConta) {
        ContaResponseDTO contaBloqueada = contaService.bloquearConta(idConta);
        return ResponseEntity.ok(contaBloqueada);
    }

    @Operation(summary = "Consulta o extrato de transações", description = "Retorna uma lista de todas as transações (depósitos e saques) realizadas em uma conta.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Extrato retornado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Conta não encontrada")
    })
    @GetMapping("/{idConta}/extrato")
    public ResponseEntity<List<TransacaoResponseDTO>> extrato(@PathVariable Long idConta) {
        List<TransacaoResponseDTO> extrato = contaService.extrato(idConta);
        return ResponseEntity.ok(extrato);
    }

    @PostMapping("/{idContaOrigem}/transferencia")
    @Operation(summary = "Realiza uma transferência entre contas",
               description = "Transfere um valor de uma conta de origem para uma conta de destino. A operação é atómica.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Transferência realizada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Operação inválida (ex: saldo insuficiente, contas inativas)"),
            @ApiResponse(responseCode = "404", description = "Conta de origem ou destino não encontrada")
    })
    public ResponseEntity<Void> transferir(
            @PathVariable Long idContaOrigem,
            @Valid @RequestBody TransferenciaRequestDTO transferenciaDTO) {
        
        contaService.transferir(idContaOrigem, transferenciaDTO);
        return ResponseEntity.noContent().build();
    }
}

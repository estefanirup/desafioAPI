package br.com.desafio.gestaocontas.controller;

import br.com.desafio.gestaocontas.dto.*;
import br.com.desafio.gestaocontas.service.ContaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/contas")
public class ContaController {

    private final ContaService contaService;

    public ContaController(ContaService contaService) {
        this.contaService = contaService;
    }

    @PostMapping
    public ResponseEntity<ContaResponseDTO> criarConta(@Valid @RequestBody ContaRequestDTO contaRequestDTO) {
        ContaResponseDTO novaConta = contaService.criarConta(contaRequestDTO);
        return new ResponseEntity<>(novaConta, HttpStatus.CREATED);
    }

    @GetMapping("/{idConta}/saldo")
    public ResponseEntity<SaldoDTO> consultarSaldo(@PathVariable Long idConta) {
        SaldoDTO saldo = contaService.consultarSaldo(idConta);
        return ResponseEntity.ok(saldo);
    }

    @PostMapping("/{idConta}/deposito")
    public ResponseEntity<ContaResponseDTO> depositar(@PathVariable Long idConta, @Valid @RequestBody TransacaoRequestDTO transacaoRequestDTO) {
        ContaResponseDTO contaAtualizada = contaService.depositar(idConta, transacaoRequestDTO);
        return ResponseEntity.ok(contaAtualizada);
    }

    @PostMapping("/{idConta}/saque")
    public ResponseEntity<ContaResponseDTO> sacar(@PathVariable Long idConta, @Valid @RequestBody TransacaoRequestDTO transacaoRequestDTO) {
        ContaResponseDTO contaAtualizada = contaService.sacar(idConta, transacaoRequestDTO);
        return ResponseEntity.ok(contaAtualizada);
    }

    @PatchMapping("/{idConta}/bloquear")
    public ResponseEntity<ContaResponseDTO> bloquearConta(@PathVariable Long idConta) {
        ContaResponseDTO contaBloqueada = contaService.bloquearConta(idConta);
        return ResponseEntity.ok(contaBloqueada);
    }

    @GetMapping("/{idConta}/extrato")
    public ResponseEntity<List<TransacaoResponseDTO>> extrato(@PathVariable Long idConta) {
        List<TransacaoResponseDTO> extrato = contaService.extrato(idConta);
        return ResponseEntity.ok(extrato);
    }
}

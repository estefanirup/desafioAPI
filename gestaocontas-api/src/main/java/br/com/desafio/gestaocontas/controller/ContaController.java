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

@RestController // Retorna JSON
@RequestMapping("/contas") // Todos os endpoints começam com /contas  
@CrossOrigin(origins = "http://localhost:5173") // Permite requisições do frontend nesse endereço
// Falar sobre o problema com o CORS
@Tag(name = "Contas", description = "Endpoints para gerenciamento de contas bancárias") // Swagger bonitinho
public class ContaController {

    private final ContaService contaService;

    public ContaController(ContaService contaService) {
        this.contaService = contaService;
    } // Aqui poderia ter usado @Autowired que o Spring injeta automatico 


    @Operation(summary = "Cria uma nova conta", description = "Cria uma nova conta associada a um ID de pessoa existente.") 
    @ApiResponses(value = { 
            @ApiResponse(responseCode = "201", description = "Conta criada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados de entrada inválidos"),
            @ApiResponse(responseCode = "404", description = "Pessoa não encontrada com o ID informado")
    })
    // Endpoint POST /contas 
    @PostMapping 
    // Corpo da requisição é um JSON que será mapeado para ContaRequestDTO
    // @Valid ativa a validação dos campos anotados em ContaRequestDTO
    // ResponseEntity permite customizar o status HTTP da resposta
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
    // @PathVariable extrai o idConta da URL
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

    @Operation(summary = "Altera o status de uma conta (ativa/bloqueada)",
               description = "Alterna o status de uma conta. Se estiver ativa, torna-se bloqueada, e vice-versa.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Status da conta alterado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Conta não encontrada")
    })
    @PatchMapping("/{idConta}/alterar-status")
    public ResponseEntity<ContaResponseDTO> alterarStatusConta(@PathVariable Long idConta) {
        ContaResponseDTO contaAtualizada = contaService.alterarStatusConta(idConta);
        return ResponseEntity.ok(contaAtualizada);
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
    @Operation(summary = "Realiza uma transferência entre contas", description = "Transfere um valor de uma conta de origem para uma conta de destino. A operação é atómica.")
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

    @GetMapping("/pessoa/{idPessoa}")
    @Operation(summary = "Busca todas as contas de uma pessoa")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contas listadas com sucesso"),
            @ApiResponse(responseCode = "404", description = "Pessoa não encontrada")
    })
    public ResponseEntity<List<ContaResponseDTO>> buscarContasPorPessoa(@PathVariable Long idPessoa) {
        List<ContaResponseDTO> contas = contaService.buscarContasPorPessoa(idPessoa);
        return ResponseEntity.ok(contas);
    }
}

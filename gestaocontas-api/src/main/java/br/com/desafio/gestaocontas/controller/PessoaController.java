package br.com.desafio.gestaocontas.controller;

import br.com.desafio.gestaocontas.dto.PessoaRequestDTO;
import br.com.desafio.gestaocontas.dto.PessoaResponseDTO;
import br.com.desafio.gestaocontas.service.PessoaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pessoas")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Pessoas", description = "Endpoints para gerenciamento de pessoas (clientes)")
public class PessoaController {

    private final PessoaService pessoaService;

    public PessoaController(PessoaService pessoaService) {
        this.pessoaService = pessoaService;
    }

    @PostMapping
    @Operation(summary = "Cria uma nova pessoa")
    public ResponseEntity<PessoaResponseDTO> criarPessoa(@Valid @RequestBody PessoaRequestDTO pessoaDTO) {
        PessoaResponseDTO novaPessoa = pessoaService.criarPessoa(pessoaDTO);
        return new ResponseEntity<>(novaPessoa, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca uma pessoa por ID")
    public ResponseEntity<PessoaResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(pessoaService.buscarPorId(id));
    }

    @GetMapping
    @Operation(summary = "Lista todas as pessoas")
    public ResponseEntity<List<PessoaResponseDTO>> buscarTodos() {
        return ResponseEntity.ok(pessoaService.buscarTodos());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza os dados de uma pessoa")
    public ResponseEntity<PessoaResponseDTO> atualizarPessoa(@PathVariable Long id, @Valid @RequestBody PessoaRequestDTO pessoaDTO) {
        return ResponseEntity.ok(pessoaService.atualizarPessoa(id, pessoaDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deleta uma pessoa")
    public ResponseEntity<Void> deletarPessoa(@PathVariable Long id) {
        pessoaService.deletarPessoa(id);
        return ResponseEntity.noContent().build();
    }
}

package br.com.desafio.gestaocontas.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PessoaResponseDTO {
    private Long idPessoa;
    private String nome;
    private String cpf;
    private LocalDate dataNascimento;
}

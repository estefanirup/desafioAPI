    package br.com.desafio.gestaocontas.service;

    import br.com.desafio.gestaocontas.dto.PessoaRequestDTO;
    import br.com.desafio.gestaocontas.dto.PessoaResponseDTO;

    import java.util.List;

    public interface PessoaService {
        PessoaResponseDTO criarPessoa(PessoaRequestDTO pessoaDTO);
        PessoaResponseDTO buscarPorId(Long id);
        List<PessoaResponseDTO> buscarTodos();
        PessoaResponseDTO atualizarPessoa(Long id, PessoaRequestDTO pessoaDTO);
        void deletarPessoa(Long id);
    }
    

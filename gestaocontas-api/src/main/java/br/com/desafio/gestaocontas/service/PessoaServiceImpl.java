package br.com.desafio.gestaocontas.service;

import br.com.desafio.gestaocontas.dto.PessoaRequestDTO;
import br.com.desafio.gestaocontas.dto.PessoaResponseDTO;
import br.com.desafio.gestaocontas.exception.IllegalOperationException;
import br.com.desafio.gestaocontas.exception.ResourceNotFoundException;
import br.com.desafio.gestaocontas.mapper.PessoaMapper;
import br.com.desafio.gestaocontas.model.Pessoa;
import br.com.desafio.gestaocontas.repository.ContaRepository;
import br.com.desafio.gestaocontas.repository.PessoaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PessoaServiceImpl implements PessoaService {

    private final PessoaRepository pessoaRepository;
    private final ContaRepository contaRepository; 
    private final PessoaMapper pessoaMapper;

    public PessoaServiceImpl(PessoaRepository pessoaRepository, ContaRepository contaRepository, PessoaMapper pessoaMapper) {
        this.pessoaRepository = pessoaRepository;
        this.contaRepository = contaRepository;
        this.pessoaMapper = pessoaMapper;
    }

    @Override
    @Transactional
    public PessoaResponseDTO criarPessoa(PessoaRequestDTO pessoaDTO) {
        pessoaRepository.findByCpf(pessoaDTO.getCpf()).ifPresent(p -> {
            throw new IllegalOperationException("CPF já cadastrado no sistema.");
        });
        Pessoa pessoa = pessoaMapper.toEntity(pessoaDTO);
        Pessoa pessoaSalva = pessoaRepository.save(pessoa);
        return pessoaMapper.toResponseDTO(pessoaSalva);
    }

    @Override
    public PessoaResponseDTO buscarPorId(Long id) {
        Pessoa pessoa = pessoaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pessoa com ID " + id + " não encontrada."));
        return pessoaMapper.toResponseDTO(pessoa);
    }

    @Override
    public List<PessoaResponseDTO> buscarTodos() {
        List<Pessoa> pessoas = pessoaRepository.findAll();
        return pessoaMapper.toResponseDTOList(pessoas);
    }

    @Override
    @Transactional
    public PessoaResponseDTO atualizarPessoa(Long id, PessoaRequestDTO pessoaDTO) {
        Pessoa pessoaExistente = pessoaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pessoa com ID " + id + " não encontrada."));

        pessoaExistente.setNome(pessoaDTO.getNome());
        pessoaExistente.setDataNascimento(pessoaDTO.getDataNascimento());

        Pessoa pessoaAtualizada = pessoaRepository.save(pessoaExistente);
        return pessoaMapper.toResponseDTO(pessoaAtualizada);
    }

    @Override
    @Transactional
    public void deletarPessoa(Long id) {
        if (!pessoaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Pessoa com ID " + id + " não encontrada.");
        }
        
        if (contaRepository.existsByPessoaIdPessoa(id)) {
            throw new IllegalOperationException("Não é possível deletar pessoa que possui contas associadas.");
        }
        
        pessoaRepository.deleteById(id);
    }
}


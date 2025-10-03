package br.com.desafio.gestaocontas.mapper;

import br.com.desafio.gestaocontas.dto.ContaResponseDTO;
import br.com.desafio.gestaocontas.model.Conta;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring") 
public interface ContaMapper {

    // Mapeia os campos da entidade Conta para ContaResponseDTO (ou o contrário)
    @Mapping(source = "pessoa.idPessoa", target = "idPessoa")
    @Mapping(source = "pessoa.nome", target = "nomePessoa")
    ContaResponseDTO toResponseDTO(Conta conta);
}

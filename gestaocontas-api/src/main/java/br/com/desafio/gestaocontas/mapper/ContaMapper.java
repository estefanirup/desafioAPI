package br.com.desafio.gestaocontas.mapper;

import br.com.desafio.gestaocontas.dto.ContaResponseDTO;
import br.com.desafio.gestaocontas.model.Conta;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring") 
public interface ContaMapper {

    @Mapping(source = "pessoa.idPessoa", target = "idPessoa")
    @Mapping(source = "pessoa.nome", target = "nomePessoa")
    ContaResponseDTO toResponseDTO(Conta conta);
}
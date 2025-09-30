package br.com.desafio.gestaocontas.mapper;

import br.com.desafio.gestaocontas.dto.PessoaRequestDTO;
import br.com.desafio.gestaocontas.dto.PessoaResponseDTO;
import br.com.desafio.gestaocontas.model.Pessoa;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PessoaMapper {

    Pessoa toEntity(PessoaRequestDTO dto);

    PessoaResponseDTO toResponseDTO(Pessoa entity);

    List<PessoaResponseDTO> toResponseDTOList(List<Pessoa> entityList);
}

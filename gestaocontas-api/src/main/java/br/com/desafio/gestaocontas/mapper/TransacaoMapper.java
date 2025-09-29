package br.com.desafio.gestaocontas.mapper;

import br.com.desafio.gestaocontas.dto.TransacaoResponseDTO;
import br.com.desafio.gestaocontas.model.Transacao;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring") 
public interface TransacaoMapper {

    TransacaoResponseDTO toResponseDTO(Transacao transacao);

    List<TransacaoResponseDTO> toResponseDTOList(List<Transacao> transacoes);
}

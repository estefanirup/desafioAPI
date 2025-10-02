package br.com.desafio.gestaocontas.service;

import br.com.desafio.gestaocontas.dto.TransacaoRequestDTO;
import br.com.desafio.gestaocontas.exception.IllegalOperationException;
import br.com.desafio.gestaocontas.model.Conta;
import br.com.desafio.gestaocontas.repository.ContaRepository;
import br.com.desafio.gestaocontas.repository.TransacaoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.never;
import static org.mockito.ArgumentMatchers.any;


// Ativa a integração do JUnit 5 com o Mockito
@ExtendWith(MockitoExtension.class)
class ContaServiceImplTest {


    @Mock
    private ContaRepository contaRepository;

    @Mock
    private TransacaoRepository transacaoRepository;

    @InjectMocks
    private ContaServiceImpl contaService;

    private Conta contaAtiva;

    @BeforeEach
    void setUp() {
        contaAtiva = new Conta();
        contaAtiva.setIdConta(1L);
        contaAtiva.setSaldo(new BigDecimal("50.00"));
        contaAtiva.setFlagAtivo(true);
        contaAtiva.setLimiteSaqueDiario(new BigDecimal("1000.00"));
    }

    @Test
    void sacar_QuandoSaldoInsuficiente_DeveLancarExcecao() {

        when(contaRepository.findById(1L)).thenReturn(Optional.of(contaAtiva));

        TransacaoRequestDTO saqueDto = new TransacaoRequestDTO();
        saqueDto.setValor(new BigDecimal("100.00")); 

        assertThrows(IllegalOperationException.class, () -> {
            contaService.sacar(1L, saqueDto);
        });
        
        verify(contaRepository, never()).save(any(Conta.class));
    }

    @Test
    void sacar_QuandoContaBloqueada_DeveLancarExcecao() {
        contaAtiva.setFlagAtivo(false); 
        when(contaRepository.findById(1L)).thenReturn(Optional.of(contaAtiva));
        TransacaoRequestDTO saqueDto = new TransacaoRequestDTO();
        saqueDto.setValor(new BigDecimal("20.00")); 

        assertThrows(IllegalOperationException.class, () -> {
            contaService.sacar(1L, saqueDto);
        });
    }
}
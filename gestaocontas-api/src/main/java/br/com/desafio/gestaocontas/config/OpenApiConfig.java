package br.com.desafio.gestaocontas.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API de Gestão de Contas Financeiras")
                        .version("v1")
                        .description("API RESTful para o desafio técnico de gestão de contas, " +
                                     "permitindo operações como criação de conta, depósito, saque, consulta de saldo e extrato.")
                        .license(new License().name("Apache 2.0").url("http://springdoc.org")));
    }
}

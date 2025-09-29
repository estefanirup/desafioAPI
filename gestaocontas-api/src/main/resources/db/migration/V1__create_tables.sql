/*
CREATE DATABASE db_gestao_contas;
GO


USE db_gestao_contas;
GO*/



CREATE TABLE tb_pessoa ( 
    idPessoa BIGINT IDENTITY(1,1) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    dataNascimento DATE NOT NULL
);
GO

CREATE TABLE tb_conta (
    idConta BIGINT IDENTITY(1,1) PRIMARY KEY,
    idPessoa BIGINT NOT NULL,
    saldo DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
    limiteSaqueDiario DECIMAL(18, 2) NOT NULL DEFAULT 1000.00,
    flagAtivo BIT NOT NULL DEFAULT 1,
    tipoConta INT NOT NULL,
    dataCriacao DATETIMEOFFSET NOT NULL DEFAULT GETUTCDATE(),
    
    CONSTRAINT FK_Contas_Pessoas FOREIGN KEY (idPessoa) REFERENCES tb_pessoa(idPessoa),
    CONSTRAINT CHK_SaldoNaoNegativo CHECK (saldo >= 0)
);
GO

CREATE TABLE tb_transacao ( 
    idTransacao BIGINT IDENTITY(1,1) PRIMARY KEY,
    idConta BIGINT NOT NULL,
    valor DECIMAL(18, 2) NOT NULL,
    dataTransacao DATETIMEOFFSET NOT NULL DEFAULT GETUTCDATE(),
    
    CONSTRAINT FK_Transacoes_Contas FOREIGN KEY (idConta) REFERENCES tb_conta(idConta) 
);
GO



INSERT INTO tb_pessoa (nome, cpf, dataNascimento) 
VALUES ('João da Silva', '12345678901', '1990-05-15');
GO

PRINT 'Tabelas e dados iniciais criados com sucesso!';

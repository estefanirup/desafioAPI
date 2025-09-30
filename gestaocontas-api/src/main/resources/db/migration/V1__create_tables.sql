/*
CREATE DATABASE db_gestao_contas;
GO
*/

USE db_gestao_contas;
GO


CREATE TABLE tb_pessoa ( 
    id_pessoa BIGINT IDENTITY(1,1) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL
);
GO

CREATE TABLE tb_conta (
    id_conta BIGINT IDENTITY(1,1) PRIMARY KEY,
    id_pessoa BIGINT NOT NULL,
    saldo DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
    limite_saque_diario DECIMAL(18, 2) NOT NULL DEFAULT 1000.00,
    flag_ativo BIT NOT NULL DEFAULT 1,
    tipo_conta INT NOT NULL,
    data_criacao DATETIMEOFFSET NOT NULL DEFAULT GETUTCDATE(),
    
    CONSTRAINT FK_Contas_Pessoas FOREIGN KEY (id_pessoa) REFERENCES tb_pessoa(id_pessoa),
    CONSTRAINT CHK_SaldoNaoNegativo CHECK (saldo >= 0)
);
GO

CREATE TABLE tb_transacao ( 
    id_transacao BIGINT IDENTITY(1,1) PRIMARY KEY,
    id_conta BIGINT NOT NULL,
    valor DECIMAL(18, 2) NOT NULL,
    data_transacao DATETIMEOFFSET NOT NULL DEFAULT GETUTCDATE(),
    
    CONSTRAINT FK_Transacoes_Contas FOREIGN KEY (id_conta) REFERENCES tb_conta(id_conta) 
);
GO

/*
DELETE FROM tb_transacao;
DELETE FROM tb_conta;
DELETE FROM tb_pessoa;
*/


INSERT INTO tb_pessoa (nome, cpf, data_nascimento) 
VALUES ('João da Silva', '12345678901', '1990-05-15');
GO

PRINT 'Tabelas e dados iniciais criados com sucesso!';
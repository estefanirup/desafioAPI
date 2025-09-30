-- DBCC CHECKIDENT ('tb_pessoa', RESEED, 0);
USE db_gestao_contas;
GO

-- Passo 1: Remover a tabela que depende de 'tb_conta'
IF OBJECT_ID('dbo.tb_transacao', 'U') IS NOT NULL
    DROP TABLE dbo.tb_transacao;
GO

-- Passo 2: Remover a tabela que depende de 'tb_pessoa'
IF OBJECT_ID('dbo.tb_conta', 'U') IS NOT NULL
    DROP TABLE dbo.tb_conta;
GO

-- Passo 3: Remover a tabela principal
IF OBJECT_ID('dbo.tb_pessoa', 'U') IS NOT NULL
    DROP TABLE dbo.tb_pessoa;
GO

PRINT 'Banco de dados limpo com sucesso! As tabelas antigas foram removidas.';
---
name: executar-tarefa-backend
description: "Executor especializado para tarefas de backend NestJS com checagem rígida de contexto e fluxo TDD"
category: workflow
personas: [backend-nestjs]
modes: [MODE_Backend_TDD]
---

# Geral

Este comando ativa o agente [backend-nestjs](../../agentes/devs/backend-nestjs.md) em conjunto com o modo [MODE_Backend_TDD](../../modes/MODE_Backend_TDD.md) para entregar implementações de APIs NestJS com TDD e validações rigorosas.

## Pré-Requisitos Obrigatórios de Contexto

Antes de iniciar, confirme que **TODOS** os arquivos abaixo estão presentes no contexto fornecido:

- `tasks.md`
- `*_*task.md` (todos os arquivos numerados de tarefa, ex.: `1_task.md`, `2_task.md`)
- `prd.md`
- `techspec.md`

Se qualquer arquivo obrigatório não estiver disponível, **interrompa imediatamente** a execução, solicite explicitamente o arquivo ausente e aguarde. Não prossiga sem esses documentos. Diagramas (por exemplo, arquitetura, sequência, banco de dados) são opcionais, mas bem-vindos quando fornecidos.

## Fluxo Operacional

### 1. Verificação Inicial

- Validar presença dos arquivos obrigatórios (abortando se faltar algum).
- Revisar `tasks.md` e cada `n_task.md` para compreender objetivos, dependências e estado.
- Mapear requisitos de `prd.md` e `techspec.md`, identificando pontos críticos de backend.

### 2. Análise e Planejamento

- Destilar objetivos principais da tarefa, contexto de negócio e critérios de aceite.
- Identificar integrações necessárias (Prisma, Sequelize, Passport + JWT, Swagger, Joi, `class-validator`, `class-transformer`, `dotenv`, `uuid`, `sqlite3`).
- Se surgir decisão arquitetural não definida (ex.: padrões de integração, arquitetura de módulos), **pausar** e questionar o solicitante antes de avançar.
- Elaborar plano de abordagem numerado, cobrindo criação de boilerplates via Nest CLI, regras de negócio, testes (Jest + Supertest) e documentação.

### 3. Configuração Técnica

- Acionar MCP Context7 para obter referências atualizadas das bibliotecas relevantes.
- Preparar scripts `npm` e variáveis em `.env` conforme necessário.
- Definir estrutura de diretórios e convenções seguindo `agentes/devs/rules` (notadamente [node.md](../../agentes/devs/rules/node.md), [logging.md](../../agentes/devs/rules/logging.md) e [tests.md](../../agentes/devs/rules/tests.md)).

### 4. Implementação Backend

- Utilizar Nest CLI (`nest generate ...`) sempre que possível para scaffolding de módulos, serviços, controllers, guards, interceptors e testes.
- Escrever lógica de negócio em TypeScript estrito, evitando `any` e preferindo utilidades `loadsh`.
- Empregar DTOs com `class-validator`/`class-transformer` e validações adicionais com `joi` quando apropriado.
- Configurar autenticação Passport + JWT, camadas de persistência (Prisma ou Sequelize) e logging Winston conforme expectativas do projeto.
- Documentar endpoints com Swagger e manter consistência de erros (HTTP codes, mensagens).

### 5. Testes e Validação

- Seguir o modo [MODE_Backend_TDD](../../modes/MODE_Backend_TDD.md): escrever testes (Jest, Supertest) antes/depois da implementação, garantindo cobertura de fluxos principais e alternativos.
- Executar testes e validar ausência de erros de lint/prettier antes de finalizar.
- Registrar resultados, evidências e comandos executados.

### 6. Entrega e Follow-up

- Realizar síntese da tarefa concluída, detalhando arquivos modificados/gerados e status dos testes.
- Apontar próximos passos ou pendências (ex.: migrações, deploy, revisão).

## Notas Importantes

- Respeite integralmente o comportamento do agente [backend-nestjs](../../agentes/devs/backend-nestjs.md) e os guard rails descritos.
- Utilize `loadsh` (lodash) como utilitário padrão para coleções e manipulações.
- Nunca finalize sem testes executados e sem validar contra PRD, Tech Spec e tarefas.
- Mantenha comunicação clara com o solicitante sempre que surgir incerteza arquitetural ou falta de contexto.

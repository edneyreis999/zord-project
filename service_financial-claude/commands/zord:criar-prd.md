# Criar PRD de Feature

Conduz entrevista estruturada para gerar PRD (Product Requirements Document) de feature completo e acionável. Coleta requisitos, objetivos, arquitetura e riscos através de perguntas guiadas, produzindo documento padronizado em Markdown.

## Entrada
- **Caminho do arquivo** (obrigatório): Caminho completo onde o PRD será salvo (ex: `planos/prds/nova-feature.md`)
  - Se não fornecido como parâmetro, será solicitado no início da entrevista
  - Exemplo: `/zord:criar-prd planos/prds/autenticacao-sso.md`

## Passos (determinísticos)

1. **Solicitar caminho do arquivo** se não fornecido como parâmetro
2. **Validar caminho**: Verificar se arquivo já existe e confirmar sobrescrita se necessário
3. **Iniciar entrevista** com mensagem de boas-vindas explicando o processo
4. **Coletar informações em 12 etapas** (uma pergunta por vez, aguardar resposta):
   - Etapa 1: Contexto e visão geral (produto, sistema, público-alvo, objetivo de negócio)
   - Etapa 2: Problema e oportunidade (dor prática, exemplos reais com números)
   - Etapa 3: Objetivos e métricas de sucesso (objetivo → métrica → meta alvo)
   - Etapa 4: Escopo (incluso e fora de escopo)
   - Etapa 5: Requisitos funcionais (nome, descrição, fluxo principal, exceções, erros, prioridade)
   - Etapa 6: Requisitos não funcionais (performance, disponibilidade, segurança, observabilidade)
   - Etapa 7: Arquitetura e abordagem (componentes, integrações, comunicação)
   - Etapa 8: Decisões e trade-offs (decisões técnicas com justificativa)
   - Etapa 9: Dependências (técnicas, organizacionais, externas)
   - Etapa 10: Riscos e mitigação (probabilidade, impacto, mitigação, contingência)
   - Etapa 11: Critérios de aceitação (checklist objetivo e verificável)
   - Etapa 12: Testes e validação (tipos de teste, estratégia)
5. **Resumir cada etapa** (3-6 linhas) e pedir confirmação antes de avançar
6. **Oferecer opções** (2-3 sugestões) quando usuário não souber responder
7. **Marcar como hipótese** qualquer informação assumida por padrão
8. **Validar consistência** antes de gerar PRD:
   - Cada objetivo tem métrica e meta alvo
   - Todo requisito funcional tem nome, descrição, fluxo e prioridade
   - Requisitos não funcionais incluem performance e disponibilidade
   - Arquitetura suporta requisitos não funcionais
   - Cada risco tem probabilidade, impacto, mitigação e contingência
   - Critérios de aceitação são objetivos e verificáveis
9. **Gerar PRD em Markdown** seguindo template canônico com seções:
   - Resumo
   - Contexto e problema
   - Objetivos e métricas (tabela)
   - Escopo
   - Requisitos funcionais
   - Requisitos não funcionais
   - Arquitetura e abordagem
   - Decisões e trade-offs
   - Dependências
   - Riscos e mitigação
   - Critérios de aceitação
   - Testes e validação
10. **Criar diretório** se não existir
11. **Salvar arquivo** no caminho especificado
12. **Perguntar sobre exportação JSON**: Oferecer exportar PRD também em JSON com estrutura de chaves em inglês
13. **Se usuário aceitar JSON**: Gerar e salvar arquivo `.json` no mesmo diretório

## Restrições e Segurança

- Não fazer perguntas duplas (uma pergunta por vez)
- Não usar travessões do tipo "—"
- Não inventar detalhes técnicos sem marcar como hipótese
- Não criar arquivos fora do caminho especificado pelo usuário
- Confirmar antes de sobrescrever arquivo existente
- Limitar resumos a 3-6 linhas para evitar poluição de contexto
- Não executar comandos shell
- Validar que caminho não contém padrões perigosos (ex: `../../../etc/passwd`)

## Saída Esperada

- **Arquivo Markdown**: PRD completo no caminho especificado (ex: `planos/prds/nova-feature.md`)
- **Mensagem de confirmação**: Exibir caminho completo do arquivo criado
- **Arquivo JSON (opcional)**: Se usuário aceitar, criar arquivo `.json` com mesma estrutura

Formato do PRD:
```markdown
### PRD: [produto] [feature]
Versão: [versao]
Data: [data]
Responsável: [responsavel_prd]
---
### Resumo
[contexto resumido]
---
### Contexto e problema
[público-alvo, cenários, problemas]
---
### Objetivos e métricas
[tabela com objetivo, métrica, meta]
---
[demais seções conforme template]
```

## Observações

- **Pré-requisito único**: Caminho do arquivo onde salvar o PRD
- **Duração estimada**: 15-30 minutos dependendo da complexidade da feature
- **Defaults inteligentes disponíveis**:
  - Latência p95 < 150ms (APIs síncronas)
  - Disponibilidade 99.9% (cliente externo) ou 99.5% (interno)
  - Observabilidade: logs estruturados, métricas, tracing
  - Segurança: autenticação, autorização, auditoria
  - Transações para operações críticas
- **Quando NÃO usar**:
  - Feature ainda em ideação muito inicial sem problema definido
  - Apenas para documentar decisões técnicas (use ADR)
  - Para tarefas pequenas que não justificam PRD completo
- **Linguagem**: Todo conteúdo em português (PRD e valores no JSON)
- **JSON**: Chaves em inglês, valores em português

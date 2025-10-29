# Invocador do Criador de PRD — Orquestração e Configuração

Assuma a orquestração do agente definido em [criador-prd.md](../../agentes/devs/criador-prd.md).
Objetivo: coletar insumos, alinhar objetivos, solicitar a criação do PRD no formato do template e salvar o resultado em caminho padronizado.

## Parâmetros da sessão (invocador)

- `inputs` (mínimos):
  - `projectRoot`: caminho absoluto do projeto que invoca (ex.: `/Users/edney/projects/pocs/pingos`). NUNCA salvar dentro de `zord-project`.
  - `nomeFuncionalidade`: nome curto para o PRD (será usado no slug).
  - `objetivos`: 3–6 bullets mensuráveis (KPIs/resultados de negócio).
  - `usuarios`: perfis/personas afetadas e principais fluxos.
  - `stakeholders`: donos, aprovadores e consultados (RACI, opcional).
  - `restricoes`: técnicas/negócio/legais e dependências conhecidas.
  - `naoObjetivos`: itens explicitamente fora de escopo.
  - `fontes`: paths e/ou trechos de referência (opcional, recomendado).
  - `context`: string/enum para ativar nuances da persona (opcional).
- `outputs`:
  - `resultPath`: `<projectRoot>/planos/prds/<slug>/prd.md`.
  - `logPath` (opcional): `<projectRoot>/sessoes/prd/<slug>-log.md`.
- `knowledgeBase` (padrão):
  - [prd-template.md](../../templates/prd-template.md) + quaisquer `fontes` fornecidas.
- `policies`:
  - Linguagem PT‑BR; seguir exatamente o formato do template.
  - Naming: `<slug>` em kebab-case derivado de `nomeFuncionalidade`.
  - Salvar sempre em `resultPath` no projeto chamador. Histórico via Git (sem versões `vN`).
  - Proibido salvar dentro de `zord-project`.
  - Exibir sumário + caminho salvo ao final.
- `limits` (overrides ao padrão da persona):
  - `maxPerguntasEsclarecimento`: 3–8.
  - `tamanhoDocumento`: ~1000–1500 palavras.

Regras de precedência: o que não for informado usa defaults da persona;

### Resolução do diretório do projeto chamador

- Preferir `inputs.projectRoot` explícito.
- Caso não informado, inferir pela sessão/ambiente (ex.: arquivo `*.code-workspace` aberto que contenha `zord-project` e o projeto alvo).  
  - Exemplo: `/Users/edney/projects/pocs/pingos/pingos.code-workspace` com pastas `pingos` e `zord-project` → usar `/Users/edney/projects/pocs/pingos` como `projectRoot`.
- Se persistir ambiguidade, perguntar ao usuário pelo caminho do projeto e não salvar até confirmar.

## Sequência mínima de alinhamento (uma por vez, só se faltar)

1) Nome da funcionalidade + objetivos mensuráveis.  
2) Usuários/personas, principais fluxos e restrições.  
3) Não‑objetivos (fora de escopo) e stakeholders.  
4) Fontes/links/arquivos relevantes.  

Se faltar clareza após isso, fazer perguntas objetivas até `maxPerguntasEsclarecimento`.

## Passos de orquestração

1) Validar/descobrir `projectRoot` (explícito ou inferido). Confirmar com o usuário se houver dúvida.  
2) Preparar briefing: sintetizar `inputs` + `knowledgeBase` em 6–10 bullets objetivos para a persona.  
3) Invocar [criador-prd.md](../../agentes/devs/criador-prd.md) com o briefing e as `policies/limits` ativas.  
4) Receber o PRD em Markdown (conforme [prd-template.md](../../templates/prd-template.md)).  
5) Salvamento: criar diretório `<projectRoot>/planos/prds/<slug>/` e salvar como `<projectRoot>/planos/prds/<slug>/prd.md`.  
6) Exibir caminho salvo e resumo das decisões; registrar no `logPath` se configurado.  
7) Iteração (opcional): aplicar ajustes pontuais solicitados e re‑salvar em `resultPath` (sem versões `vN`).

## Saída padrão (contrato com a persona)

- O PRD deve seguir exatamente a estrutura de `templates/prd-template.md`.
- Conteúdo com foco em O QUÊ e POR QUÊ; sem decisões de implementação.
- Requisitos funcionais numerados; premissas, riscos e questões em aberto listados.

## Comandos aceitos (atajos)

- `Aprovar` — aceita o conteúdo atual e mantém o arquivo salvo.  
- `Ajustar <secao|item>` — reescreve somente a seção/parte indicada e re‑salva.  
- `Fornecer arquivo:<path>` — adiciona arquivo como fonte; reinvocar com o novo contexto.  
- `Refazer` — reinicia a partir da sequência mínima de alinhamento.  

## Quickstart

Envie em uma única mensagem:  
`ProjectRoot:` caminho absoluto  |  `Funcionalidade:` nome curto  |  `Objetivos:` 3–6 bullets  |  `Usuários:` personas/fluxos  |  `Restrições:` tech/negócio  |  `Não‑objetivos:` fora de escopo  |  `Fontes:` paths/links.  

O invocador criará o briefing, gerará o PRD via `agentes/devs/criador-prd.md`, salvará em `<projectRoot>/planos/prds/<slug>/prd.md` e retornará o caminho e o sumário.

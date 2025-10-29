# Invocador do Criador de Tech Spec — Orquestração e Configuração

Assuma a orquestração do agente definido em [criador-techspec.md](../../agentes/devs/criador-techspec.md).
Objetivo: coletar insumos técnicos, alinhar pré‑condições, solicitar a criação da Especificação Técnica no formato do template e salvar o resultado em caminho padronizado do projeto chamador.

## Parâmetros da sessão (invocador)

- `inputs` (mínimos):
  - `projectRoot`: caminho absoluto do projeto que invoca (ex.: `/Users/edney/projects/pocs/pingos`). NUNCA salvar dentro de `zord-project`.
  - `prd.md`: O arquivo PRD no qual a tech spec deve se basear. Arquivo deve ser fornecido ao chamar esse invocador. Ele sempre estará localizado no `sprojectRoot`.
  - `nomeFuncionalidade`: nome curto/slug herdado do PRD aprovado (será usado no `<slug>`).
- `outputs`:
  - `resultPath`: `<projectRoot>/planos/techspecs/<slug>/techspec.md`.
- `knowledgeBase` (padrão):
  - [techspec-template.md](../../templates/techspec-template.md), o `techSpecPath` informado e quaisquer `fontes` fornecidas.
- `policies`:
  - Linguagem PT‑BR; seguir exatamente o formato do template.
  - Naming: `<slug>` em kebab-case derivado de `nomeFuncionalidade` (herdado da Tech Spec).
  - Salvar sempre em `resultPath` no projeto chamador. Histórico via Git (sem versões `vN`).
  - Proibido salvar dentro de `zord-project`.
  - Exibir sumário + caminho salvo ao final.
- `limits` (overrides ao padrão da persona):
  - `maxPerguntasTecnicas`: 3–8.
  - `tamanhoDocumento`: ~1500–2500 palavras.

Regras de precedência: o que não for informado usa defaults da persona.

### Resolução do diretório do projeto chamador

- Preferir `inputs.projectRoot` explícito.
- Caso não informado, inferir pela sessão/ambiente (ex.: arquivo `*.code-workspace` aberto que contenha `zord-project` e o projeto alvo).  
  - Exemplo: `/Users/edney/projects/pocs/pingos/pingos.code-workspace` com pastas `pingos` e `zord-project` → usar `/Users/edney/projects/pocs/pingos` como `projectRoot`.
- Se persistir ambiguidade, perguntar ao usuário pelo caminho do projeto e não salvar até confirmar.

## Sequência mínima de alinhamento (uma por vez, só se faltar)

1) `techSpecPath` válido + `nomeFuncionalidade`/`slug`.  
2) Restrições e dependências técnicas conhecidas.  
3) Objetivos técnicos/SLOs e prioridades.  
4) Fontes/links/arquivos relevantes.  

Se faltar clareza após isso, fazer perguntas objetivas até `maxPerguntasTecnicas`.

## Passos de orquestração

1) Validar/descobrir `projectRoot` e verificar existência de `techSpecPath`. Confirmar com o usuário se houver dúvida.  
2) Preparar briefing técnico: sintetizar `inputs` + `knowledgeBase` em 6–12 bullets objetivos para a persona.  
3) Invocar [criador-techspec.md](../../agentes/devs/criador-techspec.md) com o briefing.  
4) Receber a Tech Spec em Markdown (conforme [techspec-template.md](../../templates/techspec-template.md)).  
5) Salvamento: criar diretório `<projectRoot>/planos/techspecs/<slug>/` e salvar como `<projectRoot>/planos/techspecs/<slug>/techspec.md`.  
6) Exibir caminho salvo e resumo das decisões;
7) Iteração (opcional): aplicar ajustes pontuais solicitados e re‑salvar em `resultPath` (sem versões `vN`).

## Saída padrão (contrato com a persona)

- A Tech Spec deve seguir exatamente a estrutura de [techspec-template.md](../../templates/techspec-template.md).
- Conteúdo com foco no COMO implementar; não repetir o PRD (O QUÊ/POR QUÊ).
- Cobrir arquitetura, componentes, interfaces/contratos, dados/modelos, integrações, riscos, estratégia de testes e observabilidade.

## Comandos aceitos (atajos)

- `Aprovar` — aceita o conteúdo atual e mantém o arquivo salvo.  
- `Ajustar <secao|item>` — reescreve somente a seção/parte indicada e re‑salva.  
- `Fornecer arquivo:<path>` — adiciona arquivo como fonte; reinvocar com o novo contexto.  
- `Refazer` — reinicia a partir da sequência mínima de alinhamento.  

## Quickstart

Envie em uma única mensagem:  
`ProjectRoot:` caminho absoluto  |  `PRD:` `<projectRoot>/planos/prds/<slug>/prd.md`  |  `Funcionalidade:` nome curto  |  `Objetivos técnicos:` bullets  |  `Restrições técnicas:` bullets  |  `Fontes:` paths/links.  

O invocador criará o briefing técnico, gerará a Tech Spec via `agentes/devs/criador-techspec.md`, salvará em `<projectRoot>/planos/techspecs/<slug>/techspec.md` e retornará o caminho e o sumário.

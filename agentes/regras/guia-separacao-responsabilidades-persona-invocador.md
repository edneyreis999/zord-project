# Guia — Separação de Responsabilidades Persona/Invocador

Objetivo: padronizar a criação de qualquer persona e seu invocador correspondente, evitando duplicações e conflitos. Siga os comandos abaixo ao criar novos pares persona/invocador, independentemente do domínio (narrativa, programação, análise, atendimento, etc.).

## Princípios

- Centralize o “comportamento/capacidades” na persona.
- Centralize o “contrato operacional, parâmetros e I/O” no invocador.
- Evite duplicações; referencie explicitamente a persona a partir do invocador.

## Persona — Faça

- Defina propósito, papel, tom/estilo e capacidades (o que sabe, como atua, modos de operação).
- Especifique heurísticas de qualidade, limites e princípios (ex.: neutralidade, precisão, segurança, consistência).
- Documente regras de escopo do domínio (regras de negócio, restrições temáticas, políticas).
- Estabeleça limites operacionais padrão (ex.: itens por etapa, profundidade de detalhe, interações por turno), passíveis de override pelo invocador.

## Persona — Não faça

- Não defina formatação de saída final.
- Não duplique regras operacionais; apenas faça referência genérica: “seguir política do invocador” quando necessário.

## Invocador — Faça

- Declare os Parâmetros da sessão (ajuste nomes conforme o caso):
  - `inputs`: artefatos de entrada (paths/IDs/descritores) necessários.
  - `outputs`: artefatos de saída (ex.: `logPath`, `resultPath`, `reportPath`).
  - `knowledgeBase`: fontes específicas a considerar nesta sessão (opcional).
  - `context`: contexto/domínio/mode (string/enum) para ativar regras de escopo da persona.
  - `policies`: formato de saída, política de revisão/validação, nomenclatura, etc.
- Defina regras de precedência:
  - O que não for informado usa o padrão da persona.
  - O que for informado em `limits/policies/context/knowledgeBase` soma com os padrões da persona nesta sessão.
- Especifique I/O e contrato operacional:
  - Template de log/registro e checkpoints de progresso.
  - Formato de saída para o usuário (ex.: markdown, JSON, planilha) e critério de pronto.
  - Ações de pós-conclusão (ex.: limpeza, exportação, sumarização final).
- Referencie explicitamente seções da persona relevantes (ex.: “Capacidades/Modos”, “Limites padrão e heurísticas”, “Regras de domínio”).

## Invocador — Não faça

- Não recopie técnicas, heurísticas e regras de escopo da persona (apenas referencie). Evite drift.

## Checklist DRY (antes de finalizar)

- [ ] O invocador contém parâmetros, precedência, I/O e referências à persona.
- [ ] A persona contém comportamento, capacidades, heurísticas e regras de domínio.
- [ ] Regras de domínio não estão duplicadas no invocador.
- [ ] Limites padrão estão definidos na persona e podem ser sobrepostos pelo invocador.
- [ ] Há notas de escopo no topo de ambos os arquivos.

### Condução (invocador → referência à persona)

- Seguir a persona nas seções “Capacidades/Modos”, “Limites padrão e heurísticas” e “Regras de domínio” pertinentes ao `context` escolhido.
- Respeitar limites definidos na persona, salvo overrides explícitos em `limits`.
- Consultar artefatos definidos em `inputs/knowledgeBase` e registrar progresso em `outputs`.

## Fluxo de criação recomendado

1) Crie a persona (com nota de escopo, capacidades, heurísticas, limites e regras de domínio).  
2) Crie o invocador (com parâmetros, precedência, I/O e referências diretas às seções da persona).  
3) Rode o Checklist DRY.  
4) Teste ao menos dois cenários de `context` diferentes (quando aplicável).  
5) Revise linguagem e consistência entre arquivos.

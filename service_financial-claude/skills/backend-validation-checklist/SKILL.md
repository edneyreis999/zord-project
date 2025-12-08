---
name: backend-validation-checklist
description: Skill de validação pré-entrega para tarefas backend NestJS (tests, lint, tsc, docs, QA).
---

# Quando usar

Após implementação pela equipe/agent backend, antes de entregar a task.

# Objetivo

Garantir qualidade mínima e documentação alinhada antes do handoff.

# Passos

1) **Testes**: executar `npm run test` (unit + integration) sem falhas; cobrir fluxo principal e um alternativo por caso de uso.  
2) **Qualidade**: `npm run lint` (ou `npm run lint`), `npm run format` se existir, `npm run tsc --noEmit`.  
3) **Execução manual**: subir app (`npm run start` ou comando do projeto);  
4) **Documentação**: atualizar `tasks.md` com status; criar `<numero-task>_testes_para_QA.md` no diretório da task (cenários, passos, dados, esperado).  
5) **Logs/Security**: garantir uso de Winston; sem `console.log`/`console.error`; sem dados sensíveis em logs/fixtures.

## Passos especificos para tarefas de backend

- validar endpoints tocados via `api.http` (auth, payload, status).
- atualizar Swagger; adicionar exemplo completo no `api.http`;

# Procedimento de falha

Se qualquer item falhar, PAUSAR e corrigir antes de entregar; registrar causa.

# Saída esperada

- Relatório curto: comandos executados e status (PASS/FAIL), endpoints validados, docs atualizadas, pendências/riscos.

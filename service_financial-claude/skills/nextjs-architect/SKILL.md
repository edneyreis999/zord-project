---
name: nextjs-architect
description: Skill modular para arquitetar e revisar apps Next.js 15/React 19 com abordagem server-first, feature-first, shadcn/ui e Tailwind semântico.
version: 2025-12-06
---

# Nextjs Architect — Modular

Esta skill segue o modelo de modularização da `nestjs-architect`: conteúdo dividido em seções versionadas, checklist e referência rápida.

## Como usar

1) Leia `sections/activation.md` para confirmar gatilhos, persona e formato de saída.  
2) Aplique as seções relevantes (arquitetura, dados/estado/cache, UI/Tailwind, formulários, segurança, performance/DX, anti-patterns) conforme o problema.  
3) Formate a resposta com título curto + bullets por área + caminhos em backticks + blocos `ts/tsx` quando houver código.  
4) Valide com `checklists/quality.md`; rejeite itens listados em `sections/anti-patterns.md`.  
5) Use `SKILL-QUICK-REF.md` para um guia de bolso e `README.md` para visão geral.

## Estrutura

```
.claude/skills/nextjs-architect/
├─ SKILL.md                # instruções de orquestração (este arquivo)
├─ README.md               # visão geral e quando ativar
├─ SKILL-QUICK-REF.md      # gatilhos e árvore base
├─ sections.yaml           # índice das seções
├─ sections/               # conteúdo modular
└─ checklists/quality.md   # checklist final de entrega
```

## Manutenção

- Revisar quando houver releases relevantes de Next.js/shadcn/Tailwind ou novas políticas internas.  
- Registrar gaps encontrados em uso real.

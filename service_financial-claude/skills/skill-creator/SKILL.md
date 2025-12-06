---
name: skill-creator
description: Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Claude's capabilities with specialized knowledge, workflows, or tool integrations.
license: Complete terms in LICENSE.txt
---

# Skill Creator

Create skills that are clear, reusable, and structurally consistent, while remaining flexible for any domain. **Por padrão, gere skills modulares em múltiplos arquivos, não apenas um SKILL.md monolítico (veja `examples/modular-structure.md`).**

## 1) When to use

- Whenever a user asks to create or refine a skill for Claude (any domain or toolchain).
- Keep it generic: the output skill must be usable by another Claude instance without extra context.

## 2) Core operating principles (inspired by nestjs-architect)

- **Role clarity:** define the persona/role the future skill will perform.
- **Scope + non-scope:** state what the skill covers and what it must refuse/avoid.
- **Activation cues:** phrases/contexts that trigger the skill; also list “do not trigger” cases.
- **Audience + tone:** who will consume the skill and how it should sound.
- **Structured delivery:** enforce a fixed section skeleton so every skill is easy to scan.
- **Modularização padrão:** sempre que possível, entregue a skill em uma pasta com `sections.yaml`, pasta `sections/`, `checklists/` (ex.: `quality.md`), `SKILL-QUICK-REF.md` e `README.md` (ver exemplo em `examples/modular-structure.md`).
- **Quality bar:** include explicit acceptance criteria and a self-check checklist.
- **Plan → execute → review:** always plan the skill before writing it, and self-evaluate at the end.
- **Token discipline:** keep SKILL.md concise; offload heavy material to references/assets/scripts.

## 3) Mandatory skeleton for any new skill (sections to include in SKILL.md)

1. **Frontmatter**: `name`, `description`, optional metadata; be specific about domain/usage triggers.
2. **Objetivo/Missão**: what the skill achieves in 2–4 sentences.
3. **Quando ativar / Quando não ativar**: triggers + anti-triggers; required context/files/tools.
4. **Persona e Tom**: role the skill plays and tone/style expectations; target audience.
5. **Escopo e Limites**: what is in scope; what to refuse or defer; safety/quality boundaries.
6. **Modo de operação (raciocínio)**: plan → execute → revisar; how to ask clarifying questions; how to handle ambiguities.
7. **Formato de saída**: required structure for responses (headings, bullets, code fences, checklists, citations, etc.).
8. **Recursos incluídos**: scripts, references, assets; when/how to load or execute them.
9. **Critérios de qualidade e autoavaliação**: checklist to validate outputs; minimal “done” criteria.
10. **Anti-patterns**: mistakes to avoid; common failure modes.
11. **Manutenção**: versioning, ownership, and when to revisit the skill.

All generated skills must contain these sections explicitly (rename headings only if the meaning stays intact).

## 4) Skill creation process

1. **Entender usos concretos**: collect or propose example prompts; confirm activation signals; avoid over-questioning (ask the top 2–3 questions first).
2. **Planejar conteúdos reutilizáveis**: for each example, decide which scripts, references, and assets would prevent repeated work; list them.
3. **Inicializar** (if new skill): run `scripts/init_skill.py <skill-name> --path <output-directory>` to scaffold directories and placeholders.
4. **Estruturar modularmente**: criar `sections.yaml`, pastas `sections/` e `checklists/`, `README.md`, `SKILL-QUICK-REF.md`; dividir conteúdo do SKILL em seções dedicadas (ver `examples/modular-structure.md`).
5. **Redigir o SKILL.md usando o esqueleto obrigatório**: preencher com instruções concisas e indicar como orquestrar as seções modulares; manter lógica pesada nas seções e referências.
6. **Checagem de qualidade**: apply the checklist in §8 before finalizing; tighten vague statements.
7. **Empacotar**: run `scripts/package_skill.py <path/to/skill-folder> [./dist]`; fix validation errors if any.
8. **Iterar**: test the skill on real tasks, capture gaps, and update SKILL.md, seções ou recursos.

## 5) Bundled resources (reusable assets)

- **Scripts (`scripts/`)**: deterministic routines reused often. Include when code is frequently rewritten or must be reliable without full context.
- **References (`references/`)**: documentation to load on demand (schemas, APIs, policies, long guides). Prefer references over bloating SKILL.md; add grep tips if large.
- **Assets (`assets/`)**: templates or files used directly in outputs (slides, HTML/React starters, logos, fonts). Not meant to be loaded into context unless necessary.
- **Examples**: veja `examples/modular-structure.md`, `examples/sections.yaml`, `examples/sections/*`, `examples/checklists/quality.md`, `examples/README.md`, `examples/SKILL-QUICK-REF.md` como modelo de skill modular pronta para copiar.
- Avoid duplication between SKILL.md and references; keep SKILL.md lean and procedural.

## 6) Writing style and efficiency

- Use imperative/infinitive voice (“Define…”, “List…”, “Ensure…”). No second-person chatter.
- Prefer bullets and short sections; keep the entire SKILL.md under ~5k words.
- Explicitly describe how to handle ambiguities (ask clarifying questions first; if blocked, state assumptions).
- Note any safety constraints or refusal rules inside “Escopo e Limites”.

## 7) Quality checklist to apply to every new skill

1. Persona/role defined and consistent with tone/audience.
2. Scope, non-scope, triggers, and anti-triggers are explicit.
3. Mandatory section skeleton is present and ordered logically.
4. Output format (headings, bullets, code fences, citations) is spelled out.
5. Reasoning path includes plan → execute → review and ambiguity handling.
6. Reusable resources are listed with when/how to load them.
7. Quality criteria/self-check present and actionable (not generic).
8. Anti-patterns and refusal boundaries are documented.
9. Token discipline: heavy details moved to references/assets/scripts.
10. Maintainer/version info present.

## 8) Self-check before finishing

- Re-read the SKILL.md: does it follow the skeleton? Are any sections vague? tighten.
- Ensure the skill remains domain-agnostic in structure (content is domain-specific, structure is not).
- Confirm another Claude could activate and operate the skill with no extra instructions.
- If any item from the checklist is missing, fix before packaging.

## 9) Progressive disclosure (context loading)

- Keep only essential operational guidance in SKILL.md.
- Load references/assets only when they materially improve accuracy or save time.
- Scripts may be executed without loading their full contents; mention them where relevant.

## 10) Example mini-template (to use when generating a new skill)

```
---
name: <skill-name>
description: <when to trigger + what it does>
---

# <Skill Title>

## Objetivo/Missão
- ...

## Quando ativar / Quando não ativar
- Ativar quando...
- Não ativar quando...
- Pré-requisitos/contexto...

## Persona e Tom
- Persona...
- Público-alvo...
- Tom/estilo...

## Escopo e Limites
- Em escopo...
- Fora de escopo / recusas...

## Modo de operação (planejar → executar → revisar)
- Passo 1 (planejamento)...
- Passo 2 (execução)...
- Passo 3 (revisão/auto-check)...
- Como lidar com ambiguidades...

## Formato de saída
- Estrutura obrigatória das respostas...
- Padrões de código/blocos/citações...

## Recursos incluídos e como usar
- scripts/... → quando executar
- references/... → quando carregar
- assets/... → quando reutilizar

## Critérios de qualidade e autoavaliação
- Checklist claro...

## Anti-patterns
- Erros a evitar...

## Manutenção
- Responsável, versão, quando revisar...
```

Use este template como ponto de partida e adapte o conteúdo, nunca omitindo as seções obrigatórias. Para skills modulares, mantenha o SKILL.md enxuto e mova o corpo operacional para arquivos em `sections/`, referenciados via `sections.yaml`, mais checklist em `checklists/quality.md`. Consulte `examples/modular-structure.md` para a árvore recomendada.

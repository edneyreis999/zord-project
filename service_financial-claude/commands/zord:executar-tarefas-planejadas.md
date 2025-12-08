# zord:executar-tarefas-planejadas

Orquestra a execução de tasks planejadas detectando automaticamente se são backend (NestJS), frontend (Next.js) ou fullstack. Dispara o agente `executar-tarefa` (orquestrador) e delega para `backend-nestjs-developer` ou `frontend-nextjs-developer` conforme contexto. Usa Skills-First e validações rígidas antes de entregar.

## Entrada

- `--prd=<path>` (default: `prd.md`)
- `--techspec=<path>` (default: `techspec.md`)
- `--fdd=<path>` (opcional; Feature Design Doc)
- `--tasks-file=<path>` (default: `tasks.md`)
- `--tasks=<lista>` (opcional; ids/descrições separados por vírgula; quando ausente, usar tasks pendentes do `tasks-file`)

## Detecção de Contexto

### Backend Indicators
- Menções a: NestJS, Prisma, controllers, services, DTOs, repositories, use cases, domain entities, endpoints REST, Swagger, Clean Architecture
- Arquivos: `*.service.ts`, `*.controller.ts`, `*.repository.ts`, `*.entity.ts`, `schema.prisma`
- Paths: `src/core/`, `src/nest-modules/`, `src/shared/`

### Frontend Indicators
- Menções a: Next.js, React, componentes, páginas, Server Components, Client Components, app router, layouts, UI, shadcn/ui, Tailwind
- Arquivos: `*.tsx` (componentes), `page.tsx`, `layout.tsx`, `route.ts` (API routes)
- Paths: `app/`, `components/`, `lib/`, `public/`

### Fullstack Detection
- Tasks file contém tasks de ambos tipos
- Menções explícitas a integração frontend-backend
- Features que tocam ambas as camadas (ex: "implementar CRUD completo com UI")

## Passos (determinísticos)

1. **Verificar artefatos obrigatórios**:
   - `tasks-file`, `prd`, `techspec` (e `fdd` se fornecido)
   - Skills: `task-onboarding`, `validation-checklist`
   - Agentes: `.claude/agents/executar-tarefa.md`, `.claude/agents/backend-nestjs-developer.md`, `.claude/agents/frontend-nextjs-developer.md`
   - Se faltar, parar e informar

2. **Ler e analisar tasks**:
   - Ler `tasks-file` e aplicar filtro `--tasks` (se fornecido)
   - Analisar conteúdo das tasks para detectar contexto (backend/frontend/fullstack)
   - Classificar cada task individual

3. **Calcular métricas de artefatos**:
   - Contagem de linhas de `prd`, `techspec` e `fdd` (quando existir)

4. **Exibir console de pré-voo**:
   Exemplo:
   ```
   ## Referências de Origem
   - PRD: <path> (<linhas>)
   - Tech Spec: <path> (<linhas>)
   - Feature Design Doc: <path ou "não fornecido"> (<linhas ou "-">)

   ## Tarefas Detectadas
   ### Backend (delegação: backend-nestjs-developer)
   - [x] <task backend 1>
   - [x] <task backend 2>

   ### Frontend (delegação: frontend-nextjs-developer)
   - [x] <task frontend 1>

   ### Fullstack (delegação sequencial: backend → frontend)
   - [x] <task fullstack 1>

   Aguardando confirmação (Y/N):
   ```
   Se N, abortar; se Y, prosseguir.

5. **Executar tasks por contexto**:

   **Para tasks Backend**:
   - Criar sessão do agente `executar-tarefa` com delegação para `backend-nestjs-developer`
   - Skills: `task-onboarding`, `validation-checklist`, `nestjs-architect`, `MODE_Backend_TDD`
   - Validações: TDD rigoroso, testes unitários + E2E, lint, tsc, api.http, Swagger

   **Para tasks Frontend**:
   - Criar sessão do agente `executar-tarefa` com delegação para `frontend-nextjs-developer`
   - Skills: `task-onboarding`, `validation-checklist`, `nextjs-architect`
   - Validações: TDD, build, bundle size, SSR/SSG, componentes visuais, lighthouse

   **Para tasks Fullstack**:
   - Executar backend primeiro (se houver API/endpoints)
   - Depois frontend (consome API backend)
   - Validar integração end-to-end

6. **Paralelização inteligente**:
   - Tasks **independentes do mesmo tipo** (ambas backend OU ambas frontend): paralelizar
   - Tasks **fullstack ou com dependências**: serializar
   - Tasks **mistas sem dependência**: paralelizar por tipo (grupo backend + grupo frontend)

7. **Coleta de resultados**:
   - Arquivos tocados
   - Endpoints alterados (backend)
   - Componentes/páginas criados (frontend)
   - Comandos executados
   - Status de testes/lint/tsc/build
   - Pendências/riscos
   - Atualizar `tasks-file` conforme retorno dos agentes

8. **Relatório consolidado**:
   - Status por task
   - Riscos identificados
   - Follow-ups necessários
   - Checklist de validações executadas
   - Resposta breve ao usuário

## Restrições e Segurança

- Não executar comandos destrutivos (`rm -rf`, `sudo`, `chmod 777`)
- Limitar escopo ao workspace do projeto
- Evitar logs extensos; resumir outputs (use tail/resumo quando necessário)
- Paralelizar apenas tasks independentes; se houver dependência, serializar
- Não prosseguir sem artefatos obrigatórios ou aprovação de decisões arquiteturais
- Iniciar execução somente após confirmação positiva na etapa de pré-voo

## Delegação de Agentes

### Backend: `backend-nestjs-developer`
- Arquitetura: Clean Architecture + DDD
- TDD obrigatório (unit + E2E)
- Validações: api.http, Swagger, DTOs, lint, tsc
- Skills: `nestjs-architect`, `MODE_Backend_TDD`

### Frontend: `frontend-nextjs-developer`
- Arquitetura: Server-first, feature-first
- TDD (unit + E2E com Playwright/Cypress)
- Validações: build, bundle size, SSR/SSG, componentes visuais
- Skills: `nextjs-architect`

### Ambos (Fullstack)
- Executar backend primeiro
- Depois frontend
- Validar integração completa

## Saída Esperada

- Relatório consolidado por task:
  - Status (✅ concluída, ⚠️ pendências, ❌ falhou)
  - Contexto detectado (backend/frontend/fullstack)
  - Agente utilizado
  - Arquivos tocados
  - Endpoints/componentes criados
  - Comandos de validação executados
  - Pendências/riscos
- Atualização de `tasks.md` conforme instruído pelos agentes

## Observações

- **Pré-requisitos**: skills e agentes listados instalados; artefatos de contexto presentes
- **Não usar** para tasks que envolvem decisões estratégicas não definidas; obter aprovação antes
- **Detecção automática**: o comando analisa o conteúdo das tasks para determinar o contexto correto
- **Flexibilidade**: suporta projetos backend-only, frontend-only ou fullstack
- **Validação completa**: cada stack tem seu conjunto específico de validações

## Exemplos de Uso

```bash
# Executar todas as tasks pendentes (detecção automática)
/zord:executar-tarefas-planejadas

# Executar tasks específicas
/zord:executar-tarefas-planejadas --tasks="1,3,5"

# Com artefatos customizados
/zord:executar-tarefas-planejadas --prd=docs/prd-feature-x.md --techspec=docs/tech-spec-x.md --fdd=docs/fdd-x.md
```

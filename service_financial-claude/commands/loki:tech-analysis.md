---
name: nsd:tech-analysis
description: Gera analise tecnica de NSD preenchendo template de analise tecnica baseado em NSD narrativo existente
tools: Task, AskUserQuestion, Read, Write, Edit, Glob, Grep, Bash
model: sonnet
---

# NSD Technical Analysis Command

Comando para gerar análise técnica completa de NSD (Narrative Structure Document), preenchendo o template técnico baseado em um NSD narrativo existente.

## Passo 0: Entrada do Usuário

### 0.0: Receber Caminho do NSD

Usar `AskUserQuestion`:

```
header: "NSD Fonte"
question: "Qual arquivo NSD deseja analisar tecnicamente?"
options:
  - label: "Selecionar arquivo"
    description: "Escolha um arquivo .nsd.xml ou .NSD.fluxo-cenas.md"
multiSelect: false
```

Ler o arquivo fornecido e extrair:
- **Nome da quest**: `<nsd:questName>` ou header markdown
- **Variável de controle**: `<nsd:controlVariable>` ou seção de controle
- **Locais**: Lista de `<nsd:location>` com `<nsd:mapId>`
- **Cenas**: Lista de `<nsd:scene>` com beats

### 0.1: Validar Scripts de Apoio

```bash
# Verificar se scripts existem
cd /Users/edney/projects/coreto/projectX
test -f scripts/analyze_map.js || echo "ERRO: analyze_map.js não encontrado"
test -f scripts/find_free_ids.js || echo "ERRO: find_free_ids.js não encontrado"
```

**SE falhar**: abortar com mensagem clara indicando qual script falta.

### 0.2: Escopo de Análise (Opcional)

```
header: "Escopo"
question: "Deseja analisar todos os mapas do NSD ou específicos?"
options:
  - label: "Todos os mapas"
    description: "Analisa todos os mapas mencionados no NSD"
  - label: "Mapas específicos"
    description: "Selecione quais mapas analisar"
multiSelect: false
```

Se "Mapas específicos": usar `AskUserQuestion` para selecionar IDs.

## Passo 1: Análise de Impacto (PARALELO)

### 1.1: Executar Scripts em Paralelo

Para todos os mapIds identificados, executar em **ÚNICA mensagem**:

```javascript
// Pseudocódigo - executar todos em paralelo
mapIds.forEach(id => Bash(`node scripts/analyze_map.js --map ${id}`))
```

Aguardar conclusão de **TODOS** antes de consolidar.

### 1.2: Consolidar Resultados

Agrupar de todos os mapas:
- Variáveis usadas → `{varId: {name, usedIn: [mapIds]}}`
- Switches usados → `{swId: {name, usedIn: [mapIds]}}`
- Eventos críticos → `[{id, mapId, name, reason}]`
- Self-switches → `{eventId: {keys: [A,B,C,D]}}`
- Common Events → `{ceId: {name, uses}}`
- Performance → `{parallelProcessCount: N}`

### 1.3: Detectar Conflitos

- Variáveis/switches que já estão em uso
- Ranges de IDs indisponíveis
- Eventos que não podem ser modificados

## Passo 2: Buscar IDs Livres

```bash
node scripts/find_free_ids.js --min-count 3
```

Identificar ranges baseado na complexidade:
- **Baixa**: 3-5 vars, 2-3 switches
- **Média**: 5-10 vars, 3-5 switches
- **Alta**: 10+ vars, 5+ switches

## Passo 3: Mapear Narrativa → Técnico

### 3.1: Tabela de Conversão

| Narrativo | Técnico RPG Maker |
|-----------|-------------------|
| Local/mapa | `MapXXX.json` |
| NPC aparece | Evento + sprite |
| Cutscene | Auto-switch + parallel |
| Diálogo | Show Text |
| Escolha | Show Choices |
| Estado mudou | Control Variables/Switches |
| Mudou mapa | Transfer Player |
| Batalha | Battle Processing |
| Recompensa | Change Items/Weapons/Armor |
| Efeito visual | Show Animation/Move Route |

### 3.2: Requisitos Especiais

Detectar no NSD:
- **Party changes**: Personagens entram/saem
- **Environment**: Clima, luz, BGM mudam
- **No-save zones**: Checkpoints específicos
- **Persistent state**: Estados que permanecem
- **Time limits**: Contadores/temporizadores

## Passo 4: Preencher Template

### 4.1: Estrutura do Template

REFERÊNCIA: `.claude/templates/nsd-technical-analysis-template.xml`

| Seção Template | Fonte de Dados |
|----------------|----------------|
| `metadata` | Passo 0.0 (NSD lido) |
| `impactAnalysis` | Passo 1.2 (consolidado) |
| `stateManagement/variables` | Passo 2 + 3.1 |
| `stateManagement/switches` | Passo 2 + 3.1 |
| `stateSetup` | Passo 3.2 (especiais) |
| `stateTeardown` | **CRÍTICO** - derivar do setup |
| `eventSpecification` | Passo 3.1 (por cena/beat) |
| `assetRequirements` | NSD (graphics/audio refs) |
| `saveLoadConsiderations` | Passo 3.2 (no-save zones) |
| `verification` | Gerar checklist padrão |
| `outputs` | NSD (flags/outputs) |

### 4.2: Preencher Campos

**Metadata**: Nome, versão, data, autor, path NSD origem

**ImpactAnalysis**: Colar resultado consolidado do Passo 1.2

**StateManagement**:
```xml
<nsd:variable id="[ID_LIVRE]" name="v_q[Quest]_[propósito]">
  <nsd:purpose>[O que controla]</nsd:purpose>
  <nsd:type>[progress|state|counter|flag]</nsd:type>
</nsd:variable>
```

**StateTeardown** (SEÇÃO CRÍTICA):
```xml
<nsd:onSceneEnd>
  <!-- Para TUDO em StateSetup, pergunte: deve LIMPAR ou PERSISTIR? -->
  <!-- SE limpar: adicionar à lista com valor de reset -->
  <!-- SE persistir: mover para <persistence> -->
</nsd:onSceneEnd>
```

**EventSpecification**: Um bloco por cena/beat do NSD

**Verification**: Incluir sempre:
- [ ] StateSetup executado sem erros
- [ ] StateTeardown limpa tudo o que deve limpar
- [ ] Funcionalidades existentes ainda funcionam (regressão)
- [ ] Save/load funciona corretamente

### 4.3: Salvar Arquivo

```bash
# Derivar nome do NSD
nsd_path="docs/Quests/X/quest.nsd.xml"
tech_path="${nsd_path%.nsd.xml}.tech.xml"
```

## Passo 5: Relatório Final

```
+======================================================================+
|                 NSD TECHNICAL ANALYSIS REPORT                        |
+======================================================================+
| Quest: [Nome]                                                        |
| NSD: [path/to/nsd]                                                   |
| Output: [path/to/.tech.xml]                                          |
| Generated: [YYYY-MM-DD]                                              |
+======================================================================+

MAPS ANALYZED: [N]
  Map [ID]: [X] events, [Y] vars, [Z] switches
  ...

IMPACT:
  Variables in use: [N]
  Switches in use: [N]
  Critical events: [N]
  Conflicts: [N]

RECOMMENDED IDs:
  Variables: [START]-[END] ([N] free)
  Switches: [START]-[END] ([N] free)

OUTPUT: [tech.xml path]

NEXT:
  1. Review .tech.xml (especialmente StateTeardown)
  2. Aprovação técnica
  3. Implementar no RPG Maker
  4. Testar regressão
```

### 5.1: Avisos

**SE conflitos**: mostrar sugestões
**SE performance ruim**: alertar sobre parallel processes
**SE muitos IDs**: sugerir otimização

## Passo 6: Ação Final

```
header: "Ação"
question: "Deseja realizar ações adicionais?"
options:
  - label: "Finalizar"
    description: "Salva o arquivo .tech.xml e encerra"
  - label: "Abrir para revisão"
    description: "Abre o arquivo gerado para edição"
multiSelect: false
```

## Regras de Ouro

1. **SEMPRE** executar `analyze_map.js` antes de sugerir IDs
2. **NUNCA** sugerir IDs em uso
3. **StateTeardown é OBRIGATÓRIO** - derivar do setup
4. **SEMPRE** incluir testes de regressão
5. Documentar propósito de CADA variável/switch

## Recursos

- Template: `.claude/templates/nsd-technical-analysis-template.xml`
- Scripts: `scripts/analyze_map.js`, `scripts/find_free_ids.js`

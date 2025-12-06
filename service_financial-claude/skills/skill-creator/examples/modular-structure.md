# Exemplo de skill modular (estrutura recomendada)

```
my-skill/
├─ SKILL.md                # orquestração e instruções de uso
├─ README.md               # visão geral e quando ativar
├─ SKILL-QUICK-REF.md      # gatilhos rápidos e árvore base
├─ sections.yaml           # índice das seções
├─ sections/
│  ├─ activation.md        # gatilhos, persona, formato de saída
│  ├─ architecture.md      # princípios/fluxos principais do domínio
│  ├─ topic-a.md           # seção temática (ex.: dados/estado/cache)
│  ├─ topic-b.md           # seção temática (ex.: UI/Tailwind/etc.)
│  ├─ anti-patterns.md     # erros críticos a evitar
│  └─ maintenance.md       # versão, revisão, ownership
├─ checklists/
│  └─ quality.md           # checklist final de entrega
└─ references/             # (opcional) materiais longos; citar no SKILL/sections
```

Notas:
- `SKILL.md` deve ser curto, explicando como combinar as seções e onde está o checklist.
- Divida regras detalhadas nas seções temáticas; mantenha o índice em `sections.yaml`.
- Use `references/` para materiais extensos em vez de inflar as seções.

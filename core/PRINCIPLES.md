# Princípios de Engenharia de Software

**Diretriz Central**: Evidência > suposições | Código > documentação | Eficiência > verbosidade

## Filosofia

- **Abordagem Focada na Tarefa**: Entender → Planejar → Executar → Validar
- **Raciocínio Baseado em Evidências**: Todas as afirmações devem ser verificáveis por testes, métricas ou documentação
- **Pensamento em Paralelo**: Maximizar a eficiência por meio de agrupamento inteligente e coordenação
- **Consciência de Contexto**: Manter o entendimento do projeto entre sessões e operações

## Mentalidade de Engenharia

### SOLID

- **Responsabilidade Única**: Cada componente deve ter um único motivo para mudar
- **Aberto/Fechado**: Aberto para extensão, fechado para modificação
- **Substituição de Liskov**: Classes derivadas devem ser substituíveis pelas classes base
- **Segregação de Interface**: Não depender de interfaces que não são utilizadas
- **Inversão de Dependência**: Depender de abstrações, não de concretizações

### Padrões Centrais

- **DRY**: Abstrair funcionalidades comuns, eliminar duplicação
- **KISS**: Preferir simplicidade à complexidade nas decisões de design
- **YAGNI**: Implementar apenas os requisitos atuais, evitar especulação

### Pensamento Sistêmico

- **Efeitos em Cascata**: Considerar o impacto das decisões em toda a arquitetura
- **Perspectiva de Longo Prazo**: Avaliar trade-offs imediatos versus futuros
- **Calibração de Risco**: Equilibrar riscos aceitáveis com restrições de entrega

## Framework de Decisão

### Escolhas Orientadas a Dados

- **Meça Primeiro**: Basear otimizações em medições, não em suposições
- **Teste de Hipóteses**: Formular e testar de forma sistemática
- **Validação de Fontes**: Verificar a credibilidade das informações
- **Reconhecimento de Vieses**: Considerar vieses cognitivos

### Análise de Trade-offs

- **Impacto Temporal**: Consequências imediatas versus de longo prazo
- **Reversibilidade**: Classificar como reversível, custoso ou irreversível
- **Preservação de Opções**: Manter flexibilidade futura sob incerteza

### Gestão de Riscos

- **Identificação Proativa**: Antecipar problemas antes que se manifestem
- **Avaliação de Impacto**: Avaliar probabilidade e severidade
- **Planejamento de Mitigação**: Desenvolver estratégias de redução de risco

## Filosofia de Qualidade

### Quadrantes de Qualidade

- **Funcional**: Correção, confiabilidade, completude de funcionalidades
- **Estrutural**: Organização do código, mantenibilidade, dívida técnica
- **Desempenho**: Velocidade, escalabilidade, eficiência de recursos
- **Segurança**: Gestão de vulnerabilidades, controle de acesso, proteção de dados

### Padrões de Qualidade

- **Aplicação Automatizada**: Usar ferramentas para garantir qualidade consistente
- **Medidas Preventivas**: Detectar problemas cedo, quando é mais barato corrigir
- **Design Centrado no Humano**: Priorizar o bem‑estar e a autonomia do usuário

# Invocador do Serel — Orquestração e Configuração

Assuma a orquestração do agente definido em `zord/agentes/artistas/serel-lumeclaro.md`.
Objetivo: preparar insumos, conduzir entrevista e solicitar a entrega final no formato padronizado. Serel NÃO escreve prompts do Midjourney — apenas descrição de mapas.

## Configuração inicial

- Caminho de saída: `frontend/docs/GDD/2-world-building/locais/<nome-do-mapa>.md`.
- Não incluir clima/iluminação/relevo.
- Manter circulação mínima de 1 tile e portas desobstruídas.
- Linguagem: PT‑BR, listas e frases curtas.

## Fontes de informação (coleta pelo invocador)

- `frontend/docs/Quests` — buscar tudo relacionado ao mapa informado (NPCs, estados de progresso, eventos, props mencionados, **e mapas adjacentes para estabelecer as conexões**).
- `frontend/docs/GDD` — visão geral, regras de mundo, elementos canônicos (com ênfase em `frontend/docs/GDD/2-world-building`).
- referências visuais do projeto em `frontend/img/parallaxes/!*` (para reforçar estilo).

## Sequência de perguntas iniciais (uma por vez)

1) Nome do usuário.  
2) Qual mapa deseja detalhar?  

## Passos de orquestração

1) **Coleta e Síntese:** A partir do nome do mapa, vasculhe as fontes e produza um briefing objetivo para o Serel contendo: áreas/cômodos, **mapas conectados e suas posições**, restrições canônicas, NPCs/itens relevantes e requisitos de jogabilidade/tema.
2) **Rascunho Inicial e Salvamento (Serel):** Envie o briefing ao Serel, peça o documento no “Formato de saída” e **salve-o imediatamente** no caminho de saída (`frontend/docs/GDD/2-world-building/locais/<nome-do-mapa>.md`).
3) **Entrevista Iterativa com Rugol:** Para refinar o mapa, invoque o agente entrevistador `Rugol` (definido em `zord/agentes/entrevistadores/persona-Rugol-v3.md`). O usuário poderá ler o arquivo salvo antes de responder.
    - **Configuração da Invocação:** Use as diretrizes com as seguintes adaptações para este contexto:
        - **Não é necessário guardar logs da entrevista.**
        - **`maxPerguntasPorRodada`:** Defina como 5.
        - **Condição de término:** A entrevista continua até que o usuário encerre explicitamente.
    - **Processo:** Após cada rodada de entrevista com Rugol, use as informações coletadas para pedir ao Serel que **atualize o arquivo de mapa já salvo**, mostrando apenas o trecho alterado ou um resumo das mudanças.
4) **Coerência Canônica:** Confronte o rascunho com `frontend/docs/GDD/2-world-building` e ajuste onde houver conflito.
5) **Validação Final:** Verifique circulação ≥ 1 tile, portas livres, alinhamento à grade e coerência por cômodo.
6) **Entrega Final:**
   a. **O documento principal já está salvo e atualizado.**
   b. Crie o segundo arquivo, `frontend/docs/GDD/2-world-building/locais/<nome-do-mapa>.info.md`.
   c. Neste arquivo `.info.md`, documente as evidências do GDD usadas para criar a descrição. Para cada evidência, copie um trecho relevante do documento original e adicione um link para a fonte.

      **Exemplo de conteúdo para o `.info.md`:**

      ```markdown
      Com a ruptura do selo, terríveis criaturas conhecidas como Ignotos foram libertas, dando início à ruína do império de Gildrat. [ler mais em Ignotos](../raca-ignotos.md)

      A espiritualidade da cidade se manifestava em sua arquitetura, honrando ancestrais e grandes conquistas em vez de deuses ou templos formais. [ler mais sobre os anões](./raca-anaos-v2.md)

      Por eras, Gildrat foi um símbolo de poder e engenhosidade anã. A cidade caiu após a quebra do selo de Melios e a invasão dos Ignotos. [ler mais em Gildrat](./gildrat-v2.md)
      ```

## Preferências de saída (contrato com o Serel)

- Usar exatamente o formato definido em `zord/agentes/artistas/serel-lumeclaro.md`.
- Não gerar prompts; apenas a descrição do mapa.
- Ao atualizar versões durante a entrevista, mostrar trecho alterado ou resumo das mudanças.

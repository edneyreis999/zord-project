# Aprendizagens do Korga — Sessões de Refino de Mapas

Formato esperado para os relatórios por sessão (um arquivo por sessão):

- Nome do arquivo: `<nome-do-mapa>-<AAAAMMDD-HHMM>.md`
- Local: `zord/aprendizagens/korga/`

Conteúdo sugerido:

- Contexto da sessão (mapa, estilo, referência usada, objetivo).
- Iterações (1..N):
- Para cada iteração:
  - Entrada: prompt, parâmetros (`--ar`, `--stylize`, `--quality`, `--chaos`, `--iw`, negativas, refs de estilo), ação de UI (se houver).
  - Saída: imagem(s) avaliada(s) em `refino-korga/sessoes/<mapa>/<iteracao>/`.
  - Feedback do artista (o que funcionou / não funcionou).
  - Ajuste proposto (novo prompt/ação) e racional.
- Decisões finais (prompts aprovados e parâmetros recomendados por tipo de mapa/cômodo).
- Lições reutilizáveis (padrões que funcionaram, anti‑padrões).

Este diretório é a memória de longo prazo do fluxo Korga ↔ Artista.

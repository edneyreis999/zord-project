# Recomendações de Ferramentas de Geração de Imagens para “Daratrine: A Origem” (Q3 2025)

Baseado no documento zord/pesquisas/Comparativo Modelos Geração Imagem Jogos.docx e no seu objetivo de acelerar mapas mantendo o estilo já definido pelo seu artista, estas são as escolhas recomendadas por caso de uso, com foco em qualidade, controle de estilo e integração em pipeline.

## Visão Geral (Resumo)

- Conceitos de novos mapas: Midjourney v6+ para ideação estética rápida + Stable Diffusion 3.5 (via ComfyUI) com LoRA do estilo “Daratrine” para produção integrada e consistente.
- Melhorar mapas existentes, sem mudar o estilo: Stable Diffusion 3.5 (img2img) com ControlNets (Canny/Depth/Lineart) + IP-Adapter/Reference-Only para preservar estilo; upscalers de alta qualidade. Firefly 3 como opção segura (indenização) em entregas sensíveis.
- Novas peças do Character Generator (capacetes/olhos/armaduras): Leonardo.AI (treino/datasets e transparência) ou SD 3.5 + LoRA + ControlNet com gabaritos (templates). Para ícones simples/flat com transparência, gpt-image-1 (OpenAI) e Firefly 3 funcionam muito bem.

Por que essas escolhas se alinham ao comparativo:

- Midjourney v6+ é o “estado da arte” em estética e interpretação artística para ideação e key art, porém sem API oficial; por isso complementamos com SD 3.5 para pipeline e automação.
- SD 3.5 (Stability) com ComfyUI oferece controle fino (LoRA/ControlNet) e reprodutibilidade, ideal para impor o seu estilo e integrar ao fluxo de assets.
- Flux (Kontext Pro) surge como promessa forte, mas ainda em avaliação para substituir MJ em ideação ou compor pipeline quando APIs e custos estiverem consolidados.
- Leonardo.AI facilita treino leve/datasets e batch de variações com transparência, ideal para peças modulares de personagem.
- Scenario brilha em texturas PBR e tiling; aplicável a materiais de mapa. MJ v6+ também ajuda com --tile.
- gpt-image-1 e Firefly 3 são ótimos para ativos simples/limpos, especialmente com fundo transparente e boa aderência a prompt.

---

## 1) Gerar concepts de novos mapas no estilo “Daratrine”

Recomendação prática (duas camadas):

- Ideação visual e exploração: Midjourney v6+.
  - Motivo: melhor qualidade estética e leitura de estilo, ideal para alinhar direção artística com Narrative Design.
  - Como usar: referenciar 2–5 imagens do seu style guide + prompt detalhado do Narrative Design; variar “-stylize”, “—chaos” e variações regionais.
- Produção integrada e consistente: Stable Diffusion 3.5 + ComfyUI + LoRA do estilo “Daratrine”.
  - Motivo: controle total (seed, sampler, LoRA, ControlNet), API/pipeline, versionamento de nós e metadados.
  - Como usar: treinar uma LoRA leve com 30–80 imagens do seu artista (mapas/tiles/ilustrações-chave) e aplicar ControlNets (Depth/Lineart) para impor composição e perspectiva.

Alternativas/Complementos:

- Flux (Kontext Pro): forte candidato pela velocidade/edição em contexto; manter em testes A/B para ideação rápida e edição incremental.
- Scenario: útil se você quiser texturas/tiling prontos para jogo ou mosaicos de materiais coerentes com o estilo.

Quando considerar Firefly 3:

- Se o projeto exigir mitigação jurídica (indenização/compliance) para determinadas peças de marketing; Firefly ajuda, mas hoje tem menos granularidade que SD 3.5 em controle técnico.

---

## 2) Melhorar mapas atuais sem alterar o estilo

Recomendação principal:

- Stable Diffusion 3.5 (img2img) + ComfyUI com:
  - ControlNet Canny/Lineart/Depth para preservar estrutura, volumes e iluminação.
  - IP-Adapter/Reference-Only para “colar” o estilo do seu guia visual sem desvio.
  - Inpainting/Outpainting para correções locais e expansão de canvas mantendo coerência.
  - Upscalers (4x-UltraSharp/ESRGAN variações) + refinadores de detalhe.

Fluxo sugerido (ComfyUI):

1) Entrada: mapa atual (PNG) + máscara opcional.
2) ControlNets: Canny (bordas) + Depth (profundidade) + Lineart (estilo traço), pesos balanceados.
3) Aplicar LoRA do estilo “Daratrine” (peso 0.6–0.9) e negative prompts para evitar “mudanças de design”.
4) Inpainting controlado para áreas específicas; depois upscale/refine.
5) Exportar com metadados (seed, steps, LoRAs) para reprodutibilidade.

Quando considerar Firefly 3:

- Para “Generative Fill” e variações sob políticas de segurança/indenização; menos técnico que SD 3.5, porém robusto para edições guiadas.

---

## 3) Criar mais peças para o Character Generator (capacetes/olhos/armaduras)

Cenário A — produção rápida com datasets e transparência:

- Leonardo.AI
  - Motivo: fluxo simples para treinar “modelos de coleção”, saída PNG transparente, variações em lote e boa aderência a estilo/cartoon/pixel-art.
  - Uso: coleções por categoria (capacetes/olhos/armaduras), definir ângulo/pose/gabarito; gerar lotes mantendo padrão e exportar camadas/recorte limpo.

Cenário B — pipeline interno com controle máximo:

- Stable Diffusion 3.5 + LoRA específica por categoria + ControlNet com gabaritos (silhueta/UVs/encaixe).
  - Motivo: consistência geométrica (encaixe perfeito no rig do generator), reuso em CI, versionamento e custo previsível.
  - Uso: para cada categoria, crie 30–60 exemplos-curados; treine LoRA curta; gere variações com ControlNet (Template) e negative prompts para evitar quebra de silhueta.

Para ícones, emblemas e elementos de UI simples (com transparência):

- gpt-image-1 (OpenAI) e Adobe Firefly 3
  - Motivo: ótima aderência a prompt para elementos limpos, suporte nativo a fundo transparente, velocidade.

---

## Integração em Pipeline (engenharia)

- Orquestração: ComfyUI (pipelines versionados, seeds, metadados) para SD 3.5.
- Dados de treino: bancos curados do seu artista, rotulados por categoria e ângulo; validação visual por QA artístico.
- Controle de estilo: LoRA/Reference-Only/IP-Adapter por “família” de ativos.
- Consistência espacial: ControlNets com gabaritos (silhueta/linhas) para CG; Depth/Lineart para mapas.
- Saída padronizada: PNG transparente para peças; JPG/PNG para mapas; tiling quando aplicável.
- Naming & versionamento: {categoria}_{variante}_{seed}_{data}.png + JSON de metadados.
- Segurança jurídica: preferir Firefly 3 quando a peça exigir indenização; revisar termos de uso dos provedores.

---

## Plano mínimo viável (2 semanas)

- Semana 1:
  - Curadoria: 30–80 imagens estilo “Daratrine” (mapas) + 20–40 por categoria do CG.
  - Treino: 1 LoRA global de estilo + 2 LoRAs por categoria do CG (capacete/olhos).
  - Pipelines: 3 fluxos ComfyUI (Map Concept, Map Enhance, CG Parts).
- Semana 2:
  - A/B: MJ v6+ vs Flux (ideação); SD 3.5 vs Leonardo (CG batches).
  - QA: checklist de consistência (encaixe, paleta, traço) + ajustes de pesos.
  - Entrega: documentação de prompts, seeds, pesos e melhores práticas.

---

## Prompts-base (exemplos curtos)

- Map Concept (MJ v6+): “Isometric hand-painted fantasy map of [biome/region], cohesive color script, atmospheric depth, [2–3 referências do style guide], coherent gameplay landmarks, v6, --stylize 80, --chaos 10”.
- Map Enhance (SD 3.5, img2img): “Enhance depth and materials without changing shapes; keep original design intact; painterly brushwork per Daratrine style; fine edge control”.
- CG Parts (SD 3.5 + ControlNet): “Generate 12 helmets that fit head slot template; keep silhouette; same palette; subtle ornamentation; clean alpha; 1024x1024; seed range 100–140”.

---

## Ferramentas citadas (encaixe por caso de uso)

- Ideação/Key Art: Midjourney v6+, Flux (avaliando).
- Pipeline e controle: Stable Diffusion 3.5 + ComfyUI (LoRA, ControlNet, IP-Adapter/Reference-Only).
- Texturas/tiling: Scenario, Midjourney (--tile).
- CG por dataset: Leonardo.AI.
- UI/ícones com transparência: gpt-image-1 (OpenAI), Adobe Firefly 3.

> Observação: Midjourney mantém qualidade superior em ideação mas carece de API; SD 3.5 supre integração/automação. Firefly 3 destaca-se por políticas de indenização. Flux é promissor e deve ser acompanhado em testes.

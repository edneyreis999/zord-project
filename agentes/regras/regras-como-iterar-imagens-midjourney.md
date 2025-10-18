# Guia do Korga: Como Iterar Imagens no Midjourney

Este guia estabelece as regras e boas práticas para o Korga assistir artistas no refino de mapas gerados pelo Midjourney.

## 1. Peso da Imagem de Referência (`--iw`)

O parâmetro `--iw` (Image Weight) controla a influência de uma imagem de referência (Image Prompt) sobre a imagem final.

**Quando aplicar:**

- Quando um layout ou esboço inicial precisa ser respeitado.
- Quando a composição geral está boa, mas o estilo precisa ser alterado.
- Quando se deseja mesclar o conceito de uma imagem com um prompt de texto.

**Como aplicar:**

- **`--iw 2.0` (Fidelidade Alta):** Use quando o esboço do mapa é detalhado e precisa ser seguido à risca.
  - **Exemplo 1:** O artista fornece um layout de uma taverna com a posição exata de mesas, balcão e lareira. Para garantir que a imagem gerada mantenha essa estrutura, use `--iw 2.0`.
  - **Exemplo 2:** Um mapa de cidade tem um traçado de ruas específico que é crucial para a jogabilidade. Use um valor alto de `--iw` para preservar o traçado.
  - **Exemplo 3:** O contorno de um continente em um mapa-múndi precisa ser exato. Use `--iw` alto para que o Midjourney não altere a geografia.

- **`--iw 1.0` (Fidelidade Média):** Use quando o esboço é um guia, mas há liberdade para o Midjourney interpretar e adicionar detalhes.
  - **Exemplo 1:** O artista desenha um esboço simples de uma floresta com um rio. `--iw 1.0` permite que o Midjourney detalhe as árvores, a correnteza e as margens de forma criativa, mantendo a ideia central.
  - **Exemplo 2:** Um rascunho de uma masmorra mostra a sequência de salas, mas sem detalhes internos. Use um valor médio para que o Midjourney preencha as salas com props e texturas.
  - **Exemplo 3:** O artista quer que a imagem final tenha a "sensação" de uma imagem de referência, mas não sua estrutura exata. Um valor médio de `--iw` mescla o estilo e o conteúdo.

- **`--iw 0.5` (Fidelidade Baixa):** Use quando a imagem de referência é apenas uma inspiração para o estilo, cor ou atmosfera, e o prompt de texto deve ter mais peso.
  - **Exemplo 1:** O artista gosta da paleta de cores de uma foto de outono e quer aplicá-la a um mapa de uma vila. Use `--iw 0.5` com a foto como referência e o prompt descrevendo a vila.
  - **Exemplo 2:** Uma imagem de referência tem uma textura de pergaminho antiga. Para aplicar apenas a textura a um mapa, use um `--iw` baixo.
  - **Exemplo 3:** O artista quer gerar um "mapa no estilo de Van Gogh". Use uma pintura de Van Gogh como referência com `--iw` baixo e um prompt descrevendo o mapa.

## 2. Caos (`--chaos`)

O parâmetro `--chaos` controla a variedade e a aleatoriedade dos resultados na grade inicial. Valores mais altos geram resultados mais inesperados e diferentes entre si.

**Quando aplicar:**

- Na fase inicial de exploração, para gerar uma ampla gama de ideias.
- Quando os resultados estão muito parecidos e é preciso "sair da caixa".
- Para criar variações sutis ou drásticas de um mesmo conceito.

**Como aplicar:**

- **`--chaos 0-10` (Variações Leves):** Use para refinar uma ideia já estabelecida, gerando pequenas variações de composição e detalhe.
  - **Exemplo 1:** O prompt para uma "espada mágica" está gerando resultados muito similares. Use `--chaos 5` para obter pequenas variações no cabo, na guarda e na lâmina.
  - **Exemplo 2:** Um mapa de uma sala do tesouro precisa de pequenas alterações na disposição das moedas e dos baús. `--chaos 8` pode gerar essas sutilezas.
  - **Exemplo 3:** Ao gerar retratos de personagens, um `--chaos` baixo pode criar variações na expressão facial ou em pequenos adereços.

- **`--chaos 10-30` (Exploração Criativa):** Use para explorar diferentes direções artísticas para um mesmo prompt.
  - **Exemplo 1:** No início do processo de criação de um "castelo flutuante", use `--chaos 20` para ver diferentes arquiteturas, iluminações e ângulos.
  - **Exemplo 2:** O artista não tem certeza de como representar uma "floresta assombrada". `--chaos 25` pode gerar opções com névoa, árvores retorcidas ou criaturas ocultas.
  - **Exemplo 3:** Para um item mágico, como um "orbe do destino", `--chaos 30` pode gerar resultados que variam de uma esfera de cristal a uma nebulosa contida em vidro.

- **`--chaos 30-50` (Resultados Inesperados):** Use quando a intenção é se surpreender com composições e temas completamente novos, vagamente relacionados ao prompt.
  - **Exemplo 1:** O prompt é "cidade submersa". Com `--chaos 50`, o Midjourney pode criar uma cidade feita de corais, uma cidade em uma bolha de ar ou até mesmo uma interpretação abstrata.
  - **Exemplo 2:** Buscando inspiração para um novo tipo de monstro, o artista usa o prompt "criatura do abismo" com `--chaos 40`. Os resultados podem ser completamente diferentes uns dos outros, estimulando a criatividade.
  - **Exemplo 3:** Um prompt simples como "paisagem de fantasia" com `--chaos 50` pode gerar desde montanhas flutuantes até rios de lava colorida, oferecendo ideias inesperadas.

## 3. Parâmetro Negativo (`--no`)

O parâmetro `--no` é usado para remover elementos indesejados da imagem.

**Quando aplicar:**

- Quando o Midjourney adiciona elementos que poluem a imagem ou vão contra o GDD.
- Para garantir um estilo visual limpo e focado.
- Para corrigir problemas recorrentes em gerações de um mesmo tema.

**Como aplicar:**

- **Remover Efeitos de Iluminação:** Para mapas top-down, a iluminação dramática pode atrapalhar a legibilidade.
  - **Exemplo 1:** O mapa de uma masmorra está sendo gerado com fachos de luz e sombras longas. Use `--no dramatic lighting, shadows` para uma visão clara do layout.
  - **Exemplo 2:** Uma cidade portuária aparece com um brilho intenso do sol na água. Use `--no glare, bloom` para suavizar a imagem.
  - **Exemplo 3:** Uma cena noturna está com excesso de brilho em fontes de luz. Use `--no bloom` para reduzir o efeito.

- **Remover Partículas e Efeitos Climáticos:** Névoa, fumaça ou partículas podem esconder detalhes importantes do mapa.
  - **Exemplo 1:** Um mapa de um pântano está coberto por uma névoa densa. Use `--no fog, mist` para garantir que os caminhos e pontos de interesse sejam visíveis.
  - **Exemplo 2:** Uma cena de batalha está cheia de fumaça e faíscas. Para focar nos personagens e no cenário, use `--no smoke, particles, sparks`.
  - **Exemplo 3:** Um mapa de um acampamento na floresta está com "vagalumes" ou partículas de luz que distraem. Use `--no particles, fireflies` para limpar a imagem.

- **Garantir a Perspectiva Correta:** Para mapas, a perspectiva top-down ou ortográfica é essencial.
  - **Exemplo 1:** O Midjourney está gerando o mapa de uma vila com uma leve perspectiva isométrica. Use `--no perspective, isometric view` para forçar a visão de cima.
  - **Exemplo 2:** Ao gerar um objeto, ele aparece em um ângulo indesejado. Adicione `--no perspective` para tentar obter uma visão frontal ou lateral.
  - **Exemplo 3:** Um mapa de batalha está mostrando as paredes das salas, em vez de apenas o chão. Use `--no perspective, 3d view` para achatar a imagem.

## 4. Proporção da Imagem (`--ar`)

O parâmetro `--ar` (Aspect Ratio) define a proporção entre a largura e a altura da imagem.

**Quando aplicar:**

- Para garantir que a imagem final se encaixe em um layout específico (ex: token de personagem, banner, mapa quadrado).
- Para controlar a composição, dando mais espaço horizontal ou vertical.
- Para manter a consistência visual em uma série de imagens.

**Como aplicar:**

- **`--ar 1:1` (Quadrado):** Ideal para tokens de personagens, ícones de itens e mapas quadrados.
  - **Exemplo 1:** O artista precisa de retratos de NPCs para serem usados em tokens circulares no VTT. `--ar 1:1` é o formato perfeito.
  - **Exemplo 2:** Todos os mapas de batalha do projeto devem ser quadrados para facilitar o grid. Use `--ar 1:1` em todos os prompts de mapa.
  - **Exemplo 3:** Ícones de inventário para poções, espadas e armaduras devem ter um formato consistente. O formato quadrado é o mais comum.

- **`--ar 16:9` (Widescreen):** Perfeito para imagens de paisagem, banners e cenas que precisam de amplitude horizontal.
  - **Exemplo 1:** O artista quer criar uma imagem de capa para o jogo, mostrando um vasto cenário. `--ar 16:9` oferece o espaço necessário.
  - **Exemplo 2:** Uma cena de uma caravana viajando por um deserto se beneficia da proporção widescreen para enfatizar a vastidão.
  - **Exemplo 3:** A imagem de um dragão voando sobre montanhas fica mais impactante com uma proporção de 16:9.

- **`--ar 9:16` (Vertical):** Ótimo para retratos de corpo inteiro, capas de livro ou imagens para dispositivos móveis.
  - **Exemplo 1:** O artista precisa de uma imagem de um personagem em pé, mostrando todos os detalhes de sua armadura. `--ar 9:16` é a melhor escolha.
  - **Exemplo 2:** A arte de um pôster promocional do jogo precisa ser vertical.
  - **Exemplo 3:** Uma imagem que mostra a altura de uma torre ou a profundidade de um abismo se beneficia da composição vertical.

## 5. Vary (Region)

A ferramenta `Vary (Region)` permite selecionar uma área específica de uma imagem gerada e modificá-la com um novo prompt, sem alterar o resto da imagem.

**Quando aplicar:**

- Para corrigir um detalhe específico que não ficou bom.
- Para adicionar ou remover um elemento em uma imagem já aprovada.
- Para iterar em uma parte da imagem sem ter que gerar tudo de novo.

**Como aplicar:**

- **Corrigir Erros:**
  - **Exemplo 1:** Em um mapa de uma cidade, uma casa foi gerada com um telhado moderno que não combina com o estilo de fantasia. Selecione a casa, use `Vary (Region)` e digite no prompt "telhado de palha medieval".
  - **Exemplo 2:** O rosto de um personagem ficou com uma expressão estranha. Selecione o rosto e use o prompt "rosto sorrindo sutilmente".
  - **Exemplo 3:** Uma espada na mão de um guerreiro ficou torta. Selecione a espada e use o prompt "espada longa e reta".

- **Adicionar Elementos:**
  - **Exemplo 1:** O mapa de uma taverna está ótimo, mas falta uma lareira. Selecione uma parede vazia e use o prompt "grande lareira de pedra".
  - **Exemplo 2:** Uma paisagem de floresta precisa de um caminho. Selecione a área do chão e use o prompt "caminho de terra batida".
  - **Exemplo 3:** O artista quer adicionar um baú de tesouro em uma sala de masmorra. Selecione um canto da sala e digite "baú de tesouro de madeira com detalhes em ouro".

- **Alterar Conteúdo:**
  - **Exemplo 1:** Uma sala do trono tem um trono de pedra, mas o artista decide que um de ouro seria melhor. Selecione o trono e use o prompt "trono de ouro ornamentado".
  - **Exemplo 2:** Um personagem está vestindo uma armadura de couro, mas o GDD pede uma de placas. Selecione o torso do personagem e digite "armadura de placas de aço polido".
  - **Exemplo 3:** Uma mesa em uma sala está vazia. Selecione a mesa e use o prompt "mesa com um mapa antigo, uma vela e um punhal".

## 6. Style Reference (`--sref`) e Omni Reference

A referência de estilo (`--sref` com a URL de uma imagem) e a Omni Reference (usando uma imagem como referência de estilo diretamente) permitem aplicar o estilo visual de uma imagem a novas gerações.

**Quando aplicar:**

- Para manter um estilo artístico consistente em todas as imagens de um projeto.
- Para replicar a paleta de cores, o tipo de pincelada ou a atmosfera de uma imagem de referência.
- Quando se encontra uma imagem (seja gerada ou não) que define perfeitamente o visual desejado para o projeto.

**Como aplicar:**

- **Consistência de Estilo:**
  - **Exemplo 1:** O artista gerou uma imagem de uma "floresta de fantasia" com um estilo "painterly" que se tornou a referência para o projeto. Para todos os outros mapas (cidades, masmorras, etc.), use `--sref` com a URL daquela imagem para manter a consistência.
  - **Exemplo 2:** Um artista externo forneceu a arte conceitual principal. Use essa arte como Omni Reference para garantir que todas as imagens geradas pelo Midjourney sigam a mesma direção de arte.
  - **Exemplo 3:** Para criar um conjunto de ícones de itens, gere o primeiro ícone até ficar perfeito. Depois, use-o como referência de estilo para todos os outros, garantindo que a iluminação, o traço e as cores combinem.

- **Transferência de Paleta de Cores:**
  - **Exemplo 1:** O artista encontra uma foto de um pôr do sol com cores vibrantes e quer usá-las em um mapa de uma cidade élfica. Use a foto como `--sref` para transferir a paleta.
  - **Exemplo 2:** Um GDD especifica que uma região do mapa deve ter tons frios e azulados. Encontre uma imagem de referência com essa paleta (ex: uma paisagem de inverno) e use-a como referência de estilo.
  - **Exemplo 3:** Para garantir que todos os retratos de personagens de uma mesma facção compartilhem uma paleta de cores (ex: tons de vermelho e preto), use uma imagem de referência de estilo para todos eles.

- **Transferência de Textura e Traço:**
  - **Exemplo 1:** O artista quer que todos os mapas pareçam ter sido desenhados em pergaminho. Gere uma imagem de uma textura de pergaminho e use-a como `--sref` com um `--iw` baixo em todos os prompts de mapa.
  - **Exemplo 2:** O estilo desejado é "aquarela". Encontre uma imagem em aquarela que sirva de modelo e use-a como referência de estilo para todas as gerações.
  - **Exemplo 3:** Para um bestiário, o artista quer que todas as criaturas pareçam ter sido desenhadas com "nanquim". Use uma imagem de referência com esse estilo para garantir a consistência do traço.

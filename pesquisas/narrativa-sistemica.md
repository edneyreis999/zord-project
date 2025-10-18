
🧩 Resumo geral da técnica

A Narrativa Sistêmica Baseada em Variáveis é uma técnica que transforma uma história linear em uma experiência reativa, onde o estado do mundo muda conforme as decisões do jogador — sem quebrar a estrutura principal da narrativa.

Em vez de criar dezenas de rotas alternativas completas, a técnica usa variáveis acumulativas (integers) para medir a coerência, o impacto moral ou a eficiência das escolhas feitas.
Essas variáveis compõem um Índice Global de Estado (por exemplo, Índice de Preparação, Índice de Esperança, Índice de Corrupção etc.), que é consultado em momentos-chave para modular o desfecho de eventos, falas, batalhas ou finais.

🎯 Em resumo: o jogo continua linear, mas a experiência emocional e o tom do desfecho se tornam personalizados conforme o “rastro” do jogador.

⸻

⚙️ Como aplicar na main quest de um jogo

1. Identifique os nós decisivos

Selecione 3 a 6 decisões significativas ao longo da main quest — eventos com peso ético, tático ou emocional.
Exemplo:
 • Entregar um artefato para um líder corrupto ou guardá-lo.
 • Escolher entre salvar aldeões ou proteger recursos militares.
 • Apoiar um personagem rival ou ignorá-lo.

Cada uma dessas decisões deve gerar um impacto sistêmico, não um novo caminho narrativo.
Ou seja: ela não cria uma nova rota, mas altera o estado global do mundo.

⸻

2. Defina variáveis de impacto

Para cada decisão, atribua um valor inteiro que representa o impacto positivo ou negativo da escolha.

Exemplo:

v_honra = +2  // quando o jogador age com empatia
v_honra = -1  // quando o jogador age com egoísmo

Essas variáveis podem ser simples, mas o ideal é criar uma variável composta, que soma diversos aspectos do jogo:

v_preparo_total = v_sigmetal + v_milicia + v_resgate + v_aliados

⸻

3. Introduza o Índice Global de Estado (IGE)

Crie uma variável principal que some todos os componentes relevantes:

v_IP = v_sigmetal + v_pai_filena + v_saparo + v_corvos + v_melios

Esse índice será usado nos momentos-chave da narrativa, como:
 • Diálogo final antes da batalha.
 • Escolha moral decisiva.
 • Último boss ou pós-créditos.

Dependendo do intervalo do valor (v_IP), o jogo muda a reação dos NPCs, a moral da vitória, ou o destino do herói.

Exemplo de intervalo:

Intervalo IP Resultado narrativo
80+ Vitória plena e reconhecimento público
50–79 Vitória parcial, tom melancólico
30–49 Derrota moral, mas vitória tática
<30 Derrota total, cliffhanger para sequência

⸻

4. Amarre o resultado sem criar novas cenas

Em vez de criar ramificações completas, use condições dentro da mesma cena:
 • Alterar falas, músicas, animações ou o enquadramento da câmera.
 • Ativar/desativar NPCs extras.
 • Modificar o texto do epílogo.

Isso garante que o jogo permaneça linear na estrutura, mas variável na sensação.

⸻

🔧 Como implementar no RPG Maker (com variáveis inteiras)

1. Estrutura das variáveis

No RPG Maker MZ, use o sistema de “Control Variables” (não “Switches”).
Cada variável representa um aspecto do mundo:

ID Nome da Variável Tipo Escala Descrição
001 v_sigmetal_destino Integer 0–3 Ética e transparência do herói
002 v_pai_filena_respeita_thorin Integer 0–2 Reputação com aliados
003 v_saparo_recrutado Integer 0–1 Estratégia tática
004 v_corvos_aliados Integer 0–3 Suporte mágico
005 v_resgate_melios_sucesso Integer 0–2 Moral do exército
010 v_IP Integer soma total Índice Global de Preparação

⸻

2. Lógica de soma

Crie um evento comum chamado “Atualizar Índice de Estado”:

◆ Control Variables：#010 v_IP = 0
◆ Control Variables：#010 v_IP += Variable [1]  // Sigmetal
◆ Control Variables：#010 v_IP += Variable [2]  // Pai Filena
◆ Control Variables：#010 v_IP += Variable [3]  // Sáp
◆ Control Variables：#010 v_IP += Variable [4]  // Corvos
◆ Control Variables：#010 v_IP += Variable [5]  // Melios

Execute esse evento no início da Cena Final.

⸻

3. Aplicação condicional (na Cena Final)

◆ Conditional Branch：Variable [10 v_IP] ≥ 80
  ◆ Show Text：「Os anões clamam o nome de Thorin. O selo se fecha com glória.」
◆ Else
  ◆ Conditional Branch：Variable [10 v_IP] ≥ 50
    ◆ Show Text：「A vitória tem gosto de cinzas. Muitos não voltaram.」
  ◆ Else
    ◆ Conditional Branch：Variable [10 v_IP] ≥ 30
      ◆ Show Text：「O General caiu, mas Gildrat sangra. O povo murmura.」
    ◆ Else
      ◆ Show Text：「A fortaleza ruí. O som das trompas ecoa no vazio.」
    ◆ End
  ◆ End
◆ End

Dessa forma, uma única cena se adapta a quatro variações dramáticas, sem bifurcar o fluxo.

⸻

⚠️ Erros comuns ao aplicar a técnica

 1. Criar variáveis demais.
→ O excesso dilui o impacto. Prefira poucas variáveis com significado claro.
 2. Usar Switches (booleans) ao invés de integers.
→ Isso limita a gradação. Com integers, você pode criar variações sutis (pequenas vitórias, falhas parciais).
 3. Dar peso igual a todas as decisões.
→ Algumas devem valer mais (ex.: moralidade do Sigmetal pode valer +3, enquanto o resgate de Melios vale +1).
 4. Não mostrar feedback ao jogador.
→ É importante que o jogador perceba que suas ações tiveram efeito — via falas, interface ou reações de NPCs.
 5. Desbalancear a curva do índice.
→ Se for fácil demais alcançar o IP máximo, perde-se tensão dramática. Equilibre os valores.

⸻

🏆 Exemplos de sucesso narrativo

Jogo Técnica aplicada Resultado
Disco Elysium Sistema de estados internos (morais, políticos, emocionais) afetam diálogos e finais. Narrativa reativa profunda sem rotas separadas; sensação de autoria do jogador.
Mass Effect (Trilogia) “Paragon/Renegade” e decisões cumulativas alteram o clímax do 3. Alta consistência temática e payoff emocional forte.
The Witcher 2/3 Variáveis acumuladas definem apoio político e moral do final. Mostra como pequenas decisões constroem grandes consequências sem precisar de múltiplos enredos.
Undertale “EXP” e “LOVE” são variáveis morais disfarçadas. Redefiniu o impacto moral de mecânicas de RPG.

⸻

💀 Exemplos de fracasso narrativo

Jogo Erro cometido Por que falhou
Mass Effect 3 (lançamento original) Índice global mal balanceado (War Assets) e finais muito parecidos. Jogadores sentiram que suas escolhas não importaram.
Fallout 4 Sistema de facções baseado em flags binárias (switches). Decisões simplificadas; pouca nuance e payoff insatisfatório.
Fable III Variáveis de moralidade desproporcionais. Jogador era punido por boas ações; lógica inconsistente.
Cyberpunk 2077 (pré-patch) Dependência de decisões finais, não cumulativas. Finais pareciam desconectados das ações anteriores.

⸻

✅ Conclusão

A técnica de Narrativa Sistêmica com Índice de Estado Global é o elo perfeito entre linearidade e agência.
No RPG Maker, ela é poderosa porque:
 • Usa ferramentas nativas (variáveis inteiras).
 • Mantém o fluxo linear intacto.
 • Cria finais dinâmicos e emocionalmente consistentes.

Quando bem calibrada, essa abordagem faz o jogador sentir que o destino foi consequência direta de suas escolhas — sem exigir dezenas de finais distintos nem inflar o escopo do projeto.

# SPELLING GAME

Jogo de soletrar inspirado no BombParty. Usuários acessam a página inicial e podem **criar uma sala** ou **entrar com um código**. O jogo começa quando o dono da sala decidir. A sala pode ter **senha** e **limite de jogadores**.

**Mecânica**: cada jogador começa com **3 vidas**. Ao iniciar a partida, um **timer de 5s por turno** é iniciado e **reinicia** cada vez q troca de jogador, seja por um fim to timer ou acerto. O jogador da vez precisa digitar uma palavra que contenha a **sequência de letras exibida**. Se o tempo acabar sem acerto, o jogador **perde uma vida**. As **palavras não podem ser repetidas na mesma rodada**. A partida termina quando **resta apenas um jogador**.

## Passos de criação do jogo

### 1) Sala da partida (WebSocket)

- [ ] Criar sala: gerar **código único**, senha opcional, **limite de jogadores** (ex.: 2–8).
- [ ] Entrar na sala: informar **código**, senha (se houver) e nickname.
- [ ] Lobby: listar jogadores, indicar **dono da sala** (host) e status “pronto / aguardando”.
- [ ] Iniciar partida (somente host).
- [ ] Sair da sala / expulsar jogador (host).
- [ ] **Reconexão**: se o jogador cair e voltar, retornar ao estado atual da sala.
- [ ] Fechamento automático: encerrar sala **inativa** (TTL/cron simples).
- [ ] Eventos WS:
  - `room:create`, `room:join`, `room:leave`, `room:kick`, `room:start`
  - `room:state` (snapshot de estado ao conectar/reconectar)
  - `turn:tick` (tempo restante), `turn:next`
  - `play:submit` (palavra do jogador), `play:result`
  - `room:ended` (fim da partida)

### 2) Regra de palavras

- [ ] **Gerar sequência** de letras que **permita** formar palavras reais.
- [ ] **Validação da palavra**:
  - [ ] Conter a sequência atual (case-insensitive, tratar acentos se necessário).
  - [ ] **Não repetir** palavra dentro da mesma rodada.
  - [ ] Regras mínimas: tamanho mínimo (ex.: ≥ 3), caracteres permitidos, sem espaços.
- [ ] Fonte de palavras (MVP): **dicionário local** (arquivo `.txt/.json` carregado em memória).
- [ ] Feedback: retornar `válida` / `inválida` e motivos (ex.: não contém sequência, repetida, não encontrada).
- [ ] (Opcional) **Idioma**: começar com pt-BR; estruturar para permitir outros idiomas depois.
- [ ] (Opcional) Anti-cheat básico: limitar spam de envios por segundo, normalizar entrada.

### 3) Regra do jogo

- [ ] **Timer por turno** (5s): reinicia ao acerto; ao estourar, **-1 vida** e passa o turno.
- [ ] **Ordem de turnos** e rotação; remover jogadores eliminados (vidas = 0).
- [ ] **Rodadas**: limpar `usedWords` a cada novo turno/rodada conforme sua regra.
- [ ] **Encerramento**: ao restar 1 jogador, emitir `room:ended` com vencedor.
- [ ] **Persistência ao fim da partida** (SQLite): salvar partida + estatísticas básicas.

### 4) Persistência (SQLite + Drizzle)

- [ ] Tabela `matches`: id (uuid), room_code, started_at, ended_at, winner.
- [ ] Tabela `match_players`: match_id, nickname, posição final, vidas perdidas, etc.
- [ ] (Opcional) Tabela `plays`: match_id, nickname, palavra, válida?, timestamp, duração do turno.
- [ ] **Migrations** (Drizzle) e `PRAGMA journal_mode=WAL` para melhor I/O.
- [ ] **Salvar no término** da partida (ou em checkpoints) para não travar o loop do jogo.

### 6) Testes

- [ ] **Unitários**: gerador de sequência, validação de palavras, regras de timer/vidas.
- [ ] **E2E (WS)**: fluxo criar→entrar→iniciar→jogar→encerrar, reconexão, não-repetição de palavras.
- [ ] **Testes de carga leve**: simular 1–2 salas com 4–8 jogadores.

### 7) Qualidade, logs e DX

- [ ] Scripts NPM: `dev`, `build`, `start`, `db:generate`, `db:migrate`, `lint`, `test`.
- [ ] ESLint/Prettier, Husky (pre-commit opcional).
- [ ] **Logs**: eventos principais (criar/join/start/play/ended) e erros.
- [ ] Variáveis de ambiente (.env) e exemplo `.env.example`.

## Checklist do MVP (trajeto feliz)

- [ ] Criar/entrar em sala e iniciar partida (1 sala, 2–4 jogadores).
- [ ] Sequência gerada + validação local de palavras.
- [ ] Timer de 5s por turno, perda de vida no timeout, rotação de turno.
- [ ] Fim de partida com vencedor.
- [ ] Persistir resultados básicos no SQLite.
- [ ] Teste E2E cobrindo o fluxo principal.

## Futuro — **Salvar usuários**

- [ ] **Cadastro/Login** (e.g., OAuth simples, ou guest→upgrade).
- [ ] **Perfil**: nickname único global, avatar.
- [ ] **Sessões**: reentrar em sala com o mesmo usuário após reconexão.
- [ ] **Leaderboards** persistentes por temporada (derivadas de `matches`).
- [ ] **Chat de Amigos**: conversar e convidar e entrar juntos na mesma sala.
- [ ] **Chat de Grupos**: conversa e iniciar sala de partida para o grupo.
- [ ] **Moderação**: ban/kick persistente, filtro de nickname/palavras inadequadas.

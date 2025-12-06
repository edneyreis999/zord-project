# zord:figma-screenshot-extractor

Extrai screenshots do Figma a partir dos logs JSONL do Codex, salvando os PNGs no diretório indicado. Usa o script `figma_screenshot_extractor.py` se existir; caso contrário, executa um fallback em Python inline para decodificar base64 (`iVBOR`), sempre com travas de validação.

## Entrada
- `output-dir` (obrigatório): caminho de destino para os PNGs.
- `session-log` (opcional): caminho completo para um `.jsonl`. Se ausente, usa o log mais recente em `~/.codex/sessions/YYYY/MM/DD/`.
- `nodes` (opcional): JSON string com mapping `nodeId: filename` para nomear arquivos; se ausente, nomeia sequencialmente (`01-*.png`).

## Passos (determinísticos)
1. Validar que `output-dir` foi fornecido; se não, abortar com mensagem pedindo o valor.
2. Determinar o log-alvo: usar `session-log` se vier; senão selecionar o JSONL mais recente em `~/.codex/sessions` (ordenar por mtime). Se não houver log, abortar orientando o usuário a fornecer `session-log`.
3. Garantir que o diretório de saída existe (`mkdir -p <output-dir>`).
4. Se existir `figma_screenshot_extractor.py` no repositório, executar:
   ```bash
   python figma_screenshot_extractor.py --output-dir <output-dir> --session-log <log> [--nodes <nodes>]
   ```
   (incluir `--nodes` somente se fornecido).
5. Caso o script não exista, rodar o fallback Python inline para extrair todos os base64 `iVBOR` do log e salvar em `<output-dir>/<idx>.png` (idx sequencial de 01 em diante). Ignorar blocos que não iniciem com header PNG.
6. Ao final, listar os arquivos gravados (nome + tamanho) e o diretório de saída. Se nenhum arquivo for extraído, informar e sugerir verificar se o log contém chamadas `mcp__figma_desktop__get_screenshot`.

## Restrições e Segurança
- Não executar comandos destrutivos (`rm -rf`, `sudo`, alterações fora do repositório`).
- Limitar buscas de log a `~/.codex/sessions` ou ao caminho explícito em `session-log`.
- Não prosseguir sem `output-dir` válido.
- Resumir listagens (`ls -l <output-dir>`) em vez de despejar binários.

## Saída Esperada
- PNGs salvos em `<output-dir>` com nomes do mapping ou sequenciais (`01-*.png`).
- Log curto indicando: log usado, quantidade de arquivos gravados, lista dos arquivos com tamanho.
- Mensagem clara se nada foi extraído ou se faltou parâmetro obrigatório.

## Observações
- Usa Python 3 (biblioteca padrão) para o fallback; nenhuma dependência extra.
- Compatível com o fluxo descrito na skill `figma-screenshot-extractor`.
- Quando houver nós específicos, sempre preferir passar `nodes` para nomes amigáveis.

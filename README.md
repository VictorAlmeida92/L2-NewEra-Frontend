# L2 NewEra — Frontend

Frontend React/Vite do Lineage2 NewEra.

## Limites de segurança

Este projeto é somente o frontend público. Ele não acessa PostgreSQL e nunca
deve receber `GameApiSecret`, credenciais JDBC ou qualquer outro segredo.

O cadastro, login, verificação de e-mail e recuperação de senha serão
implementados por uma Account API/BFF server-side. Essa API chamará a Game API
interna por HMAC em uma rede privada.

Na primeira entrega, a Account API existe dentro do processo do GameServer,
com porta separada. No desenvolvimento local, os formulários podem apontar
para `http://127.0.0.1:9090`; no GitHub Pages a URL da API fica vazia até que
HTTPS, proxy reverso e a etapa de e-mail estejam prontos.

## Desenvolvimento

Requer Node.js e pnpm:

```bash
pnpm install --frozen-lockfile
VITE_ACCOUNT_API_URL=http://127.0.0.1:9090 pnpm run dev
```

No ambiente Docker local, o backend precisa estar com a Account API habilitada
em `http://127.0.0.1:9090` e aceitar a origem `http://localhost:5173`.
O formulário de cadastro cria somente login e senha, que são persistidos no
PostgreSQL local; e-mail será adicionado junto com o fluxo de verificação.

## Publicação no GitHub Pages

O workflow [`pages.yml`](.github/workflows/pages.yml) publica o resultado
estático usando `VITE_BASE_PATH=/L2-NewEra-Frontend/`.

O backend permanece no repositório
[`L2-NewEra`](https://github.com/VictorAlmeida92/L2-NewEra). O portal não acessa
PostgreSQL e não recebe secrets do servidor.

URL publicada: <https://victoralmeida92.github.io/L2-NewEra-Frontend/>

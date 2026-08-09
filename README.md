# NOVLYX

Plataforma de streaming premium construida com React, Next.js 15 (App Router),
TypeScript, Tailwind CSS, Shadcn UI, Framer Motion, Lucide Icons e TanStack
Query.

## Visao geral

A NOVLYX reune filmes, series, animes e doramas em uma unica interface,
alem de TV ao vivo e eventos esportivos. Toda a interface esta em portugues
brasileiro, com tema escuro premium (preto, grafite, bronze e dourado
envelhecido).

O catalogo atual e composto por dados mockados gerados localmente (sem
nenhuma API externa conectada). A arquitetura de servicos, porem, ja esta
pronta para receber uma API real a qualquer momento, sem necessidade de
alterar componentes, hooks ou paginas.

## Stack

- Next.js 15 (App Router, Server Components por padrao)
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI (Radix Primitives)
- Framer Motion
- Lucide Icons
- TanStack Query

## Como rodar

```bash
npm install
npm run dev
```

A aplicacao sobe em `http://localhost:3000`.

## Como conectar uma API real

Por padrao, nenhuma variavel de ambiente esta definida e a aplicacao roda
inteiramente com dados mockados (gerados em `lib/mock-data`). Nenhuma
chamada de rede e feita.

Para conectar uma API de catalogo real:

1. Copie `.env.example` para `.env.local`.
2. Preencha `NEXT_PUBLIC_API_BASE_URL` com a URL base da sua API.
3. Abra `lib/api-config.ts` e confirme se os caminhos em `API_ROTAS`
   correspondem aos endpoints da sua API. Ajuste conforme necessario.
4. Em cada arquivo de `services/*.service.ts`, as funcoes ja possuem um
   bloco condicional `if (API_HABILITADA)` com um comentario
   `// PLACEHOLDER_API` indicando exatamente onde a chamada real deve
   entrar. Basta ajustar o parsing da resposta para o formato retornado
   pela sua API.
5. Nenhum componente, hook ou pagina precisa ser alterado. Toda a camada
   de UI consome apenas as funcoes exportadas por `services/`.

O cliente HTTP generico em `lib/http-client.ts` ja esta pronto, com
tratamento de erros, query params e headers configuraveis.

## Estrutura do projeto

```
app/            rotas da aplicacao (App Router)
components/
  ui/           componentes base reutilizaveis (padrao shadcn)
  layout/       header, footer, navegacao
  features/     componentes especificos de cada tela
  shared/       componentes compartilhados entre features
hooks/          hooks de dados (TanStack Query) e utilitarios
lib/
  mock-data/    gerador de catalogo, canais, eventos e calendario mockados
  api-config.ts configuracao central da API (rotas e URL base)
  http-client.ts cliente HTTP generico
services/       uma camada de servico por dominio, com placeholder de API
types/          tipagem completa do dominio
utils/          formatadores e gerador de imagens placeholder
contexts/       providers de query e perfil
```

## Funcionalidades

- Homepage com banner rotativo, fileiras horizontais por categoria e genero
- Continuar assistindo e Minha Lista persistidos via Local Storage
- Paginas dedicadas para filmes, series, animes e doramas, com filtros por
  genero, ordenacao e paginacao infinita
- Pagina de detalhe de conteudo com temporadas e episodios
- Player simulado com selecao de temporada e episodio, modo cinema, tela
  cheia, proximo episodio e episodio anterior
- Busca instantanea no header e pagina de busca completa
- TV ao vivo com categorias e busca de canais
- Esportes com eventos ao vivo, agendados e encerrados
- Estados de carregamento com skeletons, tratamento de erros e pagina 404
  personalizada

## Observacao sobre as imagens

Todos os posters, banners e logos de canais/eventos sao gerados
dinamicamente como SVG (data URI), sem depender de nenhum servico de
imagem externo. O gerador esta em `utils/placeholder.ts`.

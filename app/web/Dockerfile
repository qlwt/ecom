FROM oven/bun:1.3.11

WORKDIR /repo-web

ARG API_URL
ENV API_URL=$API_URL

COPY ./package.json ./
COPY ./tsconfig.json ./

COPY ./app ./app
COPY ./pckg ./pckg

RUN bun install

RUN bun run --filter "./pckg/constants" build
RUN bun run --filter "./pckg/express-utils" build
RUN bun run --filter "./pckg/syntax-math" build
RUN bun run --filter "./pckg/syntax-search" build
RUN bun run --filter "./pckg/config" build
RUN bun run --filter "./pckg/rest" build
RUN bun run --filter "./pckg/db_default" build
RUN bun run --filter "./pckg/capi" build
RUN bun run --filter "./pckg/gstate" build
RUN bun run --filter "./app/web" build

EXPOSE 8080

WORKDIR /repo-web/app/web

CMD ["bun", "./build/server/entry/index_prod.js"]

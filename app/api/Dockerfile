FROM oven/bun:1.3.11

WORKDIR /repo-api

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
RUN bun run --filter "./app/api" build

EXPOSE 8200

WORKDIR /repo-api/app/api

CMD ["bun", "./build/entry/index.js"]

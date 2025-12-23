FROM node:current-alpine3.20 AS base

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

FROM base AS builder

WORKDIR /app

COPY . .
COPY --from=base /app/node_modules node_modules

RUN pnpm build
RUN pnpm prune --prod

FROM node:current-alpine3.20 AS production

RUN apk update && apk upgrade && apk add --no-cache dumb-init

WORKDIR /APP

COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/dist dist

ENV NODE_ENV=production

USER node

EXPOSE 3000

CMD ["dumb-init", "node", "dist/main.js"]

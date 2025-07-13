# 1. Білд
FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# 2. Продакшен запуск
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]